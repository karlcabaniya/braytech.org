import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { ProfileNavLink } from '../../components/ProfileLink';
import ObservedImage from '../../components/ObservedImage';

class ClanViewsLinks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { t } = this.props;

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
        </ul>
      </div>
    );
  }
}

export default compose(
  connect(),
  withNamespaces()
)(ClanViewsLinks);
