import React from 'react';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
// import * as enums from '../../../utils/destinyEnums';
// import ObservedImage from '../../ObservedImage';

const Mod = props => {
  const { itemHash, instanceId, itemComponents, quantity, state, rarity, type, primaryStat, stats, sockets, masterwork, masterworkInfo } = props;

  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  const perks = definitionItem.perks.filter(p => manifest.DestinySandboxPerkDefinition[p.perkHash] && manifest.DestinySandboxPerkDefinition[p.perkHash].isDisplayable);

  return (
    <>
      {perks && perks.length ? (
        <div className={cx('sockets', { 'intrinsic-only': perks.length === 0 })}>
          {perks
            .map(p => {
              const definitionPerk = manifest.DestinySandboxPerkDefinition[p.perkHash];

              return (
                <div key={p.perkHash} className='socket'>
                  <div className={cx('plug', { 'is-intrinsic': true, enabled: true, 'no-icon': true })}>
                    {/* <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionPerk.displayProperties.icon ? definitionPerk.displayProperties.icon : `/img/misc/missing_icon_d2.png`}`} /> */}
                    <div className='text'>
                      {/* <div className='name'>{definitionPerk.displayProperties && definitionPerk.displayProperties.name}</div> */}
                      <div className='description'>{definitionPerk.displayProperties && definitionPerk.displayProperties.description}</div>
                    </div>
                  </div>
                </div>
              );
            })
            .filter(c => c)}
        </div>
      ) : null}
    </>
  );
};

export default Mod;
