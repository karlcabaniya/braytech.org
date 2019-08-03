import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { orderBy } from 'lodash';

import manifest from '../../../utils/manifest';
import * as bungie from '../../../utils/bungie';
import Items from '../../../components/Items';

import InventoryViewsLinks from '../InventoryViewsLinks';

import './styles.css';

class Characters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  equipItem = async (e, item) => {
    const { member } = this.props;

    const characterInventories = member.data.profile.characterInventories.data;

    const characterId =
      Object.entries(characterInventories).find(([key, value]) => {
        if (value.items.find(i => i.itemInstanceId === item.itemInstanceId)) {
          return true;
        } else {
          return false;
        }
      }) &&
      Object.entries(characterInventories).find(([key, value]) => {
        if (value.items.find(i => i.itemInstanceId === item.itemInstanceId)) {
          return true;
        } else {
          return false;
        }
      })[0];

    try {
      await bungie.EquipItem({
        itemId: item.itemInstanceId,
        characterId,
        membershipType: member.membershipType
      });

      this.props.markStale({ membershipType: member.membershipType, membershipId: member.membershipId });
    } catch (e) {
      this.props.pushNotification({
        error: true,
        date: new Date().toISOString(),
        expiry: 86400000,
        displayProperties: {
          name: e.errorStatus,
          description: e.message,
          timeout: 60
        },
        javascript: e
      });
    }
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.rebindTooltips();
  }

  render() {
    const { t, member } = this.props;

    const characterInventories = member.data.profile.characterInventories.data;
    const characterEquipment = member.data.profile.characterEquipment.data;

    const characters = member.data.profile.characters.data;
    const characterIds = [member.characterId];

    for (const c of characters) {
      if (!characterIds.includes(c.characterId)) characterIds.push(c.characterId);
    }

    const buckets = [
      // { // Class
      //   bucketHash: 3284755031
      // },
      {
        // Kinetic
        bucketHash: 1498876634
      },
      {
        // Energy
        bucketHash: 2465295065
      },
      {
        // Power
        bucketHash: 953998645
      },
      {
        // Helmet
        bucketHash: 3448274439
      },
      {
        // Gloves
        bucketHash: 3551918588
      },
      {
        // Chest
        bucketHash: 14239492
      },
      {
        // Boots
        bucketHash: 20886954
      },
      {
        // Class item
        bucketHash: 1585787867
      },
      {
        // Ghost
        bucketHash: 4023194814
      },
      {
        // Sparrow
        bucketHash: 2025709351
      },
      {
        // Ship
        bucketHash: 284967655
      },
      {
        // Emblem
        bucketHash: 4274335291
      }
    ];

    return (
      <div className='view characters' id='inventory'>
        <InventoryViewsLinks />

        <div className='module buckets'>
          {buckets.map(b => {
            return (
              <div key={b.bucketHash} className='bucket'>
                {characterIds.map(characterId => {
                  return (
                    <div key={characterId} className='character'>
                      <ul className='list inventory-items equipped'>
                        <Items items={characterEquipment[characterId].items.filter(i => i.bucketHash === b.bucketHash)} />
                      </ul>
                      <ul className='list inventory-items'>
                        <Items items={characterInventories[characterId].items.filter(i => i.bucketHash === b.bucketHash)} action={this.equipItem} />
                      </ul>
                    </div>
                  );
                })}
              </div>
            );
          })}
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

function mapDispatchToProps(dispatch) {
  return {
    pushNotification: value => {
      dispatch({ type: 'PUSH_NOTIFICATION', payload: value });
    },
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    },
    markStale: member => {
      dispatch({ type: 'MEMBER_IS_STALE', payload: { membershipType: member.membershipType, membershipId: member.membershipId } });
    }
  };
}

Characters = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withNamespaces()
)(Characters);

export { Characters };
