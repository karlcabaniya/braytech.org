import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import * as utils from '../../utils/destinyUtils';
import * as enums from '../../utils/destinyEnums';
import * as bungie from '../../utils/bungie';
import Spinner from '../../components/UI/Spinner';
import Button from '../../components/UI/Button';
import ProgressBar from '../../components/UI/ProgressBar';
import ObservedImage from '../../components/ObservedImage';
import Ranks from '../../components/Ranks';
import Roster from '../../components/Roster';
import Items from '../../components/Items';

import './styles.css';

class Now extends React.Component {
  constructor(props) {
    super(props);

    const { member, viewport } = this.props;
    const characterProgressions = member.data.profile.characterProgressions.data;
    
    this.state = {
      seasonPassRewardsPage: Math.ceil((characterProgressions[member.characterId].progressions[1628407317].level + 1) / this.seasonPassItemsPerPage(viewport.width))
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.rebindTooltips();
  }

  componentDidUpdate(p, s) {
    if (s.seasonPassRewardsPage !== this.state.seasonPassRewardsPage) {
      this.props.rebindTooltips();
    }

    if (p.member.data.profile.characterProgressions.data[p.member.characterId].progressions[1628407317].level !== this.props.member.data.profile.characterProgressions.data[this.props.member.characterId].progressions[1628407317].level) {
      this.setState(p => ({
        ...p,
        seasonPassRewardsPage: Math.ceil((this.props.member.data.profile.characterProgressions.data[this.props.member.characterId].progressions[1628407317].level + 1) / this.seasonPassItemsPerPage(this.props.viewport.width))
      }));
    }
  }

  handler_seasonPassPrev = e => {
    this.setState(p => ({
      ...p,
      seasonPassRewardsPage: p.seasonPassRewardsPage - 1
    }));
  };

  handler_seasonPassNext = e => {
    this.setState(p => ({
      ...p,
      seasonPassRewardsPage: p.seasonPassRewardsPage + 1
    }));
  };

  seasonPassItemsPerPage = width => {
    if (width > 1280) return 10;
    if (width > 1024) return 8;
    if (width >= 768) return 5;
    if (width < 768) return 3;
    return 3;
  };

  render() {
    const { t, member, groupMembers, viewport } = this.props;
    const milestones = member.data.milestones;
    const group = member.data.groups.results.length > 0 ? member.data.groups.results[0].group : false;
    const characters = member.data.profile.characters.data;
    const character = characters.find(c => c.characterId === member.characterId);
    const characterProgressions = member.data.profile.characterProgressions.data;
    const characterActivities = member.data.profile.characterActivities.data;
    // const profileTransitoryData = member.data.profile.profileTransitoryData.data;

    const wellRestedState = utils.isWellRested(characterProgressions[character.characterId]);

    // console.log(wellRestedState)

    //console.log(Object.values(characterProgressions[member.characterId].milestones).map(m => ({...m, def: manifest.DestinyMilestoneDefinition[m.milestoneHash]})))

    // characterActivities[member.characterId].availableActivities.forEach(a => {
    //   console.log(manifest.DestinyActivityDefinition[a.activityHash])
    // });

    // flashpoint
    const definitionMilestoneFLashpoint = manifest.DestinyMilestoneDefinition[463010297];
    const milestoneFlashpointQuestItem = milestones[463010297].availableQuests && milestones[463010297].availableQuests.length && manifest.DestinyMilestoneDefinition[463010297].quests[milestones[463010297].availableQuests[0].questItemHash];
    const definitionFlashpointVendor =
      milestoneFlashpointQuestItem &&
      Object.values(manifest.DestinyVendorDefinition).find(v => {
        if (milestoneFlashpointQuestItem.destinationHash === 1993421442) {
          return v.locations && v.locations.find(l => l.destinationHash === 3669933163);
        } else {
          return v.locations && v.locations.find(l => l.destinationHash === milestoneFlashpointQuestItem.destinationHash);
        }
      });
    const definitionFlashpointFaction = definitionFlashpointVendor && manifest.DestinyFactionDefinition[definitionFlashpointVendor.factionHash];

    // console.log(definitionMilestoneFLashpoint, milestoneFlashpointQuestItem, definitionFlashpointVendor)



    // console.log(featuredCrucibleModes);

    const knownStoryActivities = [129918239, 271962655, 589157009, 1023966646, 1070049743, 1132291813, 1259766043, 1313648352, 1513386090, 1534123682, 1602328239, 1872813880, 1882259272, 1906514856, 2000185095, 2146977720, 2568845238, 2660895412, 2772894447, 2776154899, 3008658049, 3205547455, 3271773240, 4009655461, 4234327344, 4237009519, 4244464899, 2962137994];
    const dailyHeroicStoryActivities = characterActivities[member.characterId].availableActivities.filter(a => {
      if (!a.activityHash) return false;

      if (!knownStoryActivities.includes(a.activityHash)) return false;

      return true;
    });
    const dailyHeroicStories = {
      activities: dailyHeroicStoryActivities,
      displayProperties: {
        name: manifest.DestinyPresentationNodeDefinition[3028486709] && manifest.DestinyPresentationNodeDefinition[3028486709].displayProperties && manifest.DestinyPresentationNodeDefinition[3028486709].displayProperties.name
      }
    };

    // orderBy(Object.values(manifest.DestinyActivityDefinition).map(a => {
    //   if (a.activityModeTypes && a.activityModeTypes.length && a.activityModeTypes.includes(46) && !a.guidedGame && a.modifiers.length > 2) return a;
    //   return false
    // }).filter(a => a),
    // [m => m.displayProperties.name],
    // ['asc']).forEach(a => {
    //   console.log(a.displayProperties.name, a.hash, JSON.stringify(a.activityModeTypes))
    // })

    const weeklyNightfallStrikeActivities = characterActivities[member.characterId].availableActivities.filter(a => {
      if (!a.activityHash) return false;

      const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

      if (definitionActivity && definitionActivity.activityModeTypes && definitionActivity.activityModeTypes.includes(46) && !definitionActivity.guidedGame && definitionActivity.modifiers && definitionActivity.modifiers.length > 2) return true;

      return false;
    });
    const weeklyNightfallStrikes = {
      activities: {
        ordeal: Object.keys(enums.nightfalls)
          .filter(k => enums.nightfalls[k].ordealHashes.find(o => weeklyNightfallStrikeActivities.find(w => w.activityHash === o)))
          .map(h => ({ activityHash: h })),
        scored: weeklyNightfallStrikeActivities.filter(w => !Object.keys(enums.nightfalls).find(k => enums.nightfalls[k].ordealHashes.find(o => o === w.activityHash)))
      },
      displayProperties: {
        name: manifest.DestinyActivityDefinition[492869759].displayProperties.name
      },
      headings: {
        ordeal: t('Ordeal nightfall'),
        scored: t('Scored nightfalls')
      }
    };

    console.log(weeklyNightfallStrikeActivities, weeklyNightfallStrikeActivities.map(a => manifest.DestinyActivityDefinition[a.activityHash]));

    console.log(weeklyNightfallStrikes);

    // console.log(profileTransitoryData)

    console.log(characterProgressions[member.characterId], characterProgressions[member.characterId].progressions[1628407317]);

    // characterProgressions[member.characterId].progressions[1628407317].rewardItemStates.forEach((i, k) => {
    //   if (enums.enumerateProgressionRewardItemState(i).earned) console.log(manifest.DestinyInventoryItemDefinition[manifest.DestinyProgressionDefinition[1628407317].rewardItems[k].itemHash].displayProperties.name);
    // });

    const seasonPassItemsPerPage = this.seasonPassItemsPerPage(viewport.width);

    const seasonPass = {
      season: manifest.DestinySeasonDefinition[3612906877],
      slice: this.state.seasonPassRewardsPage * seasonPassItemsPerPage - seasonPassItemsPerPage,
      itemsPerPage: seasonPassItemsPerPage,
      ranks: manifest.DestinyProgressionDefinition[1628407317].steps.map((s, x) => {
        const rank = x + 1;
        const rewards = manifest.DestinyProgressionDefinition[1628407317].rewardItems
          .map((r, i) => {
            return {
              ...r,
              state: enums.enumerateProgressionRewardItemState(characterProgressions[member.characterId].progressions[1628407317].rewardItemStates[i])
            };
          })
          .filter((r, i) => r.rewardedAtProgressionLevel === rank);
        const rewardsFree = rewards
          .filter(r => r.uiDisplayStyle === 'free')
          .filter(i => {
            const definitionItem = manifest.DestinyInventoryItemDefinition[i.itemHash];

            // if package search contents
            if (definitionItem.itemCategoryHashes.includes(268598612)) {
              if (
                definitionItem.gearset &&
                definitionItem.gearset.itemList &&
                definitionItem.gearset.itemList.filter(t => {
                  const definitionItem = manifest.DestinyInventoryItemDefinition[t];

                  if (definitionItem.classType > -1 && definitionItem.classType < 3 && definitionItem.classType !== character.classType) {
                    return true;
                  } else {
                    return false;
                  }
                }).length
              ) {
                return false;
              } else {
                return true;
              }
            } else if (definitionItem.classType > -1 && definitionItem.classType < 3 && definitionItem.classType !== character.classType) {
              return false;
            } else {
              return true;
            }
          });
        const rewardsPremium = rewards
          .filter(r => r.uiDisplayStyle === 'premium')
          .filter(i => {
            const definitionItem = manifest.DestinyInventoryItemDefinition[i.itemHash];

            // if package, search contents
            if (definitionItem.itemCategoryHashes.includes(268598612)) {
              if (
                definitionItem.gearset &&
                definitionItem.gearset.itemList &&
                definitionItem.gearset.itemList.filter(t => {
                  const definitionItem = manifest.DestinyInventoryItemDefinition[t];

                  if (definitionItem.classType > -1 && definitionItem.classType < 3 && definitionItem.classType !== character.classType) {
                    return true;
                  } else {
                    return false;
                  }
                }).length
              ) {
                return false;
              } else {
                return true;
              }
            } else if (definitionItem.plug && definitionItem.plug.previewItemOverrideHash) {
              const definitionPreviewItem = manifest.DestinyInventoryItemDefinition[definitionItem.plug.previewItemOverrideHash];
              if (definitionPreviewItem.classType > -1 && definitionPreviewItem.classType < 3 && definitionPreviewItem.classType !== character.classType) {
                return false;
              } else {
                return true;
              }
            } else if (definitionItem.classType > -1 && definitionItem.classType < 3 && definitionItem.classType !== character.classType) {
              return false;
            } else {
              return true;
            }
          });

        return {
          rank,
          free: rewardsFree,
          premium: rewardsPremium
        };
      })
    };

    console.log(seasonPass);

    return (
      <div className='view' id='sit-rep'>
        <div className='module head'>
          <div className='content'>
            <div className='page-header'>
              <div className='sub-name'>{definitionMilestoneFLashpoint.displayProperties && definitionMilestoneFLashpoint.displayProperties.name}</div>
              <div className='name'>{manifest.DestinyDestinationDefinition[milestoneFlashpointQuestItem.destinationHash].displayProperties.name}</div>
            </div>
            {definitionFlashpointVendor && definitionFlashpointVendor.displayProperties ? (
              <div className='text'>
                <p>{t('{{vendorName}} is waiting for you at {{destinationName}}.', { vendorName: definitionFlashpointVendor.displayProperties && definitionFlashpointVendor.displayProperties.name, destinationName: manifest.DestinyDestinationDefinition[milestoneFlashpointQuestItem.destinationHash].displayProperties.name })}</p>
                <p>
                  <em>{definitionFlashpointFaction.displayProperties.description}</em>
                </p>
              </div>
            ) : (
              <div className='info'>{t('Beep-boop?')}</div>
            )}
          </div>
          {/* <div className='content highlight crucible'>
            <div className='module-header'>
              <div className='sub-name'>{featuredCrucibleModes.displayProperties.name}</div>
            </div>
            <h4>{featuredCrucibleModes.headings.rotator}</h4>
            <div className='text'>{featuredCrucibleModes.displayProperties.description}</div>
            <div className='modes'>
              {featuredCrucibleModes.activities.map((f, i) => {
                return (
                  <div key={i}>
                    <div className='icon'>{f.icon}</div>
                    <div className='text'>{f.displayProperties.name}</div>
                  </div>
                );
              })}
            </div>
          </div> */}
          <div className='content highlight'>
            <div className='module-header'>
              <div className='sub-name'>{weeklyNightfallStrikes.displayProperties.name}</div>
            </div>
            {weeklyNightfallStrikes.activities.scored.length ? (
              <>
                {weeklyNightfallStrikes.activities.ordeal.length ? (
                  <>
                    <h4>{weeklyNightfallStrikes.headings.ordeal}</h4>
                    <ul className='list activities'>
                      {orderBy(
                        enums.nightfalls[weeklyNightfallStrikes.activities.ordeal[0].activityHash].ordealHashes.map(o => ({
                          activityLightLevel: manifest.DestinyActivityDefinition[o].activityLightLevel,
                          activityHash: weeklyNightfallStrikes.activities.ordeal[0].activityHash,
                          ordealHash: o
                        })),
                        [a => a.activityLightLevel],
                        ['asc']
                      )
                        .slice(0, 1)
                        .map((a, i) => {
                          const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];
                          const definitionOrdeal = manifest.DestinyActivityDefinition[a.ordealHash];

                          return {
                            light: definitionOrdeal.activityLightLevel,
                            el: (
                              <li key={i} className='linked tooltip' data-table='DestinyActivityDefinition' data-hash={a.ordealHash} data-mode='175275639'>
                                <div className='name'>{definitionActivity.selectionScreenDisplayProperties && definitionActivity.selectionScreenDisplayProperties.name ? definitionActivity.selectionScreenDisplayProperties.name : definitionActivity.displayProperties && definitionActivity.displayProperties.name ? definitionActivity.displayProperties.name : t('Unknown')}</div>
                                <div>
                                  <div className='time'>{definitionActivity.timeToComplete ? <>{t('{{number}} mins', { number: definitionActivity.timeToComplete || 0 })}</> : null}</div>
                                  <div className='light'>
                                    <span>{definitionOrdeal.activityLightLevel}</span>
                                  </div>
                                </div>
                              </li>
                            )
                          };
                        })
                        .map(e => e.el)}
                    </ul>
                  </>
                ) : null}
                <h4>{weeklyNightfallStrikes.headings.scored}</h4>
                <ul className='list activities'>
                  {orderBy(
                    weeklyNightfallStrikes.activities.scored.map((a, i) => {
                      const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

                      return {
                        light: definitionActivity.activityLightLevel,
                        el: (
                          <li key={i} className='linked tooltip' data-table='DestinyActivityDefinition' data-hash={a.activityHash} data-mode='175275639'>
                            <div className='name'>{definitionActivity.selectionScreenDisplayProperties && definitionActivity.selectionScreenDisplayProperties.name ? definitionActivity.selectionScreenDisplayProperties.name : definitionActivity.displayProperties && definitionActivity.displayProperties.name ? definitionActivity.displayProperties.name : t('Unknown')}</div>
                            <div>
                              <div className='time'>{definitionActivity.timeToComplete ? <>{t('{{number}} mins', { number: definitionActivity.timeToComplete || 0 })}</> : null}</div>
                              <div className='light'>
                                <span>{definitionActivity.activityLightLevel}</span>
                              </div>
                            </div>
                          </li>
                        )
                      };
                    }),
                    [m => m.light],
                    ['asc']
                  ).map(e => e.el)}
                </ul>
              </>
            ) : (
              <div className='info'>Nightfalls are currently unavailable.</div>
            )}
          </div>
          <div className='content highlight'>
            <div className='module-header'>
              <div className='sub-name'>{dailyHeroicStories.displayProperties.name}</div>
            </div>
            <ul className='list activities'>
              {orderBy(
                dailyHeroicStories.activities.map((a, i) => {
                  const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

                  return {
                    light: definitionActivity.activityLightLevel,
                    timeToComplete: definitionActivity.timeToComplete || 20,
                    el: (
                      <li key={i} className='linked tooltip' data-table='DestinyActivityDefinition' data-hash={a.activityHash} data-mode='175275639'>
                        <div className='name'>{definitionActivity.selectionScreenDisplayProperties && definitionActivity.selectionScreenDisplayProperties.name ? definitionActivity.selectionScreenDisplayProperties.name : definitionActivity.displayProperties && definitionActivity.displayProperties.name ? definitionActivity.displayProperties.name : t('Unknown')}</div>
                        <div>
                          <div className='time'>{definitionActivity.timeToComplete ? <>{t('{{number}} mins', { number: definitionActivity.timeToComplete || 0 })}</> : null}</div>
                          <div className='light'>
                            <span>{definitionActivity.activityLightLevel}</span>
                          </div>
                        </div>
                      </li>
                    )
                  };
                }),
                [m => m.timeToComplete],
                ['asc']
              ).map(e => e.el)}
            </ul>
          </div>
        </div>
        <div className='module season-pass'>
          <div className='content status'>
            <div className='module-header'>
              <div className='sub-name'>{t('Season')}</div>
            </div>
            <div className='season-text'>
              <div className='name'>{seasonPass.season.displayProperties.name}</div>
              <div className='description'>{seasonPass.season.displayProperties.description}</div>
            </div>
          </div>
          <div className='page'>
            <Button text={<i className='segoe-uniE973' />} action={this.handler_seasonPassPrev} disabled={this.state.seasonPassRewardsPage * seasonPassItemsPerPage - seasonPassItemsPerPage < 1} />
          </div>
          <div className='rewards'>
            {seasonPass.ranks.slice(seasonPass.slice, seasonPass.slice + seasonPass.itemsPerPage).map(r => {
              const progressData = { ...characterProgressions[member.characterId].progressions[1628407317] };

              if (r.rank <= progressData.level) {
                progressData.progressToNextLevel = progressData.nextLevelAt;
              } else if (r.rank > progressData.level + 1) {
                progressData.progressToNextLevel = 0;
              }

              return (
                <div key={r.rank} className='rank' data-rank={r.rank}>
                  <ProgressBar hideCheck {...progressData} />
                  <div className={cx('free', { earned: r.free.length && r.free[0].state.earned, claimed: r.free.length && r.free[0].state.claimed, claimAllowed: r.free.length && r.free[0].state.claimAllowed })}>
                    <ul className='list inventory-items'>
                      {r.free.length ? (
                        <Items
                          items={r.free.map(r => {
                            return {
                              ...r,
                              state: null
                            };
                          })}
                        />
                      ) : null}
                    </ul>
                  </div>
                  <div className={cx('premium', { earned: r.premium.length && r.premium[0].state.earned, claimed: r.premium.length && r.premium[0].state.claimed, claimAllowed: r.premium.length && r.premium[0].state.claimAllowed })}>
                    <ul className='list inventory-items'>
                      {r.premium.length ? (
                        <Items
                          items={r.premium.map(r => {
                            return {
                              ...r,
                              state: null
                            };
                          })}
                        />
                      ) : null}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
          <div className='page'>
            <Button text={<i className='segoe-uniE974' />} action={this.handler_seasonPassNext} disabled={seasonPass.slice + seasonPass.itemsPerPage >= 100} />
          </div>
        </div>
        <div className='padder'>
          <div className='module'>
            <div className='content'>
              <div className='module-header'>
                <div className='sub-name'>{t('Ranks')}</div>
              </div>
              <div className='ranks'>
                {[2772425241, 2626549951, 2000925172].map(hash => {
                  return <Ranks key={hash} hash={hash} data={{ membershipType: member.membershipType, membershipId: member.membershipId, characterId: member.characterId, characters: member.data.profile.characters.data, characterProgressions }} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    groupMembers: state.groupMembers,
    viewport: state.viewport
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
  withTranslation()
)(Now);
