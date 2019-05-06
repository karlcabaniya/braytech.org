import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';
import orderBy from 'lodash/orderBy';

import * as bungie from '../../utils/bungie';
import getPGCR from '../../utils/getPGCR';

import manifest from '../../utils/manifest';
import ObservedImage from '../../components/ObservedImage';
import ProgressBar from '../../components/UI/ProgressBar';
import Spinner from '../../components/UI/Spinner';

import PGCR from './PGCR';

import './styles.css';

class Multiplayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  multiplayer = {
    all: {
      modes: [5,69,70],
      stats: {
        allPvP: {
          mode: 5
        },
        pvpCompetitive: {
          mode: 69
        },
        pvpQuickplay: {
          mode: 70
        }
      }
    },
    competitive: {
      modes: [72,74,37,38,39],
      stats: {
        clashCompetitive: {
          mode: 72
        },
        controlCompetitive: {
          mode: 74
        },
        countdown: {
          mode: 38
        },
        survival: {
          mode: 37
        },
        trialsofthenine: {
          mode: 39
        }
      }
    },
    quickplay: {
      modes: [71,73,43,44,45],
      stats: {
        clashQuickplay: {
          mode: 71
        },
        controlQuickplay: {
          mode: 73
        },
        ironBannerClash: {
          mode: 44
        },
        ironBannerControl: {
          mode: 43
        },
        ironBannerSupremacy: {
          mode: 45
        }
      }
    }
  }

  fetch = async () => {
    const { member } = this.props;

    this.setState(p => {
      p.loading = true;
      return p;
    });

    let [stats_allPvP, stats_competitive, stats_quickplay] = await Promise.all([
      bungie.getHistoricalStats(member.membershipType, member.membershipId, member.characterId, '1', this.multiplayer.all.modes, '0'),
      bungie.getHistoricalStats(member.membershipType, member.membershipId, member.characterId, '1', this.multiplayer.competitive.modes, '0'),
      bungie.getHistoricalStats(member.membershipType, member.membershipId, member.characterId, '1', this.multiplayer.quickplay.modes, '0')
    ]);

    for (const mode in stats_allPvP) {
      if (stats_allPvP.hasOwnProperty(mode)) {
        if (!stats_allPvP[mode].allTime) {
          return;
        }
        Object.entries(stats_allPvP[mode].allTime).forEach(([key, value]) => {
          this.multiplayer.all.stats[mode][key] = value;
        });
      }
    }

    for (const mode in stats_competitive) {
      if (stats_competitive.hasOwnProperty(mode)) {
        if (!stats_competitive[mode].allTime) {
          return;
        }
        Object.entries(stats_competitive[mode].allTime).forEach(([key, value]) => {
          this.multiplayer.competitive.stats[mode][key] = value;
        });
      }
    }

    for (const mode in stats_quickplay) {
      if (stats_quickplay.hasOwnProperty(mode)) {
        if (!stats_quickplay[mode].allTime) {
          return;
        }
        Object.entries(stats_quickplay[mode].allTime).forEach(([key, value]) => {
          this.multiplayer.quickplay.stats[mode][key] = value;
        });
      }
    }

    this.setState(p => {
      p.loading = false;
      return p;
    });
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    const { t, member, PGCRcache } = this.props;
    const characterId = member.characterId;

    const characterProgressions = member.data.profile.characterProgressions.data;
    const profileRecords = member.data.profile.profileRecords.data.records;

    console.log(manifest.DestinyActivityModeDefinition);

    console.log(this.multiplayer);

    return (
      <div className={cx('view')} id='multiplayer'>
        <div className='module'>
          <div className='content'>
            <div className='sub-header'>
              <div>Crucible Career</div>
            </div>
            <h4>Progression</h4>
            <h4>Highlights</h4>
          </div>
        </div>
        <div className='module'>
          <div className='content'>
            <div className='sub-header'>
              <div>Competitive modes</div>
            </div>

          </div>
        </div>
        <div className='module'>
          <div className='content'>
            <div className='sub-header'>
              <div>Recent matches</div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    PGCRcache: state.PGCRcache
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Multiplayer);
