import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import * as voluspa from '../../../utils/voluspa';
import MemberLink from '../../../components/MemberLink';
import Spinner from '../../../components/UI/Spinner';
import Button from '../../../components/UI/Button';
import Board from '../../../components/Board';

import './styles.css';

class For extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  componentDidMount() {}

  render() {
    const { t, member, dom, sub } = this.props;

    return (
      <div className={cx('view', 'board')} id='leaderboards'>
        <div className='module'>
          <div className='content head'>
            <div className='page-header'>
              <div className='name'>{t('Triumphs')}</div>
              <div className='description'>{t('You know, in case you missed the match summary screen while you were busy being awesome.')}</div>
            </div>
          </div>
        </div>
        <div className='module'>
          <div className='content'>
            <Board offset={sub ? parseInt(sub, 10) : 0} limit='20' />
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
