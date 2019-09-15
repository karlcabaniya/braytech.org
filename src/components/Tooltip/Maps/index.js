import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import { checklists, lookup } from '../../../utils/checklists';

import './styles.css';

class Checklist extends React.Component {
  render() {
    const { t, hash } = this.props;

    const checklistHash = lookup(hash);

    if (!checklistHash) {
      console.warn('Hash not found');
      return null;
    }

    const checklist = checklists[checklistHash]({ requested: [parseInt(hash, 10)] });
    const item = checklist.items && checklist.items.length && checklist.items[0];

    console.log(checklist)

    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', 'map')}>
          <div className='header'>
            <div className='icon'>
              <span className={cx(checklist.checklistIcon)} />
            </div>
            <div className='text'>
              <div className='name'>{item.formatted.name}{item.formatted.suffix ? ` ${item.formatted.suffix}` : null}</div>
              <div>
                <div className='kind'>{t(checklist.checklistName)}</div>
              </div>
            </div>
          </div>
          <div className='black'>
            <div className='description'>
              <div className='destination'>{item.formatted.locationExt}</div>
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
  connect(mapStateToProps),
  withTranslation()
)(Checklist);

export { Checklist };
