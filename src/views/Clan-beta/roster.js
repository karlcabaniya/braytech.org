import React from 'react';

import { ProfileNavLink } from '../../components/ProfileLink';

import Roster2 from '../../components/Roster2';

import Spinner from '../../components/UI/Spinner';

import './roster.css';

class RosterView extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { t, group, groupMembers } = this.props;

    return (
      <div className='view roster' id='clan'>
        <div className='module'>
          <div className='summary'>
            <div className='page-header'>
              <div className='sub-name'>Clan</div>
              <div className='name'>Roster</div>
            </div>
          </div>
        </div>
        <div className='module'>
          <div className='liteRefresh'>{groupMembers.loading && groupMembers.responses.length !== 0 ? <Spinner mini /> : null}</div>
          {groupMembers.loading && groupMembers.responses.length === 0 ? <Spinner /> : <Roster2 />}
        </div>
      </div>
    );
  }
}

export default RosterView;
