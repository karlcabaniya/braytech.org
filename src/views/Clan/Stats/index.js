import React from 'react';

import MemberLink from '../../../components/MemberLink';
import Spinner from '../../../components/UI/Spinner';

import ClanViewsLinks from '../ClanViewsLinks';

import './styles.css';

class StatsView extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);   
  }

  render() {
    const { t, group, groupMembers } = this.props;

    console.log(group, groupMembers);



    return (
      <>
        <ClanViewsLinks />
        <div className='module'>
          <div className='status'>{groupMembers.responses.length > 0 ? groupMembers.loading ? (
            <Spinner mini />
          ) : (
            <div className='ttl' />
          ) : null}</div>
          {groupMembers.loading && groupMembers.responses.length === 0 ? <Spinner /> : null}
        </div>
      </>
    );
  }
}

export default StatsView;
