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
import Roster from '../../components/Roster';
import * as utils from '../../utils/destinyUtils';
import quotes from '../../utils/quotes';

import './styles.css';

class SitRep extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  quote = quotes[Math.floor(Math.random() * (quotes.length)) + 0];

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { t, member, groupMembers } = this.props;
    const group = member.data.groups.results.length > 0 ? member.data.groups.results[0].group : false;
    const characterId = member.characterId;
    const characters = member.data.profile.characters.data;
    const character = characters.find(c => c.characterId === characterId);
    const profileRecords = member.data.profile.profileRecords.data.records;
    const characterProgressions = member.data.profile.characterProgressions.data;

    const milestonesData = Object.values(member.data.milestones).map(m => manifest.DestinyMilestoneDefinition[m.milestoneHash]);
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
              objectiveDefinition={{
                progressDescription: displayProperties.name,
                completionValue: state.objective.completionValue
              }}
              playerProgress={{
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
              objectiveDefinition={{
                progressDescription: 'Well rested',
                completionValue: wellRestedState.requiredXP
              }}
              playerProgress={{
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

    const valor = {
      defs: {
        rank: manifest.DestinyProgressionDefinition[2626549951],
        activity: manifest.DestinyActivityDefinition[2274172949]
      },
      progression: {
        data: characterProgressions[characterId].progressions[2626549951],
        total: utils.totalValor(),
        resets: profileRecords[559943871] ? profileRecords[559943871].objectives[0].progress : 0
      }
    };

    const glory = {
      defs: {
        rank: manifest.DestinyProgressionDefinition[2000925172],
        activity: manifest.DestinyActivityDefinition[2947109551]
      },
      progression: {
        data: characterProgressions[characterId].progressions[2000925172],
        total: utils.totalGlory()
      }
    };

    const infamy = {
      defs: {
        rank: manifest.DestinyProgressionDefinition[2772425241],
        activity: manifest.DestinyActivityDefinition[3577607128]
      },
      progression: {
        data: characterProgressions[characterId].progressions[2772425241],
        total: utils.totalInfamy(),
        resets: profileRecords[3901785488] ? profileRecords[3901785488].objectives[0].progress : 0
      }
    };

    // console.log(member);
    
    return (
      <div className='view' id='sit-rep'>
        <div className='head'>
          <div className='col'>
            <div className='page-header'>
              <div className='name'>{t('Welcome back, ') + (character.titleRecordHash ? manifest.DestinyRecordDefinition[character.titleRecordHash].titleInfo.titlesByGenderHash[character.genderHash] : t('Guardian'))}</div>
            </div>
            <div className='text'>
              <p>{this.quote}</p>
            </div>
          </div>
        </div>
        <div className='col'>
          {member.data.leaderboardPosition && member.data.leaderboardPosition.data ? (
            <div className='module'>
              <div className='sub-header sub'>
                <div>{t('Ranks')}</div>
              </div>
              <div className='ranks'>
                <div>
                  <div className='value'>{member.data.leaderboardPosition.data.ranks.triumphScore.toLocaleString('en-us')}</div>
                  <div className='name'>Triumph score rank</div>
                </div>
                <div>
                  <div className='value'>{member.data.leaderboardPosition.data.ranks.collectionTotal.toLocaleString('en-us')}</div>
                  <div className='name'>Collections rank</div>
                </div>
                <div>
                  <div className='value'>{member.data.leaderboardPosition.data.ranks.timePlayed.toLocaleString('en-us')}</div>
                  <div className='name'>Time played rank</div>
                </div>
              </div>
              <Button anchor to='/leaderboards' text={t('View leaderboards')} />
            </div>
          ) : null}
          <div className='module'>
            <div className='sub-header sub'>
              <div>{t('Progression')}</div>
            </div>
            <div>
              <div className='prog'>
                <div className='text'>
                  <div className='name'>{infamy.defs.activity.displayProperties.name}</div>
                  <div className='resets'>{infamy.progression.resets} resets</div>
                </div>
                <div className='progress'>
                  <ProgressBar
                    objectiveDefinition={{
                      progressDescription: `Next rank: ${infamy.defs.rank.currentProgress === infamy.progression.total && infamy.progression.data.stepIndex === infamy.defs.rank.steps.length ? infamy.defs.rank.steps[0].stepName : infamy.defs.rank.steps[(infamy.progression.data.stepIndex + 1) % infamy.defs.rank.steps.length].stepName}`,
                      completionValue: infamy.progression.data.nextLevelAt
                    }}
                    playerProgress={{
                      progress: infamy.progression.data.progressToNextLevel,
                      objectiveHash: 'infamy'
                    }}
                    hideCheck
                    chunky
                  />
                  <ProgressBar
                    objectiveDefinition={{
                      progressDescription: infamy.defs.rank.displayProperties.name,
                      completionValue: infamy.progression.total
                    }}
                    playerProgress={{
                      progress: infamy.progression.data.currentProgress,
                      objectiveHash: 'infamy'
                    }}
                    hideCheck
                    chunky
                  />
                </div>
              </div>
              <div className='prog'>
                <div className='text'>
                  <div className='name'>{valor.defs.activity.displayProperties.name}</div>
                  <div className='resets'>{valor.progression.resets} resets</div>
                </div>
                <div className='progress'>
                  <ProgressBar
                    objectiveDefinition={{
                      progressDescription: `Next rank: ${valor.defs.rank.currentProgress === valor.progression.total && valor.progression.data.stepIndex === valor.defs.rank.steps.length ? valor.defs.rank.steps[0].stepName : valor.defs.rank.steps[(valor.progression.data.stepIndex + 1) % valor.defs.rank.steps.length].stepName}`,
                      completionValue: valor.progression.data.nextLevelAt
                    }}
                    playerProgress={{
                      progress: valor.progression.data.progressToNextLevel,
                      objectiveHash: 'valor'
                    }}
                    hideCheck
                    chunky
                  />
                  <ProgressBar
                    objectiveDefinition={{
                      progressDescription: valor.defs.rank.displayProperties.name,
                      completionValue: valor.progression.total
                    }}
                    playerProgress={{
                      progress: valor.progression.data.currentProgress,
                      objectiveHash: 'valor'
                    }}
                    hideCheck
                    chunky
                  />
                </div>
              </div>
              <div className='prog'>
                <div className='text'>
                  <div className='name'>{glory.defs.activity.displayProperties.name}</div>
                </div>
                <div className='progress'>
                  <ProgressBar
                    objectiveDefinition={{
                      progressDescription: `Next rank: ${glory.defs.rank.currentProgress === glory.progression.total && glory.progression.data.stepIndex === glory.defs.rank.steps.length ? glory.defs.rank.steps[0].stepName : glory.defs.rank.steps[(glory.progression.data.stepIndex + 1) % glory.defs.rank.steps.length].stepName}`,
                      completionValue: glory.progression.data.nextLevelAt
                    }}
                    playerProgress={{
                      progress: glory.progression.data.progressToNextLevel,
                      objectiveHash: 'glory'
                    }}
                    hideCheck
                    chunky
                  />
                  <ProgressBar
                    objectiveDefinition={{
                      progressDescription: glory.defs.rank.displayProperties.name,
                      completionValue: glory.progression.total
                    }}
                    playerProgress={{
                      progress: glory.progression.data.currentProgress,
                      objectiveHash: 'glory'
                    }}
                    hideCheck
                    chunky
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='module milestones'>
            <div className='sub-header sub'>
              <div>{t('Milestones')}</div>
            </div>
            {milestones.length ? <ul className='list'>{milestones.map(m => m.element)}</ul> : <div className='milestones-completed'>{t("You've completed all of your milestones for this character.")}</div>}
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

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(SitRep);
