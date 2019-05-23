import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import * as voluspa from '../../../utils/voluspa';
import MemberLink from '../../../components/MemberLink';
import Spinner from '../../../components/UI/Spinner';
import Board from '../../../components/Board';

import './styles.css';

class For extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: false,
      response: false
    };
  }

  callVoluspa = async (membershipType, membershipId) => {
    try {
      let response = await voluspa.leaderboardPosition(membershipType, membershipId);
      if (!response) {
        throw Error;
      }
      this.setState((prevState, props) => {
        prevState.loading = false;
        // prevState.response = prevState.response.concat(response.data);
        prevState.response = response.data;
        return prevState;
      });
      // console.log(this.data);
    } catch (e) {
      this.setState((prevState, props) => {
        prevState.loading = false;
        prevState.error = true;
        return prevState;
      });
    }
  };

  componentDidMount() {
    if (this.props.member.membershipId) {
      this.callVoluspa(this.props.member.membershipType, this.props.member.membershipId);
    }
  }

  render() {
    const { t, member, dom, sub } = this.props;

    return (
      <div className={cx('view', 'for')} id='leaderboards'>
        <div className='module'>
          <div className='content head'>
            <div className='page-header'>
              <div className='name'>{t('Triumphs')}</div>
              <div className='description'>{t('The Braytech leaderboard for triumph score.')}</div>
            </div>
          </div>
          {/* {member.membershipId ? (
            !this.state.loading && !this.state.error ? (
              <div className='content'>
                <div className='position'>
                  <div className='rank'>
                    <div className='name'>Rank</div>
                    <div className='value'>{this.state.response[0].ranks.triumphScore.toLocaleString('en-us')}</div>
                  </div>
                  <div className='triumphScore'>
                    <div className='name'>Score</div>
                    <div className='value'>{this.state.response[0].triumphScore.toLocaleString('en-us')}</div>
                  </div>
                </div>
                <MemberLink type={member.membershipType} id={member.membershipId} groupId={this.state.response[0].destinyUserInfo.groupId} displayName={member.data ? member.data.profile.profile.data.userInfo.displayName : null} />
              </div>
            ) : this.state.error ? null : (
              <Spinner />
            )
          ) : null} */}
        </div>
        <div className='module'>
          <div className='content'>
            <Board offset={sub ? parseInt(sub, 10) : 0} limit='15' />
          </div>
        </div>
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
)(For);
