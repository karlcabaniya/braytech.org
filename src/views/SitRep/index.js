import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';
import { orderBy, flattenDepth } from 'lodash';

import manifest from '../../utils/manifest';
import Button from '../../components/UI/Button';
import Spinner from '../../components/UI/Spinner';
import ObservedImage from '../../components/ObservedImage';
import ProgressBar from '../../components/UI/ProgressBar';
import Items from '../../components/Items';
import Roster from '../../components/Roster';
import * as utils from '../../utils/destinyUtils';

import './styles.css';
import Ranks from '../../components/Ranks';

class SitRep extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.rebindTooltips();
  }

  render() {
    const { t, member, groupMembers } = this.props;
    const group = member.data.groups.results.length > 0 ? member.data.groups.results[0].group : false;
    const characterId = member.characterId;
    const characters = member.data.profile.characters.data;
    const character = characters.find(c => c.characterId === characterId);
    const profileRecords = member.data.profile.profileRecords.data.records;
    const characterProgressions = member.data.profile.characterProgressions.data;

    // const milestonesData = Object.values(member.data.milestones).map(m => manifest.DestinyMilestoneDefinition[m.milestoneHash]);
    // console.log(milestonesData);

    let milestones = [];
    Object.values(member.data.profile.characterProgressions.data[characterId].milestones).forEach(milestone => {
      let def = manifest.DestinyMilestoneDefinition[milestone.milestoneHash];

      if (milestone.milestoneHash === 4253138191) {
        return; // Weekly Clan Engrams
      }

      // console.log(def.displayProperties.name, milestone);

      let state = {
        earned: false,
        redeemed: false,
        objective: {
          progress: 0,
          completionValue: 1
        },
        rewards: []
      };

      let displayProperties = {
        name: def.displayProperties.name,
        description: def.displayProperties.description
      };

      // console.log(manifest.DestinyMilestoneDefinition[milestone.milestoneHash].rewards)

      // if (manifest.DestinyMilestoneDefinition[milestone.milestoneHash].rewards) {
      //   state.reward = true;
      // }

      // if (manifest.DestinyMilestoneDefinition[milestone.milestoneHash].quests) {
      //   console.log(manifest.DestinyMilestoneDefinition[milestone.milestoneHash], milestone)
      // }

      if (milestone.availableQuests) {
        let availableQuest = milestone.availableQuests[0];

        state.earned = availableQuest.status.completed;
        state.redeemed = availableQuest.status.redeemed;
        state.objective.progress = availableQuest.status.stepObjectives[0].progress;
        state.objective.completionValue = availableQuest.status.stepObjectives[0].completionValue;

        displayProperties.name = manifest.DestinyMilestoneDefinition[milestone.milestoneHash].quests[availableQuest.questItemHash].displayProperties.name;
        displayProperties.description = manifest.DestinyObjectiveDefinition[availableQuest.status.stepObjectives[0].objectiveHash].displayProperties.description !== '' ? manifest.DestinyObjectiveDefinition[availableQuest.status.stepObjectives[0].objectiveHash].displayProperties.description : manifest.DestinyObjectiveDefinition[availableQuest.status.stepObjectives[0].objectiveHash].progressDescription;

        let questItem = manifest.DestinyInventoryItemDefinition[availableQuest.questItemHash];
        if (questItem.value) {
          let questRewardItem = questItem.value.itemValue.find(i => i.itemHash);
          if (questRewardItem) {
            state.rewards.push(questRewardItem.itemHash);
          }
        }
      } else if (milestone.rewards) {
        if (milestone.activities && milestone.activities.length) {
          milestone.activities.forEach(a => {
            if (a.challenges.length > 0) {
              a.challenges.forEach(c => {
                state.earned = c.objective.complete;
                state.objective.progress = c.objective.progress;
                state.objective.completionValue = c.objective.completionValue;
              });
            }
          });
        } else {
          state.earned = milestone.rewards[0].entries[0].earned;
          state.redeemed = milestone.rewards[0].entries[0].redeemed;
        }

        let rewardEntryHashes = flattenDepth(milestone.rewards.map(r => r.entries), 1).map(r => r.rewardEntryHash);
        let mappedRewards = flattenDepth(rewardEntryHashes.map(r => Object.values(manifest.DestinyMilestoneDefinition[milestone.milestoneHash].rewards[r].rewardEntries).find(e => e.rewardEntryHash === r).items), 1).map(i => i.itemHash);

        state.rewards.push(...mappedRewards);
      } else {
        return;
      }

      // console.log(state.rewards)

      milestones.push({
        order: milestone.order,
        element: (
          <li key={milestone.milestoneHash} className={cx({ earned: state.earned, redeemed: state.redeemed })}>
            <ProgressBar
              objective={{
                progressDescription: displayProperties.name,
                completionValue: state.objective.completionValue
              }}
              progress={{
                progress: state.objective.progress,
                objectiveHash: milestone.milestoneHash
              }}
              hideCheck
            />
            <div className='text'>{displayProperties.description}</div>
            {state.rewards.map((r, i) => {
              const def = manifest.DestinyInventoryItemDefinition[r];
              return (
                <div key={i} className='reward'>
                  <ObservedImage className='image' src={`https://www.bungie.net${def.displayProperties.icon}`} />
                  <div className='name'>{def.displayProperties.name}</div>
                </div>
              );
            })}
          </li>
        )
      });
    });

    milestones = orderBy(milestones, [m => m.order], ['asc']);

    const wellRestedState = utils.isWellRested(this.props.member.data.profile.characterProgressions.data[character.characterId]);

    if (wellRestedState.wellRested) {
      milestones.unshift({
        order: 0,
        element: (
          <li key='rest' className='well-rested'>
            <ProgressBar
              objective={{
                progressDescription: 'Well rested',
                completionValue: wellRestedState.requiredXP
              }}
              progress={{
                progress: wellRestedState.progress,
                objectiveHash: 'rest'
              }}
              hideCheck
            />
            <div className='text'>XP gains increased by 3x for your first 3 Levels this week.</div>
          </li>
        )
      });
    }

    // console.log(member);

    return (
      <div className='view' id='sit-rep'>
        <div className='col'>
          <div className='module milestones'>
            <div className='sub-header sub'>
              <div>{t('Milestones')}</div>
            </div>
            {milestones.length ? <ul className='list'>{milestones.map(m => m.element)}</ul> : <div className='milestones-completed'>{t("You've completed all of your milestones for this character.")}</div>}
          </div>
        </div>
        <div className='col'>
          <div className='module'>
            <div className='sub-header sub'>
              <div>{t('Ranks')}</div>
            </div>
            <ul className='list ranks'>
              {[2772425241, 2626549951, 2000925172].map(hash => {
                return <Ranks key={hash} hash={hash} />
              })}
            </ul>
          </div>
        </div>
        <div className='col'>
          {group ? (
            <div className='module clan-roster'>
              <div className='sub-header sub'>
                <div>{t('Clan roster')}</div>
                <div>{groupMembers.responses.filter(member => member.isOnline).length} online</div>
              </div>
              <div className='refresh'>{groupMembers.loading && groupMembers.responses.length !== 0 ? <Spinner mini /> : null}</div>
              {groupMembers.loading && groupMembers.responses.length === 0 ? <Spinner /> : <Roster mini showOnline />}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    groupMembers: state.groupMembers,
    collectibles: state.collectibles
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
)(SitRep);
