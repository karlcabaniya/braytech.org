import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import manifest from '../../../utils/manifest';
import { classHashToString } from '../../../utils/destinyUtils';
import ObservedImage from '../../../components/ObservedImage';
import Items from '../../../components/Items';
import EmblemSecondaryOverlay from '../../../components/UI/EmblemSecondaryOverlay';

import './styles.css';

class AnimatedEmblemIcons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.rebindTooltips();
  }

  render() {
    const { t, member } = this.props;

    const characterId = member.characterId;
    const profile = member.data && member.data.profile.profile.data;
    const characters = member.data && member.data.profile.characters.data;
    const character = characters && characters.find(character => character.characterId === characterId);

    const custom = [
      {
        emblemHash: 4182480233,
        animator: 'Tom Chapman'
      },
      {
        emblemHash: 1409726988,
        animator: 'Tom Chapman'
      }
    ];

    return (
      <div className='view' id='animated-emblem-icons'>
        <div className='module head'>
          <div className='page-header'>
            <div className='name'>{t('Animated Emblem Icons')}</div>
          </div>
        </div>
        <div className='padder'>
          {custom.map((custom, i) => {
            const definitionEmblem = manifest.DestinyInventoryItemDefinition[custom.emblemHash];

            return (
              <div key={i} className='row'>
                <div className='description'>
                  <div className='item'>
                    <ul className='list inventory-items'>
                      <Items items={[{ itemHash: custom.emblemHash }]} />
                    </ul>
                  </div>
                  <div className='text'>
                    <div className='name'>{definitionEmblem.displayProperties.name}</div>
                    <div className='animator'>
                      {t('Animator')}: {custom.animator}
                    </div>
                  </div>
                </div>
                <div className='emblem'>
                  <div className='background'>
                    <ObservedImage className='image' src={`https://www.bungie.net${definitionEmblem.secondarySpecial}`} />
                  </div>
                  <div className='icon'>
                    <EmblemSecondaryOverlay hash={custom.emblemHash} />
                  </div>
                  <div className='text'>
                    <div className='displayName'>{profile ? profile.userInfo.displayName : 'Deej'}</div>
                    <div className='basics'>
                      {character ? (
                        <>
                          {character.baseCharacterLevel} / {classHashToString(character.classHash, character.genderType)} / <span className='light'>{character.light}</span>
                        </>
                      ) : (
                        <>
                          38 / {classHashToString(2271682572, 0)} / <span className='light'>777</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withNamespaces()
)(AnimatedEmblemIcons);
