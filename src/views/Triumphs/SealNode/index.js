import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../../components/ObservedImage';
import Records from '../../../components/Records';

class SealNode extends React.Component {
  render() {
    const { t } = this.props;
    const characterId = this.props.member.characterId;

    const characters = this.props.member.data.profile.characters.data;
    const genderHash = characters.find(character => character.characterId === characterId).genderHash;
    const profileRecords = this.props.member.data.profile.profileRecords.data.records;

    const sealBars = {
      2588182977: {
        image: '037E-00001367.png'
      },
      3481101973: {
        image: '037E-00001343.png'
      },
      147928983: {
        image: '037E-0000134A.png'
      },
      2693736750: {
        image: '037E-0000133C.png'
      },
      2516503814: {
        image: '037E-00001351.png'
      },
      1162218545: {
        image: '037E-00001358.png'
      },
      2039028930: {
        image: '0560-000000EB.png'
      },
      991908404: {
        image: '0560-0000107E.png'
      },
      3170835069: {
        image: '0560-00006583.png'
      },
      1002334440: {
        image: '0560-00007495.png'
      }
    };

    let definitionSeal = manifest.DestinyPresentationNodeDefinition[this.props.match.params.secondary];

    let progress = profileRecords[definitionSeal.completionRecordHash] && profileRecords[definitionSeal.completionRecordHash].objectives[0].progress;
    let total = profileRecords[definitionSeal.completionRecordHash] && profileRecords[definitionSeal.completionRecordHash].objectives[0].completionValue;
    let isComplete = progress === total ? true : false;
    let title = manifest.DestinyRecordDefinition[definitionSeal.completionRecordHash].titleInfo.titlesByGenderHash[genderHash];

    return (
      <div className='node seal'>
        <div className='children'>
          <div className='icon'>
            <div className='corners t' />
            <ObservedImage className='image' src={sealBars[definitionSeal.hash] ? `/static/images/extracts/badges/${sealBars[definitionSeal.hash].image}` : `https://www.bungie.net${definitionSeal.displayProperties.originalIcon}`} />
            <div className='corners b' />
          </div>
          <div className='text'>
            <div className='name'>{definitionSeal.displayProperties.name}</div>
            <div className='description'>{definitionSeal.displayProperties.description}</div>
          </div>
          <div className='until'>
            {total && isComplete ? <h4 className='completed'>{t('Seal completed')}</h4> : <h4>{t('Seal progress')}</h4>}
            <div className='progress'>
              <div className='text'>
                <div className='title'>{title}</div>
                {total ? (
                  <div className='fraction'>
                    {progress}/{total}
                  </div>
                ) : null}
              </div>
              <div className={cx('bar', { completed: total && isComplete })}>
                {total ? (
                  <div
                    className='fill'
                    style={{
                      width: `${(progress / total) * 100}%`
                    }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className='records'>
          <ul className='list no-interaction tertiary record-items'>
            <Records {...this.props} hashes={definitionSeal.children.records.map(child => child.recordHash)} highlight={this.props.match.params.tertiary || false} />
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    theme: state.theme,
    collectibles: state.collectibles
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(SealNode);
