import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import queryString from 'query-string'

import manifest from '../../../utils/manifest';
import * as bungie from '../../../utils/bungie';
import Button from '../../../components/UI/Button';

import './styles.css';

class OAuthTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    window.scrollTo(0, 0);

    const { t, member, location } = this.props;

    const code = queryString.parse(location.search) && queryString.parse(location.search).code;

    if (code) {
      let response = await bungie.GetOAuthAccessToken({
        client_id: process.env.REACT_APP_BUNGIE_CLIENT_ID,
        grant_type: 'authorization_code',
        code,
      });

      console.log(response)
    }
  }

  render() {
    const { t, member, location } = this.props;

    return (
      <div className='view' id='oauth-test'>
        <Button
          text='Authorize'
          action={() => {
            window.location = `https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&response_type=code`;
          }}
        />
      </div>
    );
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
)(OAuthTest);
