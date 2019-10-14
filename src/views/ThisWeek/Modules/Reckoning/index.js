import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import manifest from '../../../../utils/manifest';
import Records from '../../../../components/Records';

import './styles.css';

class Reckoning extends React.Component {
  render() {
    const { t, cycleInfo } = this.props;

    const rotation = {
      1: {
        boss: t('Likeness of Oryx'),
        triumphs: [2653311362],
        collectibles: []
      },
      2: {
        boss: t('The Swords'),
        triumphs: [2653311362],
        collectibles: []
      }
    };

    return (
      <React.Fragment key='escalation-protocol'>
        <div className='module-header'>
          <div className='sub-name'>{manifest.DestinyPlaceDefinition[4148998934].displayProperties.name}</div>
          <div className='name'>{rotation[cycleInfo.week.reckoning].boss}</div>
        </div>
        <h4>{t('Triumphs')}</h4>
        <ul className='list record-items'>
          <Records selfLinkFrom='/this-week' hashes={rotation[cycleInfo.week.reckoning].triumphs} ordered />
        </ul>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(Reckoning);
