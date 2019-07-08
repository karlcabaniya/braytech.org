import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import manifest from '../../utils/manifest';
import * as ls from '../../utils/localStorage';
import * as bungie from '../../utils/bungie';
import Spinner from '../../components/UI/Spinner';
import Items from '../../components/Items';

import './styles.css';

class Inventory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { t, member } = this.props;
    const { loading, memberships } = this.state;

    console.log(member.data.profile)

    const inventory = member.data.profile.profileInventory.data.items.slice().concat(member.data.profile.characterInventories.data[member.characterId].items);

    const pursuits = inventory.filter(i => i.bucketHash === 1345459588);
    const consumables = inventory.filter(i => i.bucketHash === 1469714392);
    const modifications = inventory.filter(i => i.bucketHash === 3313201758);
    const shaders = inventory.filter(i => i.bucketHash === 2973005342);
    
    return (
      <div className='view' id='inventory'>
        <div className='module'>
          <div className='sub-header'>
            <div>Pursuits</div>
          </div>
          <ul className='list inventory-items'>
            <Items items={pursuits} />
          </ul>
        </div>
        <div className='module'>
          <div className='sub-header'>
            <div>Consumables</div>
          </div>
          <ul className='list inventory-items'>
            <Items items={consumables} />
          </ul>
        </div>
        <div className='module'>
          <div className='sub-header'>
            <div>Modifications</div>
          </div>
          <ul className='list inventory-items'>
            <Items items={modifications} />
          </ul>
        </div>
        <div className='module'>
          <div className='sub-header'>
            <div>Shaders</div>
          </div>
          <ul className='list inventory-items'>
            <Items items={shaders} />
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

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Inventory);
