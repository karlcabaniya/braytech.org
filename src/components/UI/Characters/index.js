import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';
import Moment from 'react-moment';

import * as destinyUtils from '../../../utils/destinyUtils';
import { removeMemberIds } from '../../../utils/paths';
import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';
import Button from '../../../components/UI/Button';

import './styles.css';

class Characters extends React.Component {
  render() {
    const { t, member, viewport } = this.props;
    const characters = member.data.profile.characters;
    const characterProgressions = member.data.profile.characterProgressions.data;
    const characterActivities = member.data.profile.characterActivities;

    const lastActivities = destinyUtils.lastPlayerActivity2({ profile: { characters, characterActivities } });

    return (
      <div className={cx('characters-list', { responsive: viewport.width < 1024 })}>
        {characters.data.map(character => {
          let capped = characterProgressions[character.characterId].progressions[1716568313].level >= characterProgressions[character.characterId].progressions[1716568313].levelCap ? true : false;

          let progress = capped ? characterProgressions[character.characterId].progressions[2030054750].progressToNextLevel / characterProgressions[character.characterId].progressions[2030054750].nextLevelAt : characterProgressions[character.characterId].progressions[1716568313].progressToNextLevel / characterProgressions[character.characterId].progressions[1716568313].nextLevelAt;

          const lastActivity = lastActivities.find(a => a.characterId === character.characterId);

          const state = (
            <>
              <div className='activity'>{lastActivity.lastActivityString}</div>
              <Moment fromNow>{lastActivity.lastPlayed}</Moment>
            </>
          );

          return (
            <div key={character.characterId} className='char'>
              <Button
                className='linked'
                anchor
                to={`/${member.membershipType}/${member.membershipId}/${character.characterId}${removeMemberIds(this.props.location.pathname)}`}
                action={e => {
                  this.props.characterClick(character.characterId);
                }}
              >
                <ObservedImage
                  className={cx('image', 'emblem', {
                    missing: !character.emblemBackgroundPath
                  })}
                  src={`https://www.bungie.net${character.emblemBackgroundPath ? character.emblemBackgroundPath : `/img/misc/missing_icon_d2.png`}`}
                />
                <div className='class'>{destinyUtils.classHashToString(character.classHash, character.genderType)}</div>
                <div className='species'>{destinyUtils.raceHashToString(character.raceHash, character.genderType)}</div>
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
              </Button>
              {character.titleRecordHash ? <div className='title'>{manifest.DestinyRecordDefinition[character.titleRecordHash].titleInfo.titlesByGenderHash[character.genderHash]}</div> : null}
              <div className='state'>{state}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    viewport: state.viewport
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(Characters);
