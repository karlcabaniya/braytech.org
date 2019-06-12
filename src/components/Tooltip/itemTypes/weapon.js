import React from 'react';
import cx from 'classnames';

import ObservedImage from '../../ObservedImage';
import { damageTypeToString, ammoTypeToString } from '../../../utils/destinyUtils';
import { getSockets } from '../../../utils/destinyItems';
import manifest from '../../../utils/manifest';

const weapon = (item, member, detailedMode) => {
  let { stats, sockets, masterwork } = getSockets(item, false, detailedMode ? true : false, detailedMode ? false : true, false, [], false, detailedMode ? true : false);

  let sourceString = item.collectibleHash ? (manifest.DestinyCollectibleDefinition[item.collectibleHash] ? manifest.DestinyCollectibleDefinition[item.collectibleHash].sourceString : false) : false;

  let intrinsic = sockets.find(socket => (socket.singleInitialItem ? socket.singleInitialItem.definition.itemCategoryHashes.includes(2237038328) : false));
  intrinsic = intrinsic ? manifest.DestinySandboxPerkDefinition[intrinsic.singleInitialItem.definition.perks[0].perkHash] : false;

  let powerLevel;
  if (item.itemComponents && item.itemComponents.instance) {
    powerLevel = item.itemComponents.instance.primaryStat.value;
  } else if (member && member.data) {
    let character = member.data.profile.characters.data.find(c => c.characterId === member.characterId);
    powerLevel = Math.floor((733 / 750) * character.light);
  } else {
    powerLevel = '700';
  }

  let damageTypeHash = item.damageTypeHashes[0];
  damageTypeHash = item.itemComponents && item.itemComponents.instance ? item.itemComponents.instance.damageTypeHash : damageTypeHash;

  return {
    el: (
      <>
        <div className='damage weapon'>
          <div className={cx('power', damageTypeToString(damageTypeHash).toLowerCase())}>
            <div className={cx('icon', damageTypeToString(damageTypeHash).toLowerCase())} />
            <div className='text'>{powerLevel}</div>
          </div>
          <div className='slot'>
            <div className={cx('icon', ammoTypeToString(item.equippingBlock.ammoType).toLowerCase())} />
            <div className='text'>{ammoTypeToString(item.equippingBlock.ammoType)}</div>
          </div>
        </div>
        {sourceString && !item.itemComponents ? (
          <div className='source'>
            <p>{sourceString}</p>
          </div>
        ) : null}
        <div className={cx('stats', { 'detailed-mode': detailedMode })}>{stats.map(stat => stat.element)}</div>
        <div className={cx('sockets', { 'has-sockets': sockets.length > 0, 'detailed-mode': detailedMode })}>
          {intrinsic ? (
            <div className='plug is-active intrinsic'>
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${intrinsic.displayProperties.icon}`} />
              <div className='text'>
                <div className='name'>{intrinsic.displayProperties.name}</div>
                <div className='description'>{intrinsic.displayProperties.description}</div>
              </div>
            </div>
          ) : null}
          {sockets.length > 0
            ? sockets.map((socket, i) => {
                let group = socket.plugs
                  .filter(plug => {
                    if (plug.definition.redacted) {
                      return false;
                    } else {
                      return true;
                    }
                  })
                  .filter(plug => {
                    if (!plug.definition.itemCategoryHashes || !plug.definition.plug) {
                      console.log(socket, plug);
                      return false;
                    } else {
                      return true;
                    }
                  })
                  .filter(plug => !plug.definition.itemCategoryHashes.includes(2237038328))
                  .filter(plug => plug.definition.plug.plugCategoryHash !== 2947756142);
  
                if (group.length > 0) {
                  return (
                    <div key={i} className='group'>
                      {group.length > 4 ? (
                        <>
                          {group.slice(0, 3).map(plug => plug.element)}
                          <div className='plug ellipsis'>+ {group.length - 3} more</div>
                        </>
                      ) : (
                        group.map(plug => plug.element)
                      )}
                    </div>
                  );
                } else {
                  return null;
                }
              })
            : null}
        </div>
      </>
    ),
    masterwork
  };
};

export default weapon;
