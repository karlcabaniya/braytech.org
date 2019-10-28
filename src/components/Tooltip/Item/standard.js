import React from 'react';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import { damageTypeToString, ammoTypeToString } from '../../../utils/destinyUtils';
import ObservedImage from '../../ObservedImage';

const standard = (item, member) => {
  const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

  // source string
  let sourceString = definitionItem.collectibleHash ? (manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash] ? manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash].sourceString : false) : false;

  // weapon damage type
  let damageTypeHash = definitionItem.itemType === enums.DestinyItemType.Weapon && definitionItem.damageTypeHashes[0];
  damageTypeHash = item.itemComponents && item.itemComponents.instance ? item.itemComponents.instance.damageTypeHash : damageTypeHash;

  return (
    <>
      {item.primaryStat ? (
        definitionItem.itemType === enums.DestinyItemType.Weapon ? (
          <>
            <div className='damage weapon'>
              <div className={cx('power', damageTypeToString(damageTypeHash).toLowerCase())}>
                <div className={cx('icon', damageTypeToString(damageTypeHash).toLowerCase())} />
                <div className='text'>{item.primaryStat.value}</div>
              </div>
              <div className='slot'>
                <div className={cx('icon', ammoTypeToString(definitionItem.equippingBlock.ammoType).toLowerCase())} />
                <div className='text'>{ammoTypeToString(definitionItem.equippingBlock.ammoType)}</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='damage armour'>
              <div className='power'>
                <div className='text'>{item.primaryStat.value}</div>
                <div className='text'>{item.primaryStat.displayProperties.name}</div>
              </div>
            </div>
          </>
        )
      ) : null}
      {/* {sourceString && !item.itemComponents ? (
        <div className='source'>
          <p>{sourceString}</p>
        </div>
      ) : null} */}
      {item.stats && item.stats.length ? (
        <div className='stats'>
          {item.stats.map(s => {
            // map through stats

            const masterwork = (item.masterworkInfo && item.masterworkInfo.statHash === s.statHash && item.masterworkInfo.statValue) || 0;
            const base = s.value - masterwork;

            return (
              <div key={s.statHash} className='stat'>
                <div className='name'>{s.displayProperties.name}</div>
                <div className={cx('value', { bar: s.bar })}>
                  {s.bar ? (
                    <>
                      <div className='bar' data-value={base} style={{ width: `${base}%` }} />
                      <div className='bar masterwork' data-value={masterwork} style={{ width: `${masterwork}%` }} />
                      <div className='int'>{s.value}</div>
                    </>
                  ) : (
                    s.value
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      {item.sockets && item.sockets.socketCategories && item.sockets.sockets.filter(s => (s.isPerk || s.isIntrinsic) && !s.isTracker).length ? (
        <div className={cx('sockets', { 'intrinsic-only': item.sockets.sockets.filter(s => (s.isPerk || s.isIntrinsic) && !s.isTracker).length === 1 })}>
          {item.sockets.socketCategories
            .map((c, i) => {
              // map through socketCategories

              if (c.sockets.length) {
                const plugs = c.sockets.filter(s => (s.isPerk || s.isIntrinsic) && !s.isTracker);

                if (plugs.length) {
                  return (
                    <div key={c.category.hash} className='category'>
                      {plugs
                        .map(s => {
                          // filter for perks and map through sockets

                          return (
                            <div key={s.socketIndex} className='socket'>
                              {s.plugOptions
                                .filter(p => p.isEnabled)
                                .map(p => {
                                  // filter for enabled plugs and map through

                                  return (
                                    <div key={p.plugItem.hash} className={cx('plug', { intrinsic: s.isIntrinsic, enabled: true })}>
                                      <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${p.plugItem.displayProperties.icon ? p.plugItem.displayProperties.icon : `/img/misc/missing_icon_d2.png`}`} />
                                      <div className='text'>
                                        <div className='name'>{p.plugItem.displayProperties.name}</div>
                                        <div className='description'>{s.isIntrinsic ? p.plugItem.displayProperties.description : p.plugItem.itemTypeDisplayName}</div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          );
                        })}
                    </div>
                  );
                } else {
                  return false;
                }
              } else {
                return false;
              }
            })
            .filter(c => c)}
        </div>
      ) : null}
    </>
  );
};

export default standard;
