import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { flattenDepth, groupBy, orderBy } from 'lodash';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import ObservedImage from '../../components/ObservedImage';
import Button from '../../components/UI/Button';

import Items from './Items';
import Rewards from './Rewards';

import combos from '../../data/chaliceData';

import './styles.css';

class ChaliceRecipes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      slots: {
        slot1: false,
        slot2: false,
        slot3: false
      },
      slotsPanelOpen: false,
      matches: []
    };

    this.scrollToChalice = React.createRef();

    this.chalice = manifest.DestinyInventoryItemDefinition[1115550924];
    this.chalice.slots = Object.entries(this.chalice.sockets.socketEntries)
      .map(([key, value]) => {
        let indexes = this.chalice.sockets.socketCategories.find(c => c.socketCategoryHash === 3483578942).socketIndexes;
        if (indexes.includes(parseInt(key, 10))) {
          return value;
        } else {
          return false;
        }
      })
      .filter(f => f);

    this.runes = {
      slot1: ['braytech_remove_rune', ...this.chalice.slots[0].reusablePlugItems.map(p => p.plugItemHash)],
      slot2: ['braytech_remove_rune', ...this.chalice.slots[1].reusablePlugItems.map(p => p.plugItemHash)],
      slot3: ['braytech_remove_rune', ...this.chalice.slots[2].reusablePlugItems.map(p => p.plugItemHash)]
    };
    this.runes.purple = [...this.runes.slot1, ...this.runes.slot2, ...this.runes.slot3].filter(r => {
      let definitionPlug = manifest.DestinyInventoryItemDefinition[r];
      let identities = ['penumbra.runes.legendary.rune0', 'penumbra.runes.legendary.rune1', 'penumbra.runes.legendary.rune2'];

      if (definitionPlug && identities.includes(definitionPlug.plug.plugCategoryIdentifier)) {
        return true;
      } else {
        return false;
      }
    });
    this.runes.red = [...this.runes.slot1, ...this.runes.slot2, ...this.runes.slot3].filter(r => {
      let definitionPlug = manifest.DestinyInventoryItemDefinition[r];
      let identities = ['penumbra.runes.legendary.rune3', 'penumbra.runes.legendary.rune4', 'penumbra.runes.legendary.rune5'];

      if (definitionPlug && identities.includes(definitionPlug.plug.plugCategoryIdentifier)) {
        return true;
      } else {
        return false;
      }
    });
    this.runes.green = [...this.runes.slot1, ...this.runes.slot2, ...this.runes.slot3].filter(r => {
      let definitionPlug = manifest.DestinyInventoryItemDefinition[r];
      let identities = ['penumbra.runes.legendary.rune6', 'penumbra.runes.legendary.rune7', 'penumbra.runes.legendary.rune8'];

      if (definitionPlug && identities.includes(definitionPlug.plug.plugCategoryIdentifier)) {
        return true;
      } else {
        return false;
      }
    });
    this.runes.blue = [...this.runes.slot1, ...this.runes.slot2, ...this.runes.slot3].filter(r => {
      let definitionPlug = manifest.DestinyInventoryItemDefinition[r];
      let identities = ['penumbra.runes.legendary.rune9', 'penumbra.runes.legendary.rune10', 'penumbra.runes.legendary.rune11'];

      if (definitionPlug && identities.includes(definitionPlug.plug.plugCategoryIdentifier)) {
        return true;
      } else {
        return false;
      }
    });

    this.combos = combos.slice();
    this.combosAvailable = this.combos.filter(c => {
      if (c.combo[0].length === 1 && (c.combo[1].length === 1 && ['braytech_purple_rune', 'braytech_red_rune', 'braytech_green_rune', 'braytech_blue_rune'].includes(c.combo[1][0])) && c.combo[2].length === 0) {
        return true;
      } else {
        return false;
      }
    });
  }

  toggleSlotsPanelHandler = slot => {
    if (this.state.slotsPanelOpen === slot) {
      this.setState((prevState, props) => {
        prevState.slotsPanelOpen = false;
        return prevState;
      });
    } else {
      this.setState((prevState, props) => {
        prevState.slotsPanelOpen = slot;
        return prevState;
      });
    }

    this.props.rebindTooltips();
  };

  resetHandler = e => {
    this.setState((prevState, props) => {
      let change = {
        slots: {
          slot1: false,
          slot2: false,
          slot3: false
        },
        slotsPanelOpen: false
      };
      return { ...prevState, ...change };
    });
  };

  itemClickHandler = (e, item) => {
    console.log(item);

    if (!item) {
      return;
    }

    if (item.slot) {
      this.setState((prevState, props) => {
        let change = { ...prevState };
        if (item.itemHash) {
          change.slots[item.slot] = item.itemHash === 'braytech_no_rune' ? false : item.itemHash;
        }
        change.slotsPanelOpen = false;
        return change;
      });
    } else if (item.combo) {
      this.setState((prevState, props) => {
        let change = {
          slots: {
            slot1: item.combo[0].length ? item.combo[0][0] : false,
            slot2: item.combo[1].length ? item.combo[1][0] : false,
            slot3: item.combo[2].length ? item.combo[2][0] : false
          },
          slotsPanelOpen: false
        };
        return { ...prevState, ...change };
      });
    }

    window.scrollTo({
      top: this.scrollToChalice.current.offsetTop + this.scrollToChalice.current.offsetHeight / 2 - window.innerHeight / 2
    });
  };

  breakUpRuneAbbreviations = combo => {
    let runes = combo.slice();

    runes.forEach((e, i) => {
      if (e === 'braytech_purple_rune') {
        runes[i] = [e, ...this.runes.purple.slice()];
      } else if (e === 'braytech_red_rune') {
        runes[i] = [e, ...this.runes.red.slice()];
      } else if (e === 'braytech_green_rune') {
        runes[i] = [e, ...this.runes.green.slice()];
      } else if (e === 'braytech_blue_rune') {
        runes[i] = [e, ...this.runes.blue.slice()];
      }
    });

    return flattenDepth(runes, 1);
  };

  checkForCombo = () => {
    let matches = this.combos;
    let slot1 = this.state.slots.slot1;
    let slot2 = this.state.slots.slot2;
    let slot3 = this.state.slots.slot3;

    matches = matches.filter(m => {
      let combo1 = this.breakUpRuneAbbreviations(m.combo[0]);
      let combo2 = this.breakUpRuneAbbreviations(m.combo[1]);
      let combo3 = this.breakUpRuneAbbreviations(m.combo[2]);

      // console.log(combo1, combo2, combo3)

      if (combo1.length && combo1.includes(slot1) && (combo2.length && combo2.includes(slot2)) && (combo3.length && combo3.includes(slot3))) {
        return true;
      } else if (!slot3 && !combo3.length && (combo1.length && combo1.includes(slot1)) && (combo2.length && combo2.includes(slot2))) {
        return true;
      } else if (!slot2 && !combo2.length && (!slot3 && !combo3.length) && (combo1.length && combo1.includes(slot1))) {
        return true;
      } else {
        return false;
      }
    });

    console.log(matches);
    matches.forEach(m => {
      if (m.items.length) {
        let definitionItem = manifest.DestinyInventoryItemDefinition[m.items[0]];
        console.log(definitionItem.displayProperties.name);
      } else {
        console.log(':(');
      }
    });

    this.setState((prevState, props) => {
      prevState.matches = matches;
      return prevState;
    });

    this.props.rebindTooltips();
  };

  componentDidMount() {
    window.scrollTo(0, 0);

    this.props.rebindTooltips();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.slots.slot1 !== this.state.slots.slot1 || prevState.slots.slot2 !== this.state.slots.slot2 || prevState.slots.slot3 !== this.state.slots.slot3) {
      this.checkForCombo();
    } else if (prevState.slotsPanelOpen !== this.state.slotsPanelOpen) {
      this.props.rebindTooltips();
    }
  }

  render() {
    const { t, viewport } = this.props;

    return (
      <>
        <div className='view' id='chalice-recipes'>
          <div className='module head'>
            <div className='page-header'>
              <div className='sub-name'>{this.chalice.itemTypeDisplayName}</div>
              <div className='name'>{this.chalice.displayProperties.name}</div>
            </div>
            <div className='text'>
              <p>{this.chalice.displayProperties.description}</p>
              <p><ObservedImage className='image' src='/static/images/extracts/ui/010A-00000554.PNG' /> Does not yet display rune slot 3 interactions. Coming soon, maybe.</p>
            </div>
          </div>
          <div className='padder'>
            <div className='module'>
              <div className='frame' ref={this.scrollToChalice}>
                <div className={cx('flair', { active: this.state.matches.length > 0 })}>
                  <ObservedImage className='image padding corner' src='/static/images/extracts/ui/01E3-00000700.png' />
                  <ObservedImage className='image padding corner active' src='/static/images/extracts/ui/01E3-00000700-A.png' />
                  <ObservedImage className='image leviathan' src='/static/images/extracts/ui/01E3-00000702.png' />
                  <ObservedImage className='image leviathan active' src='/static/images/extracts/ui/01E3-00000702-A.png' />
                  <ObservedImage className='image ring-outer' src='/static/images/extracts/ui/01E3-00000777.png' />
                  <ObservedImage className='image ring-outer active' src='/static/images/extracts/ui/01E3-00000777-A.png' />
                  <ObservedImage className='image ring-inner' src='/static/images/extracts/ui/01E3-00000709.png' />
                  <ObservedImage className='image ring-inner active' src='/static/images/extracts/ui/01E3-00000709-A.png' />
                  <ObservedImage className='image chalice' src='/static/images/extracts/ui/01A3-00006414.png' />
                  <ObservedImage className='image chalice active' src='/static/images/extracts/ui/01A3-00006414-A.png' />
                </div>
                <div className='ui'>
                  <div className='slots'>
                    {Object.entries(this.state.slots).map(([key, value]) => {
                      let activePlug;
                      let definitionActivePlug = manifest.DestinyInventoryItemDefinition[this.state.slots[key] ? this.state.slots[key] : 'braytech_no_rune'];
                      if (!definitionActivePlug) {
                        console.log(this.state.slots[key]);
                      }

                      activePlug = (
                        <li
                          className={cx({
                            tooltip: viewport.width > 1024 ? true : false,
                            linked: true
                          })}
                          data-hash={this.state.slots[key] ? this.state.slots[key] : 'braytech_no_rune'}
                          onClick={e => {
                            this.toggleSlotsPanelHandler(key);
                          }}
                        >
                          <div className='icon'>
                            <ObservedImage className='image' src={definitionActivePlug.displayProperties.localIcon ? `${definitionActivePlug.displayProperties.icon}` : `https://www.bungie.net${definitionActivePlug.displayProperties.icon}`} />
                          </div>
                        </li>
                      );

                      return (
                        <div key={key} className={cx(key, { slotZ: this.state.slotsPanelOpen === key })}>
                          <div className='slot-inner'>
                            <div className='active-plug'>
                              <ul className='list chalice-items'>{activePlug}</ul>
                            </div>
                            {this.state.slotsPanelOpen === key ? (
                              <div className='overlay'>
                                <ul className='list chalice-items'>
                                  <Items
                                    items={this.runes[key].map(s => {
                                      return {
                                        itemHash: s,
                                        slot: key,
                                        active: this.state.slots[key] === s
                                      };
                                    })}
                                    action={this.itemClickHandler}
                                  />
                                </ul>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className='module'>
              {this.state.matches.length > 0 ? (
                <>
                  <div className='sub-header'>
                    <div>Selected runes</div>
                  </div>
                  <ul className='list reward-items'>
                    <Rewards items={this.state.matches} onClick={this.itemClickHandler} matches />
                  </ul>
                </>
              ) : null}
              {orderBy(
                Object.entries(groupBy(this.combosAvailable, g => g.parentPresentationNodeHash)).map(([key, value]) => {
                  let definitionPresentationNode = manifest.DestinyPresentationNodeDefinition[key];

                  return {
                    itemType: value[0].itemType,
                    el: (
                      <React.Fragment key={key}>
                        <div className='sub-header'>
                          <div>{definitionPresentationNode ? definitionPresentationNode.displayProperties.name : 'uh oh'}</div>
                        </div>
                        <ul className='list reward-items'>
                          <Rewards items={value} onClick={this.itemClickHandler} />
                        </ul>
                      </React.Fragment>
                    )
                  };
                }),
                [r => r.itemType],
                ['desc']
              ).map(e => e.el)}
            </div>
          </div>
        </div>
        <div className='sticky-nav'>
          <div />
          <ul>
            <li>
              {viewport.width <= 1024 && this.state.slotsPanelOpen ? (
                <Button
                  action={e => {
                    this.toggleSlotsPanelHandler(this.state.slotsPanelOpen);
                  }}
                >
                  <i className='destiny-B_Button' /> {t('Dismiss')}
                </Button>
              ) : (
                <Button action={this.resetHandler}>
                  <i className='uniE777' />
                  {t('Reset')}
                </Button>
              )}
            </li>
          </ul>
        </div>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
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
  withNamespaces()
)(ChaliceRecipes);
