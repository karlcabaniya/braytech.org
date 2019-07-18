import React from 'react';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';

import './styles.css';

// Planet of Peace

class Emblem_4182480233 extends React.Component {
  render() {
    return (
      <div className='emblem-ani-4182480233'>
        <ObservedImage className='image secondaryOverlay s3' src={`/static/images/original/emblems/4182480233/3.png`} />
        <ObservedImage className='image secondaryOverlay s2' src={`/static/images/original/emblems/4182480233/2.png`} />
        <ObservedImage className='image secondaryOverlay s1' src={`/static/images/original/emblems/4182480233/1.png`} />
      </div>
    );
  }
}

// Spicey Ramen

class Emblem_1409726988 extends React.Component {
  render() {
    return (
      <div className='emblem-ani-1409726988'>
        <div className='bowl-1' />
        <div className='bowl-2' />
        <div className='bowl-3' />
        <div className='outline' />
      </div>
    );
  }
}

class EmblemSecondaryOverlay extends React.Component {
  render() {
    const { hash } = this.props;

    const custom = {
      4182480233: Emblem_4182480233,
      1409726988: Emblem_1409726988
    };

    if (custom[hash]) {
      const Element = custom[hash];

      return <Element />;
    } else {
      const definitionEmblem = manifest.DestinyInventoryItemDefinition[hash];

      return (
        <ObservedImage
          className={cx('image', 'secondaryOverlay', {
            missing: definitionEmblem.redacted
          })}
          src={`https://www.bungie.net${!definitionEmblem.redacted ? definitionEmblem.secondaryOverlay : `/img/misc/missing_icon_d2.png`}`}
        />
      );
    }
  }
}

export default EmblemSecondaryOverlay;
