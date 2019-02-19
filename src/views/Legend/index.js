import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import * as bungie from '../../utils/bungie';
import getPGCR from '../../utils/getPGCR';

import Characters from './Characters';
import NightfallHighScores from './NightfallHighScores';
import RaidReport from './RaidReport';

import './styles.css';

class Legend extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  cacheMachine = async (mode) => {
    const { member, PGCRcache } = this.props;

    let charactersIds = member.data.profile.characters.data.map(c => c.characterId);

    // console.log(charactersIds)

    let requests = charactersIds.map(async c => {
      let response = await bungie.activityHistory(member.membershipType, member.membershipId, c, 250, mode, 0);
      return response.activities;
    });

    let activities = await Promise.all(requests);
    activities = activities.flat();

    // console.log(activities);

    let PGCRs = activities.map(async activity => {
      if (PGCRcache[member.membershipId] && activity && !PGCRcache[member.membershipId].find(pgcr => pgcr.activityDetails.instanceId === activity.activityDetails.instanceId)) {
        return getPGCR(member.membershipId, activity.activityDetails.instanceId);
      } else if (!PGCRcache[member.membershipId] && activity) {
        return getPGCR(member.membershipId, activity.activityDetails.instanceId);
      } else {
        return true;
      }
    });

    return await Promise.all(PGCRs);
  }

  async componentDidMount() {
    let modes = ['46', '4'];
    let ignition = await modes.map(m => { return this.cacheMachine(m); });
    
    let lit = await Promise.all(ignition);
    console.log('done', lit);
  }

  render() {
    const { t } = this.props;

    return (
      <div className={cx('view')} id='legend'>
        <div className='section characters'>
          <Characters />
        </div>
        <div className='section strikes'>
          <NightfallHighScores />
        </div>
        <div className='section raids'>
          <RaidReport />
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
)(Legend);
