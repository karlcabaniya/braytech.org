import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import Moment from 'react-moment';
import cx from 'classnames';

import ObservedImage from '../../components/ObservedImage';
import Ranks from '../../components/Ranks';

import './styles.css';

import Root from './Root';
import Member from './Member';
import Group from './Group';

class Leaderboards extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { t, match } = this.props;
    const { view, param1, param2 } = match.params;

    // console.log(view, param1, param2);

    if (view === 'member') {
      return (
        <div className='view' id='leaderboards'>
          <Member membershipType={param1} membershipId={param2} />
        </div>
      );
    } else if (view === 'group') {
      return (
        <div className='view' id='leaderboards'>
          <Group groupId={param1} />
        </div>
      );
    } else {
      return (
        <div className='view' id='leaderboards'>
          <Root />
        </div>
      );
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
)(Leaderboards);
