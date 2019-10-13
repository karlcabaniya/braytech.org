import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import Flashpoint from './Modules/Flashpoint';
import HeroicStoryMissions from './Modules/HeroicStoryMissions';
import VanguardStrikes from './Modules/VanguardStrikes';
import Ranks from './Modules/Ranks';
import SeasonPass from './Modules/SeasonPass';

import './styles.css';

class Now extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    // const { t, member, groupMembers, viewport } = this.props;
    // const milestones = member.data.milestones;
    // const group = member.data.groups.results.length > 0 ? member.data.groups.results[0].group : false;
    // const characters = member.data.profile.characters.data;
    // const character = characters.find(c => c.characterId === member.characterId);
    // const characterProgressions = member.data.profile.characterProgressions.data;
    // const characterActivities = member.data.profile.characterActivities.data;
    // const profileTransitoryData = member.data.profile.profileTransitoryData.data;

    const modules = [
      {
        className: ['head'],
        cols: [
          {
            className: [],
            mods: [
              {
                className: [],
                component: <Flashpoint />
              }
            ]
          },
          {
            className: [],
            mods: [
              {
                className: [],
                component: <HeroicStoryMissions />
              }
            ]
          },
          {
            className: [],
            mods: [
              {
                className: [],
                component: <VanguardStrikes />
              }
            ]
          }
        ]
      },
      {
        className: ['season-pass'],
        component: <SeasonPass />
      },
      {
        className: [],
        cols: [
          {
            className: [],
            mods: [
              {
                className: [],
                component: <Ranks />
              }
            ]
          }
        ]
      }
    ];

    // const wellRestedState = utils.isWellRested(characterProgressions[character.characterId]);

    // console.log(wellRestedState)

    //console.log(Object.values(characterProgressions[member.characterId].milestones).map(m => ({...m, def: manifest.DestinyMilestoneDefinition[m.milestoneHash]})))

    // characterActivities[member.characterId].availableActivities.forEach(a => {
    //   console.log(manifest.DestinyActivityDefinition[a.activityHash])
    // });

    // flashpoint

    // console.log(definitionMilestoneFLashpoint, milestoneFlashpointQuestItem, definitionFlashpointVendor)

    // console.log(featuredCrucibleModes);

    // orderBy(Object.values(manifest.DestinyActivityDefinition).map(a => {
    //   if (a.activityModeTypes && a.activityModeTypes.length && a.activityModeTypes.includes(46) && !a.guidedGame && a.modifiers.length > 2) return a;
    //   return false
    // }).filter(a => a),
    // [m => m.displayProperties.name],
    // ['asc']).forEach(a => {
    //   console.log(a.displayProperties.name, a.hash, JSON.stringify(a.activityModeTypes))
    // })

    // console.log(weeklyNightfallStrikeActivities, weeklyNightfallStrikeActivities.map(a => manifest.DestinyActivityDefinition[a.activityHash]));

    // console.log(weeklyNightfallStrikes);

    // console.log(profileTransitoryData)

    // console.log(characterProgressions[member.characterId], characterProgressions[member.characterId].progressions[1628407317]);

    // characterProgressions[member.characterId].progressions[1628407317].rewardItemStates.forEach((i, k) => {
    //   if (enums.enumerateProgressionRewardItemState(i).earned) console.log(manifest.DestinyInventoryItemDefinition[manifest.DestinyProgressionDefinition[1628407317].rewardItems[k].itemHash].displayProperties.name);
    // });

    // console.log(characterActivities[member.characterId].availableActivities.map(a => ({name: manifest.DestinyActivityDefinition[a.activityHash] && manifest.DestinyActivityDefinition[a.activityHash].displayProperties && manifest.DestinyActivityDefinition[a.activityHash].displayProperties.name, ...a, def: manifest.DestinyActivityDefinition[a.activityHash]})))

    // characterActivities[member.characterId].availableActivities.filter(a => {
    //   if (a.activityModeTypes && a.activityModeTypes.length && a.activityModeTypes.includes(46) && !a.guidedGame && a.modifiers.length > 2) return a;
    //   return false
    // }).forEach(a => {
    //   console.log(a.displayProperties.name, a.hash, JSON.stringify(a.activityModeTypes))
    // })

    return (
      <div className='view' id='sit-rep'>
        {modules.map((grp, g) => {
          if (grp.component) {
            return (
              <div key={g} className={cx('group', ...grp.className)}>
                {grp.component}
              </div>
            );
          } else {
            return (
              <div key={g} className={cx('group', ...grp.className)}>
                {grp.mods
                  ? grp.mods.map((mod, m) => {
                      return (
                        <div key={m} className={cx('module', ...mod.className)}>
                          {mod.component}
                        </div>
                      );
                    })
                  : grp.cols.map((col, c) => {
                      return (
                        <div key={c} className={cx('column', ...col.className)}>
                          {col.mods.map((mod, m) => {
                            return (
                              <div key={m} className={cx('module', ...mod.className)}>
                                {mod.component}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
              </div>
            );
          }
        })}
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
