import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';
import { enumerateItemState } from '../../../utils/destinyEnums';
import fallback from './fallback';
import weapon from './weapon';
import armour from './armour';
import emblem from './emblem';
import bounty from './bounty';
import mod from './mod';
import ghost from './ghost';
import sparrow from './sparrow';
import subclass from './subclass';
import ui from './ui';
import sandboxPerk from './sandboxPerk';

class ItemTypes extends React.Component {
  render() {
    let { member, hash, instanceId, state, rollNote, table, tooltipType, tooltips } = this.props;

    if (!table) {
      table = 'DestinyInventoryItemDefinition';
    }

    let item;
    if (hash === '343') {
      item = {
        redacted: true
      };
    } else {
      item = manifest[table][hash];
    }

    if (instanceId && member.data && member.data.profile.itemComponents.instances.data[instanceId]) {
      let itemComponents = member.data.profile.itemComponents.instances.data[instanceId];

      item.itemComponents = {
        state: state ? parseInt(state, 10) : false,
        instance: itemComponents.instances.data[instanceId] ? itemComponents.instances.data[instanceId] : false,
        sockets: itemComponents.sockets.data[instanceId] ? itemComponents.sockets.data[instanceId].sockets : false,
        perks: itemComponents.perks.data[instanceId] ? itemComponents.perks.data[instanceId].perks : false,
        stats: itemComponents.stats.data[instanceId] ? itemComponents.stats.data[instanceId].stats : false
      };

    } else if (instanceId && tooltips.itemComponents[instanceId]) {
      item.itemComponents = tooltips.itemComponents[instanceId];
    } else {
      item.itemComponents = false;
    }

    let kind, tier, black, masterwork;

    if (item.itemType) {
      if (item.itemType === 1) {
        kind = 'ui';
        black = ui(item);
      } else if (item.itemType === 3) {
        kind = 'weapon';
        let type = weapon(item, member, tooltips.settings.detailedMode);
        black = type.el;
        masterwork = type.masterwork;
      } else if (item.itemType === 2) {
        kind = 'armour';
        let type = armour(item, member, tooltips.settings.detailedMode);
        black = type.el;
        masterwork = type.masterwork;
      } else if (item.itemType === 14) {
        kind = 'emblem';
        black = emblem(item);
      } else if (item.itemType === 16) {
        kind = 'ui subclass';
        black = subclass(item, member);
      } else if (item.itemType === 19) {
        kind = 'mod';
        black = mod(item);
      } else if (item.itemType === 20) {
        kind = 'material';
        black = ui(item);
      } else if (item.itemType === 21) {
        kind = 'ship';
        black = sparrow(item, tooltips.settings.detailedMode);
      } else if (item.itemType === 22) {
        kind = 'sparrow';
        black = sparrow(item, tooltips.settings.detailedMode);
      } else if (item.itemType === 24) {
        kind = 'ghost';
        black = ghost(item, tooltips.settings.detailedMode);
      } else if (item.itemType === 26) {
        kind = 'bounty';
        black = bounty(item);
      } else {
        kind = 'ui';
        tier = 'basic';
        black = fallback(item);
      }
    }

    if (table === 'DestinySandboxPerkDefinition') {
      kind = 'ui name-only sandbox-perk';
      black = sandboxPerk(item);
    }

    if (tooltipType) {
      kind = tooltipType;
    }

    if (item.inventory) {
      switch (item.inventory.tierType) {
        case 6:
          tier = 'exotic';
          break;
        case 5:
          tier = 'legendary';
          break;
        case 4:
          tier = 'rare';
          break;
        case 3:
          tier = 'uncommon';
          break;
        case 2:
          tier = 'common';
          break;
        default:
          tier = 'common';
      }
    }

    if (item.redacted) {
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
    } else {
      state = enumerateItemState(parseInt(state, 10));
      return (
        <>
          <div className='acrylic' />
          <div className={cx('frame', kind, tier, { 'is-masterworked': masterwork })}>
            <div className='header'>
              {masterwork ? <ObservedImage className={cx('image', 'bg')} src={tier === 'exotic' ? `/static/images/extracts/flair/01A3-00001DDC.PNG` : `/static/images/extracts/flair/01A3-00001DDE.PNG`} /> : null}
              <div className='name'>{item.displayProperties.name}</div>
              <div>
                <div className='kind'>{item.itemTypeDisplayName}</div>
                {kind !== 'ui' && kind !== 'ui subclass' && item.inventory ? <div className='rarity'>{item.inventory.tierTypeName}</div> : null}
              </div>
            </div>
            {!item.itemComponents && rollNote ? <div className='note'>Non-instanced item (displaying collections roll)</div> : null}
            <div className='black'>
              {this.props.viewport.width <= 600 && item.screenshot ? <ObservedImage className='image screenshot' src={`https://www.bungie.net${item.screenshot}`} /> : null}
              {black}
            </div>
          </div>
        </>
      );
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    viewport: state.viewport,
    tooltips: state.tooltips
  };
}

export default connect(mapStateToProps)(ItemTypes);
