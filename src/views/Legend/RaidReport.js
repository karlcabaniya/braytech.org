import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';

import manifest from '../../utils/manifest';
import ObservedImage from '../../components/ObservedImage';

class RaidReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  fetchReport = async membershipId => {
    const request = await fetch(`https://b9bv2wd97h.execute-api.us-west-2.amazonaws.com/prod/api/player/${membershipId}`).then(r => r.json());

    if (!request.response) {
      console.log('fetch error');
    }

    return request.response;
  };

  async componentDidMount() {
    const { member } = this.props;

    //console.log(await this.fetchReport(member.membershipId))
  }

  render() {
    const { t, member, PGCRcache } = this.props;
    const characterIds = member.data.profile.characters.data.map(c => c.characterId);

    const getBungiePGCRImage = path => {
      return `https://stats.bungie.net/img/destiny_content/pgcr/${path}.jpg`;
    };

    const LEVIATHAN = {
      displayValue: 'Leviathan',
      boss: 'Calus',
      image: getBungiePGCRImage('raid_gluttony'),
      launchTime: '2017-09-13T17:00:00.000Z',
      versions: [
        {
          activityHashes: [417231112, 757116822, 1685065161, 2449714930, 3446541099, 3879860661],
          displayValue: 'Prestige'
        },
        {
          activityHashes: [2693136600, 2693136601, 2693136602, 2693136603, 2693136604, 2693136605],
          displayValue: 'Normal'
        },
        {
          activityHashes: [89727599, 287649202, 1699948563, 1875726950, 3916343513, 4039317196],
          displayValue: 'Guided Games'
        }
      ],
      additionalStartingPhaseIndexes: [2]
    };

    const EATER_OF_WORLDS = {
      displayValue: 'Eater of Worlds',
      boss: 'Argos',
      image: getBungiePGCRImage('raids_leviathan_eater_of_worlds'),
      launchTime: '2017-12-08T18:00:00.000Z',
      versions: [
        {
          activityHashes: [809170886],
          displayValue: 'Prestige'
        },
        {
          activityHashes: [3089205900],
          displayValue: 'Normal'
        },
        {
          activityHashes: [2164432138],
          displayValue: 'Guided Games'
        }
      ]
    };

    const SPIRE_OF_STARS = {
      displayValue: 'Spire of Stars',
      boss: `Val Ca'uor`,
      image: getBungiePGCRImage('raid_greed'),
      launchTime: '2018-05-11T17:00:00.000Z',
      versions: [
        {
          activityHashes: [3213556450],
          displayValue: 'Prestige'
        },
        {
          activityHashes: [119944200],
          displayValue: 'Normal'
        },
        {
          activityHashes: [3004605630],
          displayValue: 'Guided Games'
        }
      ]
    };

    const LAST_WISH = {
      displayValue: 'Last Wish',
      boss: 'Riven',
      image: getBungiePGCRImage('raid_beanstalk'),
      launchTime: '2018-09-14T17:00:00.000Z',
      versions: [
        {
          activityHashes: [2122313384],
          displayValue: 'Normal'
        },
        {
          activityHashes: [1661734046],
          displayValue: 'Guided Games'
        }
      ],
      flawlessRecordHash: 4177910003
    };

    const SCOURGE_OF_THE_PAST = {
      displayValue: 'Scourge of the Past',
      boss: 'Insurrection Prime',
      image: '/static/images/sotp.jpg',
      launchTime: '2018-12-07T17:00:00.000Z',
      versions: [
        {
          activityHashes: [548750096],
          displayValue: 'Normal'
        },
        {
          activityHashes: [2812525063],
          displayValue: 'Guided Games'
        }
      ],
      flawlessRecordHash: 2648109757
    };

    let sotpClears = false;
    let firstSotpClear = false;
    if (PGCRcache[member.membershipId]) {
      let raidReports = PGCRcache[member.membershipId].filter(pgcr => pgcr.activityDetails.mode === 4);

      sotpClears = raidReports
            .filter(pgcr => 
              SCOURGE_OF_THE_PAST.versions
              .map(v => v.activityHashes)
              .flat()
              .includes(pgcr.activityDetails.directorActivityHash)
            )
            .filter(pgcr => {
              let clear = false;
              let entries = pgcr.entries.filter(entry => characterIds.includes(entry.characterId));
              entries.forEach(entry => {
                if (entry.values.completed.basic.value === 1 && entry.values.completionReason.basic.value === 0) {
                  clear = true;
                }
              });
              return clear;
            });
      
      firstSotpClear = orderBy(sotpClears, [pgcr => pgcr.period], ['asc'])[0];

      // console.log(sotpClears, firstSotpClear);
    }

    return (
      <>
        <div className='bg' />
        <div className='first'>
          {firstSotpClear ? (
            <>
              <ObservedImage className='image pgcrImage' src={SCOURGE_OF_THE_PAST.image} />
              <div className='head'>
                <div className='page-header'>
                  <div className='name'>{t('Raids')}</div>
                  <div className='description'>{t('Form a fireteam of six and brave the strange and powerful realms of our enemies')}</div>
                </div>
              </div>
              <div className='properties'>
                <div className='desc'>First clear</div>
                <div className='name'>{SCOURGE_OF_THE_PAST.displayValue}</div>
                <div className='score'><Moment format='D/M/YYYY'>{firstSotpClear.period}</Moment></div>
              </div>
              <div className='fireteam'>
                <div className='sub-header sub'>
                  <div>Fireteam</div>
                  <div>
                    <Moment format='D/M/YYYY'>{firstSotpClear.period}</Moment>
                  </div>
                </div>
                <ul className='list'>
                  {firstSotpClear.entries.map(entry => {
                    if (entry.values.completed.basic.value !== 1 || entry.values.completionReason.basic.value !== 0) {
                      return null;
                    }
                    return (
                      <li key={entry.characterId} className='linked'>
                        <div className='icon'>
                          <ObservedImage className={cx('image', 'emblem')} src={`https://www.bungie.net${entry.player.destinyUserInfo.iconPath}`} />
                        </div>
                        <div className='displayName'>{entry.player.destinyUserInfo.displayName}</div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          ) : null}
        </div>
        {/* <div className='summary'>
          
          <div className='datum'>
            
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
)(RaidReport);
