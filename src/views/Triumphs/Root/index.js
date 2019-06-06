import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import { ProfileLink } from '../../../components/ProfileLink';
import ObservedImage from '../../../components/ObservedImage';
import { enumerateRecordState } from '../../../utils/destinyEnums';
import RecordsAlmost from '../../../components/RecordsAlmost';
import RecordsTracked from '../../../components/RecordsTracked';
import NotificationInline from '../../../components/Notifications/NotificationInline';

class Root extends React.Component {
  render() {
    const { t } = this.props;
    const characterId = this.props.member.characterId;

    const characters = this.props.member.data.profile.characters.data;
    const genderHash = characters.find(character => character.characterId === characterId).genderHash;
    const profileRecords = this.props.member.data.profile.profileRecords.data.records;
    const characterRecords = this.props.member.data.profile.characterRecords.data;

    const sealBars = {
      2588182977: {
        image: '037E-00001367.png'
      },
      3481101973: {
        image: '037E-00001343.png'
      },
      147928983: {
        image: '037E-0000134A.png'
      },
      2693736750: {
        image: '037E-0000133C.png'
      },
      2516503814: {
        image: '037E-00001351.png'
      },
      1162218545: {
        image: '037E-00001358.png'
      },
      2039028930: {
        image: '0560-000000EB.png'
      },
      991908404: {
        image: '0560-0000107E.png'
      },
      3170835069: {
        image: '0560-00006583.png'
      }
    };

    let parent = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.recordsRootNode];
    let sealsParent = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.medalsRootNode];

    let nodes = [];
    let sealNodes = [];
    let recordsStates = [];

    parent.children.presentationNodes.forEach(child => {
      let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];
      let states = [];

      node.children.presentationNodes.forEach(nodeChild => {
        let nodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChild.presentationNodeHash];
        nodeChildNode.children.presentationNodes.forEach(nodeChildNodeChild => {
          let nodeChildNodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChildNodeChild.presentationNodeHash];
          if (nodeChildNodeChildNode.redacted) {
            // console.log(nodeChildNodeChildNode)
            return;
          }
          nodeChildNodeChildNode.children.records.forEach(record => {
            let scope = profileRecords[record.recordHash] ? profileRecords[record.recordHash] : characterRecords[characterId].records[record.recordHash];
            let def = manifest.DestinyRecordDefinition[record.recordHash] || false;
            if (scope) {
              scope.hash = record.recordHash;
              scope.scoreValue = def && def.completionInfo ? def.completionInfo.ScoreValue : 0;
              states.push(scope);
              recordsStates.push(scope);
            } else {
              // console.log(`107 Undefined state for ${record.recordHash}`);
              // states.push({ state: 0 });
              // recordsStates.push({ state: 0 });
            }
          });
        });
      });

      // console.log(
      //   node.displayProperties.name,
      //   states.length,
      //   states.filter(record => enumerateRecordState(record.state).canEquipTitle).length,
      //   states.filter(record => enumerateRecordState(record.state).entitlementUnowned).length,
      //   states.filter(record => enumerateRecordState(record.state).invisible).length,
      //   states.filter(record => enumerateRecordState(record.state).objectiveNotCompleted).length,
      //   states.filter(record => enumerateRecordState(record.state).obscured).length,
      //   states.filter(record => enumerateRecordState(record.state).recordRedeemed).length,
      //   states.filter(record => enumerateRecordState(record.state).rewardUnavailable).length
      // );
      // console.log(
      //   node.displayProperties.name,
      //   states.length - states.filter(record => enumerateRecordState(record.state).invisible).length - states.filter(record => enumerateRecordState(record.state).obscured).length
      // )

      let nodeCompleted = states.filter(record => enumerateRecordState(record.state).recordRedeemed).length;
      let nodeTotal = states.filter(record => !enumerateRecordState(record.state).invisible).length;

      nodes.push(
        <li key={node.hash} className='linked'>
          <div className='progress-bar-background' style={{ width: `${(nodeCompleted / nodeTotal) * 100}%` }} />
          <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${node.originalIcon}`} />
          <div className='displayProperties'>
            <div className='name'>{node.displayProperties.name}</div>
            <div className='value'>
              <span>{nodeCompleted}</span> / {nodeTotal}
            </div>
          </div>
          <ProfileLink to={`/triumphs/${node.hash}`} />
        </li>
      );
    });

    sealsParent.children.presentationNodes.forEach(child => {
      let definitionSeal = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];
      let states = [];

      if (definitionSeal.redacted) {
        return;
      }

      definitionSeal.children.records.forEach(record => {
        let scope = profileRecords[record.recordHash] ? profileRecords[record.recordHash] : characterRecords[characterId].records[record.recordHash];
        if (scope) {
          states.push(scope);
        } else {
          // console.log(`138 Undefined state for ${record.recordHash}`);
        }
      });

      let progress = profileRecords[definitionSeal.completionRecordHash].objectives[0].progress;
      let total = profileRecords[definitionSeal.completionRecordHash].objectives[0].completionValue;
      let isComplete = progress === total ? true : false;

      sealNodes.push({
        completed: isComplete,
        element: (
          <li
            key={definitionSeal.hash}
            className={cx('linked', {
              completed: isComplete
            })}
          >
            <div className='progress-bar-background' style={{ width: `${(progress / total) * 100}%` }} />
            <ObservedImage className={cx('image', 'icon')} src={sealBars[definitionSeal.hash] ? `/static/images/extracts/badges/${sealBars[definitionSeal.hash].image}` : `https://www.bungie.net${definitionSeal.displayProperties.icon}`} />
            <div className='displayProperties'>
              <div className='name'>{definitionSeal.displayProperties.name}</div>
              <div className='value'>
                <span>{progress}</span> / {total}
              </div>
            </div>
            <ProfileLink to={`/triumphs/seal/${definitionSeal.hash}`} />
          </li>
        )
      });
    });

    let unredeemedTriumphCount = recordsStates.filter(record => !enumerateRecordState(record.state).recordRedeemed && !enumerateRecordState(record.state).objectiveNotCompleted).length;

    let potentialScoreGain = recordsStates.filter(record => !enumerateRecordState(record.state).recordRedeemed && !enumerateRecordState(record.state).objectiveNotCompleted).reduce((currentValue, unredeemedTriumph) => {
      return unredeemedTriumph.scoreValue + currentValue;
    }, 0);

    return (
      <>
        <div className='module'>
          <div className='sub-header sub'>
            <div>{t('Total score')}</div>
          </div>
          <div className='total-score'>{this.props.member.data.profile.profileRecords.data.score}</div>
          {unredeemedTriumphCount > 0 ? <NotificationInline name='Unredeemed triumphs' description={potentialScoreGain > 0 ? `You have ${unredeemedTriumphCount} triumph ${unredeemedTriumphCount === 1 ? `record` : `records`} worth ${potentialScoreGain} score to redeem` : `You have ${unredeemedTriumphCount} triumph ${unredeemedTriumphCount === 1 ? `record` : `records`} to redeem`} /> : null}
          <div className='sub-header sub'>
            <div>{t('Triumphs')}</div>
            <div>
              {recordsStates.filter(record => enumerateRecordState(record.state).recordRedeemed).length}/{recordsStates.filter(record => !enumerateRecordState(record.state).invisible).length}
            </div>
          </div>
          <ul className='list parents'>{nodes}</ul>
          <div className='sub-header sub'>
            <div>{t('Seals')}</div>
            <div>{sealNodes.filter(n => n.completed).length}/{sealNodes.length}</div>
          </div>
          <ul className='list parents seals'>{sealNodes.map(n => n.element)}</ul>
        </div>
        <div className='module'>
          <div className='sub-header sub'>
            <div>{t('Almost complete')}</div>
          </div>
          <div className='almost-complete'>
            <RecordsAlmost {...this.props} limit='4' selfLinkFrom='/triumphs' pageLink />
          </div>
        </div>
        <div className='module'>
          <div className='sub-header sub'>
            <div>{t('Tracked records')}</div>
          </div>
          <div className='tracked'>
            <RecordsTracked {...this.props} limit='4' selfLinkFrom='/triumphs' pageLink />
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    theme: state.theme
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Root);
