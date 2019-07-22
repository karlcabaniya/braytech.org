import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import manifest from '../../utils/manifest';
import ObservedImage from '../ObservedImage';
import ProgressBar from '../UI/ProgressBar';
import * as utils from '../../utils/destinyUtils';

import './styles.css';

class Mode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { t, member, hash } = this.props;
    const characterId = member.characterId;
    const characters = member.data.profile.characters.data;
    const character = characters.find(c => c.characterId === characterId);
    const profileRecords = member.data.profile.profileRecords.data.records;
    const characterProgressions = member.data.profile.characterProgressions.data;

    const data = {
      2772425241: {
        hash: 2772425241, // infamy
        activityHash: 3577607128,
        icon: '/static/images/extracts/ui/modes/01E3-00000051.PNG',
        currentResetCount: characterProgressions[characterId].progressions[2772425241].currentResetCount,
        totalResetCount: characterProgressions[characterId].progressions[2772425241].seasonResets.reduce((acc, curr) => {
          if (curr.season > 3) {
            return acc + curr.resets;
          } else {
            return acc;
          }
        }, 0),
        totalPoints: utils.totalInfamy()
      },
      2626549951: {
        hash: 2626549951, // valor
        activityHash: 2274172949,
        icon: '/static/images/extracts/ui/modes/01E3-00000190.PNG',
        currentResetCount: characterProgressions[characterId].progressions[2679551909] && characterProgressions[characterId].progressions[2679551909].currentResetCount ? characterProgressions[characterId].progressions[2679551909].currentResetCount : '?',
        totalResetCount:
          characterProgressions[characterId].progressions[2679551909] && characterProgressions[characterId].progressions[2679551909].seasonResets
            ? characterProgressions[characterId].progressions[2679551909].seasonResets.reduce((acc, curr) => {
                if (curr.season > 3) {
                  return acc + curr.resets;
                } else {
                  return acc;
                }
              }, 0)
            : '?',
        totalPoints: utils.totalValor()
      },
      2679551909: {
        hash: 2679551909, // glory
        activityHash: 2947109551,
        icon: '/static/images/extracts/ui/modes/01E3-00000181.PNG',
        totalPoints: utils.totalGlory()
      }
    };

    return (
      <li>
        <div className='icon'>
          <ObservedImage className='image' src={data[hash].icon} />
        </div>
        <div className='text'>
          <div className='name'>{manifest.DestinyActivityDefinition[data[hash].activityHash].displayProperties.name}</div>
          <div className='data'>
            <div>
              <div className='value'>{characterProgressions[characterId].progressions[hash].currentProgress.toLocaleString()}</div>
              <div className='name'>{t('Points')}</div>
            </div>
            {data[hash].totalResetCount ? (
              <>
                <div>
                  <div className='value'>{data[hash].totalResetCount}</div>
                  <div className='name'>{t('Total resets')}</div>
                </div>
                <div>
                  <div className='value'>{data[hash].currentResetCount}</div>
                  <div className='name'>{t('Season resets')}</div>
                </div>
              </>
            ) : null}
          </div>
        </div>
        <div className='progress'>
          <ProgressBar
            classNames='step'
            objective={{
              completionValue: characterProgressions[characterId].progressions[hash].nextLevelAt
            }}
            progress={{
              progress: characterProgressions[characterId].progressions[hash].progressToNextLevel,
              objectiveHash: hash
            }}
            hideCheck
          />
          <ProgressBar
            classNames='total'
            objective={{
              completionValue: data[hash].totalPoints
            }}
            progress={{
              progress: characterProgressions[characterId].progressions[hash].currentProgress,
              objectiveHash: hash
            }}
            hideCheck
          />
        </div>
      </li>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Mode);
