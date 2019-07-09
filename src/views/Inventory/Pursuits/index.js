import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import manifest from '../../../utils/manifest';
import Items from '../../../components/Items';
import QuestLine from '../../../components/QuestLine';

import InventoryViewsLinks from '../InventoryViewsLinks';

import './styles.css';

class Pursuits extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.rebindTooltips();
  }

  render() {
    const { t, member } = this.props;

    const inventory = member.data.profile.profileInventory.data.items.slice().concat(member.data.profile.characterInventories.data[member.characterId].items);

    const pursuits = inventory.filter(i => i.bucketHash === 1345459588);
    
    return (
      <div className='view pursuits' id='inventory'>
        <InventoryViewsLinks />
        <div className='module'>
          <div className='sub-header'>
            <div>Pursuits</div>
          </div>
          <ul className='list inventory-items'>
            <Items items={pursuits} order='rarity' />
          </ul>
        </div>
        <div className='module'>
          <QuestLine item={{
            itemHash: '2713477421',
            itemInstanceId: null
          }} />
        </div>
      </div>
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
  withNamespaces()
)(Pursuits);
