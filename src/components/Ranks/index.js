import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';

import Globals from '../../utils/globals';
import { ProfileLink } from '../../components/ProfileLink';
import manifest from '../../utils/manifest';
import ObservedImage from '../../components/ObservedImage';
import MemberLink from '../../components/MemberLink';
import Spinner from '../../components/Spinner';
import * as utils from '../../utils/destinyUtils';
import * as destinyEnums from '../../utils/destinyEnums';

import './styles.css';

class Ranks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      response: false,
      offset: 0,
      sort: this.props.sort || 'triumphScore'
    };
  }

  voluspa = async (offset = 0, sort = 'triumphScore') => {
    const request = await fetch(`https://voluspa-a.braytech.org/?limit=10&offset=${offset}&sort=${sort}`).then(r => r.json());

    if (!request.Response) {
      console.log('fetch error');
    }

    return request.Response;
  }
  
  callVoulspa = async () => {
    this.setState((prevState, props) => {
      prevState.loading = true;
      return prevState;
    });
    let response = await this.voluspa(this.state.offset, this.state.sort);
    this.setState((prevState, props) => {
      prevState.loading = false;
      prevState.response = response;
      return prevState;
    });
  }

  async componentDidMount() {
    window.scrollTo(0, 0);

    this.callVoulspa();
  }

  render() {
    const { t, member } = this.props;

    let list = [];

    if (this.state.response) {

      let data = this.state.response.data;

      console.log(data);

      data.forEach((member, index) => {

        let characters = Object.values(member.characters).sort(function(a, b) {
          return parseInt(b.minutesPlayedTotal) - parseInt(a.minutesPlayedTotal);
        });
        let lastCharacter = characters[0];

        list.push({
          membershipId: member.destinyUserInfo.membershipId,
          element: (
            <li key={member.destinyUserInfo.membershipId}>
              <div className='col'>
                <div className='rank'>{member.rank}</div>
              </div>
              <div className='col'>
                <MemberLink {...member.destinyUserInfo} />
              </div>
              <div className='col'>
                <div className='triumphScore'>{member.triumphScore.toLocaleString()}</div>
              </div>
            </li>
          )
        });
      });

      return <ul className={cx('list', 'ranks')}>{list.map(member => member.element)}</ul>;
    } else {
      return <Spinner mini />
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
)(Ranks);
