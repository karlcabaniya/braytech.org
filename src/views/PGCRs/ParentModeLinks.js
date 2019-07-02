import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { removeMemberIds } from '../../utils/paths';
import { ProfileNavLink } from '../../components/ProfileLink';
import ObservedImage from '../../components/ObservedImage';

class ParentModeLinks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  componentDidMount() {
    
  }

  render() {
    const { t } = this.props;

    return (
      <div className='content views'>
        <ul className='list'>
          <li className='linked'>
            <div className='icon'>
              <ObservedImage className='image' src='/static/images/extracts/ui/modes/01E3-00000104.PNG' />
            </div>
            <ProfileNavLink to='/pgcrs' isActive={(match, location) => {
                if (['/pgcrs', '/pgcrs/all'].includes(removeMemberIds(location.pathname)) || removeMemberIds(location.pathname).includes('/pgcrs/all')) {
                  return true;
                } else {
                  return false;
                }
              }} />
          </li>
          <li className='linked'>
            <div className='icon'>
              <ObservedImage className='image' src='/static/images/extracts/ui/modes/01E3-00000102.PNG' />
            </div>
            <ProfileNavLink to='/pgcrs/crucible' />
          </li>
          <li className='linked'>
            <div className='icon'>
              <ObservedImage className='image' src='/static/images/extracts/ui/modes/01E3-00000101.PNG' />
            </div>
            <ProfileNavLink to='/pgcrs/gambit' />
          </li>
          <li className='linked'>
            <div className='icon'>
              <ObservedImage className='image' src='/static/images/extracts/ui/modes/01E3-00000103.PNG' />
            </div>
            <ProfileNavLink to='/pgcrs/raids' />
          </li>
          <li className='linked'>
            <div className='icon'>
              <ObservedImage className='image' src='/static/images/extracts/ui/modes/01E3-00000105.PNG' />
            </div>
            <ProfileNavLink to='/pgcrs/strikes' />
          </li>
        </ul>
      </div>
    )
  }
}

export default compose(
  connect(),
  withNamespaces()
)(ParentModeLinks);
