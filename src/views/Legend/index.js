import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import Ranks from './Ranks';
import TimePlayed from './TimePlayed';
import StrikeHighScores from './StrikeHighScores';
import RaidReport from './RaidReport';


import Characters from './Characters';

import './styles.css';

class Legend extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { t } = this.props;

    return (
      <div className={cx('view')} id='legend'>
        <div className='section characters'>
          <Characters />
        </div>
        <div className='section strikes'>
          <StrikeHighScores />
        </div>
        {/* <div className='module strikes'>
          <div className='sub-header sub'>
            <div>Strike high-scores</div>
          </div>
          <StrikeHighScores />
        </div>
        <div className='module strikes'>
          <div className='sub-header sub'>
            <div>Raid report</div>
          </div>
          <RaidReport />
        </div>
        <div className='module ranks'>
          <div className='sub-header sub'>
            <div>Ranks</div>
          </div>
          <Ranks />
        </div> */}
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
)(Legend);
