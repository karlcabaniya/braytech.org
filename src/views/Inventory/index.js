import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import * as ls from '../../utils/localStorage';
import Spinner from '../../components/UI/Spinner';

import './styles.css';

import Consumables from './Consumables';
import Pursuits from './Pursuits';

class Inventory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { t, member } = this.props;
    const view = this.props.match.params.view;
    const hash = this.props.match.params.hash;
    const { loading, memberships } = this.state;

    const auth = ls.get('setting.auth');

    if (!auth) {
      return null;
    }

    if (auth && !auth.destinyMemberships.find(m => m.membershipId === member.membershipId)) {
      return null;
    }

    if (auth && auth.destinyMemberships.find(m => m.membershipId === member.membershipId) && !member.data.profile.profileInventory) {
      return (
        <div className='view' id='inventory'>
          <Spinner />
        </div>
      )
    }
    
    if (view === 'consumables') {
      return <Consumables order='rarity' />;
    } else if (view === 'pursuits') {
      return <Pursuits hash={hash} order='rarity' />;
    } else {
      return <Pursuits order='rarity' />;
    }
    
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
)(Inventory);
