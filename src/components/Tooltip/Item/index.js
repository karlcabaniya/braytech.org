import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import { sockets } from '../../../utils/destinyItems/sockets';
import { stats } from '../../../utils/destinyItems/stats';
import { masterwork } from '../../../utils/destinyItems/masterwork';
import * as enums from '../../../utils/destinyEnums';
import ObservedImage from '../../ObservedImage';

import standard from './standard';

class Item extends React.Component {
  render() {
    const { t, member, tooltips } = this.props;

    const item = {
      itemHash: this.props.hash,
      instanceId: this.props.instanceid || false,
      quantity: this.props.quantity || 1,
      state: (this.props.state && parseInt(this.props.state, 10)) || 0
    };

    const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

    if (!definitionItem) {
      return null;
    }

    if (item.instanceId && member.data && member.data.profile.itemComponents.instances.data[item.instanceId]) {
      let itemComponents = member.data.profile.itemComponents;

      item.itemComponents = {
        instance: itemComponents.instances.data[item.instanceId] ? itemComponents.instances.data[item.instanceId] : false,
        sockets: itemComponents.sockets.data[item.instanceId] ? itemComponents.sockets.data[item.instanceId].sockets : false,
        perks: itemComponents.perks.data[item.instanceId] ? itemComponents.perks.data[item.instanceId].perks : false,
        stats: itemComponents.stats.data[item.instanceId] ? itemComponents.stats.data[item.instanceId].stats : false,
        objectives: itemComponents.objectives.data[item.instanceId] ? itemComponents.objectives.data[item.instanceId].objectives : false
      };
    } else if (item.instanceId && tooltips.itemComponents[item.instanceId]) {
      item.itemComponents = tooltips.itemComponents[item.instanceId];
    } else {
      item.itemComponents = false;
    }

    if (member.data.profile && member.data.profile.characterUninstancedItemComponents && member.data.profile.characterUninstancedItemComponents[member.characterId].objectives && member.data.profile.characterUninstancedItemComponents[member.characterId].objectives.data[item.itemHash]) {
      if (item.itemComponents) {
        item.itemComponents.objectives = member.data.profile.characterUninstancedItemComponents[member.characterId].objectives.data[item.itemHash].objectives;
      } else {
        item.itemComponents = {
          objectives: member.data.profile.characterUninstancedItemComponents[member.characterId].objectives.data[item.itemHash].objectives
        };
      }
    }

    if (item.instanceId && member.data.profile && member.data.profile.characterInventories && member.data.profile.characterInventories.data && member.data.profile.characterInventories.data[member.characterId] && member.data.profile.characterInventories.data[member.characterId].items.find(i => i.itemInstanceId === item.instanceId)) {
      if (item.itemComponents) {
        item.itemComponents.item = member.data.profile.characterInventories.data[member.characterId].items.find(i => i.itemInstanceId === item.instanceId);
      } else {
        item.itemComponents = {
          item: member.data.profile.characterInventories.data[member.characterId].items.find(i => i.itemInstanceId === item.instanceId)
        };
      }
    }

    item.masterwork = enums.enumerateItemState(item.state).masterwork;
    item.sockets = sockets(item);
    item.stats = stats(item);
    item.masterworkInfo = masterwork(item);

    item.primaryStat = definitionItem.stats && !definitionItem.stats.disablePrimaryStatDisplay && definitionItem.stats.primaryBaseStatHash && {
      hash: definitionItem.stats.primaryBaseStatHash,
      displayProperties: manifest.DestinyStatDefinition[definitionItem.stats.primaryBaseStatHash].displayProperties,
      value: 750
    };

    if (item.primaryStat && item.itemComponents && item.itemComponents.instance && item.itemComponents.instance.primaryStat) {
      item.primaryStat.value = item.itemComponents.instance.primaryStat.value;
    } else if (item.primaryStat && member && member.data) {
      let character = member.data.profile.characters.data.find(c => c.characterId === member.characterId);

      item.primaryStat.value = Math.floor((733 / 750) * character.light);
    }
  
    console.log(item);

    let itemRarity = 'common';
    let itemRarityHide = false;
    let kind;
    let meat = standard(item, member);

    if (definitionItem.inventory) {
      switch (definitionItem.inventory.tierType) {
        case 6:
          itemRarity = 'exotic';
          break;
        case 5:
          itemRarity = 'legendary';
          break;
        case 4:
          itemRarity = 'rare';
          break;
        case 3:
          itemRarity = 'uncommon';
          break;
        case 2:
          itemRarity = 'common';
          break;
        default:
          itemRarity = 'common';
      }
    }

    if (definitionItem.redacted) {
      return (
        <>
          <div className='acrylic' />
          <div className={cx('frame', 'common')}>
            <div className='header'>
              <div className='name'>Classified</div>
              <div>
                <div className='kind'>Insufficient clearance</div>
              </div>
            </div>
            <div className='black'>
              <div className='description'>
                <pre>Keep it clean.</pre>
              </div>
            </div>
          </div>
        </>
      );
    }

    let name = definitionItem.displayProperties && definitionItem.displayProperties.name;

    let note = false;

    if (!item.itemComponents && this.props.uninstanced) {
      note = t('Non-instanced item (displaying collections roll)');
    }

    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', kind, itemRarity, { 'masterworked': item.masterwork || (item.masterworkInfo && item.masterworkInfo.tier === 10) })}>
          <div className='header'>
            {item.masterwork || (item.masterworkInfo && item.masterworkInfo.tier === 10) ? <ObservedImage className={cx('image', 'bg')} src={itemRarity === 'exotic' ? `/static/images/extracts/flair/01A3-00001DDC.PNG` : `/static/images/extracts/flair/01A3-00001DDE.PNG`} /> : null}
            <div className='name'>{name}</div>
            <div>
              {definitionItem.itemTypeDisplayName && definitionItem.itemTypeDisplayName !== '' ? <div className='kind'>{definitionItem.itemTypeDisplayName}</div> : null}
              {!itemRarityHide && definitionItem.inventory ? <div className='rarity'>{definitionItem.inventory.tierTypeName}</div> : null}
            </div>
          </div>
          {note ? <div className='note'>{note}</div> : null}
          <div className='black'>
            {this.props.viewport.width <= 600 && definitionItem.screenshot ? (
              <div className='screenshot'>
                <ObservedImage className='image' src={`https://www.bungie.net${definitionItem.screenshot}`} />
              </div>
            ) : null}
            {meat}
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    viewport: state.viewport,
    tooltips: state.tooltips
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(Item);
