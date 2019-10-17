import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../../utils/manifest';
import * as ls from '../../../../utils/localStorage';
import * as bungie from '../../../../utils/bungie';
import ObservedImage from '../../../../components/ObservedImage';
import { NoAuth, DiffProfile } from '../../../../components/BungieAuth';
import Spinner from '../../../../components/UI/Spinner';
import ProgressBar from '../../../../components/UI/ProgressBar';

import './styles.css';

const mods = {
  // Dark Glimmer
  4088080601: {
    hash: 4088080601,
    active: '/static/images/extracts/ui/artifact/0593_0376_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_0378_00.png'
  },
  // Labyrinth Miner
  4088080602: {
    hash: 4088080602,
    active: '/static/images/extracts/ui/artifact/0593_0383_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_0385_00.png'
  },
  // Biomonetizer
  4088080603: {
    hash: 4088080603,
    active: '/static/images/extracts/ui/artifact/0593_038D_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_038F_00.png'
  },
  // Circuit Scavenger
  4088080604: {
    hash: 4088080604,
    active: '/static/images/extracts/ui/artifact/0593_0397_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_0399_00.png'
  },
  // Dissection Matrix
  4088080605: {
    hash: 4088080605,
    active: '/static/images/extracts/ui/artifact/0593_03A1_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_03A3_00.png'
  },
  // Anti-Barrier Rounds
  2102702010: {
    hash: 2102702010,
    active: '/static/images/extracts/ui/artifact/0593_0460_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_0462_00.png'
  },
  // Anti-Barrier Hand Cannon
  2102702009: {
    hash: 2102702009,
    active: '/static/images/extracts/ui/artifact/0593_046A_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_046B_00.png'
  },
  // Overload Rounds
  2102702008: {
    hash: 2102702008,
    active: '/static/images/extracts/ui/artifact/0593_0473_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_0476_00.png'
  },
  // Overload Arrowheads
  2102702015: {
    hash: 2102702015,
    active: '/static/images/extracts/ui/artifact/0593_047D_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_0480_00.png'
  },
  // Unstoppable Hand Cannon
  2102702014: {
    hash: 2102702014,
    active: '/static/images/extracts/ui/artifact/0593_0488_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_048A_00.png'
  },
  // Enhanced Hand Cannon Loader
  3333771943: {
    hash: 3333771943,
    active: '/static/images/extracts/ui/artifact/0593_03AB_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_03AC_00.png'
  },
  // Enhanced Submachine Gun Loader
  3333771940: {
    hash: 3333771940,
    active: '/static/images/extracts/ui/artifact/0593_03B5_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_03B6_00.png'
  },
  // Enhanced Bow Loader
  3333771941: {
    hash: 3333771941,
    active: '/static/images/extracts/ui/artifact/0593_03BE_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_03C1_00.png'
  },
  // Enhanced Fusion Rifle Loader
  3333771938: {
    hash: 3333771938,
    active: '/static/images/extracts/ui/artifact/0593_03C9_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_03CA_00.png'
  },
  // Enhanced Auto Rifle Loader
  3333771939: {
    hash: 3333771939,
    active: '/static/images/extracts/ui/artifact/0593_03D3_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_03D4_00.png'
  },
  // Breach Refractor
  2402696710: {
    hash: 2402696710,
    active: '/static/images/extracts/ui/artifact/0593_03DD_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_03DF_00.png'
  },
  // Ballistic Combo
  2402696706: {
    hash: 2402696706,
    active: '/static/images/extracts/ui/artifact/0593_0405_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_0406_00.png'
  },
  // Overload Grenades
  2402696709: {
    hash: 2402696709,
    active: '/static/images/extracts/ui/artifact/0593_03E7_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_03E9_00.png'
  },
  // Disruptor Spike
  2402696708: {
    hash: 2402696708,
    active: '/static/images/extracts/ui/artifact/0593_03F1_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_03F3_00.png'
  },
  // Unstoppable Melee
  2402696707: {
    hash: 2402696707,
    active: '/static/images/extracts/ui/artifact/0593_03FB_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_03FD_00.png'
  },
  // Heavy Finisher
  2612707365: {
    hash: 2612707365,
    active: '/static/images/extracts/ui/artifact/0593_040F_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_0411_00.png'
  },
  // Oppressive Darkness
  2612707366: {
    hash: 2612707366,
    active: '/static/images/extracts/ui/artifact/0593_0419_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_041A_00.png'
  },
  // Arc Battery
  2612707367: {
    hash: 2612707367,
    active: '/static/images/extracts/ui/artifact/0593_0423_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_0424_00.png'
  },
  // Thunder Coil
  2612707360: {
    hash: 2612707360,
    active: '/static/images/extracts/ui/artifact/0593_042D_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_042F_00.png'
  },
  // From the Depths
  2612707361: {
    hash: 2612707361,
    active: '/static/images/extracts/ui/artifact/0593_0437_00.png',
    inactive: '/static/images/extracts/ui/artifact/0593_0439_00.png'
  }
};

