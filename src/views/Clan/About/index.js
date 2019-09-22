import React from 'react';
import Markdown from 'react-markdown';
import moment from 'moment';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import * as bungie from '../../../utils/bungie';
import ObservedImage from '../../../components/ObservedImage';
import ClanBanner from '../../../components/UI/ClanBanner';
import Spinner from '../../../components/UI/Spinner';
import ProgressBar from '../../../components/UI/ProgressBar';
import Checkbox from '../../../components/UI/Checkbox';
import Roster from '../../../components/Roster';

import ClanViewsLinks from '../ClanViewsLinks';

import './styles.css';

class BannerPerks extends React.Component {
  render() {
    const { level } = this.props;

    const definitionBanner = manifest.DestinyInventoryItemDefinition[1460578935];
    const perks =
      definitionBanner &&
      definitionBanner.sockets.socketEntries
        .map((entry, i) => {
          if (definitionBanner.sockets.socketCategories.find(socketCategory => socketCategory.socketCategoryHash === 3898156960) && definitionBanner.sockets.socketCategories.find(socketCategory => socketCategory.socketCategoryHash === 3898156960).socketIndexes.includes(i)) {
            return entry;
          } else {
            return false;
          }
        })
        .filter(t => t);

    return <ul className='banner-perks'>
      {perks.map((perk, i) => {
        const definitionPerk = manifest.DestinyInventoryItemDefinition[perk.singleInitialItemHash];

        return (
          <li key={i} className={cx({ active: level > i + 1 })}>
            <div className='icon'>
              <ObservedImage className='image' src={`https://www.bungie.net${definitionPerk.displayProperties.icon}`} />
            </div>
            <div className='text'>
              <div className='name'>{definitionPerk.displayProperties.name}</div>
              <div className='description'>{definitionPerk.displayProperties.description}</div>
            </div>
          </li>
        )
      })}
    </ul>;
  }
}

class AboutView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weeklyRewardState: false
    };
  }

  async componentDidMount() {
    window.scrollTo(0, 0);

    const groupId = this.props.group.groupId;
    const groupWeeklyRewardState = await bungie.GetClanWeeklyRewardState(groupId);

    this.setState({ weeklyRewardState: groupWeeklyRewardState });
  }

  render() {
    const { t, group, groupMembers } = this.props;

    const clanLevel = group.clanInfo.d2ClanProgressions[584850370];

    const weeklyClanEngramsDefinition = manifest.DestinyMilestoneDefinition[4253138191].rewards[1064137897].rewardEntries;
    const weeklyRewardState = this.state.weeklyRewardState;

    let rewardState = null;
    if (weeklyRewardState) {
      rewardState = weeklyRewardState.rewards.find(reward => reward.rewardCategoryHash === 1064137897).entries;
    }

    return (
      <>
        <ClanViewsLinks {...this.props} />
        <div className='module banner'>
          <ClanBanner bannerData={group.clanInfo.clanBannerData} />
        </div>
        <div className='module about'>
          <div className='name'>{group.name}</div>
          <div className='members'>
            {t('Founded')} {moment(group.creationDate).format('MMMM YYYY')} / {group.memberCount} {t('Members')}
          </div>
          <Markdown className={cx('bio', { 'includes-motto': group.motto !== '' })} escapeHtml disallowedTypes={['image', 'imageReference']} source={group.motto !== '' ? `_${group.motto}_\n\n${group.about}` : group.about} />
        </div>
        <div className='module progression'>
          <div className='module-header'>
            <div className='sub-name'>{t('Progression')}</div>
          </div>
          {clanLevel.level === clanLevel.levelCap ? (
            <ProgressBar
              classNames='level-6'
              objective={{
                progressDescription: `${t('Level')} ${clanLevel.level}`,
                completionValue: 1
              }}
              progress={{
                progress: 1,
                objectiveHash: 'clanLevel'
              }}
              hideCheck
              chunky
            />
          ) : (
            <ProgressBar
              objective={{
                progressDescription: `${t('Level')} ${clanLevel.level}`,
                completionValue: clanLevel.nextLevelAt
              }}
              progress={{
                progress: clanLevel.progressToNextLevel,
                objectiveHash: 'clanLevel'
              }}
              hideCheck
              chunky
            />
          )}
          <h4>{t('Banner Perks')}</h4>
          <BannerPerks level={clanLevel.level} />
          <h4>{t('Engrams')}</h4>
          <ul className='clan-rewards'>
            {rewardState ? (
              rewardState.map(reward => (
                <li key={reward.rewardEntryHash}>
                  <Checkbox checked={reward.earned} text={weeklyClanEngramsDefinition[reward.rewardEntryHash].displayProperties.name} />
                </li>
              ))
            ) : (
              <Spinner mini />
            )}
          </ul>
        </div>
        <div className='module roster'>
          <div className='module-header'>
            <div className='sub-name'>{t('Leadership')}</div>
          </div>
          {groupMembers.loading && groupMembers.members.length === 0 ? <Spinner mini /> : <Roster mini limit='10' filter='admins' />}
        </div>
      </>
    );
  }
}

export default AboutView;
