import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import Items from '../../../components/Items';

import InventoryViewsLinks from '../InventoryViewsLinks';

import './styles.css';

class Consumables extends React.Component {
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

    const consumables = inventory.filter(i => i.bucketHash === 1469714392);
    const modifications = inventory.filter(i => i.bucketHash === 3313201758);
    const shaders = inventory.filter(i => i.bucketHash === 2973005342);

    return (
      <div className='view consumables' id='inventory'>
        <InventoryViewsLinks />
        <div className='module'>
          <div className='sub-header'>
            <div>{t('Consumables')}</div>
            <div>{consumables.length}/50</div>
          </div>
          <ul className='list inventory-items'>
            <Items items={consumables} order='rarity' />
          </ul>
        </div>
        <div className='module'>
          <div className='sub-header'>
            <div>{t('Modifications')}</div>
            <div>{modifications.length}/50</div>
          </div>
          <ul className='list inventory-items'>
            <Items items={modifications} order='rarity' />
          </ul>
        </div>
        <div className='module'>
          <div className='sub-header'>
            <div>{t('Shaders')}</div>
            <div>{shaders.length}/50</div>
          </div>
          <ul className='list inventory-items'>
            <Items items={shaders} order='rarity' />
          </ul>
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
)(Consumables);
