import React from 'react';

import manifest from '../../../utils/manifest';
import ProgressBar from '../../UI/ProgressBar';

const quest = item => {
  let description = item.displaySource !== '' ? item.displaySource : false;

  let objective = item.displayProperties.description;

  let objectives = [];
console.log(item)
  item.objectives.objectiveHashes.forEach(element => {
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
      <div className='objective'>{objective}</div>
      {objectives ? <div className='objectives'>{objectives}</div> : null}
      {description ? (
        <div className='description'>
          <pre>{description}</pre>
        </div>
      ) : null}
    </>
  );
};

export default quest;
