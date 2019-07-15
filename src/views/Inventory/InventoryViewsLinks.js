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

    const currencies = member.data.profile.profileCurrencies && member.data.profile.profileCurrencies.data.items;

    return (
      <div className='module views'>
        <div className='sticker'>
          <ul className='list'>
            <li className='linked'>
              <div className='icon'>
                <ObservedImage className='image' src='/static/images/extracts/ui/01A3-00001DB5.PNG' />
              </div>
              <ProfileNavLink to='/inventory' isActive={(match, location) => {
                if (['/inventory', '/inventory/pursuits'].includes(removeMemberIds(location.pathname)) || removeMemberIds(location.pathname).includes('/inventory/pursuits')) {
                  return true;
                } else {
                  return false;
                }
              }} />
            </li>
            <li className='linked'>
              <div className='icon'>
                <ObservedImage className='image' src='/static/images/extracts/ui/01E3-00001080.PNG' />
              </div>
              <ProfileNavLink to='/inventory/consumables' />
            </li>
            <li className='linked'>
              <div className='icon'>
                <ObservedImage className='image' src='/static/images/extracts/ui/01e3-00000246.png' />
              </div>
              <ProfileNavLink to='/inventory/postmaster' />
            </li>
            <li className='linked'>
              <div className='icon'>
                <ObservedImage className='image' src='/static/images/extracts/ui/01E3-00001095.PNG' />
              </div>
              <ProfileNavLink to='/inventory/vault' />
            </li>
          </ul>
          <ul className='list currencies'>
            {currencies.map((c, i) => {
              const definitionCurrency = manifest.DestinyInventoryItemDefinition[c.itemHash];

              return (
                <li key={i} className='tooltip' data-hash={c.itemHash}>
                  <div className='icon'>
                    <ObservedImage className='image' src={`https://www.bungie.net${definitionCurrency.displayProperties.icon}`} />
                  </div>
                  <div className='quantity'>{c.quantity}</div>
                </li>
              );
            })}
          </ul>
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
