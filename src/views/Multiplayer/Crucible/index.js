import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import * as bungie from '../../../utils/bungie';

import manifest from '../../../utils/manifest';
import ProgressBar from '../../../components/UI/ProgressBar';
import Spinner from '../../../components/UI/Spinner';
import Mode from '../../../components/Multiplayer/Mode';
import Matches from '../../../components/Multiplayer/Matches';

class Crucible extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  crucible = {
    all: {
      modes: [5, 69, 70],
      stats: {
        allPvP: {
          mode: 5
        },
        pvpCompetitive: {
          mode: 69
        },
        pvpQuickplay: {
          mode: 70
        }
      }
    },
    competitive: {
      modes: [72, 74, 37, 38],
      stats: {
        clashCompetitive: {
          mode: 72
        },
        controlCompetitive: {
          mode: 74
        },
        countdown: {
          mode: 38
        },
        survival: {
          mode: 37
        }
      }
    },
    quickplay: {
      modes: [71, 73, 43, 48, 60, 65],
      stats: {
        clashQuickplay: {
          mode: 71
        },
        controlQuickplay: {
          mode: 73
        },
        ironBannerControl: {
          mode: 43
        },
        rumble: {
          mode: 48
        },
        lockdown: {
          mode: 60
        },
        breakthrough: {
          mode: 65
        }
      }
    }
  };

  fetch = async () => {
    const { member } = this.props;

    this.setState(p => {
      p.loading = true;
      return p;
    });

    let [stats_allPvP, stats_competitive, stats_quickplay] = await Promise.all([
      bungie.getHistoricalStats(member.membershipType, member.membershipId, member.characterId, '1', this.crucible.all.modes, '0'),
      bungie.getHistoricalStats(member.membershipType, member.membershipId, member.characterId, '1', this.crucible.competitive.modes, '0'),
      bungie.getHistoricalStats(member.membershipType, member.membershipId, member.characterId, '1', this.crucible.quickplay.modes, '0')
    ]);

    for (const mode in stats_allPvP) {
      if (stats_allPvP.hasOwnProperty(mode)) {
        if (!stats_allPvP[mode].allTime) {
          return;
        }
        Object.entries(stats_allPvP[mode].allTime).forEach(([key, value]) => {
          this.crucible.all.stats[mode][key] = value;
        });
      }
    }

    for (const mode in stats_competitive) {
      if (stats_competitive.hasOwnProperty(mode)) {
        if (!stats_competitive[mode].allTime) {
          return;
        }
        Object.entries(stats_competitive[mode].allTime).forEach(([key, value]) => {
          this.crucible.competitive.stats[mode][key] = value;
        });
      }
    }

    for (const mode in stats_quickplay) {
      if (stats_quickplay.hasOwnProperty(mode)) {
        if (!stats_quickplay[mode].allTime) {
          return;
        }
        Object.entries(stats_quickplay[mode].allTime).forEach(([key, value]) => {
          this.crucible.quickplay.stats[mode][key] = value;
        });
      }
    }

    this.setState(p => {
      p.loading = false;
      return p;
    });

    return true;
  };

  componentDidMount() {
    this.refreshData();
    this.startInterval();
  }

  refreshData = async () => {
    if (!this.state.loading) {
      //console.log('refresh start');
      await this.fetch();
      //console.log('refresh end');
    } else {
      //console.log('refresh skipped');
    }
  };

  startInterval() {
    this.refreshDataInterval = window.setInterval(this.refreshData, 30000);
  }

  clearInterval() {
    window.clearInterval(this.refreshDataInterval);
  }

  componentWillUnmount() {
    this.clearInterval();
  }

  render() {
    const { t, member } = this.props;
    const characterId = member.characterId;

    const characterProgressions = member.data.profile.characterProgressions.data;
    const profileRecords = member.data.profile.profileRecords.data.records;

    const valor = {
      defs: {
        rank: manifest.DestinyProgressionDefinition[3882308435],
        activity: manifest.DestinyActivityDefinition[2274172949]
      },
      progression: {
        data: characterProgressions[characterId].progressions[3882308435],
        total: 0,
        resets: profileRecords[559943871] ? profileRecords[559943871].objectives[0].progress : 0
      }
    };

    valor.progression.total = Object.keys(valor.defs.rank.steps).reduce((sum, key) => {
      return sum + valor.defs.rank.steps[key].progressTotal;
    }, 0);

    const glory = {
      defs: {
        rank: manifest.DestinyProgressionDefinition[2679551909],
        activity: manifest.DestinyActivityDefinition[2947109551]
      },
      progression: {
        data: characterProgressions[characterId].progressions[2679551909],
        total: 0
      }
    };

    glory.progression.total = Object.keys(glory.defs.rank.steps).reduce((sum, key) => {
      return sum + glory.defs.rank.steps[key].progressTotal;
    }, 0);

    return (
      <div className={cx('view', 'crucible')} id='multiplayer'>
        <div className='module'>
          <div>
            <div className='content career'>
              <div className='sub-header'>
                <div>Crucible Career</div>
              </div>
              <h4>Glory modes</h4>
              <div className='highlight'>
              <div className='value'>{this.crucible.all.stats.pvpCompetitive.secondsPlayed ? Math.floor(this.crucible.all.stats.pvpCompetitive.secondsPlayed.basic.value / 60 / 60) : 0} hours</div>
                <div className='name'>Time played</div>
              </div>
              <div className='highlight'>
                <div className='value progress competitive'>
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
                  <ProgressBar
                    objectiveDefinition={{
                      progressDescription: `Next rank: ${glory.defs.rank.currentProgress === glory.progression.total && glory.progression.data.stepIndex === glory.defs.rank.steps.length ? valor.defs.rank.steps[0].stepName : glory.defs.rank.steps[(glory.progression.data.stepIndex + 1) % glory.defs.rank.steps.length].stepName}`,
                      completionValue: glory.progression.data.nextLevelAt
                    }}
                    playerProgress={{
                      progress: glory.progression.data.progressToNextLevel,
                      objectiveHash: 'valor'
                    }}
                    hideCheck
                    chunky
                  />
                </div>
                <div className='name'>Progress</div>
              </div>
              <h4>Valor modes</h4>
              <div className='highlight'>
                <div className='value'>{this.crucible.all.stats.pvpQuickplay.secondsPlayed ? Math.floor(this.crucible.all.stats.pvpQuickplay.secondsPlayed.basic.value / 60 / 60) : 0} hours</div>
                <div className='name'>Time played</div>
              </div>
              <div className='highlight'>
                <div className='value progress quickplay'>
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
                </div>
                <div className='name'>Progress</div>
              </div>
            </div>
          </div>
          <div>
            <div className='content'>
              <div className='sub-header'>
                <div>Summative modes</div>
              </div>
              {Object.values(this.crucible.all.stats.allPvP).length > 1 ? (
                <ul className='list modes'>
                  {Object.values(this.crucible.all.stats).map(m => {
                    let paramsMode = this.props.mode ? parseInt(this.props.mode) : 5;
                    let isActive = (match, location) => {
                      if (paramsMode === m.mode) {
                        return true;
                      } else {
                        return false;
                      }
                    };

                    return <Mode key={m.mode} stats={m} isActive={isActive} />;
                  })}
                </ul>
              ) : (
                <Spinner mini />
              )}
            </div>
            <div className='content'>
              <div className='sub-header'>
                <div>Glory modes</div>
              </div>
              {Object.values(this.crucible.all.stats.allPvP).length > 1 ? (
                <ul className='list modes'>
                  {Object.values(this.crucible.competitive.stats).map(m => {
                    let paramsMode = this.props.mode ? parseInt(this.props.mode) : 5;
                    let isActive = (match, location) => {
                      if (paramsMode === m.mode) {
                        return true;
                      } else {
                        return false;
                      }
                    };

                    return <Mode key={m.mode} stats={m} isActive={isActive} />;
                  })}
                </ul>
              ) : (
                <Spinner mini />
              )}
            </div>
            <div className='content'>
              <div className='sub-header'>
                <div>Valor modes</div>
              </div>
              {Object.values(this.crucible.all.stats.allPvP).length > 1 ? (
                <ul className='list modes'>
                  {Object.values(this.crucible.quickplay.stats).map(m => {
                    let paramsMode = this.props.mode ? parseInt(this.props.mode) : 5;
                    let isActive = (match, location) => {
                      if (paramsMode === m.mode) {
                        return true;
                      } else {
                        return false;
                      }
                    };

                    return <Mode key={m.mode} stats={m} isActive={isActive} />;
                  })}
                </ul>
              ) : (
                <Spinner mini />
              )}
            </div>
          </div>
        </div>
        <div className='module' id='matches'>
          <div className='content'>
            <div className='sub-header'>
              <div>Recent matches</div>
            </div>
            <Matches modes={[this.props.mode ? parseInt(this.props.mode) : 5]} characterId={member.characterId} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    PGCRcache: state.PGCRcache
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Crucible);
