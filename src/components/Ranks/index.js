import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { flattenDepth, orderBy } from 'lodash';

import manifest from '../../utils/manifest';
import ObservedImage from '../ObservedImage';
import ProgressBar from '../UI/ProgressBar';
import Spinner from '../UI/Spinner';
import * as utils from '../../utils/destinyUtils';
import * as bungie from '../../utils/bungie';

import './styles.css';

class Mode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      glory: {
        streak: 0,
        loading: true
      }
    };
  }

  winsRequired = data => {
    const { characterId, characterProgressions } = this.props.data;

    const debug = false;

    let stepsData = data[2000925172].definition.steps;
    let { stepIndex: currentStepIndex, stepIndex: workingStepIndex, progressToNextLevel: initialProgress, currentProgress } = characterProgressions[characterId].progressions[2000925172];
    let targetStepIndex = currentStepIndex < 9 ? 9 : 15;

    let winsRequired = 0;
    let winsStreak = Math.max(data[2000925172].streak, 1);
    let totalProgress = currentProgress;
    let progress = initialProgress;

    if (debug) console.warn(`starting rank: ${stepsData[workingStepIndex].stepName} - ${currentProgress}`)

    // just to Fabled I or go all the way to Legend+
    while (targetStepIndex === 9 ? workingStepIndex < targetStepIndex : workingStepIndex <= targetStepIndex) {
      const currentStep = stepsData[workingStepIndex];

      if (debug) console.log(`stepIndex: ${workingStepIndex}, name: ${currentStep.stepName}`)

      if (debug) console.log(`win: streak ${winsStreak}, progress ${progress}/${currentStep.progressTotal}`)
      while (progress < currentStep.progressTotal) {

        progress = progress + data[2000925172].gains[workingStepIndex].progressGain[Math.min(winsStreak, 5)];
        totalProgress = totalProgress + data[2000925172].gains[workingStepIndex].progressGain[Math.min(winsStreak, 5)];

        winsRequired++;
        
        if (debug) console.log(`win: streak ${winsStreak}, progress ${progress}/${currentStep.progressTotal}`)
      }

      progress = Math.max(progress - currentStep.progressTotal, 0);

      workingStepIndex++;
    }

    if (debug) console.warn(`finishing rank: ${stepsData[Math.min(workingStepIndex, stepsData.length - 1)].stepName} - ${totalProgress}`)

    if (debug) console.log(winsRequired)

    return winsRequired;
  }

  async componentDidMount() {
    const { hash, data } = this.props;
    const { membershipType, membershipId, characters } = data;

    if (hash === 2000925172) {
      const charactersIds = characters.map(c => c.characterId);

      let requests = charactersIds.map(async c => {
        let response = await bungie.GetActivityHistory(membershipType, membershipId, c, 5, 69, 0);
        return response.activities || [];
      });

      let activities = await Promise.all(requests);
      activities = flattenDepth(activities, 1);
      activities = orderBy(activities, [ac => ac.period], ['desc']);

      let streakCount = 0;
      let streakBroken = false;
      activities.forEach((match, i) => {
        if (match.values.standing.basic.value !== 0) {
          streakBroken = true;
        }

        if (!streakBroken && match.values.standing.basic.value === 0) {
          streakCount++;
        }

      });

      this.setState({ glory: { streak: streakCount, loading: false } })
    }
  }

  render() {
    const { t, hash } = this.props;
    const { characterId, characterProgressions } = this.props.data;

    let data = {
      2772425241: {
        hash: 2772425241, // infamy
        activityHash: 3577607128,
        icon: '/static/images/extracts/ui/modes/01a3-00007365.png',
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
        icon: '/static/images/extracts/ui/modes/037E-000013D9.PNG',
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
      2000925172: {
        hash: 2000925172, // glory
        definition: manifest.DestinyProgressionDefinition[2000925172],
        activityHash: 2947109551,
        icon: '/static/images/extracts/ui/modes/037E-000013EB.PNG',
        totalPoints: utils.totalGlory(),
        streak: this.state.glory.streak,
        gains: {
          '0': {
            progressLoss: -60,
            progressGain: {
              '1': 80,
              '2': 100,
              '3': 120,
              '4': 140,
              '5': 160
            }
          },
          '1': {
            progressLoss: -60,
            progressGain: {
              '1': 80,
              '2': 100,
              '3': 120,
              '4': 140,
              '5': 160
            }
          },
          '2': {
            progressLoss: -60,
            progressGain: {
              '1': 80,
              '2': 100,
              '3': 120,
              '4': 140,
              '5': 160
            }
          },
          '3': {
            progressLoss: -60,
            progressGain: {
              '1': 68,
              '2': 88,
              '3': 108,
              '4': 136,
              '5': 148
            }
          },
          '4': {
            progressLoss: -60,
            progressGain: {
              '1': 68,
              '2': 88,
              '3': 108,
              '4': 136,
              '5': 148
            }
          },
          '5': {
            progressLoss: -60,
            progressGain: {
              '1': 68,
              '2': 88,
              '3': 108,
              '4': 136,
              '5': 148
            }
          },
          '6': {
            progressLoss: -52,
            progressGain: {
              '1': 60,
              '2': 80,
              '3': 100,
              '4': 128,
              '5': 140
            }
          },
          '7': {
            progressLoss: -52,
            progressGain: {
              '1': 60,
              '2': 80,
              '3': 100,
              '4': 128,
              '5': 140
            }
          },
          '8': {
            progressLoss: -52,
            progressGain: {
              '1': 60,
              '2': 80,
              '3': 100,
              '4': 128,
              '5': 140
            }
          },
          '9': {
            progressLoss: -60,
            progressGain: {
              '1': 40,
              '2': 60,
              '3': 80,
              '4': 108,
              '5': 120
            }
          },
          '10': {
            progressLoss: -60,
            progressGain: {
              '1': 40,
              '2': 60,
              '3': 80,
              '4': 108,
              '5': 120
            }
          },
          '11': {
            progressLoss: -60,
            progressGain: {
              '1': 40,
              '2': 60,
              '3': 80,
              '4': 108,
              '5': 120
            }
          },
          '12': {
            progressLoss: -68,
            progressGain: {
              '1': 40,
              '2': 60,
              '3': 80,
              '4': 108,
              '5': 120
            }
          },
          '13': {
            progressLoss: -68,
            progressGain: {
              '1': 40,
              '2': 60,
              '3': 80,
              '4': 108,
              '5': 120
            }
          },
          '14': {
            progressLoss: -68,
            progressGain: {
              '1': 40,
              '2': 60,
              '3': 80,
              '4': 108,
              '5': 120
            }
          },
          '15': {
            progressLoss: -68,
            progressGain: {
              '1': 40,
              '2': 60,
              '3': 80,
              '4': 108,
              '5': 120
            }
          }
        }
      }
    };

    let winsRequired = 0;
    if (hash === 2000925172) {
      winsRequired = this.winsRequired(data);
    }
    
    // console.log(data[2000925172].gains)
    // console.log(characterProgressions[characterId].progressions[2000925172])

    return (
      <li>
        <div className='icon'>
          <ObservedImage className='image' src={data[hash].icon} />
        </div>
        <div className='data'>
          <div>
            <div className='value'>{characterProgressions[characterId].progressions[hash].currentProgress.toLocaleString()}</div>
            <div className='name'>{t('Points')}</div>
          </div>
          {hash !== 2000925172 ? (
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
          {hash === 2000925172 ? (
            <>
              <div>
                <div className='value'>{!this.state.glory.loading ? Math.max(data[2000925172].streak, 1) : <Spinner mini />}</div>
                <div className='name'>{t('Win streak')}</div>
              </div>
              <div>
                <div className='value'>{winsRequired} {winsRequired === 1 ? t('win') : t('wins')}</div>
                <div className='name'>{characterProgressions[characterId].progressions[2000925172].stepIndex < 9 ? t('Fabled rank') : t('Legend rank')}</div>
              </div>
            </>
          ) : null}
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

export default compose(
  connect(),
  withNamespaces()
)(Mode);
