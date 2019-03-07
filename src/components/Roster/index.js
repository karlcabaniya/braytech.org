import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';

import Globals from '../../utils/globals';
import { ProfileLink } from '../../components/ProfileLink';
import manifest from '../../utils/manifest';
import ObservedImage from '../../components/ObservedImage';
import * as utils from '../../utils/destinyUtils';
import getGroupMembers from '../../utils/getGroupMembers';

import './styles.css';

class Roster extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: []
    };
  }

  componentDidMount() {
    const { member, groupMembers } = this.props;
    const group = member.data.groups.results.length > 0 ? member.data.groups.results[0].group : false;

    if (group) {
      this.callGetGroupMembers(group);
      this.startInterval();
    }
  }

  callGetGroupMembers = () => {
    const { member, groupMembers } = this.props;
    const group = member.data.groups.results.length > 0 ? member.data.groups.results[0].group : false;
    let now = new Date();

    // console.log(now - groupMembers.lastUpdated);

    if (group && (now - groupMembers.lastUpdated > 30000 || group.groupId !== groupMembers.groupId)) {
      getGroupMembers(group);
    }
  }

  startInterval() {
    this.refreshClanDataInterval = window.setInterval(this.callGetGroupMembers, 60000);
  }

  clearInterval() {
    window.clearInterval(this.refreshClanDataInterval);
  }

  componentWillUnmount() {
    this.clearInterval();
  }

  expandHandler = (membershipId, mini) => {
    if (mini) {
      return false;
    } else {
      this.setState((prevState, props) => {
        let index = prevState.expanded.indexOf(membershipId);
        if (index > -1) {
          let expanded = prevState.expanded.filter(id => id !== membershipId);
          return { expanded: expanded };
        } else {
          let expanded = prevState.expanded.concat(membershipId);
          return { expanded: expanded };
        }
      });
    }
  };

  render() {
    const { t, groupMembers, mini, linked, isOnline } = this.props;

    let list = [];
    let results = isOnline ? groupMembers.responses.filter(response => response.isOnline) : groupMembers.responses;

    results.forEach(member => {
      let blueberry = new Date().getTime() - new Date(member.joinDate).getTime() < 1209600000 ? true : false;

      if (!member.profile) {
        if (!mini) {
          list.push({
            membershipId: member.destinyUserInfo.membershipId,
            isOnline: member.isOnline,
            lastPlayed: new Date(member.joinDate).getTime(),
            lastActivity: 0,
            element: (
              <li key={member.destinyUserInfo.membershipId} className={cx({ isOnline: member.isOnline }, 'no-character', 'error')}>
                <div className='basic'>
                  <div className='icon'>
                    <div className='emblem' />
                  </div>
                  <div className='displayName'>{member.destinyUserInfo.displayName}</div>
                  <div className='error'>{t("Couldn't retrieve this profile")}</div>
                  <div className='activity'>
                    <Moment fromNow ago>{member.joinDate}</Moment>
                  </div>
                </div>
              </li>
            )
          });
        }
        return;
      }

      if (!member.profile.characterActivities.data || !member.profile.characters.data.length) {
        if (!mini) {
          list.push({
            membershipId: member.destinyUserInfo.membershipId,
            isOnline: member.isOnline,
            lastPlayed: new Date(member.profile.profile.data.dateLastPlayed).getTime(),
            lastActivity: 0,
            element: (
              <li key={member.destinyUserInfo.membershipId} className={cx({ isOnline: member.isOnline }, 'no-character', 'error')}>
                <div className='basic'>
                  <div className='icon'>
                    <div className='emblem' />
                  </div>
                  <div className='displayName'>{member.destinyUserInfo.displayName}</div>
                  <div className='error'>{t('Private profile')}</div>
                  <div className='activity'>
                    <Moment fromNow ago>{member.profile.profile.data.dateLastPlayed}</Moment>
                  </div>
                </div>
              </li>
            )
          });
        }
        return;
      }

      const { lastPlayed, lastActivity, lastCharacter, lastMode, display } = utils.lastPlayerActivity(member);

      // if (member.destinyUserInfo.membershipId === this.props.member.membershipId.toString()) {
      //   console.log(member, lastMode);
      // }

      if (mini) {
        list.push({
          membershipId: member.destinyUserInfo.membershipId,
          isOnline: member.isOnline,
          lastPlayed: new Date(lastPlayed).getTime(),
          lastActivity: lastActivity && member.isOnline ? lastActivity.currentActivityHash : 0,
          element: (
            <li key={member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.isOnline, thisIsYou: member.destinyUserInfo.membershipId === this.props.member.membershipId.toString() })}>
              <div className='basic'>
                <div className='icon'>
                  <ObservedImage className={cx('image', 'emblem')} src={`https://www.bungie.net${lastCharacter.emblemPath}`} />
                </div>
                <div className='displayName'>{member.destinyUserInfo.displayName}</div>
              </div>
            </li>
          )
        });
      } else {
        let displayName = (
          <>
            <div className='icon'>{member.isOnline ? <ObservedImage className={cx('image', 'emblem')} src={`https://www.bungie.net${lastCharacter.emblemPath}`} /> : <div className='emblem' />}</div>
            <div className='displayName'>{member.destinyUserInfo.displayName}</div>
          </>
        );

        const characterStamps = character => (
          <>
            <span className={cx('stamp', 'light', { max: character.light === 700 })}>{character.light}</span>
            <span className={cx('stamp', 'level')}>{character.baseCharacterLevel}</span>
            <span className={cx('stamp', 'class', utils.classTypeToString(character.classType).toLowerCase())}>{utils.classTypeToString(character.classType)}</span>
            <span className={cx('stamp', 'clan-xp', { complete: member.profile.characterProgressions.data[character.characterId].progressions[540048094].weeklyProgress === 5000 })}>{member.profile.characterProgressions.data[character.characterId].progressions[540048094].weeklyProgress} XP</span>
          </>
        );

        const timePlayedTotalCharacters = Math.floor(
          Object.keys(member.profile.characters.data).reduce((sum, key) => {
            return sum + parseInt(member.profile.characters.data[key].minutesPlayedTotal);
          }, 0) / 1440
        );
        const timePlayedAllPvE = member.historicalStats.allPvE && member.historicalStats.allPvE.allTime ? member.historicalStats.allPvE.allTime.secondsPlayed.basic.value / 60 : 0;
        const timePlayedAllPvP = member.historicalStats.allPvP && member.historicalStats.allPvP.allTime ? member.historicalStats.allPvP.allTime.secondsPlayed.basic.value / 60 : 0;
        const timePlayedTotal = timePlayedAllPvE > timePlayedAllPvP ? Math.floor((timePlayedAllPvE / (timePlayedAllPvE + timePlayedAllPvP)) * 100) : Math.floor((timePlayedAllPvP / (timePlayedAllPvE + timePlayedAllPvP)) * 100);

        let isExpanded = this.state.expanded.includes(member.destinyUserInfo.membershipId);
        let expanded = (
          <div className='detail'>
            <ul className='times'>
              <li className='joinDate'>
                <>Joined </>
                <Moment fromNow>{member.joinDate}</Moment>
              </li>
              <li className='timePlayed'>
                {timePlayedTotalCharacters} {timePlayedTotalCharacters === 1 ? t('day played') : t('days played')}
              </li>
              <li>
                {timePlayedTotal}% {timePlayedAllPvE > timePlayedAllPvP ? <span className='stamp pve'>PvE</span> : <span className='stamp pvp'>PvP</span>} player
              </li>
            </ul>
            <ul className='characters'>
              {member.profile.characters.data.map(character => (
                <li key={character.characterId} className={cx({ isLast: character.characterId === lastCharacter.characterId })}>
                  {characterStamps(character)}
                </li>
              ))}
            </ul>
          </div>
        );

        // <div className='rank'>{utils.groupMemberTypeToString(member.memberType)}</div>

        list.push({
          membershipId: member.destinyUserInfo.membershipId,
          isOnline: member.isOnline,
          lastPlayed: new Date(lastPlayed).getTime(),
          lastActivity: lastActivity && member.isOnline ? lastActivity.currentActivityHash : 0,
          element: (
            <li key={member.destinyUserInfo.membershipId} className={cx('linked', { isOnline: member.isOnline, isExpanded: isExpanded, thisIsYou: member.destinyUserInfo.membershipId === this.props.member.membershipId.toString() })} onClick={() => this.expandHandler(member.destinyUserInfo.membershipId, mini)}>
              <div className='basic'>
                {displayName}
                <div className='character'>{characterStamps(lastCharacter)}</div>
                <div className='activity'>
                  {lastMode ? <div className='mode'>{lastMode.displayProperties.name}</div> : null}
                  {display ? <div className='name'>{display}</div> : null}
                  <Moment fromNow ago>{lastPlayed}</Moment>
                </div>
              </div>
              {isExpanded ? expanded : null}
            </li>
          )
        });
      }
    });

    list = orderBy(list, [member => member.isOnline, member => member.lastActivity, member => member.lastPlayed], ['desc', 'desc', 'desc']);

    if (this.props.mini) {
      list.push({
        membershipId: 0,
        isOnline: false,
        lastActive: 0,
        lastActivity: 0,
        element: (
          <li key='i_am_unqiue' className='linked view-all'>
            <ProfileLink to='/clan/roster'>{t('View full roster')}</ProfileLink>
          </li>
        )
      });
    } else {
      list.unshift({
        membershipId: 0,
        isOnline: false,
        lastActive: 0,
        lastActivity: 0,
        element: (
          <li key='i_am_unqiue' className='grid-header'>
            <div className='basic'>
              <div className='icon'>
                <div className='emblem' />
              </div>
              <div className='displayName' />
              <div className='character'>{t('Last character')}</div>
              <div className='activity'>{t('Last activity')}</div>
            </div>
          </li>
        )
      });
    }

    return <ul className={cx('list', 'roster', { mini: mini })}>{list.map(member => member.element)}</ul>;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    groupMembers: state.groupMembers
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Roster);
