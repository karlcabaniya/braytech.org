import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import manifest from '../../../../utils/manifest';
import ObservedImage from '../../../../components/ObservedImage';

import './styles.css';

class SeasonalArtifact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.rebindTooltips();
  }

  render() {
    const { t, member } = this.props;
    const characterEquipment = member.data.profile.characterEquipment.data[member.characterId].items;
    const itemComponents = member.data.profile.itemComponents;

    const equippedArtifact = characterEquipment.find(e => e.bucketHash === 1506418338);

    const equippedArtifactComponents = equippedArtifact && equippedArtifact.itemInstanceId && {
      instance: itemComponents.instances.data[equippedArtifact.itemInstanceId] && itemComponents.instances.data[equippedArtifact.itemInstanceId],
      sockets: itemComponents.sockets.data[equippedArtifact.itemInstanceId] && itemComponents.sockets.data[equippedArtifact.itemInstanceId].sockets,
      perks: itemComponents.perks.data[equippedArtifact.itemInstanceId] && itemComponents.perks.data[equippedArtifact.itemInstanceId].perks,
      stats: itemComponents.stats.data[equippedArtifact.itemInstanceId] && itemComponents.stats.data[equippedArtifact.itemInstanceId].stats,
      objectives: itemComponents.objectives.data[equippedArtifact.itemInstanceId] && itemComponents.objectives.data[equippedArtifact.itemInstanceId].objectives
    }

    console.log(equippedArtifact, equippedArtifactComponents)
    

    return (
      <>
        <ObservedImage className='image artifact' src='/static/images/extracts/flair/VEye.png' />
        <div className='module-header'>
          <div className='sub-name'>{manifest.DestinyInventoryBucketDefinition[1506418338].displayProperties.name}</div>
        </div>
        
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
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
)(SeasonalArtifact);
