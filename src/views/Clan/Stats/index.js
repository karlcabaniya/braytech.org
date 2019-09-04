import React from 'react';

import RosterLeaderboards from '../../../components/RosterLeaderboards';

import ClanViewsLinks from '../ClanViewsLinks';

import './styles.css';

class StatsView extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);   
  }

  render() {
    const { subView } = this.props;

    return (
      <>
        <ClanViewsLinks {...this.props} />
        <RosterLeaderboards mode='70' scope={subView} />
      </>
    );
  }
}

export default StatsView;
