/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';
import { orderBy, groupBy } from 'lodash';
import Moment from 'react-moment';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';
import * as bungie from '../../../utils/bungie';
import * as responseUtils from '../../../utils/responseUtils';

import './styles.css';

class PGCR extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: [],
      playerCache: []
    };
  }

  expandHandler = instanceId => {
    this.setState((prevState, props) => {
      let index = prevState.expanded.find(e => e.instanceId === instanceId);
      if (!index) {
        let expanded = prevState.expanded.concat({ instanceId, expandedPlayers: [] });
        return { expanded: expanded };
      }
    });

    this.updatePlayerCache(instanceId);
  };

  contractHandler = instanceId => {
    this.setState((prevState, props) => {
      let index = prevState.expanded.find(e => e.instanceId === instanceId);
      if (index) {
        let expanded = prevState.expanded.filter(e => e.instanceId !== instanceId);
        return { expanded: expanded };
      }
    });
  };

  updatePlayerCache = instanceId => {
    let pgcr = this.props.data.find(p => instanceId === p.activityDetails.instanceId);
    
    if (pgcr) {
      pgcr.entries.forEach(async e => {
        let points = await this.getGloryPoints(e.player.destinyUserInfo.membershipType, e.player.destinyUserInfo.membershipId);
        
        
        this.setState((state, props) => ({
          playerCache: state.playerCache.concat({ id: e.player.destinyUserInfo.membershipType + e.player.destinyUserInfo.membershipId, gloryPoints: points })
        }))
      });
    }
    
  }

  getGloryPoints = async (membershipType, membershipId) => {
    let response = await bungie.memberProfile(membershipType, membershipId, '202');

    let value = Object.values(response.characterProgressions.data)[0].progressions[2679551909].currentProgress;
    return value;
  }

  togglePlayerHandler = (instanceId, characterId) => {
    this.setState((prevState, props) => {
      let expandedIndex = prevState.expanded.findIndex(e => e.instanceId === instanceId);

      if (expandedIndex > -1) {
        let index = prevState.expanded[expandedIndex].expandedPlayers.indexOf(characterId);
        if (index > -1) {
          let expanded = prevState.expanded;
          let expandedPlayers = expanded[expandedIndex].expandedPlayers.filter(c => c !== characterId);
          expanded[expandedIndex].expandedPlayers = expandedPlayers;
          return { expanded: expanded };
        } else {
          let expanded = prevState.expanded;
          let expandedPlayers = expanded[expandedIndex].expandedPlayers.concat(characterId);
          expanded[expandedIndex].expandedPlayers = expandedPlayers;
          return { expanded: expanded };
        }
      }
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.expanded !== this.state.expanded) {
      this.props.RebindTooltips();
    }
  }

  render() {
    const { t, member, viewport, data, limit } = this.props;
    const characterId = member.characterId;
    const characters = member.data.profile.characters.data;
    const characterIds = characters.map(c => c.characterId);

    let reports = [];

    let modes = {
      clash: [71, 72, 44],
      control: [73, 74, 43],
      ironBanner: [43, 44],
      supremacy: [31],
      survival: [37],
      countdown: [38],
      gambit: [63, 75]
    };

    const modeAsString = mode => {
      let string;
      if (modes.clash.includes(mode)) {
        string = 'Clash';
      } else if (modes.control.includes(mode)) {
        string = 'Control';
      } else if (modes.supremacy.includes(mode)) {
        string = 'Supremacy';
      } else if (modes.survival.includes(mode)) {
        string = 'Survival';
      } else if (modes.countdown.includes(mode)) {
        string = 'Countdown';
      } else if (modes.gambit.includes(mode)) {
        //string = 'Gambit';
      } else {
        string = '???';
      }

      if (modes.ironBanner.includes(mode)) {
        string = 'Iron Banner ' + string;
      }

      return string;
    };

    data.forEach(pgcr => {
      let isExpanded = this.state.expanded.find(e => e.instanceId === pgcr.activityDetails.instanceId);

      let definitionMode = Object.values(manifest.DestinyActivityModeDefinition).find(d => d.modeType === pgcr.activityDetails.mode);

      let definitionCompetitive = manifest.DestinyActivityDefinition[2947109551];
      let definitionQuickplay = manifest.DestinyActivityDefinition[2274172949];

      let modeName = definitionMode.displayProperties.name;
      modeName = definitionMode.hash === 2096553452 ? 'Lockdown' : modeName;
      modeName = definitionMode.hash === 1164760504 ? 'All modes' : modeName;
      modeName = definitionMode.hash === 2486723318 ? 'Competitive' : modeName;
      modeName = definitionMode.hash === 3425110680 ? 'Quickplay' : modeName;
      modeName = modeName.replace(': ' + definitionCompetitive.displayProperties.name, '');
      modeName = modeName.replace(': ' + definitionQuickplay.displayProperties.name, '');

      let map = manifest.DestinyActivityDefinition[pgcr.activityDetails.referenceId];

      let entry = pgcr.entries.find(entry => characterIds.includes(entry.characterId));
      let victory = entry.standing === 0;
      let alphaVictory = pgcr.teams.find(t => t.teamId === 17 && t.standing.basic.value === 0);
      let bravoVictory = pgcr.teams.find(t => t.teamId === 18 && t.standing.basic.value === 0);

      let standingImage = victory ? `/static/images/extracts/ui/01E3-000004AC.PNG` : `/static/images/extracts/ui/01E3-000004B2.PNG`;
      if (modes.ironBanner.includes(pgcr.activityDetails.mode)) {
        standingImage = victory ? `/static/images/extracts/ui/0560-000006CB.PNG` : `/static/images/extracts/ui/0560-000006C8.PNG`;
      }
      if (modes.gambit.includes(pgcr.activityDetails.mode)) {
        standingImage = victory ? `/static/images/extracts/ui/02AF-00001F1E.PNG` : `/static/images/extracts/ui/02AF-00001F1A.PNG`;
      }

      let row;
      let detail;

      // #region Crucible (default)

      row = (
        <div className='basic'>
          <div className='mode'>{modeName}</div>
          <div className='map'>{map.displayProperties.name}</div>
          <div className='ago'>
            <Moment fromNow>{pgcr.period}</Moment>
          </div>
        </div>
      );

      let displayStatsDefault = [
        {
          key: 'opponentsDefeated',
          name: 'Opp. Def.',
          type: 'value'
        },
        {
          key: 'kills',
          name: 'Kills',
          type: 'value'
        },
        {
          key: 'deaths',
          name: 'Deaths',
          type: 'value'
        },
        {
          key: 'killsDeathsRatio',
          name: 'K/D',
          type: 'value',
          round: true
        },
        {
          key: 'gloryPoints',
          name: 'Glory points',
          type: 'value',
          async: true,
          hideInline: true
        },
        {
          key: 'assists',
          name: 'Assists',
          type: 'value',
          expanded: true
        },
        {
          key: 'weaponKillsSuper',
          name: 'Super kills',
          type: 'value',
          extended: true,
          expanded: true
        },
        {
          key: 'weaponKillsGrenade',
          name: 'Grenade kills',
          type: 'value',
          extended: true,
          expanded: true
        },
        {
          key: 'weaponKillsMelee',
          name: 'Melee kills',
          type: 'value',
          extended: true,
          expanded: true
        },
        {
          key: 'weaponKillsAbility',
          name: 'Ability kills',
          type: 'value',
          extended: true,
          expanded: true
        }
      ];

      let displayStatsGambit = [
        {
          key: 'mobKills',
          name: 'Mob Kills',
          type: 'value',
          extended: true
        },
        {
          key: 'motesDeposited',
          name: 'Motes Deposited',
          type: 'value',
          extended: true
        },
        {
          key: 'motesLost',
          name: 'Motes Lost',
          type: 'value',
          extended: true
        },
        {
          key: 'invasionKills',
          name: 'Invasion Kills',
          type: 'value',
          extended: true
        },
        {
          key: 'blockerKills',
          name: 'Blocker Kills',
          type: 'value',
          extended: true,
          hideInline: true
        },
        {
          key: 'invaderKills',
          name: 'Invader Kills',
          type: 'value',
          extended: true,
          hideInline: true
        },
        {
          key: 'smallBlockersSent',
          name: 'Small Blockers Sent',
          type: 'value',
          extended: true,
          expanded: true
        },
        {
          key: 'mediumBlockersSent',
          name: 'Medium Blockers Sent',
          type: 'value',
          extended: true,
          expanded: true
        },
        {
          key: 'largeBlockersSent',
          name: 'Large Blockers Sent',
          type: 'value',
          extended: true,
          expanded: true
        },
        {
          key: 'invasionKills',
          name: 'Invasion Kills',
          type: 'value',
          extended: true,
          expanded: true
        },
        {
          key: 'invasionDeaths',
          name: 'Invasion Deaths',
          type: 'value',
          extended: true,
          expanded: true
        },
        {
          key: 'motesDenied',
          name: 'Motes Denied',
          type: 'value',
          extended: true,
          expanded: true
        },
        {
          key: 'primevalHealing',
          name: 'Primeval Healing',
          type: 'displayValue',
          extended: true,
          expanded: true
        },
        {
          key: 'invaderKills',
          name: 'Invader Kills',
          type: 'value',
          extended: true,
          expanded: true
        },
        {
          key: 'invaderDeaths',
          name: 'Invader Deaths',
          type: 'value',
          extended: true,
          expanded: true
        },
        {
          key: 'primevalDamage',
          name: 'Primeval Damage',
          type: 'value',
          extended: true,
          expanded: true
        },
        {
          key: 'weaponKillsSuper',
          name: 'Super Kills',
          type: 'value',
          extended: true,
          expanded: true
        }
      ];

      let displayStats = modes.gambit.includes(pgcr.activityDetails.mode) ? displayStatsGambit : displayStatsDefault;

      let entries = [];
      pgcr.entries.forEach(entry => {
        let dnf = entry.values.completed.basic.value === 1 ? false : true;
        let isExpandedPlayer = this.state.expanded.find(e => e.instanceId === pgcr.activityDetails.instanceId && e.expandedPlayers.includes(entry.characterId));

        entries.push({
          teamId: pgcr.teams && pgcr.teams.length ? entry.values.team.basic.value : null,
          fireteamId: entry.values.fireteamId ? entry.values.fireteamId.basic.value : null,
          element: (
            <li key={entry.characterId} className={cx('linked', { isExpandedPlayer })} onClick={() => this.togglePlayerHandler(pgcr.activityDetails.instanceId, entry.characterId)}>
              <div className='inline'>
                <div className='icon'>{!dnf ? <ObservedImage className={cx('image', 'emblem')} src={`https://www.bungie.net${entry.player.destinyUserInfo.iconPath}`} /> : null}</div>
                <div className={cx('displayName', { dnf: dnf })}>{entry.player.destinyUserInfo.displayName}</div>
                {displayStats.map((s, i) => {
                  let value;
                  if (s.expanded) {
                    return null;
                  } else {
                    if (s.extended) {
                      value = s.round ? Number.parseFloat(entry.extended.values[s.key].basic[s.type]).toFixed(2) : entry.extended.values[s.key].basic[s.type];
                    } else if (s.async) {
                      if (s.key === 'gloryPoints') {
                        let playerCache = this.state.playerCache.find(c => c.id === (entry.player.destinyUserInfo.membershipType + entry.player.destinyUserInfo.membershipId));
                        value = playerCache ? playerCache.gloryPoints : '–';
                      }
                    } else {
                      value = s.round ? Number.parseFloat(entry.values[s.key].basic[s.type]).toFixed(2) : entry.values[s.key].basic[s.type];
                    }
                  }
                  return (
                    <div key={i} className={cx('stat', { hideInline: s.hideInline, extended: s.extended }, s.key)}>
                      {s.expanded ? <div className='name'>{s.name}</div> : null}
                      <div className='value'>{value}</div>
                    </div>
                  );
                })}
              </div>
              <div className='expanded'>
                {displayStats.map((s, i) => {
                  let value;
                  if (s.expanded) {
                    if (s.extended) {
                      value = s.round ? Number.parseFloat(entry.extended.values[s.key].basic[s.type]).toFixed(2) : entry.extended.values[s.key].basic[s.type].toLocaleString('en-us');
                    } else if (s.async) {
                      if (s.key === 'gloryPoints') {
                        let playerCache = this.state.playerCache.find(c => c.id === (entry.player.destinyUserInfo.membershipType + entry.player.destinyUserInfo.membershipId));
                        value = playerCache ? playerCache.gloryPoints : '–';
                      }
                    } else {
                      value = s.round ? Number.parseFloat(entry.values[s.key].basic[s.type]).toFixed(2) : entry.values[s.key].basic[s.type].toLocaleString('en-us');
                    }
                  } else {
                    return null;
                  }
                  return (
                    <div key={i} className={cx('stat', { hideInline: s.hideInline, expanded: s.extended }, s.key)}>
                      <div className='name'>{s.name}</div>
                      <div className='value'>{value}</div>
                    </div>
                  );
                })}
                {entry.extended.weapons && entry.extended.weapons.length ? (
                  <div className='stat expanded weapons'>
                    <div className='name'>Weapons used</div>
                    <div className='value'>
                      <ul>
                        {entry.extended.weapons.map((w, i) => {
                          let definitionItem = manifest.DestinyInventoryItemDefinition[w.referenceId];
                          let kills = w.values ? w.values.uniqueWeaponKills.basic.value : '0';
                          return (
                            <li key={i} className={cx('item', 'tooltip')} data-itemhash={definitionItem.hash}>
                              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionItem.displayProperties.icon}`} />
                              <div className='kills'>{kills}</div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            </li>
          )
        });
      });

      let alpha = pgcr.teams && pgcr.teams.length ? pgcr.teams.find(t => t.teamId === 17) : false;
      let bravo = pgcr.teams && pgcr.teams.length ? pgcr.teams.find(t => t.teamId === 18) : false;
      let score;
      if (pgcr.teams && pgcr.teams.length && alpha && bravo) {
        score = (
          <>
            <div className={cx('value', 'alpha', { victory: alphaVictory })}>{alpha.score.basic.displayValue}</div>
            <div className={cx('value', 'bravo', { victory: bravoVictory })}>{bravo.score.basic.displayValue}</div>
          </>
        );
      }

      detail = (
        <>
          <div className='head'>
            <ObservedImage className='image bg' src={`https://www.bungie.net${map.pgcrImage}`} />
            <div className='detail'>
              <div>
                <div className='mode'>{modeName}</div>
                <div className='map'>{map.displayProperties.name}</div>
              </div>
              <div>
                <div className='duration'>{entry.values.activityDurationSeconds.basic.displayValue}</div>
                <div className='ago'>
                  <Moment fromNow>{pgcr.period}</Moment>
                </div>
              </div>
            </div>
            <div className='standing'>
              <ObservedImage className='image' src={standingImage} />
              <div className='text'>{victory ? `VICTORY` : `DEFEAT`}</div>
            </div>
            <div className='score'>{score}</div>
          </div>
          <div className='entries'>
            {pgcr.teams && pgcr.teams.length ? (
              orderBy(pgcr.teams, [t => t.score.basic.value], ['desc']).map(t => {
                let fireteams = Object.values(groupBy(entries.filter(e => e.teamId === t.teamId), 'fireteamId'));

                return (
                  <ul key={t.teamId} className='team'>
                    <li className={cx('team-head', (t.teamId === 17 ? 'Alpha' : 'Bravo').toLowerCase())}>
                      <div />
                      <div className='team name'>{t.teamId === 17 ? 'Alpha' : 'Bravo'} team</div>
                      {displayStats.map((s, i) => {
                        if (s.expanded) {
                          return null;
                        }
                        return (
                          <div key={i} className={cx(s.name, { hideInline: s.hideInline })}>
                            {s.name}
                          </div>
                        );
                      })}
                      <div className='team score hideInline'>{t.score.basic.displayValue}</div>
                    </li>
                    {fireteams.map((f, i) => {              
                      return (
                        <li key={i}>
                          <ul className={cx('list', 'fireteam', { stacked: f.length > 1 })}>
                            {f.map(e => e.element)}
                          </ul>
                        </li>
                      )
                    })}
                  </ul>
                );
              })
            ) : (
              <ul key={t.teamId} className='team'>
                <li className={cx('team-head')}>
                  <div />
                  <div className='team name' />
                  {displayStats.map((s, i) => {
                    if (s.expanded) {
                      return null;
                    }
                    return (
                      <div key={i} className={cx(s.name, { hideInline: s.hideInline })}>
                        {s.name}
                      </div>
                    );
                  })}
                  <div className='team score hideInline'></div>
                </li>
                {entries.map(e => e.element)}
              </ul>
            )}
          </div>
          <div className='sticky-nav inline'>
            <div />
            <ul>
              <li>
                <a onClick={() => this.contractHandler(pgcr.activityDetails.instanceId)}>
                  <i className='uniF094' />
                  {t('Close')}
                </a>
              </li>
            </ul>
          </div>
        </>
      );

      // #endregion

      reports.push({
        element: (
          <li key={pgcr.activityDetails.instanceId} className={cx('linked', { isExpanded: isExpanded, victory: victory })} onClick={() => (!isExpanded ? this.expandHandler(pgcr.activityDetails.instanceId) : false)}>
            {!isExpanded ? row : detail}
          </li>
        )
      });
    });

    return <ul className='list reports'>{reports.slice(0, limit).map(r => r.element)}</ul>;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    viewport: state.viewport
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(PGCR);
