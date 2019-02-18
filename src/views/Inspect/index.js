import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import Globals from '../../utils/globals';
import ObservedImage from '../../components/ObservedImage';
import { damageTypeToString } from '../../utils/destinyUtils';
import { getSockets } from '../../utils/destinyItems';

import './styles.css';

class Inspect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      from: this.props.location.state && this.props.location.state.from ? this.props.location.state.from : false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.kind !== prevProps.match.params.kind) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { t } = this.props;
    const hash = this.props.match.params.hash ? this.props.match.params.hash : false;
    const item = manifest.DestinyInventoryItemDefinition[hash];

    let { stats, sockets } = getSockets(item, false, true, false);
    console.log(sockets)

    let backLinkPath = this.state.from;

    let tier;
    if (item.inventory) {
      switch (item.inventory.tierType) {
        case 6:
          tier = 'exotic';
          break;
        case 5:
          tier = 'legendary';
          break;
        case 4:
          tier = 'rare';
          break;
        case 3:
          tier = 'uncommon';
          break;
        case 2:
          tier = 'basic';
          break;
        default:
          tier = 'basic';
      }
    }

    return (
      <div className={cx('view', 'dark-mode')} id='inspect'>
        <div className='bg'>
          <ObservedImage className='image' src={`${Globals.url.bungie}${item.screenshot}`} />
        </div>
        {item.secondaryIcon ? <ObservedImage className='image secondaryIcon' src={`${Globals.url.bungie}${item.secondaryIcon}`} /> : null}
        <div className={cx('rarity', tier)} />
        <div className='wrap'>
          <div className='properties'>
            <div className='head'>
              <ObservedImage className='image icon' src={`${Globals.url.bungie}${item.displayProperties.icon}`} />
              <div className='text'>
                <div className='name'>{item.displayProperties.name}</div>
                <div className='type'>{item.itemTypeDisplayName}</div>
              </div>
            </div>
            <div className='description'>{item.displayProperties.description}</div>
            <div className='sock'>
            <div className='sub-header sub'>
                <div>Weapon perks</div>
              </div>
              <div className='sockets is-perks'>
                {sockets
                .filter(socket => socket.categoryHash === 4241085061)
                .map((socket, index) => {
                  return (
                    <div key={index} className='socket'>
                      {socket.plugs.map(plug => plug.element)}
                    </div>
                  );
                })}
              </div>
              <div className='sub-header sub'>
                <div>Weapon mods</div>
              </div>
              <div className='sockets is-mods'>
                {sockets
                .filter(socket => socket.categoryHash === 2685412949)
                .map((socket, index) => {
                  return (
                    <div key={index} className='socket'>
                      {socket.plugs.map(plug => plug.element)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className='stats'>
            <div className='primary'>
              <div className={cx('damageType', damageTypeToString(item.damageTypeHashes[0]).toLowerCase())}>
                <div className={cx('icon', damageTypeToString(item.damageTypeHashes[0]).toLowerCase())} />
              </div>
              <div className='text'>
                <div className='power'>630</div>
                <div className='primaryBaseStat'>{manifest.DestinyStatDefinition[item.stats.primaryBaseStatHash].displayProperties.name}</div>
              </div>
            </div>
            <div className='values'>
              {stats.map(stat => stat.element)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    theme: state.theme,
    member: state.member
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Inspect);
