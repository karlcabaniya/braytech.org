import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import * as utils from '../../utils/destinyUtils';
import * as bungie from '../../utils/bungie';
import Spinner from '../../components/UI/Spinner';
import Ranks from '../../components/Ranks';
import Roster from '../../components/Roster';

import { ReactComponent as CrucibleIconMayhem } from './icons/mayhem.svg';
import { ReactComponent as CrucibleIconDoubles } from './icons/doubles.svg';
import { ReactComponent as CrucibleIconBreakthrough } from './icons/breakthrough.svg';

import './styles.css';

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

    const crucibleRotators = [
      3753505781, // Iron Banner
      2303927902, // Clash
      3780095688, // Supremacy
      1219083526, // Team Scorched
      4209226441, // Hardware
      952904835, // Momentum Control
      1102379070, // Mayhem
      3011324617, // Breakthrough
      3646079260, // Countdown
      1457072306, // Showdown
      3239164160, // Lockdown
      740422335, // Survival
      920826395 // Doubles
    ];

    const crucibleModeIcons = {
      3753505781: <CrucibleIconDoubles />,
      2303927902: <CrucibleIconDoubles />,
      3780095688: <CrucibleIconDoubles />,
      1219083526: <CrucibleIconDoubles />,
      4209226441: <CrucibleIconDoubles />,
      952904835: <CrucibleIconDoubles />,
      1102379070: <CrucibleIconMayhem />,
      3011324617: <CrucibleIconBreakthrough />,
      3646079260: <CrucibleIconDoubles />,
      1457072306: <CrucibleIconDoubles />,
      3239164160: <CrucibleIconDoubles />,
      740422335: <CrucibleIconDoubles />,
      920826395: <CrucibleIconDoubles />
    };

    const featuredCrucibleModes = {
      activities: characterActivities[member.characterId].availableActivities.filter(a => {
        if (!a.activityHash) return false;
        const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

        if (definitionActivity && definitionActivity.activityModeTypes && definitionActivity.activityModeTypes.includes(5) && crucibleRotators.includes(definitionActivity.hash)) {
          a.displayProperties = definitionActivity.displayProperties;
          a.icon = crucibleModeIcons[definitionActivity.hash] || null;
          return true;
        }

        return false;
      }),
      displayProperties: {
        name: manifest.DestinyPlaceDefinition[4088006058].displayProperties.name,
        description: (
          <p>
            <em>{t('The following Crucible modes are currently in rotation and available for you to test your vigour in against other Guardians.')}</em>
          </p>
        )
      },
      headings: {
        rotator: t('Rotator playlists')
      }
    };

    // console.log(featuredCrucibleModes);

    const knownStoryActivities = [129918239, 271962655, 589157009, 1023966646, 1070049743, 1132291813, 1259766043, 1313648352, 1513386090, 1534123682, 1602328239, 1872813880, 1882259272, 1906514856, 2000185095, 2146977720, 2568845238, 2660895412, 2772894447, 2776154899, 3008658049, 3205547455, 3271773240, 4009655461, 4234327344, 4237009519, 4244464899];
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

    const knownNightfalls = {
      272852450: {
        triumphs: [1039797865, 3013611925],
        items: [],
        collectibles: [2466440635, 1766893928],
        ordealHashes: []
      },
      522318687: {
        triumphs: [165166474, 1871570556],
        items: [],
        collectibles: [1534387877, 1766893929],
        ordealHashes: [966580527, 1193451437, 2357524344, 3392133546, 4196546910]
      },
      629542775: {
        triumphs: [],
        items: [],
        collectibles: [],
        ordealHashes: []
      },
      936308438: {
        triumphs: [2692332187, 1398454187],
        items: [],
        collectibles: [2448009818, 3490589931],
        ordealHashes: [102545131, 1272746497, 1822476598, 4044386747]
      },
      1034003646: {
        triumphs: [599303591, 3399168111],
        items: [],
        collectibles: [1186314105, 465974149],
        ordealHashes: []
      },
      1282886582: {
        triumphs: [1526865549, 2140068897],
        items: [],
        collectibles: [3036030067, 3490589927],
        ordealHashes: []
      },
      1391780798: {
        triumphs: [3042714868, 4156350130],
        items: [],
        collectibles: [],
        ordealHashes: []
      },
      3034843176: {
        triumphs: [3951275509, 3641166665],
        items: [],
        collectibles: [1099984904, 1410290331],
        ordealHashes: []
      },
      3108813009: {
        triumphs: [2836924866, 1469598452],
        items: [],
        collectibles: [1279318101, 2263264048],
        ordealHashes: []
      },
      3145298904: {
        triumphs: [3340846443, 4267516859],
        items: [],
        collectibles: [3036030066, 3490589921],
        ordealHashes: []
      },
      3280234344: {
        triumphs: [2099501667, 1442950315],
        items: [],
        collectibles: [1333654061, 3490589926],
        ordealHashes: [997759433, 1114928259, 2021103427, 3815447166]
      },
      3289589202: {
        triumphs: [1060780635, 1142177491],
        items: [],
        collectibles: [1152758802, 3490589930],
        ordealHashes: [282531137, 1198226683, 2380555126, 3407296811]
      },
      3372160277: {
        triumphs: [1329556468, 413743786],
        items: [],
        collectibles: [1602518767, 3896331530],
        ordealHashes: []
      },
      3701132453: {
        triumphs: [3450793480, 3847579126],
        items: [],
        collectibles: [1074861258, 3314387486],
        ordealHashes: []
      },
      3718330161: {
        triumphs: [2282894388, 3636866482],
        items: [],
        collectibles: [1279318110, 3490589924],
        ordealHashes: []
      },
      3856436847: {
        triumphs: [],
        items: [],
        collectibles: [],
        ordealHashes: [694558778, 1940967975, 2359276231]
      },
      4259769141: {
        triumphs: [3973165904, 1498229894],
        items: [],
        collectibles: [1718922261, 3490589925],
        ordealHashes: [1173782160, 1244305605, 1390900084, 3094633658]
      }
    };
    const weeklyNightfallStrikeActivities = characterActivities[member.characterId].availableActivities.filter(a => {
      if (!a.activityHash) return false;

      const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

      if (definitionActivity && definitionActivity.activityModeTypes && definitionActivity.activityModeTypes.includes(46) && !definitionActivity.guidedGame && definitionActivity.modifiers && definitionActivity.modifiers.length > 2) return true;

      return false;
    });
    const weeklyNightfallStrikes = {
      activities: {
        ordeal: Object.keys(knownNightfalls)
          .filter(k => knownNightfalls[k].ordealHashes.find(o => weeklyNightfallStrikeActivities.find(w => w.activityHash === o)))
          .map(h => ({ activityHash: h })),
        scored: weeklyNightfallStrikeActivities.filter(w => !Object.keys(knownNightfalls).find(k => knownNightfalls[k].ordealHashes.find(o => o === w.activityHash)))
      },
      displayProperties: {
        name: manifest.DestinyActivityDefinition[492869759].displayProperties.name
      },
      headings: {
        ordeal: t('Ordeal nightfall'),
        scored: t('Scored nightfalls')
      }
    };

    // console.log(weeklyNightfallStrikeActivities, weeklyNightfallStrikeActivities.map(a => manifest.DestinyActivityDefinition[a.activityHash]));

    // console.log(weeklyNightfallStrikes);

    // console.log(profileTransitoryData)

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
          <div className='content highlight crucible'>
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
          </div>
          <div className='content highlight'>
            <div className='module-header'>
              <div className='sub-name'>{weeklyNightfallStrikes.displayProperties.name}</div>
            </div>
            {weeklyNightfallStrikes.activities.scored.length ? (
              <>
                <h4>{weeklyNightfallStrikes.headings.ordeal}</h4>
                <ul className='list activities'>
                  {orderBy(
                    weeklyNightfallStrikes.activities.ordeal.map((a, i) => {
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
        <div className='padder'>
          {/* <div className='module'>
            <div className='content'>
              <div className='module-header'>
                <div className='sub-name'>{t('Fireteam')}</div>
              </div>
              <h4>{t('Activity')}</h4>
              <h4>{t('Members')}</h4>
            </div>
          </div> */}
          {/* {group ? (
            <div className='module'>
              <div className='content'>
                <div className='module-header'>
                  <div className='sub-name'>{t('Clan')}</div>
                </div>
              </div>
            </div>
          ) : null} */}
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
          {/* {group ? (
            <div className='module'>
              <div className='content clan-roster'>
                <div className='module-header'>
                  <div className='sub-name'>{t('Clan')}</div>
                </div>
                <h4>
                  <span>{t('Roster')}</span>
                  <span>{t('{{number}} online', { number: groupMembers.members.filter(member => member.isOnline).length })}</span>
                </h4>
                <div className='refresh'>{groupMembers.loading && groupMembers.members.length !== 0 ? <Spinner mini /> : null}</div>
                {groupMembers.loading && groupMembers.members.length === 0 ? <Spinner /> : <Roster mini showOnline />}
              </div>
            </div>
          ) : null} */}
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
  withTranslation()
)(SitRep);
