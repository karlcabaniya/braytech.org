import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import './styles.css';

import Root from './Root/';
import Crucible from './Crucible/';
import Gambit from './Gambit/';

class PGCRs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    
  }

  render() {
    const { t, member } = this.props;
    const type = this.props.match.params.type || false;
    const mode = this.props.match.params.mode || false;

    if (type === 'crucible') {
      return <Crucible mode={mode} />;
    } else if (type === 'gambit') {
      return <Gambit mode={mode} />;
    } else {
      return <Root />;
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    PGCRcache: state.PGCRcache
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(PGCRs);
