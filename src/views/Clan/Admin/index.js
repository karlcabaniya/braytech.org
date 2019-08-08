import React from 'react';

import Spinner from '../../../components/UI/Spinner';
import RosterAdmin from '../../../components/RosterAdmin';

import ClanViewsLinks from '../ClanViewsLinks';

import './styles.css';

class AdminView extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);   
  }

  render() {
    const { t, group, groupMembers } = this.props;

    return (
      <>
        <ClanViewsLinks {...this.props} />
        <div className='module'>
          <div className='status'>{groupMembers.responses.length > 0 ? groupMembers.loading ? (
            <Spinner mini />
          ) : (
            <div className='ttl' />
          ) : null}</div>
          {groupMembers.loading && groupMembers.responses.length === 0 ? <Spinner /> : <RosterAdmin />}
        </div>
      </>
    );
  }
}

export default AdminView;
