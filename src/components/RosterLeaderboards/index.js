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

  statIds = ['kills', 'deaths', 'killsDeathsRatio', 'suicides', 'secondsPlayed', 'bestSingleGameKills', 'precisionKills', 'longestKillSpree', 'longestKillDistance', 'longestSingleLife'];

  generateLeaderboards = () => {
    const leaderboards = {};

    this.scopes.forEach(scope => {
      leaderboards[scope.value] = {};

      this.statIds.forEach(statId => {
        leaderboards[scope.value][statId] = orderBy(
          this.responses.map(m => {
            try {
              return {
                destinyUserInfo: {
                  ...m.destinyUserInfo,
                  groupId: m.groupId
                },
                value: m.historicalStats[scope.value].allTime[statId].basic.value,
                displayValue: m.historicalStats[scope.value].allTime[statId].basic.displayValue
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
    });

    this.setState({ loading: false, leaderboards });
  };

  componentDidUpdate(pP, pS) {
    if (pP.groupMembers.lastUpdated !== this.props.groupMembers.lastUpdated && this.state.loading) {
      this.callGetClanLeaderboards();
    }
  }

  elScopes = (scope, stat) => {
    return this.scopes.map(s => {
      return (
        <li key={s.value} className={cx('linked', { active: scope === s.value })}>
          <div className='text'>{s.name}</div>
          <ProfileNavLink to={`/clan/stats/${s.value}`} />
        </li>
      );
    });
  };

  elBoards = (scope, stat) => {
    const { t } = this.props;

    if (stat && this.statIds.includes(stat)) {
      const definitionStat = manifest.DestinyHistoricalStatsDefinition[stat];
      
      return (
        <div key={stat} className='module'>
          <div className='module-header'>
            <div className='sub-name'>{definitionStat.statName}</div>
          </div>
          <ul key={stat} className='list leaderboard'>
            {this.state.leaderboards[scope][stat].map((m, i) => {
              return (
                <li key={m.destinyUserInfo.membershipId} className={cx('row', { self: false })}>
                  <ul>
                    <li className='col rank'>{i + 1}</li>
                    <li className='col member'>
                      <MemberLink type={m.destinyUserInfo.membershipType} id={m.destinyUserInfo.membershipId} groupId={m.destinyUserInfo.groupId} displayName={m.destinyUserInfo.displayName} />
                    </li>
                    <li className='col value'>{m.displayValue}</li>
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
                    return (
                      <li key={m.destinyUserInfo.membershipId} className={cx('row', { self: false })}>
                        <ul>
                          <li className='col rank'>{i + 1}</li>
                          <li className='col member'>
                            <MemberLink type={m.destinyUserInfo.membershipType} id={m.destinyUserInfo.membershipId} groupId={m.destinyUserInfo.groupId} displayName={m.destinyUserInfo.displayName} />
                          </li>
                          <li className='col value'>{m.displayValue}</li>
                        </ul>
                      </li>
                    );
                  })}
                </ul>
                <ProfileLink className='button' to={`/clan/stats/${scope}/${statId}`}>
                  <div className='text'>{t('See all members')}</div>
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

    // const isSelf = m.profile.profile.data.userInfo.membershipType.toString() === member.membershipType && m.profile.profile.data.userInfo.membershipId === member.membershipId;

    // <li key={m.destinyUserInfo.membershipType + m.destinyUserInfo.membershipId} className={cx('row', { self: isSelf })}>

    if (!this.state.loading) {
      if (scope && this.scopes.find(s => s.value === scope) && stat) {
        return (
          <div className='wrapper'>
            <div className='module views scopes'>
              <ul className='list'>{this.elScopes(scope, stat)}</ul>
            </div>
            <div className='boards single'>{this.elBoards(scope, stat)}</div>
          </div>
        );
      } else if (scope && this.scopes.find(s => s.value === scope)) {
        return (
          <div className='wrapper'>
            <div className='module views scopes'>
              <ul className='list'>{this.elScopes(scope, stat)}</ul>
            </div>
            <div className='boards'>{this.elBoards(scope, stat)}</div>
          </div>
        );
      } else {
        return (
          <div className='wrapper'>
            <div className='module views scopes'>
              <ul className='list'>
                {this.scopes.map(s => {
                  return (
                    <li key={s.value} className={cx('linked', { active: scope === s.value })}>
                      <div className='text'>{s.name}</div>
                      <ProfileNavLink to={`/clan/stats/${s.value}`} />
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className='boards'></div>
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
