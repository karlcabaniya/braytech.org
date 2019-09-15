import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { cloneDeep, orderBy } from 'lodash';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import checklists from '../../../data/lowlines/checklists';

import './styles.css';

class Checklist extends React.Component {
  render() {
    const { t, hash } = this.props;

    const checklistHash = Object.keys(checklists).find(key => checklists[key].find(entry => entry.checklistHash === parseInt(hash, 10)));

    const checklistEntry = checklistHash && checklists[checklistHash].find(entry => entry.checklistHash === parseInt(hash, 10));

    console.log(checklistEntry)

    // if (!definitionActivity) {
    //   console.warn('Hash not found');
    //   return null;
    // }

    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', 'map')}>
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

Checklist = compose(
  connect(mapStateToProps)
)(Checklist);

export { Checklist };
