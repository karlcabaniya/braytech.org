import React from 'react';

import manifest from '../../../utils/manifest';
import ProgressBar from '../../UI/ProgressBar';

const fallback = item => {
  let sourceString = item.collectibleHash ? (manifest.DestinyCollectibleDefinition[item.collectibleHash] ? manifest.DestinyCollectibleDefinition[item.collectibleHash].sourceString : false) : false;

  let description = item.displayProperties.description !== '' ? item.displayProperties.description : false;

  let quanityMax = item.inventory && item.inventory.maxStackSize === parseInt(item.quantity, 10);

  let objectives = [];

  item.objectives && item.objectives.objectiveHashes.forEach(element => {
    let objectiveDefinition = manifest.DestinyObjectiveDefinition[element];

    let playerProgress = {
      complete: false,
      progress: 0,
      objectiveHash: objectiveDefinition.hash
    };

    let instanceProgress = item.itemComponents && item.itemComponents.objectives && item.itemComponents.objectives.find(o => o.objectiveHash === element);

    playerProgress = { ...playerProgress, ...instanceProgress };

    objectives.push(<ProgressBar key={objectiveDefinition.hash} objectiveDefinition={objectiveDefinition} playerProgress={playerProgress} />);
  });

  return (
    <>
      {description ? (
        <div className='description'>
          <pre>{description}</pre>
        </div>
      ) : null}
      {objectives.length ? <div className='objectives'>{objectives}</div> : null}
      {quanityMax && quanityMax > 1 ? (
        <div className='quantity'>Quantity: <span>{item.inventory.maxStackSize}</span> (MAX)</div>
      ) : null}
      {sourceString ? (
        <div className='source'>
          <p>{sourceString}</p>
        </div>
      ) : null}
    </>
  );
};

export default fallback;
