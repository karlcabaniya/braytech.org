import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import manifest from '../../utils/manifest';
import * as ls from '../../utils/localStorage';
import * as bungie from '../../utils/bungie';
import Spinner from '../../components/UI/Spinner';

import './styles.css';

class Inventory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      memberships: false
    };
  }

  getMemberships = async () => {
    let response = await bungie.GetMembershipDataForCurrentUser();

    console.log(response);

    if (this.mounted) {
      this.setState((prevState, props) => {
        return { ...prevState, memberships: response };
      });
    }
  }

  componentDidMount() {
    const { t, member } = this.props;
    const tokens = ls.get('setting.auth');

    this.mounted = true;
    
    if (tokens) {
      this.getMemberships();
    } else if (this.mounted) {
      this.setState((prevState, props) => {
        return { ...prevState, loading: false };
      });
    }

    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t, member } = this.props;
    const { loading, memberships } = this.state;
    

    if (loading) {
      return <Spinner />;
    } else {
      return null;
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
