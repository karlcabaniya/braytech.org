import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import * as voluspa from '../../utils/voluspa';
import MemberLink from '../MemberLink';
import Spinner from '../UI/Spinner';
import Button from '../UI/Button';

import './styles.css';

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      response: []
    };
  }

  limit = 1000;
  offset = Math.floor(parseInt(this.props.offset, 10)/this.limit) * this.limit;
  callVoluspa = async (offset = this.offset, limit = this.limit) => {
    let response = await voluspa.leaderboard('triumphScore', offset, limit);
    this.setState((prevState, props) => {
      prevState.loading = false;
      //prevState.response = prevState.response.concat(response.data);
      prevState.response = response.data;
      return prevState;
    });
    // console.log(this.data);
  };

  componentDidMount() {
    this.callVoluspa();
  }

  componentDidUpdate(prevProps, prevState) {

    if (prevProps.offset !== this.props.offset) {
      const prevDisplayOffset = parseInt(prevProps.offset, 10) || 0;
      const prevDisplayLimit = parseInt(prevProps.limit, 10) || 20;
      const displayOffset = parseInt(this.props.offset, 10) || 0;
      const displayLimit = parseInt(this.props.limit, 10) || 20;

      if (Math.floor(prevDisplayOffset/this.limit) * this.limit !== Math.floor(displayOffset/this.limit) * this.limit) {
        this.offset = Math.floor(displayOffset/this.limit) * this.limit;
        this.setState({ loading: true });
        this.callVoluspa();
      }
    }
  }

  render() {
    const displayOffset = parseInt(this.props.offset, 10) || 0;
    const displayLimit = parseInt(this.props.limit, 10) || 20;

    console.log(displayOffset % this.limit, (displayOffset % this.limit) + 20)

    if (!this.state.loading) {
      return (
        <>
          <ul className='list board'>
            <li className='header'>
              <ul>
                <li className='col rank' />
                <li className='col member'>Member</li>
                <li className='col triumphScore'>Triumph score</li>
              </ul>
            </li>
            {this.state.response.slice(displayOffset % this.limit, (displayOffset % this.limit) + 20).map((m, i) => {
              return (
                <li key={(m.destinyUserInfo.membershipType + m.destinyUserInfo.membershipId)}>
                  <ul>
                    <li className='col rank'>{m.rank.toLocaleString('en-us')}</li>
                    <li className='col member'>
                      <MemberLink type={m.destinyUserInfo.membershipType} id={m.destinyUserInfo.membershipId} displayName={m.destinyUserInfo.displayName} />
                    </li>
                    <li className='col triumphScore'>{m.triumphScore.toLocaleString('en-us')}</li>
                  </ul>
                </li>
              );
            })}
          </ul>
          <div className='pages'>
            <Button classNames='previous' text='Previous page' disabled={displayOffset === 0 ? true : false} anchor to={`/leaderboards/for/triumphs${displayOffset > displayLimit ? `/${displayOffset - displayLimit}` : ''}`} />
            <Button classNames='next' text='Next page' disabled={false} anchor to={`/leaderboards/for/triumphs/${displayOffset + displayLimit}`} />
          </div>
        </>
      );
    } else {
      return <Spinner />;
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
)(Board);
