import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../../components/ObservedImage';
import Items from '../../../components/Items';
import Button from '../../../components/UI/Button';

import './styles.css';

class ChaliceRecipes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sockets: {
        socket1: {
          panelOpen: true,
          activePlug: false
        },
        socket2: {
          panelOpen: false,
          activePlug: false
        },
        socket3: {
          panelOpen: false,
          activePlug: false
        },
        socket4: {
          panelOpen: false,
          activePlug: false
        }
      }      
    };

    this.runes = {
      socket1: [
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
        2149082460, // Rune of Pleasure
      ]
    }
  }

  togglePanel = socket => {
    this.setState((prevState, props) => {
      prevState.sockets[socket].panelOpen = !prevState.sockets[socket].panelOpen ? true : false;
      return prevState;
    });
  }

  itemClickHandler = (e, item) => {

    console.log(item);

    this.setState((prevState, props) => {
      if (item.itemHash) {
        prevState.sockets[item.socket].activePlug = item.itemHash;
      }
      prevState.sockets[item.socket].panelOpen = false;
      return prevState;
    });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
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
            <div className='sockets'>
              {Object.entries(this.state.sockets).map(([key, value]) => {
                let activePlug;
                if (this.state.sockets[key].activePlug) {
                  let definitionActivePlug = manifest.DestinyInventoryItemDefinition[this.state.sockets[key].activePlug];

                  activePlug = (
                    <li
                      className={cx(
                        {
                          tooltip: true,
                          linked: true,
                        }
                      )}
                      data-hash={this.state.sockets[key].activePlug}
                      onClick={e => {
                        this.togglePanel(key);
                      }}
                    >
                      <div className='icon'>
                        <ObservedImage className='image' src={`https://www.bungie.net${definitionActivePlug.displayProperties.icon}`} />
                      </div>
                    </li>
                  );
                } else {
                  let definitionActivePlug = manifest.DestinySandboxPerkDefinition[1530757635];

                  activePlug = (
                    <li
                      className={cx(
                        {
                          tooltip: false,
                          linked: true,
                        }
                      )}
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
                  <div className={cx(key)}>
                    <div className='socket-inner'>
                      <div className='active-plug'>
                        <ul className='list inventory-items'>
                          {activePlug}
                        </ul>
                      </div>
                      {this.state.sockets[key].panelOpen ? (
                        <div className='overlay'>
                          <ul className='list inventory-items'>
                            <Items 
                              items={this.runes[key].map(s => {
                                return {
                                  itemHash: s,
                                  socket: key
                                }
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
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(ChaliceRecipes);
