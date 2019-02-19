import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';

import manifest from '../../utils/manifest';
import * as utils from '../../utils/destinyUtils';

class RaidReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  fetchReport = async membershipId => {
    const request = await fetch(`https://b9bv2wd97h.execute-api.us-west-2.amazonaws.com/prod/api/player/${membershipId}`).then(r => r.json());

    if (!request.response) {
      console.log('fetch error');
    }

    return request.response;
  }

  async componentDidMount() {
    const { member } = this.props;

    //console.log(await this.fetchReport(member.membershipId))
  }

  render() {
    const { t, member, PGCRcache } = this.props;

    

    return null;
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
)(RaidReport);
