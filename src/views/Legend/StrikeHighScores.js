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

    let strikes = [
      {
        hash: 3749730895,
        score: 1039797865,
        activity: 3944547192
      },
      {
        hash: 2737678546,
        score: 165166474,
        activity: 743963294
      },
      {
        hash: 3054774873,
        score: 2692332187,
        activity: 117447065
      },
      {
        hash: 1707190649,
        score: 3399168111,
        activity: 1295173537
      },
      {
        hash: 56596211,
        score: 1526865549,
        activity: 1549614516
      },
      {
        hash: 3145627334,
        score: 3951275509,
        activity: 3374205760
      },
      {
        hash: 1336344009,
        score: 2836924866,
        activity: 1360385764
      },
      {
        hash: 2782139949,
        score: 3340846443,
        activity: 442671778
      },
      {
        hash: 256005845,
        score: 2099501667,
        activity: 649648599
      },
      {
        hash: 319759693,
        score: 1060780635,
        activity: 1035135049
      },
      {
        hash: 141268704,
        score: 1329556468,
        activity: 661855681
      },
      {
        hash: 794103965,
        score: 3450793480,
        activity: 1475539136
      },
      {
        hash: 1889144800,
        score: 2282894388,
        activity: 561345572
      },
      {
        hash: 20431832,
        score: 3973165904,
        activity: 286562305
      }
    ];

    let list = strikes.map(strike => {
      let scoreDefinition = manifest.DestinyRecordDefinition[strike.score];
      let scoreRecord = characterRecords[characterId].records[strike.score];
      let strikeRecord = profileRecords[strike.hash];

      let score = scoreRecord.objectives.length === 1 ? scoreRecord.objectives[0].progress : 0;
      let completions = strikeRecord.objectives.length === 1 ? strikeRecord.objectives[0].progress : 0;

      return {
        value: score,
        activity: strike.activity,
        element: (
          <li key={strike.hash} className={cx({ lowScore: score < 100000 })}>
            <div className='name'>{scoreDefinition.displayProperties.name}</div>
            <div className='score'>{score === 0 ? '—' : score.toLocaleString()}</div>
          </li>
        )
      };
    });

    list = orderBy(list, [score => score.value], ['desc']);
    let top = list[0];
    list.unshift({
      element: (
        <li key='header'>
          <div className='name'>Strike</div>
          <div className='score'>High score</div>
        </li>
      )
    });

    let topDefinition = manifest.DestinyActivityDefinition[top.activity];

    let nightfallKills = 0;
    let highscorePGCR;
    let temp = 0;
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
    });
    console.log(temp, highscorePGCR);

    // console.log(PGCRcache.cache.filter(pgcr => pgcr.activityDetails.directorActivityHash === 936308438));

    return (
      <>
        <div className='bg' />
        <div className='top'>
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
