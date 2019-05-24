import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import Board from '../../../components/Board';

import './styles.css';

class Root extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    
  }

  render() {
    const { t, member } = this.props;

    return (
      <div className={cx('view', 'root')} id='leaderboards'>
        <div className='module'>
          <div className='content head'>
            <div className='page-header'>
              <div className='name'>{t('Leaderboards')}</div>
            </div>
            <div className='text'>
              <p>Braytech leaderboards use a dense rank and are sorted by rank in ascending order, followed by display name in ascending order.</p>
            </div>
          </div>
        </div>
        <div className='module'>
          <div className='sub-header alt'>
            <div>{t('Triumph score')}</div>
          </div>
          <div className='content'>
            <Board type='top20' metric='triumphScore' limit='10' focusOnly />
          </div>
        </div>
        <div className='module'>
          <div className='sub-header alt'>
            <div>{t('Collection total')}</div>
          </div>
          <div className='content'>
            <Board type='top20' metric='collectionTotal' limit='10' focusOnly />
          </div>
        </div>
        <div className='module'>
          <div className='sub-header alt'>
            <div>{t('Time played')}</div>
          </div>
          <div className='content'>
            <Board type='top20' metric='timePlayed' limit='10' focusOnly />
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
)(Root);
