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
      loading: true
    };
  }

  callVoluspa = async (offset = 0, limit = 20) => {
    this.data = await voluspa.leaderboard('triumphScore', offset, limit);
    this.setState({ loading: false });
    console.log(this.data);
  };

  componentDidMount() {
    const offset = parseInt(this.props.offset, 10) || 0;
    const limit = parseInt(this.props.limit, 10) || 20;

    this.callVoluspa(offset, limit);
  }

  componentDidUpdate(prevProps, prevState) {

    if (prevProps.offset !== this.props.offset) {
      const offset = parseInt(this.props.offset, 10) || 0;
      const limit = parseInt(this.props.limit, 10) || 20;

      this.setState({ loading: true });
      this.callVoluspa(offset, limit);
    }
  }

  render() {
    const offset = parseInt(this.props.offset, 10) || 0;
    const limit = parseInt(this.props.limit, 10) || 20;

    if (!this.state.loading) {
      return (
        <>
          <ul className='list board'>
            <li className='header'>
              <ul>
                <li className='col rank' />
                <li className='col member'>Member</li>
                <li className='col triumphScore'>Triumph score</li>
                <li className='col collectionTotal'>Collection total</li>
                <li className='col sealsTotal'>Seals total</li>
              </ul>
            </li>
            {this.data.data.map((m, i) => {
              return (
                <li key={i} className=''>
                  <ul>
                    <li className='col rank'>{m.rank.toLocaleString('en-us')}</li>
                    <li className='col member'>
                      <MemberLink type={m.destinyUserInfo.membershipType} id={m.destinyUserInfo.membershipId} displayName={m.destinyUserInfo.displayName} />
                    </li>
                    <li className='col triumphScore'>{m.triumphScore.toLocaleString('en-us')}</li>
                    <li className='col collectionTotal'>{m.collectionTotal.toLocaleString('en-us')}</li>
                    <li className='col sealsTotal'>
                      {Object.values(m.seals)
                        .filter(s => s)
                        .map(s => {
                          return <div />;
                        })}
                    </li>
                  </ul>
                </li>
              );
            })}
          </ul>
          <div className='pages'>
            <Button classNames='previous' text='Previous page' disabled={offset === 0 ? true : false} anchor to={`/leaderboards/for/triumphs${this.props.offset > 0 ? `/${this.props.offset}` : ''}`} />
            <Button classNames='next' text='Next page' disabled={false} anchor to={`/leaderboards/for/triumphs/${offset + limit}`} />
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
