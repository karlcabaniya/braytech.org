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
    const { member } = this.props;
    
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
      return getPGCR(activity.activityDetails.instanceId)
    });

  }

  render() {
    const { t, member, PGCRcache } = this.props;
    const characterId = member.characterId;
    const profileRecords = member.data.profile.profileRecords.data.records;
    const characterRecords = member.data.profile.characterRecords.data;

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

    // let list = strikes.map(strike => {
    //   let scoreDefinition = manifest.DestinyRecordDefinition[strike.score];
    //   let scoreRecord = characterRecords[characterId].records[strike.score];
    //   let strikeRecord = profileRecords[strike.hash];

    //   let score = scoreRecord.objectives.length === 1 ? scoreRecord.objectives[0].progress : 0;
    //   let completions = strikeRecord.objectives.length === 1 ? strikeRecord.objectives[0].progress : 0;

    //   return {
    //     value: score,
    //     activity: strike.activity,
    //     element: (
    //       <li key={strike.hash} className={cx({ lowScore: score < 100000 })}>
    //         <div className='name'>{scoreDefinition.displayProperties.name}</div>
    //         <div className='score'>{score === 0 ? '—' : score.toLocaleString()}</div>
    //       </li>
    //     )
    //   };
    // });

    // list = orderBy(list, [score => score.value], ['desc']);
    // let top = list[0];
    // list.unshift({
    //   element: (
    //     <li key='header'>
    //       <div className='name'>Strike</div>
    //       <div className='score'>High score</div>
    //     </li>
    //   )
    // });

    // let topDefinition = manifest.DestinyActivityDefinition[top.activity];

    let nightfallKills = 0;
    let highscorePGCR;
    let temp = 0;let nfs = [];
    let characterIds = member.data.profile.characters.data.map(c => c.characterId);
    PGCRcache.cache.forEach(pgcr => {
      let entry = pgcr.entries.find(entry => characterIds.includes(entry.characterId));
      if (entry) {
        nightfallKills = nightfallKills + entry.values.kills.basic.value
      }
      let ttemp = 0;
      pgcr.entries.forEach(entry => {
        ttemp = ttemp + entry.score.basic.value;
      });
      if (ttemp > temp) {
        temp = ttemp;
        highscorePGCR = pgcr;
      }
      let nf = nfs.find(nf => nf.directorActivityHash === pgcr.activityDetails.directorActivityHash);
      if (nf) {
        if (ttemp > nf.score) {
          nf.score = ttemp;
        }
      } else {
        nfs.push({
          directorActivityHash: pgcr.activityDetails.directorActivityHash,
          name: manifest.DestinyActivityDefinition[pgcr.activityDetails.directorActivityHash].displayProperties.name,
          // score: ttemp
        })
      }
    });
    console.log(temp, highscorePGCR);

    // nfs = orderBy(nfs, [nf => nf.name], ['asc']);

    // console.log(nfs)

    // console.log(PGCRcache.cache.filter(pgcr => pgcr.activityDetails.directorActivityHash === 936308438));

    return (
      <>
        <div className='bg' />
        {/* <div className='top'>
          <ObservedImage className='image' src={`https://www.bungie.net${topDefinition.pgcrImage}`} />
          <div className='head'>
            <div className='page-header'>
              <div className='name'>{t('Nightfall strikes')}</div>
              <div className='description'>{t('Your hard-won high scores from your fight against the most feared minions of the Darkness')}</div>
            </div>
          </div>
          <div className='text'>
            <div className='name'>{topDefinition.displayProperties.name}</div>
            <div className='score'>{top.value.toLocaleString()}</div>
          </div>
        </div>
        <div className='chart'>
          <ul className='list'>{list.map(item => item.element)}</ul>
        </div>
        <div className='datum'>
          <div className='d'>
            <div className='v'>{nightfallKills}</div>
            <div className='n'>{t('kills')}</div>
          </div>
        </div> */}
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
