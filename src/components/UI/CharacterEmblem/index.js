import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import ObservedImage from '../../ObservedImage';
import * as utils from '../../../utils/destinyUtils';

import './styles.css';

class CharacterEmblem extends React.Component {
  render() {
    const { t, member, onBoarding, responsive } = this.props;

    if (member.data && !onBoarding) {
      const { groups } = member.data;
      const { profile, characters, characterProgressions } = member.data.profile;

      const characterId = this.props.characterId || member.characterId;

      const character = characters.data.find(c => c.characterId === characterId);

      const capped = characterProgressions.data[characterId].progressions[1716568313].level === characterProgressions.data[characterId].progressions[1716568313].levelCap ? true : false;
      const progress = capped ? characterProgressions.data[characterId].progressions[2030054750].progressToNextLevel / characterProgressions.data[characterId].progressions[2030054750].nextLevelAt : characterProgressions.data[characterId].progressions[1716568313].progressToNextLevel / characterProgressions.data[characterId].progressions[1716568313].nextLevelAt;

      return (
        <div className={cx('character-emblem', { responsive })}>
          <div className='wrapper'>
            <ObservedImage
              className={cx('image', 'emblem', {
                missing: !character.emblemBackgroundPath
              })}
              src={`https://www.bungie.net${character.emblemBackgroundPath ? character.emblemBackgroundPath : `/img/misc/missing_icon_d2.png`}`}
            />
            <div className='displayName'>{profile.data.userInfo.displayName}</div>
            <div className='group'>{groups && groups.results && groups.results.length ? groups.results[0].group.name : ''}</div>
            <div className='light'>{character.light}</div>
            <div className='level'>
              {t('Level')} {character.baseCharacterLevel}
            </div>
            <div className='progress'>
              <div
                className={cx('bar', {
                  capped: capped
                })}
                style={{
                  width: `${progress * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      );
    } else if (onBoarding) {
      return (
        <div className={cx('character-emblem', 'onboarding', { responsive })}>
          <div className='wrapper'>
            <div className='abs'>
              <div className='text'>{t('Select a character')}</div>
              <div className='icon'><i className='segoe-uniE0AB' /></div>
              <Link to={{ pathname: '/character-select', state: { from: { pathname: '/maps' } } }} />
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(CharacterEmblem);