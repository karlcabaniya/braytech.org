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
import Mode from '../../components/Multiplayer/Mode';
import Matches from '../../components/Multiplayer/Matches';

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
      modes: [5, 69, 70],
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
      modes: [72, 74, 37, 38],
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
        }
      }
    },
    quickplay: {
      modes: [71, 73, 48, 43, 60, 65],
      stats: {
        clashQuickplay: {
          mode: 71
        },
        controlQuickplay: {
          mode: 73
        },
        rumble: {
          mode: 48
        },
        ironBannerControl: {
          mode: 43
        },
        lockdown: {
          mode: 60
        },
        breakthrough: {
          mode: 65
        }
      }
    }
  };

  fetch = async () => {
    const { member } = this.props;

    this.setState(p => {
      p.loading = true;
      return p;
    });

    let [stats_allPvP, stats_competitive, stats_quickplay] = await Promise.all([bungie.getHistoricalStats(member.membershipType, member.membershipId, member.characterId, '1', this.multiplayer.all.modes, '0'), bungie.getHistoricalStats(member.membershipType, member.membershipId, member.characterId, '1', this.multiplayer.competitive.modes, '0'), bungie.getHistoricalStats(member.membershipType, member.membershipId, member.characterId, '1', this.multiplayer.quickplay.modes, '0')]);

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

    return true;
  };

  async componentDidMount() {
    await this.fetch();

    this.setState(p => {
      p.loading = false;
      return p;
    });
  }

  render() {
    const { t, member, PGCRcache } = this.props;
    const characterId = member.characterId;

    const characterProgressions = member.data.profile.characterProgressions.data;
    const profileRecords = member.data.profile.profileRecords.data.records;

    const valor = {
      defs: {
        rank: manifest.DestinyProgressionDefinition[3882308435],
        activity: manifest.DestinyActivityDefinition[2274172949]
      },
      progression: {
        data: characterProgressions[characterId].progressions[3882308435],
        total: 0,
        resets: profileRecords[559943871] ? profileRecords[559943871].objectives[0].progress : 0
      },
      modes: [71, 73, 43, 44, 31],
      PGCRs: []
    };

    valor.progression.total = Object.keys(valor.defs.rank.steps).reduce((sum, key) => {
      return sum + valor.defs.rank.steps[key].progressTotal;
    }, 0);

    const glory = {
      defs: {
        rank: manifest.DestinyProgressionDefinition[2679551909],
        activity: manifest.DestinyActivityDefinition[2947109551]
      },
      progression: {
        data: characterProgressions[characterId].progressions[2679551909],
        total: 0
      },
      modes: [37, 38, 72, 74],
      PGCRs: []
    };

    glory.progression.total = Object.keys(glory.defs.rank.steps).reduce((sum, key) => {
      return sum + glory.defs.rank.steps[key].progressTotal;
    }, 0);

    return (
      <div className={cx('view')} id='multiplayer'>
        <div className='module'>
          <div>
            <div className='content career'>
              <div className='sub-header'>
                <div>Crucible Career</div>
              </div>
              <h4>Quickplay</h4>
              <div className='progress quickplay'>
                <ProgressBar
                  objectiveDefinition={{
                    progressDescription: `Next rank: ${valor.defs.rank.currentProgress === valor.progression.total && valor.progression.data.stepIndex === valor.defs.rank.steps.length ? valor.defs.rank.steps[0].stepName : valor.defs.rank.steps[(valor.progression.data.stepIndex + 1) % valor.defs.rank.steps.length].stepName}`,
                    completionValue: valor.progression.data.nextLevelAt
                  }}
                  playerProgress={{
                    progress: valor.progression.data.progressToNextLevel,
                    objectiveHash: 'valor'
                  }}
                  hideCheck
                  chunky
                />
                <ProgressBar
                  objectiveDefinition={{
                    progressDescription: valor.defs.rank.displayProperties.name,
                    completionValue: valor.progression.total
                  }}
                  playerProgress={{
                    progress: valor.progression.data.currentProgress,
                    objectiveHash: 'valor'
                  }}
                  hideCheck
                  chunky
                />
              </div>
              <h4>Competitive</h4>
              <div className='progress competitive'>
                <ProgressBar
                  objectiveDefinition={{
                    progressDescription: `Next rank: ${glory.defs.rank.currentProgress === glory.progression.total && glory.progression.data.stepIndex === glory.defs.rank.steps.length ? valor.defs.rank.steps[0].stepName : glory.defs.rank.steps[(glory.progression.data.stepIndex + 1) % glory.defs.rank.steps.length].stepName}`,
                    completionValue: glory.progression.data.nextLevelAt
                  }}
                  playerProgress={{
                    progress: glory.progression.data.progressToNextLevel,
                    objectiveHash: 'valor'
                  }}
                  hideCheck
                  chunky
                />
                <ProgressBar
                  objectiveDefinition={{
                    progressDescription: glory.defs.rank.displayProperties.name,
                    completionValue: glory.progression.total
                  }}
                  playerProgress={{
                    progress: glory.progression.data.currentProgress,
                    objectiveHash: 'glory'
                  }}
                  hideCheck
                  chunky
                />
              </div>
            </div>
          </div>
          <div>
            <div className='content'>
              <div className='sub-header'>
                <div>Summative modes</div>
              </div>
              {Object.values(this.multiplayer.all.stats.allPvP).length > 1 ? (
                <ul className='list modes'>
                  {Object.values(this.multiplayer.all.stats).map(m => {
                    let paramsMode = this.props.match.params.mode ? parseInt(this.props.match.params.mode) : 5;
                    let isActive = (match, location) => {
                      if (paramsMode === m.mode) {
                        return true;
                      } else {
                        return false;
                      }
                    };

                    return <Mode stats={m} isActive={isActive} />;
                  })}
                </ul>
              ) : (
                <Spinner mini />
              )}
            </div>
            <div className='content'>
              <div className='sub-header'>
                <div>Competitive modes</div>
              </div>
              {Object.values(this.multiplayer.all.stats.allPvP).length > 1 ? (
                <ul className='list modes'>
                  {Object.values(this.multiplayer.competitive.stats).map(m => {
                    let paramsMode = this.props.match.params.mode ? parseInt(this.props.match.params.mode) : 5;
                    let isActive = (match, location) => {
                      if (paramsMode === m.mode) {
                        return true;
                      } else {
                        return false;
                      }
                    };

                    return <Mode stats={m} isActive={isActive} />;
                  })}
                </ul>
              ) : (
                <Spinner mini />
              )}
            </div>
            <div className='content'>
              <div className='sub-header'>
                <div>Quickplay modes</div>
              </div>
              {Object.values(this.multiplayer.all.stats.allPvP).length > 1 ? (
                <ul className='list modes'>
                  {Object.values(this.multiplayer.quickplay.stats).map(m => {
                    let paramsMode = this.props.match.params.mode ? parseInt(this.props.match.params.mode) : 5;
                    let isActive = (match, location) => {
                      if (paramsMode === m.mode) {
                        return true;
                      } else {
                        return false;
                      }
                    };

                    return <Mode stats={m} isActive={isActive} />;
                  })}
                </ul>
              ) : (
                <Spinner mini />
              )}
            </div>
          </div>
        </div>
        <div className='module' id='matches'>
          <div className='content'>
            <div className='sub-header'>
              <div>Recent matches</div>
            </div>
            <Matches modes={[this.props.match.params.mode ? parseInt(this.props.match.params.mode) : 5]} characterId={member.characterId} />
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
