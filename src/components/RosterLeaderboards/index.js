import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import moment from 'moment';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import * as ls from '../../utils/localStorage';
import * as destinyUtils from '../../utils/destinyUtils';
import * as bungie from '../../utils/bungie';
import getGroupMembers from '../../utils/getGroupMembers';
import { ProfileNavLink, ProfileLink } from '../ProfileLink';
import MemberLink from '../MemberLink';
import Spinner from '../UI/Spinner';

import './styles.css';

class RosterLeaderboards extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      leaderboards: false
    };
  }

  componentDidMount() {
    this.mounted = true;

    this.callGetClanLeaderboards();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  callGetClanLeaderboards = async () => {
    const { member, groupMembers, mode } = this.props;
    const result = member.data.groups.results.length > 0 ? member.data.groups.results[0] : false;

    const auth = ls.get('setting.auth');
    const isAuthed = auth && auth.destinyMemberships && auth.destinyMemberships.find(m => m.membershipId === member.membershipId);

    if (!groupMembers.groupId && !groupMembers.loading) {
      await getGroupMembers(result.group, result.member.memberType > 2 && isAuthed);
    } else {
      const responses = await Promise.all(
        groupMembers.members.map(async member => {
          try {
            const response = await bungie.GetHistoricalStats(member.destinyUserInfo.membershipType, member.destinyUserInfo.membershipId, '0', '1', '4,18,46,63,75,69,70,77', '0');

            return {
              ...member,
              historicalStats: response
            };
          } catch (e) {
            console.log(`Something went wrong with ${member.destinyUserInfo.membershipId}: ${e}`);
          }
        })
      );

      if (this.mounted) {
        this.responses = responses;

        console.log(responses);

        this.generateLeaderboards();
      }
    }
  };

  scopes = [
    {
      name: 'Quickplay',
      value: 'pvpQuickplay'
    },
    {
      name: 'Competitive',
      value: 'pvpCompetitive'
    },
    {
      name: 'Gambit',
      value: 'pvecomp_gambit'
    },
    {
      name: 'Gambit Prime',
      value: 'pvecomp_mamba'
    },
    {
      name: 'Strikes',
      value: 'allStrikes'
    },
    {
      name: 'Nightfalls',
      value: 'scored_nightfall'
    },
    {
      name: 'Menagerie',
      value: 'caluseum'
    },
    {
      name: 'Raids',
      value: 'raid'
    }
  ];

  statIds = [
    {
      value: 'kills',
      type: 'integer'
    },
    {
      value: 'deaths',
      type: 'integer'
    },
    {
      value: 'killsDeathsRatio',
      type: 'float'
    },
    {
      value: 'suicides',
      type: 'integer'
    },
    {
      value: 'secondsPlayed',
      type: 'time'
    },
    {
      value: 'bestSingleGameKills',
      type: 'integer'
    },
    {
      value: 'precisionKills',
      type: 'integer'
    },
    {
      value: 'longestKillSpree',
      type: 'integer'
    },
    {
      value: 'longestKillDistance',
      type: 'distance'
    },
    {
      value: 'longestSingleLife',
      type: 'time'
    }
  ];

  statIdsSummary = [
    {
      value: 'kills',
      type: 'integer'
    },
    {
      value: 'deaths',
      type: 'integer'
    },
    {
      value: 'activitiesCleared',
      type: 'integer'
    },
    {
      value: 'activitiesWon',
      type: 'integer'
    },
    {
      value: 'secondsPlayed',
      type: 'integer'
    },
    {
      value: 'orbsDropped',
      type: 'integer'
    },
    {
      value: 'motesDeposited',
      type: 'integer'
    },
    {
      name: 'Primeval Damage',
      value: 'primevalDamage',
      type: 'integer'
    },
    {
      name: 'Primeval Kills',
      value: 'primevalKills',
      type: 'integer'
    }
  ];

  generateLeaderboards = () => {
    const leaderboards = {
      summary: {}
    };

    this.scopes.forEach(scope => {
      leaderboards[scope.value] = {};

      this.statIds.forEach(statId => {
        leaderboards[scope.value][statId.value] = orderBy(
          this.responses.map(m => {
            try {
              return {
                destinyUserInfo: {
                  ...m.destinyUserInfo,
                  groupId: m.groupId
                },
                value: m.historicalStats[scope.value].allTime[statId.value].basic.value,
                displayValue: m.historicalStats[scope.value].allTime[statId.value].basic.displayValue
              };
            } catch (e) {
              return {
                destinyUserInfo: {
                  ...m.destinyUserInfo,
                  groupId: m.groupId
                },
                value: 0,
                displayValue: 0
              };
            }
          }),
          [m => m.value],
          ['desc']
        );
      });

      this.statIdsSummary.forEach(statId => {
        const target = statId.value === 'activitiesWon' ? 'activitiesCleared' : statId.value;
        
        leaderboards.summary[target] = this.responses.reduce((a, m) => {
          try {
            return a + m.historicalStats[scope.value].allTime[statId.value].basic.value;
          } catch (e) {
            return a + 0;
          }
        }, leaderboards.summary[target] || 0);
      });
    });



    this.setState({ loading: false, leaderboards });
  };

  componentDidUpdate(pP, pS) {
    if (pP.groupMembers.lastUpdated !== this.props.groupMembers.lastUpdated && this.state.loading) {
      this.callGetClanLeaderboards();
    }
  }

  prettyValue = (statId, value) => {
    const stat = this.statIds.concat(this.statIdsSummary).find(s => s.value === statId);

    if (stat && stat.type === 'time') {
      return value;
    } else if (stat && stat.type === 'distance') {
      return Math.floor(value) + 'm';
    } else if (stat && stat.type === 'integer') {
      return parseInt(value, 10).toLocaleString('en-us');
    } else {
      return value;
    }
  }

  elScopes = scope => {
    const t = this.props.t;

    const scopes = this.scopes.map(s => {
      return (
        <li key={s.value} className={cx('linked', { active: scope === s.value })}>
          <div className='text'>{s.name}</div>
          <ProfileNavLink to={`/clan/stats/${s.value}`} />
        </li>
      );
    });

    scopes.unshift(
      <li key='summary' className={cx('linked', { active: !scope })}>
        <div className='text'>{t('Summary')}</div>
        <ProfileNavLink exact to={`/clan/stats`} />
      </li>
    );

    return scopes;
  };

  elBoards = (scope, stat) => {
    const { t, member, groupMembers } = this.props;

    if (stat) {
      const definitionStat = manifest.DestinyHistoricalStatsDefinition[stat];
      
      return (
        <div key={stat} className='module'>
          <div className='module-header'>
            <div className='sub-name'>{definitionStat.statName}</div>
          </div>
          <ul key={stat} className='list leaderboard'>
            {this.state.leaderboards[scope][stat].map((m, i) => {
              const isSelf = m.destinyUserInfo.membershipType.toString() === member.membershipType && m.destinyUserInfo.membershipId === member.membershipId;

              return (
                <li key={m.destinyUserInfo.membershipId} className={cx('row', { self: isSelf })}>
                  <ul>
                    <li className='col member'>
                      <MemberLink type={m.destinyUserInfo.membershipType} id={m.destinyUserInfo.membershipId} groupId={m.destinyUserInfo.groupId} displayName={m.destinyUserInfo.displayName} />
                    </li>
                    <li className='col rank'>{i + 1}</li>
                    <li className='col value'>{this.prettyValue(stat, m.displayValue)}</li>
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      )
    } else {
      return Object.entries(this.state.leaderboards[scope])
        .map(([statId, data]) => {
          const definitionStat = manifest.DestinyHistoricalStatsDefinition[statId];

          return {
            name: statId,
            el: (
              <div key={statId} className='module'>
                <div className='module-header'>
                  <div className='sub-name'>{definitionStat.statName}</div>
                </div>
                <ul key={statId} className='list leaderboard'>
                  {data.slice(0, 10).map((m, i) => {
                    const isSelf = m.destinyUserInfo.membershipType.toString() === member.membershipType && m.destinyUserInfo.membershipId === member.membershipId;

                    return (
                      <li key={m.destinyUserInfo.membershipId} className={cx('row', { self: isSelf })}>
                        <ul>
                          <li className='col member'>
                            <MemberLink type={m.destinyUserInfo.membershipType} id={m.destinyUserInfo.membershipId} groupId={m.destinyUserInfo.groupId} displayName={m.destinyUserInfo.displayName} />
                          </li>
                          <li className='col rank'>{i + 1}</li>
                          <li className='col value'>{this.prettyValue(statId, m.displayValue)}</li>
                        </ul>
                      </li>
                    );
                  })}
                </ul>
                <ProfileLink className='button' to={`/clan/stats/${scope}/${statId}`}>
                  <div className='text'>{t('See all {{count}}', { count: groupMembers.members.length })}</div>
                </ProfileLink>
              </div>
            )
          };
        })
        .map(e => e.el);
    }
  };

  render() {
    const { t, member, scope, stat } = this.props;

    console.log(this.state);

    if (!this.state.loading) {
      const knownScope = this.scopes.find(s => s.value === scope);
      const knownStat = this.statIds.find(s => s.value === stat);

      if (scope && knownScope && stat && knownStat) {
        const definitionStat = manifest.DestinyHistoricalStatsDefinition[stat];

        return (
          <div className='wrapper'>
            <div className='bread'>
              <span>{t('Historical stats')}</span>
              <span>{knownScope.name}</span>
              <span>{definitionStat.statName}</span>
            </div>
            <div className='module views scopes'>
              <ul className='list'>{this.elScopes(scope)}</ul>
            </div>
            <div className='boards single'>{this.elBoards(scope, stat)}</div>
          </div>
        );
      } else if (scope && knownScope) {
        return (
          <div className='wrapper'>
            <div className='bread'>
              <span>{t('Historical stats')}</span>
              <span>{knownScope.name}</span>
            </div>
            <div className='module views scopes'>
              <ul className='list'>{this.elScopes(scope)}</ul>
            </div>
            <div className='boards'>{this.elBoards(scope)}</div>
          </div>
        );
      } else {
        return (
          <div className='wrapper'>
            <div className='bread'>
              <span>{t('Historical stats')}</span>
            </div>
            <div className='module views scopes'>
              <ul className='list'>{this.elScopes(scope)}</ul>
            </div>
            <div className='boards summary-stats'>
              {Object.entries(this.state.leaderboards.summary).map(([statId, value]) => {
                const definitionStat = manifest.DestinyHistoricalStatsDefinition[statId];
                const stat = this.statIdsSummary.find(s => s.value === statId);

                return (
                  <div key={statId} className='stat'>
                    <div className='name'>{stat.name ? stat.name : definitionStat.statName}</div>
                    <div className='value'>{this.prettyValue(statId, value)}</div>
                  </div>
                )
              })}
            </div>
          </div>
        );
      }
    } else {
      return <Spinner />;
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    groupMembers: state.groupMembers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(RosterLeaderboards);
