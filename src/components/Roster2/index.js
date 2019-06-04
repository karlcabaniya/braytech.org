import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';

import manifest from '../../utils/manifest';
import * as destinyUtils from '../../utils/destinyUtils';
import getGroupMembers from '../../utils/getGroupMembers';
import MemberLink from '../MemberLink';
import Button from '../UI/Button';

import './styles.css';

class Roster extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
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
  };

  startInterval() {
    this.refreshClanDataInterval = window.setInterval(this.callGetGroupMembers, 60000);
  }

  clearInterval() {
    window.clearInterval(this.refreshClanDataInterval);
  }

  componentWillUnmount() {
    this.clearInterval();
  }

  render() {
    const { t, groupMembers, mini, showOnline = false } = this.props;

    let members = [];
    let results = showOnline ? groupMembers.responses.filter(r => r.isOnline) : groupMembers.responses;

    results.forEach(m => {
      let isPrivate = !m.profile || (!m.profile.characterActivities.data || !m.profile.characters.data.length);
      let { lastPlayed, lastActivity, lastCharacter, lastMode, display } = destinyUtils.lastPlayerActivity(m);
      let triumphScore = !isPrivate ? m.profile.profileRecords.data.score : 0;
      let valorPoints = !isPrivate ? m.profile.characterProgressions.data[m.profile.characters.data[0].characterId].progressions[2626549951].currentProgress : 0;
      let gloryPoints = !isPrivate ? m.profile.characterProgressions.data[m.profile.characters.data[0].characterId].progressions[2000925172].currentProgress : 0;
      let infamyPoints = !isPrivate ? m.profile.characterProgressions.data[m.profile.characters.data[0].characterId].progressions[2772425241].currentProgress : 0;

      /*

        lastPlayed:     Date
        lastActivity:   Object
        lastCharacter:  Object
        lastMode:       Object
        display:        String

      */

      console.log(lastPlayed, lastActivity, lastCharacter, lastMode, display);

      members.push({
        sorts: {
          private: isPrivate,
          isOnline: m.isOnline,
          lastActivity,
          lastPlayed,
          triumphScore
        },
        el: {
          full: (
            <li key={m.destinyUserInfo.membershipType + m.destinyUserInfo.membershipId} className='row'>
              <ul>
                <li className='col member'>
                  <MemberLink type={m.destinyUserInfo.membershipType} id={m.destinyUserInfo.membershipId} groupId={m.destinyUserInfo.groupId} displayName={m.destinyUserInfo.displayName} hideEmblemIcon={!m.isOnline} />
                </li>
                {!isPrivate ? (
                  <>
                    <li className='col lastCharacter'>
                      <div className='icon'>
                        <i
                          className={`destiny-class_${destinyUtils
                            .classTypeToString(lastCharacter.classType)
                            .toString()
                            .toLowerCase()}`}
                        />
                      </div>
                      <div className='icon'>
                        <div>{lastCharacter.baseCharacterLevel}</div>
                      </div>
                      <div className='icon'>
                        <div className={cx({ 'max-ish': lastCharacter.light >= 690, max: lastCharacter.light === 700 })}><span>{lastCharacter.light}</span></div>
                      </div>
                    </li>
                    <li className={cx('col', 'lastActivity', { display: m.isOnline && display })}>
                      {m.isOnline && display ? <div className='name'>{display}</div> : null}
                      <Moment fromNow>
                        {lastPlayed}
                      </Moment>
                    </li>
                    <li className='col triumphScore'>{triumphScore.toLocaleString('en-us')}</li>
                    <li className='col valor'>{valorPoints}</li>
                    <li className='col glory'>{gloryPoints}</li>
                    <li className='col infamy'>{infamyPoints}</li>
                  </>
                ) : (
                  <>
                    <li className='col lastCharacter'>–</li>
                    <li className='col lastActivity'>–</li>
                    <li className='col triumphScore'>–</li>
                    <li className='col valor'>–</li>
                    <li className='col glory'>–</li>
                    <li className='col infamy'>–</li>
                  </>
                )}
              </ul>
            </li>
          )
        }
      });
    });

    members = orderBy(members, [m => m.sorts.private, m => m.sorts.isOnline, m => m.sorts.lastActivity, m => m.sorts.lastPlayed], ['asc', 'desc', 'desc', 'desc']);

    members.unshift({
      sorts: {
        
      },
      el: {
        full: (
          <li key='header-row' className='row header'>
            <ul>
              <li className='col member' />
              <li className='col lastCharacter'>
                <div className='full'>Last character</div>
                <div className='abbr'>Char</div>
              </li>
              <li className='col lastActivity'>
                <div className='full'>Last activity</div>
                <div className='abbr'>Activity</div>
              </li>
              <li className='col triumphScore'>
                <div className='full'>Triumph score</div>
                <div className='abbr'>T. Score</div>
              </li>
              <li className='col valor'>
                <div className='full'>Valor</div>
                <div className='abbr'>Valor</div>
              </li>
              <li className='col glory'>
                <div className='full'>Glory</div>
                <div className='abbr'>Glory</div>
              </li>
              <li className='col infamy'>
                <div className='full'>Infamy</div>
                <div className='abbr'>Infamy</div>
              </li>
            </ul>
          </li>
        )
      }
    });

    return <ul className={cx('list', 'roster2', { mini: mini })}>{members.map(m => m.el.full)}</ul>;
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
