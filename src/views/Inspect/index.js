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
import { ProfileLink } from '../../components/ProfileLink';

import './styles.css';

class Inspect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
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

    let { stats, sockets } = getSockets(item, false, true, false, [], true);
    console.log(sockets);

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
    
    const isArmour = item.itemType === 2 ? true : false;
    const isWeapon = item.itemType === 3 ? true : false;

    const perkCategoryHashes = [4241085061];
    const modCategoryHashes = [2685412949, 590099826, 3379164649, 4265082475];

    const hasBaseStat = item.stats && manifest.DestinyStatDefinition[item.stats.primaryBaseStatHash] ? manifest.DestinyStatDefinition[item.stats.primaryBaseStatHash] : false;

    return (
      <div className={cx('view', 'dark-mode')} id='inspect'>
        {item.screenshot ? <ObservedImage className='image screenshot' src={`${Globals.url.bungie}${item.screenshot}`} /> : null}
        <div className='grid'>
          <div className='col displayProperties'>
            <div className={cx('rarity', tier)} />
            <div className='text'>
              <div className='name'>{item.displayProperties.name}</div>
              <div className='type'>{item.itemTypeDisplayName}</div>
              <div className='description'>{item.displayProperties.description}</div>
              <div className={cx('primary-stat', { isWeapon, isArmour } )}>
                {isWeapon ? <div className={cx('damageType', damageTypeToString(item.damageTypeHashes[0]).toLowerCase())}>
                  <div className={cx('icon', damageTypeToString(item.damageTypeHashes[0]).toLowerCase())} />
                </div> : null}
                {hasBaseStat ? <div className='text'>
                  <div className='power'>630</div>
                  <div className='primaryBaseStat'>{hasBaseStat.displayProperties.name}</div>
                </div> : null}
              </div>
            </div>
          </div>
          <div className='col details'>
            <div className='socket-bros'>
              {sockets.filter(socket => !modCategoryHashes.includes(socket.categoryHash)).length ? (
                <>
                  <div className='sub-header sub'>
                    <div>Weapon perks</div>
                  </div>
                  <div className='sockets is-perks'>
                    {sockets
                      .filter(socket => !modCategoryHashes.includes(socket.categoryHash))
                      .map((socket, index) => {
                        return (
                          <div key={index} className='socket'>
                            {socket.plugs.map(plug => plug.element)}
                          </div>
                        );
                      })}
                  </div>
                </>
              ) : null}
              {sockets.filter(socket => modCategoryHashes.includes(socket.categoryHash)).length ? (
                <>
                  <div className='sub-header sub'>
                    <div>Weapon mods</div>
                  </div>
                  <div className='sockets is-mods'>
                    {sockets
                      .filter(socket => modCategoryHashes.includes(socket.categoryHash))
                      .map((socket, index) => {
                        return (
                          <div key={index} className='socket'>
                            {socket.plugs.map(plug => plug.element)}
                          </div>
                        );
                      })}
                  </div>
                </>
              ) : null}
            </div>
            {(isWeapon || isArmour) && stats.length ? <div className='stats'>
              <div className='sub-header sub'>
                <div>{isWeapon ? `Weapon` : `Armour`} stats</div>
              </div>
              <div className='values'>{stats.map(stat => stat.element)}</div>
            </div> : null}
          </div>
        </div>
        <div className='sticky-nav'>
          <div />
          <ul>
            <li>
              <ProfileLink to={backLinkPath}>
                <i className='uniF094' />
                {t('Back')}
              </ProfileLink>
            </li>
          </ul>
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
