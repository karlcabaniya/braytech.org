import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { cloneDeep, orderBy } from 'lodash';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';

import './styles.css';

class Maps extends React.Component {
  render() {
    const { t, hash } = this.props;

    

    // if (!definitionActivity) {
    //   console.warn('Hash not found');
    //   return null;
    // }

    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', 'common')}>
          <div className='header'>
            <div className='name'>Classified</div>
            <div>
              <div className='kind'>Insufficient clearance</div>
            </div>
          </div>
          <div className='black'>
            <div className='description'>
              <pre>Keep it clean.</pre>
            </div>
          </div>
        </div>
      </>
    );
    
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    viewport: state.viewport,
    tooltips: state.tooltips
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(Maps);
