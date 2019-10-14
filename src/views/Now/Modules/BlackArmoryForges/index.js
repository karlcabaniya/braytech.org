import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import manifest from '../../../../utils/manifest';

import './styles.css';

class BlackArmoryForges extends React.Component {
  render() {
    const { t, member } = this.props;
    const characterActivities = member.data.profile.characterActivities.data;

    const dailyBlackArmoryForges = {
      activities: characterActivities[member.characterId].availableActivities.filter(a => {
        const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

        if (definitionActivity && definitionActivity.activityTypeHash === 838603889) {
          return true;
        } else {
          return false;
        }
      }),
      displayProperties: {
        name: t('Black Armory Forges')
      },
      headings: {
        current: t('Current forge')
      }
    };

    return (
      <>
        <div className='module-header'>
          <div className='sub-name'>{dailyBlackArmoryForges.displayProperties.name}</div>
        </div>
        {dailyBlackArmoryForges.activities.length ? (
          <ul className='list activities'>
            {dailyBlackArmoryForges.activities.map((a, i) => {
              const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

              return (
                <li key={i} className='linked tooltip' data-table='DestinyActivityDefinition' data-hash={definitionActivity.activityTypeHash} data-playlist={a.activityHash}>
                  <div className='name'>{definitionActivity.displayProperties && definitionActivity.displayProperties.name ? definitionActivity.displayProperties.name : t('Unknown')}</div>
                </li>
              );
            })}
          </ul>
        ) : null}
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
)(BlackArmoryForges);
