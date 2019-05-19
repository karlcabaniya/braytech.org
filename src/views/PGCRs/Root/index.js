import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import * as bungie from '../../../utils/bungie';

import manifest from '../../../utils/manifest';
import { ProfileNavLink } from '../../../components/ProfileLink';
import ProgressBar from '../../../components/UI/ProgressBar';
import Spinner from '../../../components/UI/Spinner';

import './styles.css';

class Crucible extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.stats = {};
  }

  fetch = async () => {
    const { member } = this.props;

    this.setState(p => {
      p.loading = true;
      return p;
    });

    this.stats = await bungie.getHistoricalStats(member.membershipType, member.membershipId, member.characterId, '1', [4, 5, 7, 64], '0');

    this.setState(p => {
      p.loading = false;
      return p;
    });

    return true;
  };

  componentDidMount() {
    this.refreshData();
    this.startInterval();
  }

  refreshData = async () => {
    if (!this.state.loading) {
      //console.log('refresh start');
      await this.fetch();
      //console.log('refresh end');
    } else {
      //console.log('refresh skipped');
    }
  };

  startInterval() {
    this.refreshDataInterval = window.setInterval(this.refreshData, 30000);
  }

  clearInterval() {
    window.clearInterval(this.refreshDataInterval);
  }

  componentWillUnmount() {
    this.clearInterval();
  }

  render() {
    const { t, member } = this.props;
    const characterId = member.characterId;

    let displayStats = [
      {
        key: 'secondsPlayed',
        name: 'Time Played',
        type: 'value',
        time: true
      },
      {
        key: 'kills',
        name: 'Kills',
        type: 'value'
      },
      {
        key: 'deaths',
        name: 'Deaths',
        type: 'value'
      },
      {
        key: 'suicides',
        name: 'Suicides',
        type: 'value'
      },
      {
        key: 'longestKillSpree',
        name: 'Longest Kill Spree',
        type: 'value'
      },
      {
        key: 'longestKillDistance',
        name: 'Longest Kill Distance',
        type: 'value'
      },
      {
        key: 'longestSingleLife',
        name: 'Longest Single Life',
        type: 'value',
        time: true
      }
    ];

    return (
      <div className={cx('view', 'root')} id='multiplayer'>
        <div className='module-l1'>
          <div className='module-l2'>
            <div className='content head'>
              <div className='page-header'>
                <div className='name'>{t('Post Game Carnage Reports')}</div>
                <div className='description'>{t('You know, in case you missed the match summary screen while you were busy being awesome.')}</div>
              </div>
            </div>
          </div>
        </div>
        <div className='module-l1'>
          <div className='content views'>
            <div className='sub-header'>
              <div>Views</div>
            </div>
            <ul className='list'>
              <li className='linked'>
                <ProfileNavLink to='/pgcrs' exact>
                  {t('Summary')}
                </ProfileNavLink>
              </li>
              <li className='linked'>
                <ProfileNavLink to='/pgcrs/crucible'>{t('Crucible')}</ProfileNavLink>
              </li>
              <li className='linked'>
                <ProfileNavLink to='/pgcrs/gambit'>{t('Gambit')}</ProfileNavLink>
              </li>
              {/* <li className='linked'>
                <ProfileNavLink to='/pgcrs/raids'>{t('Raids')}</ProfileNavLink>
              </li>
              <li className='linked'>
                <ProfileNavLink to='/pgcrs/all'>{t('All')}</ProfileNavLink>
              </li> */}
            </ul>
          </div>
          <div className='content career'>
            <div className='sub-header'>
              <div>Highlights</div>
            </div>
            <div className='doms'>
              <div className='subs'>None atm idk lol give me a break</div>
            </div>
          </div>
        </div>
        <div className='module-l1' id='stats'>
          {this.stats.allPvP ? (
            <div className='content'>
              {this.stats.allPvP.allTime ? (
                <>
                  <div className='sub-header'>
                    <div>Crucible</div>
                  </div>
                  <div className='stats'>
                    {displayStats.map((s, i) => {
                      let object = this.stats.allPvP;
                      let value;
                      if (s.time) {
                        if (s.key === 'longestSingleLife') {
                          value = `${Math.floor(object.allTime[s.key].basic[s.type] / 60).toLocaleString('en-us')} minutes`;
                        } else {
                          value = `${Math.floor(object.allTime[s.key].basic[s.type] / 60 / 60 / 24).toLocaleString('en-us')} days`;
                        }
                      } else if (s.key === 'longestKillDistance') {
                        value = `${object.allTime[s.key].basic[s.type].toLocaleString('en-us')} metres`;
                      } else {
                        value = object.allTime[s.key].basic[s.type].toLocaleString('en-us');
                      }
                      return (
                        <div key={i} className={cx('stat', s.key)}>
                          <div className='value'>{value}</div>
                          <div className='name'>{s.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : null}
              {this.stats.allPvECompetitive.allTime ? (
                <>
                  <div className='sub-header'>
                    <div>Gambit</div>
                  </div>
                  <div className='stats'>
                    {displayStats.map((s, i) => {
                      let object = this.stats.allPvECompetitive;
                      let value;
                      if (s.time) {
                        if (s.key === 'longestSingleLife') {
                          value = `${Math.floor(object.allTime[s.key].basic[s.type] / 60).toLocaleString('en-us')} minutes`;
                        } else {
                          value = `${Math.floor(object.allTime[s.key].basic[s.type] / 60 / 60 / 24).toLocaleString('en-us')} days`;
                        }
                      } else if (s.key === 'longestKillDistance') {
                        value = `${object.allTime[s.key].basic[s.type].toLocaleString('en-us')} metres`;
                      } else {
                        value = object.allTime[s.key].basic[s.type].toLocaleString('en-us');
                      }
                      return (
                        <div key={i} className={cx('stat', s.key)}>
                          <div className='value'>{value}</div>
                          <div className='name'>{s.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <Spinner />
          )}
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
)(Crucible);
