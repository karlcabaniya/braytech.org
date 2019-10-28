import React from 'react';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import { damageTypeToString, ammoTypeToString } from '../../../utils/destinyUtils';
import ObservedImage from '../../ObservedImage';

const standard = (item, member) => {
  const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

  let sourceString = definitionItem.collectibleHash ? (manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash] ? manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash].sourceString : false) : false;

  let damageTypeHash = definitionItem.damageTypeHashes[0];
  damageTypeHash = item.itemComponents && item.itemComponents.instance ? item.itemComponents.instance.damageTypeHash : damageTypeHash;

  return (
    <>
      <div className='damage weapon'>
        <div className={cx('power', damageTypeToString(damageTypeHash).toLowerCase())}>
          <div className={cx('icon', damageTypeToString(damageTypeHash).toLowerCase())} />
          <div className='text'>{item.powerLevel}</div>
        </div>
        <div className='slot'>
          <div className={cx('icon', ammoTypeToString(definitionItem.equippingBlock.ammoType).toLowerCase())} />
          <div className='text'>{ammoTypeToString(definitionItem.equippingBlock.ammoType)}</div>
        </div>
      </div>
      {sourceString && !item.itemComponents ? (
        <div className='source'>
          <p>{sourceString}</p>
        </div>
      ) : null}
      <div className='stats'>
        {item.stats &&
          item.stats.map(s => {
            // map through stats

            return (
              <div key={s.statHash} className='stat'>
                <div className='name'>{s.displayProperties.name}</div>
                <div className={cx('value', { bar: s.bar })}>
                  {s.bar ? (
                    <>
                      <div className='bar' data-value={s.value} style={{ width: `${s.value}%` }} />
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
      <div className='sockets'>
        {item.sockets &&
          item.sockets.socketCategories
            .map((c, i) => {
              // map through socketCategories

              if (c.sockets.length > 0) {
                return (
                  <div key={c.category.hash} className='category'>
                    {c.sockets
                      .filter(s => s.isPerk)
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
                                      <div className='name'>{p.plugItem.displayProperties.name ? p.plugItem.displayProperties.name : `Unknown`}</div>
                                      <div className='description'>{p.plugItem.itemTypeDisplayName}</div>
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
                return null;
              }
            })
            .filter(c => c)}
      </div>
    </>
  );
};

export default standard;
