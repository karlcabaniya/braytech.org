import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import ObservedImage from '../ObservedImage';
import Items from '../Items';
import ProgressBar from '../UI/ProgressBar';

import './styles.css';

class QuestLine extends React.Component {
  render() {
    const { t, member, item } = this.props;
    const itemComponents = member.data.profile.itemComponents;
    const characterUninstancedItemComponents = member.data.profile.characterUninstancedItemComponents[member.characterId].objectives.data;

    let definitionItem = item && item.itemHash && manifest.DestinyInventoryItemDefinition[item.itemHash];

    if (definitionItem && definitionItem.objectives && definitionItem.objectives.questlineItemHash) {
      definitionItem = manifest.DestinyInventoryItemDefinition[definitionItem.objectives.questlineItemHash]
    }
    
    if (definitionItem && definitionItem.setData && definitionItem.setData.itemList && definitionItem.setData.itemList.length) {

      const questLine = definitionItem;

      let assumeCompleted = true;
      const steps = questLine.setData.itemList.map(i => {

        i.definitionStep = manifest.DestinyInventoryItemDefinition[i.itemHash];
        i.completed = assumeCompleted;

        if (i.itemHash === item.itemHash) {
          assumeCompleted = false;
          i.completed = false;
          i.active = true;
          i.itemInstanceId = item.itemInstanceId || null;
        }

        let progressData = item.itemInstanceId && itemComponents.objectives.data[item.itemInstanceId] ? itemComponents.objectives.data[item.itemInstanceId].objectives : characterUninstancedItemComponents && characterUninstancedItemComponents[item.itemHash] ? characterUninstancedItemComponents[item.itemHash].objectives : false;

        let stepMatch = false;
        if (progressData && i.definitionStep.objectives && i.definitionStep.objectives.objectiveHashes.length === progressData.length) {
          progressData.forEach(o => {
            if (i.definitionStep.objectives.objectiveHashes.includes(o.objectiveHash)) {
              stepMatch = true;
            } else {
              stepMatch = false;
            }
          });
        }

        if (stepMatch) {
          i.progress = progressData;
        } else if (assumeCompleted && i.definitionStep.objectives && i.definitionStep.objectives.objectiveHashes.length) {
          i.progress = i.definitionStep.objectives.objectiveHashes.map(o => {
            let definitionObjective = manifest.DestinyObjectiveDefinition[o];

            return {
              complete: true,
              progress: definitionObjective.completionValue,
              objectiveHash: definitionObjective.hash
            }
          });
        } else {
          i.progress = [];
        }

        return i;
      });

      const questLineSource = questLine.sourceData && questLine.sourceData.vendorSources && questLine.sourceData.vendorSources.length ? questLine.sourceData.vendorSources : steps[0].definitionStep.sourceData && steps[0].definitionStep.sourceData.vendorSources && steps[0].definitionStep.sourceData.vendorSources.length ? steps[0].definitionStep.sourceData.vendorSources : false;

      const descriptionQuestLine = questLine.displaySource && questLine.displaySource !== '' ? questLine.displaySource : questLine.displayProperties.description && questLine.displayProperties.description !== '' ? questLine.displayProperties.description : steps[0].definitionStep.displayProperties.description;

      const rewards = (questLine.value && questLine.value.itemValue.length && questLine.value.itemValue.filter(v => v.itemHash !== 0 && v.quantity > 0)) || [];

      console.log(rewards)

      return (
        <div className='quest-line'>
          <div className='module header'>
            <div className='name'>{questLine.displayProperties.name}</div>
          </div>
          <div className='module'>
            <ReactMarkdown className='displaySource' source={descriptionQuestLine} />
          </div>
          {rewards.length ? (
            <div className='module'>
              <h4>{t('Rewards')}</h4>
              <ul className='list inventory-items'>
                <Items items={rewards} />
              </ul>
            </div>
          ) : null}
          <div className='module'>
            {questLineSource ? (
              <>
                <h4>{t('Source')}</h4>
                {questLineSource.map(s => {
                  if (s.vendorHash) {
                    let definitionVendor = manifest.DestinyVendorDefinition[s.vendorHash];

                    return (
                      <div key={s.vendorHash} className='vendor'>
                        <div className='name'>{definitionVendor.displayProperties.name}</div>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </>
            ) : null}
          </div>
          <div className='module'>
            <h4>{t('Steps')}</h4>
            <div className='steps'>
              {steps.map(s => {

                let objectives = [];
                s.definitionStep && s.definitionStep.objectives && s.definitionStep.objectives.objectiveHashes.forEach(element => {
                  let definitionObjective = manifest.DestinyObjectiveDefinition[element];
              
                  let playerProgress = { ...{
                    complete: false,
                    progress: 0,
                    objectiveHash: definitionObjective.hash
                  }, ...s.progress.find(o => o.objectiveHash === definitionObjective.hash) };
              
                  objectives.push(<ProgressBar key={definitionObjective.hash} objectiveDefinition={definitionObjective} playerProgress={playerProgress} />);
                });

                const descriptionStep = s.definitionStep.displayProperties.description && s.definitionStep.displayProperties.description !== '' ? s.definitionStep.displayProperties.description : false;

                return (
                  <div key={s.itemHash} className='step'>
                    <div className='header'>
                      <div className='name'>{s.definitionStep.displayProperties.name}</div>
                      {descriptionStep ? <ReactMarkdown className='description' source={descriptionStep} /> : null}
                    </div>
                    {objectives.length ? <div className='objectives'>{objectives}</div> : null}
                  </div>
                )

              })}
            </div>
          </div>
        </div>
      )
    }

    return null;
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
)(QuestLine);
