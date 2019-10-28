import React from 'react';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import ObservedImage from '../../ObservedImage';
import ProgressBar from '../../UI/ProgressBar';

const Default = (props) => {
  const { itemHash, instanceId, itemComponents, quantity, state, rarity, type, primaryStat, stats, sockets, masterwork, masterworkInfo } = props;

  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  const description = definitionItem.displayProperties && definitionItem.displayProperties.description !== '' && definitionItem.displayProperties.description;

  return (
    <>
      {description ? (
        <div className='description'>
          <pre>{description}</pre>
        </div>
      ) : null}
    </>
  );
};

export default Default;
