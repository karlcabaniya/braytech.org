import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import manifest from '../../../../utils/manifest';

import './styles.css';

class DailyVanguardModifiers extends React.Component {
  render() {
    const { t, member } = this.props;
    const milestones = member.data.milestones;
    const characterActivities = member.data.profile.characterActivities.data;
    
    // console.log(Object.values(milestones).map(m => ({ name: manifest.DestinyMilestoneDefinition[m.milestoneHash].displayProperties.name, ...m })).filter(m => m.activities))

    console.log(characterActivities[member.characterId].availableActivities.map(m => ({ name: manifest.DestinyActivityDefinition[m.activityHash].displayProperties.name, ...m })))

    return (
      <>
        
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(
    mapStateToProps
  ),
  withTranslation()
)(DailyVanguardModifiers);
