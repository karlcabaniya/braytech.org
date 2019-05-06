import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';

import * as destinyEnums from '../../utils/destinyEnums';
import * as bungie from '../../utils/bungie';

import './styles.css';

class MemberLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      memberGroups: false
    };
    this.mounted = false;
  }

  componentWillMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    // If we don't do this, the searchForPlayers may attempt to setState on
    // an unmounted component. We can't cancel it as it's using
    // fetch, which doesn't support cancels :(
    this.mounted = false;
  }

  async componentDidMount() {
    const { membershipType, membershipId, displayName, displayClan } = this.props;

    if (displayClan) {
      try {
        const results = await bungie.memberGroups(membershipType, membershipId);
        if (this.mounted) this.setState({ memberGroups: results });
      } catch (e) {
        
      }
    }
  }

  render() {
    const { membershipType, membershipId, displayName, displayClan } = this.props;

    return (
      <div className='member-link'>
        <span className={`destiny-platform_${destinyEnums.PLATFORMS[membershipType].toLowerCase()}`} />
        <div className='text'>
          <div className='displayName'>{displayName}</div>
          {displayClan ? <div className='clanName'>{this.state.memberGroups && this.state.memberGroups.results.length === 1 ? this.state.memberGroups.results[0].group.name : null}</div> : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    
  };
}

export default compose(connect(mapStateToProps))(MemberLink);
