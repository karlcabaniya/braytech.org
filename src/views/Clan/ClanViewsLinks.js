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
            <div className='icon'>
              <ObservedImage className='image' src='/static/images/extracts/ui/01e3-00000143.png' />
            </div>
            <ProfileNavLink to='/clan' exact />
          </li>
          <li className='linked'>
            <div className='icon'>
              <ObservedImage className='image' src='/static/images/extracts/ui/02af-00000497.png' />
            </div>
            <ProfileNavLink to='/clan/roster' />
          </li>
          <li className='linked'>
            <div className='icon'>
              <ObservedImage className='image' src='/static/images/extracts/ui/01e3-00001924.png' />
            </div>
            <ProfileNavLink to='/clan/stats' />
          </li>
        </ul>
      </div>
    );
  }
}

export default compose(
  connect(),
  withNamespaces()
)(ClanViewsLinks);
