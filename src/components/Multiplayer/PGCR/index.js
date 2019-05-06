/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';
import { orderBy } from 'lodash';
import Moment from 'react-moment';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';

import './styles.css';

class Competitive extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: []
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

  togglePlayerHandler = (instanceId, characterId) => {
    if (this.props.viewport.width > 786) {
      return;
    }

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

  render() {
    const { t, member, viewport, data, limit } = this.props;
    const characterId = member.characterId;
    const characters = member.data.profile.characters.data;
    const characterIds = characters.map(c => c.characterId);

    // console.log(data);

    let expandPlayers = false;
    if (viewport.width <= 786) {
      expandPlayers = true;
    }

    let reports = [];

    let modes = {
      clash: [71, 72, 44],
      control: [73, 74, 43],
      ironBanner: [43, 44],
      supremacy: [31],
      survival: [37],
      countdown: [38],
      gambit: [63]
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
        string = 'Gambit';
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
          <div className='opponents-defeated'>{entry.values.opponentsDefeated.basic.value}</div>
          <div className='kills'>{entry.values.kills.basic.value}</div>
          <div className='efficiency'>{entry.values.efficiency.basic.displayValue}</div>
          <div className='ago'>
            <Moment fromNow>{pgcr.period}</Moment>
          </div>
        </div>
      );

      let entries = [];
      pgcr.entries.forEach(entry => {
        let dnf = entry.values.completed.basic.value === 1 ? false : true;
        let isExpandedPlayer = this.state.expanded.find(e => e.instanceId === pgcr.activityDetails.instanceId && e.expandedPlayers.includes(entry.characterId));

        entries.push({
          teamId: pgcr.teams && pgcr.teams.length ? entry.values.team.basic.value : null,
          element: (
            <li key={entry.characterId} className={cx('linked', { isExpandedPlayer })} onClick={() => this.togglePlayerHandler(pgcr.activityDetails.instanceId, entry.characterId)}>
              <div className='icon'>{!dnf ? <ObservedImage className={cx('image', 'emblem')} src={`https://www.bungie.net${entry.player.destinyUserInfo.iconPath}`} /> : null}</div>
              <div className={cx('displayName', { dnf: dnf })}>{entry.player.destinyUserInfo.displayName}</div>
              {!isExpandedPlayer ? (
                <>
                  <div className='opponents-defeated'>{entry.values.opponentsDefeated.basic.value}</div>
                  <div className='kills'>{entry.values.kills.basic.value}</div>
                  <div className='deaths'>{entry.values.deaths.basic.value}</div>
                  <div className='assists'>{entry.values.assists.basic.value}</div>
                  <div className='efficiency'>{entry.values.efficiency.basic.displayValue}</div>
                </>
              ) : (
                <>
                  <div className='pairs'>
                    <div className='key'>Opponents deposited</div>
                    <div className='value'>{entry.values.opponentsDefeated.basic.value}</div>
                    <div className='key'>Kills</div>
                    <div className='value'>{entry.values.kills.basic.value}</div>
                    <div className='key'>Deaths</div>
                    <div className='value'>{entry.values.deaths.basic.value}</div>
                    <div className='key'>Assists</div>
                    <div className='value'>{entry.values.assists.basic.value}</div>
                    <div className='key'>Efficiency</div>
                    <div className='value'>{entry.values.efficiency.basic.displayValue}</div>
                  </div>
                </>
              )}
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
            {pgcr.teams && pgcr.teams.length ? orderBy(pgcr.teams, [t => t.score.basic.value], ['desc']).map(t => {
              return (
                <ul key={t.teamId} className='list team'>
                  <li className={cx('team-head', (t.teamId === 17 ? 'Alpha' : 'Bravo').toLowerCase())}>
                    <div />
                    <div className='team name'>{t.teamId === 17 ? 'Alpha' : 'Bravo'} team</div>
                    <div className='opponents-defeated'>Opp. Def.</div>
                    <div className='kills'>Kills</div>
                    <div className='deaths'>Deaths</div>
                    <div className='assists'>Assists</div>
                    <div className='efficiency'>Efficiency</div>
                    <div className='team score'>{t.score.basic.displayValue}</div>
                  </li>
                  {entries.filter(e => e.teamId === t.teamId).map(e => e.element)}
                </ul>
              );
            }) : (
                <ul key={t.teamId} className='list team'>
                  <li className={cx('team-head')}>
                    <div />
                    <div className='team name'></div>
                    <div className='opponents-defeated'>Opp. Def.</div>
                    <div className='kills'>Kills</div>
                    <div className='deaths'>Deaths</div>
                    <div className='assists'>Assists</div>
                    <div className='efficiency'>Efficiency</div>
                    <div className='team score'></div>
                  </li>
                  {entries.map(e => e.element)}
                </ul>
              )
            }
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
)(Competitive);