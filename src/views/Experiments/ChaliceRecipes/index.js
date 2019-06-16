import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { flattenDepth } from 'lodash';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../../components/ObservedImage';
import Items from '../../../components/Items';

import combos from './combos';

import './styles.css';

class ChaliceRecipes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      slots: {
        slot1: {
          panelOpen: false,
          activePlug: false
        },
        slot2: {
          panelOpen: false,
          activePlug: false
        },
        slot3: {
          panelOpen: false,
          activePlug: false
        },
        slot4: {
          panelOpen: false,
          activePlug: false
        }
      }
    };

    this.runes = {
      slot1: [
        2149082453, // Rune of Joy
        2149082452, // Rune of the Beast
        2149082455, // Rune of Jubilation
        2149082448, // Rune of Ambition
        2149082449, // Rune of Gluttony
        2149082454, // Rune of Cunning
        2149082451, // Rune of War
        2149082461, // Rune of Pride
        2149082450, // Rune of Desire
        4201087756, // Rune of Excess
        4201087757, // Rune of Wealth
        2149082460 // Rune of Pleasure
      ],
      slot2: [
        3216785208, // Rune of Joy
        3216785209, // Rune of the Beast
        3216785210, // Rune of Jubilation
        3216785213, // Rune of Ambition
        3216785212, // Rune of Gluttony
        3216785211, // Rune of Cunning
        3216785214, // Rune of War
        3216785200, // Rune of Pride
        3216785215, // Rune of Desire
        240617099, // Rune of Excess
        240617098, // Rune of Wealth
        3216785201 // Rune of Pleasure
      ],
      slot3: [
        3019704439, // Rune of Joy
        3019704438, // Rune of the Beast
        3019704437, // Rune of Jubilation
        3019704434, // Rune of Ambition
        3019704435, // Rune of Gluttony
        3019704436, // Rune of Cunning
        3019704433, // Rune of War
        3019704447, // Rune of Pride
        3019704432, // Rune of Desire
        3444855282, // Rune of Excess
        3444855283, // Rune of Wealth
        3019704446 // Rune of Pleasure
      ]
    };
  }

  togglePanel = slot => {
    this.setState((prevState, props) => {
      prevState.slots[slot].panelOpen = !prevState.slots[slot].panelOpen ? true : false;
      return prevState;
    });

    this.props.rebindTooltips();
  };

  itemClickHandler = (e, item) => {
    console.log(item);

    if (item.slot && item.slot === 'slot4' && item.runes) {
      this.setState((prevState, props) => {
        prevState.slots[item.slot].activePlug = item.itemHash;
        prevState.slots['slot1'].activePlug = item.runes[0][0];
        prevState.slots['slot2'].activePlug = item.runes[1][0];
        prevState.slots['slot3'].activePlug = item.runes[2][0];
        prevState.slots[item.slot].panelOpen = false;
        return prevState;
      });
    } else {
      this.setState((prevState, props) => {
        if (item.itemHash) {
          prevState.slots[item.slot].activePlug = item.itemHash;
        }
        prevState.slots[item.slot].panelOpen = false;
        return prevState;
      });
    }

    this.props.rebindTooltips();
  };

  componentDidMount() {
    window.scrollTo(0, 0);

    this.props.rebindTooltips();
  }

  render() {
    console.log(this.state);

    return (
      <div className='view' id='chalice-recipes'>
        <div className='frame'>
          <div className='flair'>
            <ObservedImage className='image padding corner' src='/static/images/extracts/ui/01E3-00000700.PNG' />
            <ObservedImage className='image leviathan' src='/static/images/extracts/ui/01E3-00000702.PNG' />
            <ObservedImage className='image ring-outer' src='/static/images/extracts/ui/01E3-00000777.PNG' />
            <ObservedImage className='image ring-inner' src='/static/images/extracts/ui/01E3-00000709.PNG' />
          </div>
          <div className='ui'>
            <ObservedImage className='image chalice' src='/static/images/extracts/ui/01A3-00006414.PNG' />
            <div className='slots'>
              {Object.entries(this.state.slots).map(([key, value]) => {
                let activePlug;
                if (this.state.slots[key].activePlug) {
                  let definitionActivePlug = manifest.DestinyInventoryItemDefinition[this.state.slots[key].activePlug];

                  activePlug = (
                    <li
                      className={cx({
                        tooltip: true,
                        linked: true
                      })}
                      data-hash={this.state.slots[key].activePlug}
                      onClick={e => {
                        this.togglePanel(key);
                      }}
                    >
                      <div className='icon'>
                        <ObservedImage className='image' src={definitionActivePlug.displayProperties.localIcon ? `${definitionActivePlug.displayProperties.icon}` : `https://www.bungie.net${definitionActivePlug.displayProperties.icon}`} />
                      </div>
                    </li>
                  );
                } else {
                  let definitionActivePlug = manifest.DestinySandboxPerkDefinition[1530757635];

                  activePlug = (
                    <li
                      className={cx({
                        tooltip: false,
                        linked: true
                      })}
                      onClick={e => {
                        this.togglePanel(key);
                      }}
                    >
                      <div className='icon'>
                        <ObservedImage className='image' src={`https://www.bungie.net${definitionActivePlug.displayProperties.icon}`} />
                      </div>
                    </li>
                  );
                }

                return (
                  <div key={key} className={cx(key)}>
                    <div className='slot-inner'>
                      <div className='active-plug'>
                        <ul className='list inventory-items'>{activePlug}</ul>
                      </div>
                      {this.state.slots[key].panelOpen ? (
                        key === 'slot4' ? (
                          <div className='overlay'>
                            <ul className='list inventory-items'>
                              <Items
                                items={flattenDepth(
                                  combos
                                    .map(c => {
                                      if (c.items.length) {
                                        console.log(
                                          c.items.map(h => ({
                                            itemHash: h,
                                            slot: key,
                                            runes: c.runes
                                          }))
                                        );
                                        return c.items.map(h => ({
                                          itemHash: h,
                                          slot: key,
                                          runes: c.runes
                                        }));
                                      } else {
                                        return false;
                                      }
                                    })
                                    .filter(f => f),
                                  1
                                )}
                                action={this.itemClickHandler}
                              />
                            </ul>
                          </div>
                        ) : (
                          <div className='overlay'>
                            <ul className='list inventory-items'>
                              <Items
                                items={this.runes[key].map(s => {
                                  return {
                                    itemHash: s,
                                    slot: key
                                  };
                                })}
                                action={this.itemClickHandler}
                              />
                            </ul>
                          </div>
                        )
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {};
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
)(ChaliceRecipes);
