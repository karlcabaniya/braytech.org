import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import manifest from '../../../utils/manifest';
import Items from '../../../components/Items';

import InventoryViewsLinks from '../InventoryViewsLinks';

import './styles.css';

class Vault extends React.Component {
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

    const vault = inventory.filter(i => i.bucketHash === 138197802);

    const weapons = vault.filter(i => {
      const definitionItem = manifest.DestinyInventoryItemDefinition[i.itemHash];

      if (definitionItem.itemType === 3) {
        return true;
      } else {
        return false;
      }
    });

    const armour = vault.filter(i => {
      const definitionItem = manifest.DestinyInventoryItemDefinition[i.itemHash];

      if (definitionItem.itemType === 2) {
        return true;
      } else {
        return false;
      }
    });

    const misc = vault.filter(i => {
      const definitionItem = manifest.DestinyInventoryItemDefinition[i.itemHash];

      if (definitionItem.itemType !== 2 && definitionItem.itemType !== 3) {
        return true;
      } else {
        return false;
      }
    });

    

    return (
      <div className='view vault' id='inventory'>
        <InventoryViewsLinks />
        <div className='module'>
          <div className='sub-header'>
            <div>{t('Vault: weapons')}</div>
            <div>{vault.length}/500</div>
          </div>
          <ul className='list inventory-items'>
            <Items items={weapons} order='tierType' />
          </ul>
        </div>
        <div className='module'>
          <div className='sub-header'>
            <div>{t('Vault: armour')}</div>
            <div>{vault.length}/500</div>
          </div>
          <ul className='list inventory-items'>
            <Items items={armour} order='tierType' />
          </ul>
        </div>
        <div className='module'>
          <div className='sub-header'>
            <div>{t('Vault: miscellaneous')}</div>
            <div>{vault.length}/500</div>
          </div>
          <ul className='list inventory-items'>
            <Items items={misc} order='tierType' />
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
)(Vault);
