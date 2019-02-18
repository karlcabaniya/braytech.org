import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';

import manifest from '../../utils/manifest';
import * as utils from '../../utils/destinyUtils';
import * as bungie from '../../utils/bungie';
import getPGCR from '../../utils/getPGCR';
import ObservedImage from '../../components/ObservedImage';

class StrikeHighScores extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    const { member, PGCRcache } = this.props;
    
    let charactersIds = member.data.profile.characters.data.map(c => c.characterId);

    // console.log(charactersIds)

    let requests = charactersIds.map(async c => {
      let response = await bungie.activityHistory(member.membershipType, member.membershipId, c, 250, '46', 0);
      return response.activities;
    });

    let activities = await Promise.all(requests);
    activities = activities.flat();

    // console.log(activities);

    activities.forEach(activity => {
      if (PGCRcache[member.membershipId] && !PGCRcache[member.membershipId].find(pgcr => pgcr.activityDetails.instanceId === activity.activityDetails.instanceId)) {
        return getPGCR(member.membershipId, activity.activityDetails.instanceId);
      } else if (!PGCRcache[member.membershipId]) {
        return getPGCR(member.membershipId, activity.activityDetails.instanceId);
      } else {

      }
    });

  }

  render() {
    const { t, member, PGCRcache } = this.props;
    const characterIds = member.data.profile.characters.data.map(c => c.characterId);

    let nightfalls = [
      {
        directorActivityHash: 936308438,
        name: 'Nightfall: A Garden World'
      },
      {
        directorActivityHash: 1282886582,
        name: 'Nightfall: Exodus Crash'
      },
      {
        directorActivityHash: 3372160277,
        name: 'Nightfall: Lake of Shadows'
      },
      {
        directorActivityHash: 3280234344,
        name: 'Nightfall: Savathûn\'s Song'
      },
      {
        directorActivityHash: 522318687,
        name: 'Nightfall: Strange Terrain'
      },
      {
        directorActivityHash: 3145298904,
        name: 'Nightfall: The Arms Dealer'
      },
      {
        directorActivityHash: 3034843176,
        name: 'Nightfall: The Corrupted'
      },
      {
        directorActivityHash: 3701132453,
        name: 'Nightfall: The Hollowed Lair'
      },
      {
        directorActivityHash: 1034003646,
        name: 'Nightfall: The Insight Terminus'
      },
      {
        directorActivityHash: 4259769141,
        name: 'Nightfall: The Inverted Spire'
      },
      {
        directorActivityHash: 3289589202,
        name: 'Nightfall: The Pyramidion'
      },
      {
        directorActivityHash: 3718330161,
        name: 'Nightfall: Tree of Probabilities'
      },
      {
        directorActivityHash: 3108813009,
        name: 'Nightfall: Warden of Nothing'
      },
      {
        directorActivityHash: 272852450,
        name: 'Nightfall: Will of the Thousands'
      }
    ];

    let sumKills = 0;
    let sumCleared = 0;
    let sumDuration = 0;
    if (PGCRcache[member.membershipId]) {
      PGCRcache[member.membershipId].forEach(pgcr => {
        let nightfall = nightfalls.find(nf => nf.directorActivityHash === pgcr.activityDetails.directorActivityHash);
        if (!nightfall) {
          return;
        }

        let entry = pgcr.entries.find(entry => characterIds.includes(entry.characterId));
        if (entry) {
          sumKills = sumKills + entry.values.kills.basic.value;
          sumDuration = sumDuration + entry.values.activityDurationSeconds.basic.value
          if (entry.values.completed.basic.value === 1) {
            sumCleared = sumCleared + entry.values.completed.basic.value;
          }
        }

        let sumScore = 0
        let highScore = nightfall.score || 0;
        pgcr.entries.forEach(entry => {
          sumScore = sumScore + entry.score.basic.value;
        });
        if (sumScore > highScore) {
          nightfall.score = sumScore;
        }

      });
    }

    let list = nightfalls.map(nf => {
      let definition = manifest.DestinyActivityDefinition[nf.directorActivityHash];

      return {
        score: nf.score || 0,
        definition: definition,
        element: (
          <li key={definition.hash} className={cx({ lowScore: (nf.score || 0) < 100000 })}>
            <div className='name'>{definition.displayProperties.name.replace('Nightfall: ','')}</div>
            <div className='score'>{!nf.score ? '—' : nf.score.toLocaleString()}</div>
          </li>
        )
      };
    });

    list = orderBy(list, [nf => nf.score], ['desc']);
    let topNightfall = list[0];
    list.unshift({
      element: (
        <li key='header'>
          <div className='name'>Strike</div>
          <div className='score'>High score</div>
        </li>
      )
    });

    return (
      <>
        <div className='bg' />
        <div className='top'>
        {topNightfall ? <>
          <ObservedImage className='image' src={`https://www.bungie.net${topNightfall.definition.pgcrImage}`} />
          <div className='head'>
            <div className='page-header'>
              <div className='name'>{t('Nightfall strikes')}</div>
              <div className='description'>{t('Your hard-won high scores from your fight against the most feared minions of the Darkness')}</div>
            </div>
          </div>
          <div className='text'>
            <div className='name'>{topNightfall.definition.displayProperties.name.replace('Nightfall: ','')}</div>
            <div className='score'>{topNightfall.score.toLocaleString()}</div>
          </div></> : null}
        </div>
        <div className='chart'>
          <ul className='list'>{list.map(item => item.element)}</ul>
        </div>
        <div className='datum'>
          <div className='d'>
            <div className='v'>{sumKills.toLocaleString()}</div>
            <div className='n'>{t('kills')}</div>
          </div>
          <div className='d'>
            <div className='v'>{sumCleared.toLocaleString()}</div>
            <div className='n'>{t('completed')}</div>
          </div>
          <div className='d'>
            <div className='v'>{Math.floor(parseInt(sumDuration) / 1440)}</div>
            <div className='n'>{Math.floor(parseInt(sumDuration) / 1440) === 1 ? t('day played') : t('days played')}</div>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    PGCRcache: state.PGCRcache
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(StrikeHighScores);
