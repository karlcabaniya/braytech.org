import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../../utils/manifest';
import * as enums from '../../../../utils/destinyEnums';
import Collectibles from '../../../../components/Collectibles';
import Records from '../../../../components/Records';

import './styles.css';

class Nightfalls extends React.Component {
  render() {
    const { t, member } = this.props;
    const characterActivities = member.data.profile.characterActivities.data;

    const nightfalls = [];

    const weeklyNightfallStrikeActivities = characterActivities[member.characterId].availableActivities.filter(a => {
      if (!a.activityHash) return false;

      const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

      if (definitionActivity && definitionActivity.activityModeTypes && definitionActivity.activityModeTypes.includes(46) && !definitionActivity.guidedGame && definitionActivity.modifiers && definitionActivity.modifiers.length > 2) return true;

      return false;
    });

    // const weeklyNightfallStrikesOrdeal = Object.keys(enums.nightfalls)
    //   .filter(k => enums.nightfalls[k].ordealHashes.find(o => weeklyNightfallStrikeActivities.find(w => w.activityHash === o)))
    //   .map(h => ({ activityHash: h }));
    const weeklyNightfallStrikesScored = weeklyNightfallStrikeActivities.filter(w => !Object.keys(enums.nightfalls).find(k => enums.nightfalls[k].ordealHashes.find(o => o === w.activityHash)));

    weeklyNightfallStrikesScored.forEach(activity => {
      const nightfall = manifest.DestinyActivityDefinition[activity.activityHash];

      if (enums.nightfalls[nightfall.hash].collectibles.length < 1 && enums.nightfalls[nightfall.hash].triumphs.length < 1) return;

      nightfalls.push(
        <React.Fragment key={nightfall.hash}>
          <div className='module-header'>
            <div className='sub-name'>{t('Nightfall')}</div>
            <div className='name'>{nightfall.selectionScreenDisplayProperties.name}</div>
          </div>
          {enums.nightfalls[nightfall.hash].collectibles.length ? (
            <>
              <h4>{t('Collectibles')}</h4>
              <ul className='list collection-items'>
                <Collectibles selfLinkFrom='/this-week' hashes={enums.nightfalls[nightfall.hash].collectibles} />
              </ul>
            </>
          ) : null}
          {enums.nightfalls[nightfall.hash].triumphs.length ? (
            <>
              <h4>{t('Triumphs')}</h4>
              <ul className='list record-items'>
                <Records selfLinkFrom='/this-week' hashes={enums.nightfalls[nightfall.hash].triumphs} ordered />
              </ul>
            </>
          ) : null}
        </React.Fragment>
      );
    });

    return nightfalls
      .map(n => ({
        className: [],
        mods: [
          {
            className: [],
            component: n
          }
        ]
      }))
      .map((col, c) => {
        return (
          <div key={c} className={cx('column', ...col.className)}>
            {col.mods.map((mod, m) => {
              return (
                <div key={m} className={cx('module', ...mod.className)}>
                  {mod.component}
                </div>
              );
            })}
          </div>
        );
      });
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(Nightfalls);
