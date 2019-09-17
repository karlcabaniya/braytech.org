import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';
import { bookCovers } from '../../../utils/destinyEnums';
import { checklists, lookup } from '../../../utils/checklists';

import './styles.css';

class Checklist extends React.Component {
  render() {
    const { t, hash } = this.props;

    const checklistEntry = lookup({ key: 'checklistHash', value: hash });

    if (!checklistEntry) {
      console.warn('Hash not found');
      return null;
    }

    const checklist = checklistEntry.checklistId && checklists[checklistEntry.checklistId]({ requested: { key: 'checklistHash', array: [checklistEntry.checklistHash] } });
    const checklistItem = checklist && checklist.items && checklist.items.length && checklist.items[0];

    // console.log(checklist)

    if (checklistEntry.checklistId === '4178338182') {
      checklist.checklistIcon = (
        <span className='destiny-adventure2'>
          <span className='path1' />
          <span className='path2' />
          <span className='path3' />
          <span className='path4' />
          <span className='path5' />
          <span className='path6' />
        </span>
      )
    } else {
      checklist.checklistIcon = (
        <span className={cx(checklist.checklistIcon)} />
      )
    }

    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', 'map', 'checklist')}>
          <div className='header'>
            <div className='icon'>
              {checklist.checklistIcon}
            </div>
            <div className='text'>
              <div className='name'>{checklistItem.formatted.name}{checklistItem.formatted.suffix ? ` ${checklistItem.formatted.suffix}` : null}</div>
              <div>
                <div className='kind'>{t(checklist.checklistName)}</div>
              </div>
            </div>
          </div>
          <div className='black'>
            <div className='description'>
              <div className='destination'>{checklistItem.formatted.locationExt}</div>
            </div>
            {checklistItem.completed ? (
              <div className='completed'>{t('Completed')}</div>
            ) : null}
          </div>
        </div>
      </>
    );
    
  }
}

class Record extends React.Component {
  render() {
    const { t, hash } = this.props;

    const checklistEntry = lookup({ key: 'recordHash', value: hash });

    if (!checklistEntry) {
      console.warn('Hash not found');
      return null;
    }

    const checklist = checklistEntry.checklistId && checklists[checklistEntry.checklistId]({ requested: { key: 'recordHash', array: [checklistEntry.recordHash] } });
    const checklistItem = checklist && checklist.items && checklist.items.length && checklist.items[0];

    const definitionRecord = manifest.DestinyRecordDefinition[checklistItem.recordHash];
    const definitionParentNode = definitionRecord && manifest.DestinyPresentationNodeDefinition[definitionRecord.presentationInfo.parentPresentationNodeHashes[0]];

    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', 'map', 'record', 'lore')}>
          <div className='header'>
            <div className='icon'>
              <span className='destiny-ishtar' />
            </div>
            <div className='text'>
              <div className='name'>{checklistItem.formatted.name}{checklistItem.formatted.suffix ? ` ${checklistItem.formatted.suffix}` : null}</div>
              <div>
                <div className='kind'>{t('Record')}</div>
              </div>
            </div>
          </div>
          <div className='black'>
            {definitionParentNode ? (
              <div className='book'>
                <div className='cover'>
                  <ObservedImage className='image' src={`/static/images/extracts/books/${bookCovers[definitionParentNode.hash]}`} />
                </div>
                <div className='text'>
                  <div className='name'>{definitionParentNode.displayProperties.name}</div>
                  <div className='kind'>{t('Book')}</div>
                </div>
              </div>
            ) : null}
            <div className='description'>
              <div className='destination'>{checklistItem.formatted.locationExt}</div>
            </div>
            {checklistItem.completed ? (
              <div className='completed'>{t('Completed')}</div>
            ) : null}
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

Record = compose(
  connect(mapStateToProps),
  withTranslation()
)(Record);

export { Checklist, Record };
