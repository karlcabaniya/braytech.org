import React from 'react';

import ObservedImage from '../../ObservedImage';
import * as utils from '../../../utils/destinyUtils';

const subclass = (item, member) => {

  const subClassInfo = utils.getSubclassPathInfo(member.data.profile, member.characterId);

  return (
    <>
      <ObservedImage className='image' src={`/static/images/extracts/subclass-art/${subClassInfo.art}.png`} />
      <div className='text'>
        <div className='name'>{subClassInfo.name}</div>
        <div className='description'>{item.displayProperties.description}</div>
      </div>
    </>
  );
};

export default subclass;
