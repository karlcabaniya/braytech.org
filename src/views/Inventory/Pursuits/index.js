import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { orderBy } from 'lodash';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../../components/ObservedImage';
import { ProfileLink } from '../../../components/ProfileLink';
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

  componentDidUpdate(prevProps) {
    if (prevProps.hash !== this.props.hash) {
      window.scrollTo(0, 0);
      this.props.rebindTooltips();
    }
  }

  render() {
    const { t, member, viewport, hash, order } = this.props;
    const itemComponents = member.data.profile.itemComponents;
    const characterUninstancedItemComponents = member.data.profile.characterUninstancedItemComponents[member.characterId].objectives.data;

    const inventory = member.data.profile.profileInventory.data.items.slice().concat(member.data.profile.characterInventories.data[member.characterId].items);
    const pursuits = inventory.filter(i => i.bucketHash === 1345459588);

    const nowMs = new Date().getTime();

    let items = [];

    pursuits.forEach((item, i) => {
      const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];
      const definitionBucket = item.bucketHash ? manifest.DestinyInventoryBucketDefinition[item.bucketHash] : false;

      if (!definitionItem) {
        console.log(`Items: Couldn't find item definition for ${item.itemHash}`);
        return;
      }

      const expiryMs = item.expirationDate && new Date(item.expirationDate).getTime();

      const progressData = item.itemInstanceId && itemComponents.objectives.data[item.itemInstanceId] ? itemComponents.objectives.data[item.itemInstanceId].objectives : characterUninstancedItemComponents && characterUninstancedItemComponents[item.itemHash] ? characterUninstancedItemComponents[item.itemHash].objectives : false;

      const bucketName = definitionBucket && definitionBucket.displayProperties && definitionBucket.displayProperties.name && definitionBucket.displayProperties.name.replace(' ', '-').toLowerCase();

      const vendorSource = definitionItem.sourceData && definitionItem.sourceData.vendorSources && definitionItem.sourceData.vendorSources.length && definitionItem.sourceData.vendorSources[0] && definitionItem.sourceData.vendorSources[0].vendorHash ? definitionItem.sourceData.vendorSources[0].vendorHash : false;

      items.push({
        ...item,
        name: definitionItem.displayProperties && definitionItem.displayProperties.name,
        rarity: definitionItem.inventory && definitionItem.inventory.tierType,
        itemType: definitionItem.itemType,
        vendorSource,
        expiryMs: expiryMs || false,
        el: (
          <li
            key={i}
            className={cx(
              {
                linked: true,
                tooltip: definitionItem.itemType === 12 && viewport.width <= 600 ? false : true,
                exotic: definitionItem.inventory && definitionItem.inventory.tierType === 6
              },
              bucketName
            )}
            data-hash={item.itemHash}
            data-instanceid={item.itemInstanceId}
            data-quantity={item.quantity && item.quantity > 1 ? item.quantity : null}
          >
            <div className='icon'>
              <ObservedImage className='image' src={definitionItem.displayProperties.localIcon ? `${definitionItem.displayProperties.icon}` : `https://www.bungie.net${definitionItem.displayProperties.icon}`} />
            </div>
            {item.quantity && item.quantity > 1 ? <div className={cx('quantity', { 'max-stack': definitionItem.inventory && definitionItem.inventory.maxStackSize === item.quantity })}>{item.quantity}</div> : null}
            {progressData && progressData.filter(o => !o.complete).length === 0 ? <div className='completed' /> : null}
            {progressData && progressData.filter(o => !o.complete).length > 0 && nowMs + 7200 * 1000 > expiryMs ? <div className='expires-soon' /> : null}
            {definitionItem.itemType === 12 ? <ProfileLink to={`/inventory/pursuits/${item.itemHash}`} /> : null}
          </li>
        )
      });
    });

    const exceptionsVendor = [3347378076, 248695599];
    const exceptionsItems = [1160544509, 1160544508, 1160544511];

    let quests = items.filter(i => i.itemType === 12);
    let bounties = items.filter(i => {
      if (i.itemType === 26) {
        return true;
      } else if (i.itemType === 0 && exceptionsVendor.includes(i.vendorSource) && !exceptionsItems.includes(i.itemHash)) {
        return true;
      } else {
        return false;
      }
    });
    let miscellaneous = items.filter(i => {
      if ((i.itemType !== 12 && i.itemType !== 26 && (i.itemType === 0 && !exceptionsVendor.includes(i.vendorSource))) || (i.itemType === 0 && exceptionsVendor.includes(i.vendorSource) && exceptionsItems.includes(i.itemHash))) {
        return true;
      } else {
        return false;
      }
    });

    quests = order ? orderBy(quests, [i => i[order], i => i.name], ['desc', 'asc']) : items;
    bounties = order ? orderBy(bounties, [i => i.vendorSource, i => i.expiryMs, i => i[order], i => i.name], ['desc', 'asc', 'desc', 'asc']) : items;
    miscellaneous = order ? orderBy(miscellaneous, [i => i[order], i => i.name], ['desc', 'asc']) : items;

    let selected = hash ? pursuits.find(p => p.itemHash.toString() === hash) ? pursuits.find(p => p.itemHash.toString() === hash) : quests[0] : quests.length && quests[0] && quests[0].itemHash ? quests[0] : false;

    if (viewport.width < 1024 && hash) {
      return (
        <>
          <div className='view quest' id='inventory'>
            <div className='module'>
              <QuestLine item={selected} />
            </div>
          </div>
          <div className='sticky-nav'>
            <div />
            <ul>
              <li>
                <ProfileLink className='button' to='/inventory'>
                  <i className='destiny-B_Button' />
                  {t('Back')}
                </ProfileLink>
              </li>
            </ul>
          </div>
        </>
      );
    } else {
      return (
        <div className='view pursuits' id='inventory'>
          <InventoryViewsLinks />
          <div className='module'>
            <div className='sub-header'>
              <div>{t('Quests')}</div>
            </div>
            <ul className='list inventory-items'>{quests.map(i => i.el)}</ul>
            <div className='sub-header'>
              <div>{t('Bounties')}</div>
            </div>
            <ul className='list inventory-items'>{bounties.map(i => i.el)}</ul>
            <div className='sub-header'>
              <div>{t('Miscellaneous')}</div>
            </div>
            <ul className='list inventory-items'>{miscellaneous.map(i => i.el)}</ul>
          </div>
          <div className='module'>{selected && viewport.width >= 1024 ? <QuestLine item={selected} /> : null}</div>
        </div>
      );
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    viewport: state.viewport
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
