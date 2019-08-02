import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { removeMemberIds } from '../../utils/paths';
import { ProfileNavLink } from '../../components/ProfileLink';
import ObservedImage from '../../components/ObservedImage';
import manifest from '../../utils/manifest';

class InventoryViewsLinks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { t, member } = this.props;

    const inventory = member.data.profile.profileInventory.data.items.slice().concat(member.data.profile.characterInventories.data[member.characterId].items);
    const currencies = member.data.profile.profileCurrencies && member.data.profile.profileCurrencies.data.items;

    let outputCurrencies = currencies.map((c, i) => {
      const definitionCurrency = manifest.DestinyInventoryItemDefinition[c.itemHash];

      return {
        hash: c.itemHash,
        el: (
          <li key={i} className='tooltip' data-hash={c.itemHash}>
            <div className='icon'>
              <ObservedImage className='image' src={`https://www.bungie.net${definitionCurrency.displayProperties.icon}`} />
            </div>
            <div className='quantity'>{c.quantity}</div>
          </li>
        )
      };
    });

    const enhancementCores = inventory.find(i => i.itemHash === 3853748946);
    if (enhancementCores) {
      outputCurrencies.splice(2, 0, {
        hash: enhancementCores.itemHash,
        el: (
          <li key={enhancementCores.itemHash} className='tooltip' data-hash={enhancementCores.itemHash}>
            <div className='icon'>
              <ObservedImage className='image' src={`/static/images/extracts/ui/01e3-00005388.png`} />
            </div>
            <div className='quantity'>{enhancementCores.quantity}</div>
          </li>
        )
      });
    }

    return (
      <div className='module views'>
        <div className='sticker'>
          <ul className='list'>
            <li className='linked'>
              <div className='icon characters' />
              <ProfileNavLink to='/inventory' isActive={(match, location) => {
                  // if (['/inventory'].includes(removeMemberIds(location.pathname)) || removeMemberIds(location.pathname).includes('/inventory')) {
                  if (['/inventory'].includes(removeMemberIds(location.pathname))) {
                    return true;
                  } else {
                    return false;
                  }
                }} />
            </li>
            <li className='linked'>
              <div className='icon pursuits' />
              <ProfileNavLink
                to='/inventory/pursuits'
              />
            </li>
            <li className='linked'>
              <div className='icon consumables' />
              <ProfileNavLink to='/inventory/consumables' />
            </li>
            <li className='linked'>
              <div className='icon vault' />
              <ProfileNavLink to='/inventory/vault' />
            </li>
          </ul>
          <ul className='list currencies'>{outputCurrencies.map(e => e.el)}</ul>
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
)(InventoryViewsLinks);
