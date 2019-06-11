import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import Globals from '../../utils/globals';
import ObservedImage from '../../components/ObservedImage';
import { damageTypeToString } from '../../utils/destinyUtils';
import { getSockets } from '../../utils/destinyItems';
import { ProfileLink } from '../../components/ProfileLink';

import './styles.css';

class Inspect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loreOpen: false
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

  toggleLore = () => {
    if (!this.state.loreOpen) {
      this.setState({ loreOpen: true });
    } else {
      this.setState({ loreOpen: false });
    }
  };

  render() {
    const { t, member } = this.props;
    const hash = this.props.match.params.hash ? this.props.match.params.hash : false;
    const item = manifest.DestinyInventoryItemDefinition[hash];

    let { stats, sockets } = getSockets(item, false, true, false, true, [], true, true);

    console.log(sockets);

    const modCategoryHashes = [2685412949, 590099826, 3379164649, 4265082475, 4243480345];
    const socketsPerks = sockets.filter(socket => !modCategoryHashes.includes(socket.categoryHash)).length ? sockets.filter(socket => !modCategoryHashes.includes(socket.categoryHash)).filter(socket => socket.socketTypeHash !== 1282012138) : false;
    const socketsMods = sockets.filter(socket => modCategoryHashes.includes(socket.categoryHash)).length ? sockets.filter(socket => modCategoryHashes.includes(socket.categoryHash)) : false;

    let backLinkPath = this.props.location.state && this.props.location.state.from ? this.props.location.state.from : '/collections';

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

    const hasBaseStat = item.stats && manifest.DestinyStatDefinition[item.stats.primaryBaseStatHash] ? manifest.DestinyStatDefinition[item.stats.primaryBaseStatHash] : false;

    let powerLevel;
    if (member && member.data) {
      let character = member.data.profile.characters.data.find(c => c.characterId === member.characterId);
      powerLevel = Math.floor((680 / 700) * character.light);
    } else if (item.itemComponents && item.itemComponents.instance) {
      powerLevel = item.itemComponents.instance.primaryStat.value;
    } else {
      powerLevel = '730';
    }

    return (
      <div className={cx('view', { 'lore-open': this.state.loreOpen })} id='inspect'>
        <div className='row displayProperties'>
          <div className={cx('rarity', tier)} />
          <div className='icon'>{item.displayProperties.icon ? <ObservedImage className='image' src={`https://www.bungie.net${item.displayProperties.icon}`} /> : null}</div>
          <div className='text'>
            <div className='name'>{item.displayProperties.name}</div>
            <div className='type'>{item.itemTypeDisplayName}</div>
            <div className='description'>{item.displayProperties.description}</div>
          </div>
        </div>
        <div className='row sockets'>
          {socketsPerks.length > 0 ? (
            <div className='module'>
              <div className='sub-header'>
                <div>Perks</div>
              </div>
              <div className={cx('sockets','perks')}>
                {socketsPerks.map((socket, i) => {
                  let group = socket.plugs
                    .filter(plug => {
                      if (plug.definition.redacted) {
                        return false;
                      } else {
                        return true;
                      }
                    })
                    .filter(plug => {
                      if (!plug.definition.itemCategoryHashes || !plug.definition.plug) {
                        console.log(socket, plug);
                        return false;
                      } else {
                        return true;
                      }
                    })
                    .filter(plug => plug.definition.plug.plugCategoryHash !== 2947756142);

                  if (group.length > 0) {
                    return (
                      <div key={i} className='socket'>
                        {group.map(plug => plug.element)}
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            </div>
          ) : null}
          {socketsMods.length > 0 ? (
            <div className='module'>
              <div className='sub-header'>
                <div>Mods</div>
              </div>
              <div className={cx('sockets','mods')}>
                {socketsMods.map((socket, i) => {
                  let group = socket.plugs
                    .filter(plug => {
                      if (plug.definition.redacted) {
                        return false;
                      } else {
                        return true;
                      }
                    })
                    .filter(plug => {
                      if (!plug.definition.itemCategoryHashes || !plug.definition.plug) {
                        console.log(socket, plug);
                        return false;
                      } else {
                        return true;
                      }
                    })
                    .filter(plug => plug.definition.plug.plugCategoryHash !== 2947756142);

                  if (group.length > 0) {
                    return (
                      <div key={i} className='socket'>
                        {group.map(plug => plug.element)}
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Inspect);
