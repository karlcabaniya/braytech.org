import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import { sockets } from '../../../utils/destinyItems/sockets';
import { stats } from '../../../utils/destinyItems/stats';
import * as enums from '../../../utils/destinyEnums';
import ObservedImage from '../../ObservedImage';

import standard from './standard';

class Item extends React.Component {
  render() {
    const { t, member, tooltips } = this.props;

    const item = {
      itemHash: this.props.hash,
      instanceid: this.props.instanceid,
      quantity: this.props.quantity,
      state: this.props.state && (parseInt(this.props.state, 10) || 0)
    };

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

    item.sockets = sockets(item);
    item.stats = stats(item);
  
    console.log(item.sockets, item.stats);

    if (item.itemComponents && item.itemComponents.instance) {
      item.powerLevel = item.itemComponents.instance.primaryStat.value;
    } else if (member && member.data) {
      let character = member.data.profile.characters.data.find(c => c.characterId === member.characterId);
      item.powerLevel = Math.floor((733 / 750) * character.light);
    } else {
      item.powerLevel = '750';
    }

    const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

    let itemRarity = 'common';
    let itemRarityHide = false;
    let kind;
    let meat = standard(item, member);
    let masterwork = false;

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
        <div className={cx('frame', kind, itemRarity, { 'masterworked': masterwork })}>
          <div className='header'>
            {masterwork ? <ObservedImage className={cx('image', 'bg')} src={itemRarity === 'exotic' ? `/static/images/extracts/flair/01A3-00001DDC.PNG` : `/static/images/extracts/flair/01A3-00001DDE.PNG`} /> : null}
            <div className='name'>{name}</div>
            <div>
              {definitionItem.itemTypeDisplayName && definitionItem.itemTypeDisplayName !== '' ? <div className='kind'>{definitionItem.itemTypeDisplayName}</div> : null}
              {!itemRarityHide && definitionItem.inventory ? <div className='rarity'>{definitionItem.inventory.tierTypeName}</div> : null}
            </div>
          </div>
          {note ? <div className='note'>{note}</div> : null}
          <div className='black'>
            {this.props.viewport.width <= 600 && item.screenshot ? (
              <div className='screenshot'>
                <ObservedImage className='image' src={`https://www.bungie.net${item.screenshot}`} />
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
