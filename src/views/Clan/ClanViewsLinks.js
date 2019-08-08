import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { ProfileNavLink } from '../../components/ProfileLink';

class ClanViewsLinks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { t, member } = this.props;

    const memberGroups = member.data.groups.results.filter(r => r.member.memberType > 2);

    return (
      <div className='module views'>
        <ul className='list'>
          <li className='linked'>
            <div className='icon about' />
            <ProfileNavLink to='/clan' exact />
          </li>
          <li className='linked'>
            <div className='icon roster' />
            <ProfileNavLink to='/clan/roster' />
          </li>
          {/* <li className='linked'>
            <div className='icon stats' />
            <ProfileNavLink to='/clan/stats' />
          </li> */}
          {memberGroups.length ? (
            <li className='linked'>
              <div className='icon admin' />
              <ProfileNavLink to='/clan/admin' />
            </li>
          ) : null}
        </ul>
      </div>
    );
  }
}

export default compose(
  connect(),
  withNamespaces()
)(ClanViewsLinks);
