import React from 'react';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import ObservedImage from '../../ObservedImage';

const Emblem = (props) => {
  const { itemHash, instanceId, itemComponents, quantity, state, rarity, type, primaryStat, stats, sockets, masterwork, masterworkInfo } = props;

  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  // source string
  let sourceString = definitionItem.collectibleHash ? (manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash] ? manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash].sourceString : false) : false;

  

  return (
    <>
      <div className='emblem'>
        <ObservedImage className='image' src={`https://www.bungie.net${definitionItem.secondaryIcon}`} />
      </div>
    </>
  );
};

export default Emblem;
