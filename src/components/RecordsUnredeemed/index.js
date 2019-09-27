import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import { enumerateRecordState } from '../../utils/destinyEnums';
import Records from '../Records';

class RecordsUnredeemed extends React.Component {
  render() {
    const { member, limit, selfLinkFrom = false } = this.props;
    const characterRecords = member && member.data.profile.characterRecords.data;
    const profileRecords = member && member.data.profile.profileRecords.data.records;

    const hashes = [];

    let records = {
      ...profileRecords,
      ...characterRecords[member.characterId].records
    }

    Object.entries(records).forEach(([key, record]) => {
      const definitionRecord = manifest.DestinyRecordDefinition[key];
      
      if (definitionRecord && definitionRecord.redacted) {
        return;
      }

      if (definitionRecord.presentationInfo && definitionRecord.presentationInfo.parentPresentationNodeHashes && definitionRecord.presentationInfo.parentPresentationNodeHashes.length && !enumerateRecordState(record.state).invisible && !enumerateRecordState(record.state).objectiveNotCompleted && !enumerateRecordState(record.state).recordRedeemed) {
        
        // check to see if belongs to transitory expired seal
        const definitionParent = definitionRecord.presentationInfo.parentPresentationNodeHashes.length && manifest.DestinyPresentationNodeDefinition[definitionRecord.presentationInfo.parentPresentationNodeHashes[0]];
        const parentCompletionRecordData = definitionParent && definitionParent.completionRecordHash && definitionParent.scope === 1 ? characterRecords[member.characterId].records[definitionParent.completionRecordHash] : profileRecords[definitionParent.completionRecordHash];

        if (parentCompletionRecordData && enumerateRecordState(parentCompletionRecordData.state).rewardUnavailable && enumerateRecordState(parentCompletionRecordData.state).objectiveNotCompleted) {
          return;
        } else {
          hashes.push(key);
        }

      }

    });

    return (
      <>
        <ul className={cx('list record-items')}>
          <Records selfLink hashes={hashes} ordered='rarity' limit={limit} selfLinkFrom={selfLinkFrom} />
        </ul>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    triumphs: state.triumphs
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(RecordsUnredeemed);