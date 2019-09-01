import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { cloneDeep, orderBy } from 'lodash';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';

import './styles.css';

class Activity extends React.Component {
  render() {
    let { t, hash, table, mode = [] } = this.props;

    let definitionActivity = cloneDeep(manifest[table][hash]);

    if (!definitionActivity) {
      console.warn('Hash not found');
      return null;
    }

    let lol = manifest.DestinyMilestoneDefinition[1300394968].activities.concat([{activityHash:2307090074}, {activityHash:2067233851}, {activityHash:185515551}, {activityHash:1063969232}, {activityHash:1773400654}]).map(m => {
      return manifest.DestinyActivityDefinition[m.activityHash].displayProperties.name;
    }).map(n => n.replace('(Heroic)','').trim());

    let lol2 = manifest.DestinyMilestoneDefinition[1300394968].activities.concat([{activityHash:2307090074}, {activityHash:2067233851}, {activityHash:185515551}, {activityHash:1063969232}, {activityHash:1773400654}]).map(m => {
      return m.activityHash;
    });

    let lol3 = lol2.filter(function(elem, index, self) {
      return index == self.indexOf(elem);
    });

    let lol4 = Object.values(manifest.DestinyActivityDefinition).filter(m => m.displayProperties && m.displayProperties.name && lol.includes(m.displayProperties.name.replace('(Heroic)','').trim()))

    let lol5 = lol4.map(m => {
      return m.hash;
    }).concat(lol2);

    let lol6 = lol5.filter(function(elem, index, self) {
      return index == self.indexOf(elem);
    });

    console.log(JSON.stringify(lol6), lol4.map(d => d.displayProperties.name).map(n => n.replace('(Heroic)','').trim()).filter(function(elem, index, self) {
      return index == self.indexOf(elem);
    }))

    if (definitionActivity.redacted) {
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
    } else {

      const activityType = (activityModeHashes = []) => {
        if (activityModeHashes.includes(1686739444)) {
          return 'story';
        } else if (activityModeHashes.includes(2394616003)) {
          return 'strike';
        } else if (activityModeHashes.includes(1164760504)) {
          return 'crucible';
        } else if (activityModeHashes.includes(3894474826)) {
          return 'reckoning';
        }
      }

      const modeFiltered = activityType(definitionActivity.activityModeHashes.concat(mode));

      let activityTypeDisplay = {
        name: definitionActivity.selectionScreenDisplayProperties && definitionActivity.selectionScreenDisplayProperties.name ? definitionActivity.selectionScreenDisplayProperties.name : definitionActivity.displayProperties && definitionActivity.displayProperties.name ? definitionActivity.displayProperties.name : t('Unknown'),
        
        description: definitionActivity.selectionScreenDisplayProperties && definitionActivity.selectionScreenDisplayProperties.description ? definitionActivity.selectionScreenDisplayProperties.description : definitionActivity.displayProperties && definitionActivity.displayProperties.description ? definitionActivity.displayProperties.description : t('Unknown'),
        
        destination:
          definitionActivity.destinationHash && manifest.DestinyDestinationDefinition[definitionActivity.destinationHash].displayProperties
            ? {
                ...manifest.DestinyDestinationDefinition[definitionActivity.destinationHash].displayProperties,
                place: manifest.DestinyDestinationDefinition[definitionActivity.destinationHash].placeHash && manifest.DestinyPlaceDefinition[manifest.DestinyDestinationDefinition[definitionActivity.destinationHash].placeHash].displayProperties && manifest.DestinyPlaceDefinition[manifest.DestinyDestinationDefinition[definitionActivity.destinationHash].placeHash].displayProperties.name
              }
            : false,
        
        activityLightLevel: definitionActivity.activityLightLevel,

        icon: <span className='destiny-patrol' />
      };
      console.log(definitionActivity)

      if (modeFiltered === 'story')
        activityTypeDisplay = {
          ...activityTypeDisplay,
          name: definitionActivity.selectionScreenDisplayProperties && definitionActivity.selectionScreenDisplayProperties.name,
          mode: manifest.DestinyActivityTypeDefinition[1686739444].displayProperties.name,
          className: 'story',
          icon: (
            <span className='destiny-quest2'>
              <span className='path1' />
              <span className='path2' />
              <span className='path3' />
              <span className='path4' />
              <span className='path5' />
              <span className='path6' />
            </span>
          )
        };

      if (modeFiltered === 'crucible')
        activityTypeDisplay = {
          ...activityTypeDisplay,
          className: 'crucible',
          activityLightLevel: false,
          icon: <span className='destiny-crucible' />
        };

      if (modeFiltered === 'reckoning')
        activityTypeDisplay = {
          ...activityTypeDisplay,
          mode: definitionActivity.originalDisplayProperties && definitionActivity.originalDisplayProperties.name,
          className: 'reckoning',
          icon: <span className='destiny-reckoning' />
        };

      if (modeFiltered === 'strike')
        activityTypeDisplay = {
          ...activityTypeDisplay,
          name: definitionActivity.selectionScreenDisplayProperties && definitionActivity.selectionScreenDisplayProperties.name,
          mode: manifest.DestinyActivityTypeDefinition[2884569138].displayProperties.name,
          className: 'strike',
          icon: <span className='destiny-strike' />
        };

      if (modeFiltered === 'adventure')
        activityTypeDisplay = {
          ...activityTypeDisplay,
          icon: (
            <span className='destiny-adventure2'>
              <span className='path1' />
              <span className='path2' />
              <span className='path3' />
              <span className='path4' />
              <span className='path5' />
              <span className='path6' />
            </span>
          )
        };

      return (
        <>
          <div className='acrylic' />
          <div className={cx('frame', 'activity', activityTypeDisplay.className)}>
            <div className='header'>
              <div className='icon'>{activityTypeDisplay.icon}</div>
              <div className='text'>
                <div className='name'>{activityTypeDisplay.name}</div>
                <div>
                  <div className='kind'>{activityTypeDisplay.mode}</div>
                </div>
              </div>
            </div>
            <div className='black'>
              {definitionActivity.pgcrImage && definitionActivity.pgcrImage !== '/img/theme/destiny/bgs/pgcrs/placeholder.jpg' ? (
                <div className='screenshot'>
                  <ObservedImage className='image' src={`https://www.bungie.net${definitionActivity.pgcrImage}`} />
                </div>
              ) : null}
              <div className='description'>
                {activityTypeDisplay.destination ? (
                  <div className='destination'>
                    {activityTypeDisplay.destination.name !== activityTypeDisplay.destination.place && !activityTypeDisplay.destination.name.includes(activityTypeDisplay.destination.place) ? (
                      <>
                        {activityTypeDisplay.destination.name}, {activityTypeDisplay.destination.place}
                      </>
                    ) : (
                      activityTypeDisplay.destination.name
                    )}
                  </div>
                ) : null}
                <pre>{activityTypeDisplay.description}</pre>
              </div>
              {definitionActivity.timeToComplete ? (
                <div className='time-to-complete'>
                  {t('Time to complete')}: {t('{{number}} minutes', { number: definitionActivity.timeToComplete || 0 })}
                </div>
              ) : null}
              {activityTypeDisplay.activityLightLevel ? (
                <div className='recommended-light'>
                  {t('Recommended Power')}: <span>{activityTypeDisplay.activityLightLevel}</span>
                </div>
              ) : null}
            </div>
          </div>
        </>
      );
    }
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
)(Activity);
