import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

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
    const { loading, memberships } = this.state;
    
    if (view === 'consumables') {
      return <Consumables />;
    } else {
      return <Pursuits />;
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
