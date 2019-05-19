import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import ObservedImage from '../ObservedImage';
import * as bungie from '../../utils/bungie';
import * as responseUtils from '../../utils/responseUtils';

import './styles.css';

class MemberLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
    this.mounted = false;
  }

  componentWillMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async componentDidMount() {
    const { type, id } = this.props;

    let response = await bungie.memberProfile(type, id, '200');
    this.data = responseUtils.profileScrubber(response);
    if (this.mounted) {
      this.setState({ loading: false });
    }
    // console.log(this.data);
  }

  render() {
    const { member, type, id, displayName } = this.props;

    return (
      <div className='member-link'>
        <div className='emblem'>{!this.state.loading && this.data ? <ObservedImage className='image' src={`https://www.bungie.net${this.data.characters.data[0].emblemPath}`} /> : null}</div>
        <div className='displayName'>{displayName}</div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    
  };
}

export default compose(connect(mapStateToProps))(MemberLink);
