import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { orderBy } from 'lodash';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../../components/ObservedImage';
import { ProfileLink } from '../../../components/ProfileLink';
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
    const { t, member, hash, order } = this.props;

    const inventory = member.data.profile.profileInventory.data.items.slice().concat(member.data.profile.characterInventories.data[member.characterId].items);
    const pursuits = inventory.filter(i => i.bucketHash === 1345459588);

    const selected = hash ? pursuits.find(p => p.itemHash.toString() === hash) : false;

    let items = [];

    pursuits.forEach((item, i) => {
      let definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];
      let definitionBucket = item.bucketHash ? manifest.DestinyInventoryBucketDefinition[item.bucketHash] : false;

      if (!definitionItem) {
        console.log(`Items: Couldn't find item definition for ${item.itemHash}`);
        return;
      }

      let bucketName = definitionBucket && definitionBucket.displayProperties && definitionBucket.displayProperties.name && definitionBucket.displayProperties.name.replace(' ','-').toLowerCase();

      items.push({
        name: definitionItem.displayProperties && definitionItem.displayProperties.name,
        rarity: definitionItem.inventory && definitionItem.inventory.tierType,
        itemType: definitionItem.itemType,
        el: (
          <li
            key={i}
            className={cx(
              {
                linked: true,
                tooltip: true,
                exotic: definitionItem.inventory && definitionItem.inventory.tierType === 6
              },
              bucketName,
            )}
            data-hash={item.itemHash}
            data-instanceid={item.itemInstanceId}
          >
            <div className='icon'>
              <ObservedImage className='image' src={definitionItem.displayProperties.localIcon ? `${definitionItem.displayProperties.icon}` : `https://www.bungie.net${definitionItem.displayProperties.icon}`} />
            </div>
            {item.quantity && item.quantity > 1 ? <div className='quantity'>{item.quantity}</div> : null}
            <ProfileLink to={`/inventory/pursuits/${item.itemHash}`} />
          </li>
        )
      });
    });

    let quests = items.filter(i => i.itemType === 12);
    let bounties = items.filter(i => i.itemType === 26);
    let miscellaneous = items.filter(i => i.itemType !== 12 && i.itemType !== 26);
    
    quests = order ? orderBy(quests, [i => i[order], i => i.name], ['desc', 'asc']) : items;
    bounties = order ? orderBy(bounties, [i => i[order], i => i.name], ['desc', 'asc']) : items;
    miscellaneous = order ? orderBy(miscellaneous, [i => i[order], i => i.name], ['desc', 'asc']) : items;
    
    return (
      <div className='view pursuits' id='inventory'>
        <InventoryViewsLinks />
        <div className='module'>
          <div className='sub-header'>
            <div>Quests</div>
          </div>
          <ul className='list inventory-items'>
            {quests.map(i => i.el)}
          </ul>
          <div className='sub-header'>
            <div>Bounties</div>
          </div>
          <ul className='list inventory-items'>
            {bounties.map(i => i.el)}
          </ul>
          <div className='sub-header'>
            <div>Miscellaneous</div>
          </div>
          <ul className='list inventory-items'>
            {miscellaneous.map(i => i.el)}
          </ul>
        </div>
        <div className='module'>
          {selected ? <QuestLine item={selected} /> : null}
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
