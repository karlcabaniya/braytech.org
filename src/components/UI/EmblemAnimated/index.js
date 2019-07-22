import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';

import './styles.css';

// Planet of Peace

class Emblem_4182480233_icon extends React.Component {
  render() {
    return (
      <div className='emblem-ani-4182480233-icon'>
        <ObservedImage className='image secondaryOverlay s3' src={`/static/images/original/emblems/4182480233/3.png`} />
        <ObservedImage className='image secondaryOverlay s2' src={`/static/images/original/emblems/4182480233/2.png`} />
        <ObservedImage className='image secondaryOverlay s1' src={`/static/images/original/emblems/4182480233/1.png`} />
      </div>
    );
  }
}

// Spicey Ramen

class Emblem_1409726988_icon extends React.Component {
  render() {
    return (
      <div className='emblem-ani-1409726988-icon'>
        <div className='bowl-0' />
        <div className='bowl-1' />
        <div className='bowl-2' />
        <div className='bowl-3' />
        <div className='outline' />
      </div>
    );
  }
}

// Sign of Our City

class Emblem_2133500855_icon extends React.Component {
  render() {
    return (
      <div className='emblem-ani-2133500855-icon'>
        <div className='ball one' />
        <div className='st10' />
        <div className='st11' />
        <div className='iris' />
        <div className='ball two' />
      </div>
    );
  }
}

class Emblem_2133500855_background extends React.Component {
  render() {
    const { hideCredit } = this.props;

    return (
      <div className='emblem-ani-2133500855-background'>
        <div className='bars' />
        {!hideCredit ? (
          <div className='animator'>
            <Link to='/experiments/animated-emblems'>
              Animated by <span>InexorableAce</span>
            </Link>
          </div>
        ) : null}
      </div>
    );
  }
}

// Grizzled Wolf

class Emblem_1661191199_icon extends React.Component {
  render() {
    return (
      <div className='emblem-ani-1661191199-icon'>
        <div className='wolf' />
      </div>
    );
  }
}

class Emblem_1661191199_background extends React.Component {
  render() {
    const { hideCredit } = this.props;

    return (
      <div className='emblem-ani-1661191199-background'>
        <div className='thickets' />
        <div className='extra-thickets' />
        {!hideCredit ? (
          <div className='animator'>
            <Link to='/experiments/animated-emblems'>
              Animated by <span>InexorableAce</span>
            </Link>
          </div>
        ) : null}
      </div>
    );
  }
}

const emblemsCustom = {
  4182480233: {
    icon: Emblem_4182480233_icon
  },
  1409726988: {
    icon: Emblem_1409726988_icon
  },
  2133500855: {
    icon: Emblem_2133500855_icon,
    background: Emblem_2133500855_background
  },
  1661191199: {
    icon: Emblem_1661191199_icon,
    background: Emblem_1661191199_background
  }
};

export class EmblemAnimatedIcon extends React.Component {
  render() {
    const { hash } = this.props;

    if (emblemsCustom[hash] && emblemsCustom[hash].icon) {
      const Element = emblemsCustom[hash].icon;

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

export class EmblemAnimatedBackground extends React.Component {
  render() {
    const { hash } = this.props;

    if (emblemsCustom[hash] && emblemsCustom[hash].background) {
      const Element = emblemsCustom[hash].background;

      return <Element {...this.props} />;
    } else {
      const definitionEmblem = manifest.DestinyInventoryItemDefinition[hash];

      const veryLightEmblems = [4182480236, 3961503937];

      return (
        <ObservedImage
          className={cx('image', 'emblem', {
            missing: definitionEmblem.redacted,
            'very-light': veryLightEmblems.includes(definitionEmblem.hash)
          })}
          src={`https://www.bungie.net${definitionEmblem.secondarySpecial ? definitionEmblem.secondarySpecial : `/img/misc/missing_icon_d2.png`}`}
        />
      );
    }
  }
}
