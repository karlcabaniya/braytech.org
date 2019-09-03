import React from 'react';

import RosterLeaderboard from '../../../components/RosterLeaderboard';

import ClanViewsLinks from '../ClanViewsLinks';

import './styles.css';

class StatsView extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);   
  }

  render() {
    const {  } = this.props;




    return (
      <>
        <ClanViewsLinks {...this.props} />
        <RosterLeaderboard mode='70' />
      </>
    );
  }
}

export default StatsView;
