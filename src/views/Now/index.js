import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';

import Flashpoint from './Modules/Flashpoint';
import HeroicStoryMissions from './Modules/HeroicStoryMissions';
import VanguardStrikes from './Modules/VanguardStrikes';
import Ranks from './Modules/Ranks';
import SeasonPass from './Modules/SeasonPass';
import SeasonalArtifact from './Modules/SeasonalArtifact';

import './styles.css';

class Now extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.props.rebindTooltips();
  }

  render() {
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
        components: [<SeasonPass />]
      },
      {
        className: [],
        cols: [
          // {
          //   className: [],
          //   mods: [
          //     {
          //       className: ['seasonal-artifact'],
          //       component: <SeasonalArtifact />
          //     }
          //   ]
          // },
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

    return (
      <div className='view' id='now'>
        {modules.map((grp, g) => {
          if (grp.components) {
            return (
              <div key={g} className={cx('group', ...grp.className)}>
                {grp.components}
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

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(
  connect(
    null,
    mapDispatchToProps
  )
)(Now);