class SeasonalArtifact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: false
    };

    this.auth = ls.get('setting.auth');
  }

  componentDidMount() {
    this.getVendor(2894222926);
  }

  componentDidUpdate(p, s) {
    if (s.loading !== this.state.loading) {
      this.props.rebindTooltips();
    }
  }

  getVendor = async hash => {
    const { member } = this.props;

    if (!this.auth) return;

    const response = await bungie.GetVendor(member.membershipType, member.membershipId, member.characterId, hash, [400, 402, 300, 301, 304, 305, 306, 307, 308, 600].join(','));

    if (response) {
      this.setState({
        loading: false,
        data: response
      });
    } else {
      this.setState(p => ({
        ...p,
        loading: false
      }));
    }
  };

  render() {
    const { t, member } = this.props;
    const profileProgression = member.data.profile.profileProgression.data;
    const progressionArtifact = profileProgression.seasonalArtifact;

    if (!this.auth) {
      return <NoAuth inline />;
    }

    if (this.auth && !this.auth.destinyMemberships.find(m => m.membershipId === member.membershipId)) {
      return <DiffProfile inline />;
    }

    if (this.auth && this.auth.destinyMemberships.find(m => m.membershipId === member.membershipId) && this.state.loading) {
      return (
        <>
          <div className='head'>
            <div className='module-header'>
              <div className='sub-name'>{t('Seasonal progression')}</div>
            </div>
            <Spinner />
          </div>
        </>
      );
    }

    const definitionArtifact = progressionArtifact.artifactHash && manifest.DestinyArtifactDefinition[progressionArtifact.artifactHash];
    const definitionVendor = progressionArtifact.artifactHash && manifest.DestinyVendorDefinition[progressionArtifact.artifactHash];

    const items = [];

    if (this.state.data) {
      Object.values(this.state.data.sales.data).forEach(sale => {
        if (!this.state.data.itemComponents.plugStates.data[sale.itemHash]) return;

        items.push({
          vendorHash: definitionVendor.hash,
          ...sale,
          ...((sale.vendorItemIndex !== undefined && definitionVendor && definitionVendor.itemList && definitionVendor.itemList[sale.vendorItemIndex]) || {}),
          available: this.state.data.itemComponents.plugStates.data[sale.itemHash].canInsert,
          obtained: this.state.data.itemComponents.plugStates.data[sale.itemHash].enabled
        });
      });
    }

    console.log(progressionArtifact, items);

    // let string = ''
    //     definitionArtifact.tiers.forEach(tier => {
    //       tier.items.forEach(item => {
    //         const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash]
    // string = string + `
    // // ${definitionItem.displayProperties.name}
    // ${item.itemHash}: {
    //   hash: ${item.itemHash},
    //   active: '/static/images/extracts/ui/artifact/0000000.png',
    //   inactive: '/static/images/extracts/ui/artifact/0000000.png'
    // },`
    //       })
    //     })
    //     console.log(string)

    return (
      <>
        {/* <ObservedImage className='image artifact' src='/static/images/extracts/flair/VEye.png' /> */}
        <div className='head'>
          <div className='module-header'>
            <div className='sub-name'>{t('Seasonal progression')}</div>
          </div>
          <div className='artifact'>
            <div className='icon'>
              <ObservedImage src={`https://www.bungie.net${definitionArtifact.displayProperties.icon}`} />
            </div>
            <div className='text'>
              <div className='name'>{definitionArtifact.displayProperties.name}</div>
              <div className='type'>{t('Seasonal Artifact')}</div>
            </div>
            <div className='description'>
              <p>{definitionVendor.displayProperties.description}</p>
            </div>
          </div>
        </div>
        <div className='grid'>
          <div className='mods'>
            <h4>{t('Mods')}</h4>
            <div className='tiers'>
              {definitionArtifact.tiers.map((tier, t) => {
                const tierItemHashes = tier.items.map(i => i.itemHash);

                return (
                  <div
                    key={t}
                    className={cx('tier', {
                      available: t === 0 || (items.filter(i => tierItemHashes.includes(i.itemHash)).filter(i => i.obtained).length > 0 && progressionArtifact.pointProgression.level >= tier.minimumUnlockPointsUsedRequirement),
                      last: (t < 4 && items.filter(i => tierItemHashes.includes(i.itemHash)).filter(i => i.available).length < 1 && progressionArtifact.pointProgression.level < definitionArtifact.tiers[t + 1].minimumUnlockPointsUsedRequirement) || (t > 2 && t < 4)
                    })}
                  >
                    <ul className='list inventory-items'>
                      {items
                        .filter(i => tierItemHashes.includes(i.itemHash))
                        .map((item, i) => {
                          const active = item.obtained;

                          const image = !active ? mods[item.itemHash].inactive : mods[item.itemHash].active;

                          const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

                          const energyCost = definitionItem && definitionItem.plug && definitionItem.plug.energyCost ? definitionItem.plug.energyCost.energyCost : 0;

                          return (
                            <li
                              key={i}
                              className={cx({
                                tooltip: true,
                                linked: true,
                                'no-border': true,
                                unavailable: !active
                              })}
                              data-hash={item.itemHash}
                              data-instanceid={item.itemInstanceId}
                              data-state={item.state}
                              // data-vendorhash={item.vendorHash}
                              // data-vendorindex={item.vendorItemIndex}
                              // data-vendorstatus={item.saleStatus}
                              data-quantity={item.quantity && item.quantity > 1 ? item.quantity : null}
                            >
                              <div className='icon'>
                                {!active ? <ObservedImage className='image background' src='/static/images/extracts/ui/artifact/01A3_12DB_00.png' /> : null}
                                <ObservedImage src={image} />
                                <div className='cost'>{energyCost}</div>
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
          <div className='progression'>
            <h4>{t('Progression')}</h4>
            <p>
              <em>{t('Earning XP grants Power bonuses and unlocks powerful mods that can be slotted into weapons and armor.')}</em>
            </p>
            <div className='integers'>
              <div>
                <div className='name'>{t('Artifact unlocks')}</div>
                <div className='value'>
                  {progressionArtifact.pointProgression.level}/{progressionArtifact.pointProgression.levelCap}
                </div>
              </div>
              <div>
                <div className='name'>{t('Power bonus')}</div>
                <div className='value power'>+{progressionArtifact.powerBonus}</div>
              </div>
            </div>
            <p>{t('Next power bonus')}</p>
            <ProgressBar {...progressionArtifact.powerBonusProgression} hideCheck />
            {progressionArtifact.pointProgression.level < progressionArtifact.pointProgression.levelCap ? (
              <>
                <p>{t('Next artifact unlock')}</p>
                <ProgressBar {...progressionArtifact.pointProgression} hideCheck />
              </>
            ) : null}
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
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
  withTranslation()
)(SeasonalArtifact);
