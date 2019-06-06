import React from 'react';

import Spinner from '../../components/UI/Spinner';
import Roster from '../../components/Roster';

import './roster.css';

class RosterView extends React.Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     ttl: 59000
  //   };
  // }

  componentDidMount() {
    window.scrollTo(0, 0);   
  }

  // componentDidUpdate(p) {
  //   if (!this.refreshCountdownInterval && !this.props.groupMembers.loading && this.props.groupMembers.responses.length > 0) {
  //     this.startInterval();
  //   }
  //   if (p.group && this.props.group) {
      
  //   }
  // }

  // updateCountdown = () => {
  //   let lastUpdated = this.props.groupMembers.lastUpdated;
  //   let now = new Date().getTime();

  //   this.setState((prevState, props) => {
  //     prevState.ttl = (lastUpdated + 59000 - now);
  //     return prevState;
  //   });
  // }

  // startInterval() {
  //   this.refreshCountdownInterval = window.setInterval(this.updateCountdown, 1000);
  // }

  // clearInterval() {
  //   window.clearInterval(this.refreshCountdownInterval);
  // }

  // componentWillUnmount() {
  //   this.clearInterval();
  // }

  render() {
    const { t, group, groupMembers } = this.props;

    return (
      <div className='view roster' id='clan'>
        <div className='module'>
          <div className='page-header'>
            <div className='sub-name'>{t('Clan: roster')}</div>
            <div className='name'>
              {group.name}
              <div className='tag'>[{group.clanInfo.clanCallsign}]</div>
            </div>
            {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
            <div className='memberCount'>
              // {group.memberCount} {t('members')} / {groupMembers.responses.filter(member => member.isOnline).length} {t('online')}
            </div>
          </div>
        </div>
        <div className='module'>
          <div className='status'>{groupMembers.responses.length > 0 ? groupMembers.loading ? (
            <Spinner mini />
          ) : (
            <div className='ttl' />
          ) : null}</div>
          {groupMembers.loading && groupMembers.responses.length === 0 ? <Spinner /> : <Roster />}
        </div>
      </div>
    );
  }
}

export default RosterView;
