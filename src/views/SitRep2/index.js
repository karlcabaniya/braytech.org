import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy, flattenDepth } from 'lodash';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import * as utils from '../../utils/destinyUtils';
import ObservedImage from '../../components/ObservedImage';
import Spinner from '../../components/UI/Spinner';
import ProgressBar from '../../components/UI/ProgressBar';
import Ranks from '../../components/Ranks';
import Roster from '../../components/Roster';

import './styles.css';

class SitRep extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.rebindTooltips();
  }

  render() {
    const { t, member, groupMembers } = this.props;
    const { profile, milestones } = member.data;
    const group = member.data.groups.results.length > 0 ? member.data.groups.results[0].group : false;
    const characters = member.data.profile.characters.data;
    const character = characters.find(c => c.characterId === member.characterId);
    const characterProgressions = member.data.profile.characterProgressions.data;

    const wellRestedState = utils.isWellRested(characterProgressions[character.characterId]);

    console.log(wellRestedState)

    const dailies = [];
    const weeklies = [];

    if (wellRestedState.wellRested) {
      const definitionSandboxPerk = manifest.DestinySandboxPerkDefinition[1519921522];

      weeklies.push({
        el: (
          <li key='rest' className='rest-state'>
            <div className='icon'>
              <span className='destiny-well_rested' />
            </div>
            <div className='properties'>
              <div className='text'>
                <div className='name'>{definitionSandboxPerk.displayProperties && definitionSandboxPerk.displayProperties.name}</div>
                <div className='description'>{definitionSandboxPerk.displayProperties && definitionSandboxPerk.displayProperties.description}</div>
              </div>
              <ProgressBar
                objective={{
                  progressDescription: definitionSandboxPerk.displayProperties && definitionSandboxPerk.displayProperties.name,
                  completionValue: wellRestedState.requiredXP
                }}
                progress={{
                  progress: wellRestedState.progress,
                  objectiveHash: 'rest'
                }}
                hideCheck
              />
            </div>
          </li>
        )
      });
    }

    // flashpoint
    const definitionMilestoneFLashpoint = manifest.DestinyMilestoneDefinition[463010297];
    const milestoneFlashpointQuestItem = milestones[463010297].availableQuests && milestones[463010297].availableQuests.length && manifest.DestinyMilestoneDefinition[463010297].quests[milestones[463010297].availableQuests[0].questItemHash];
    const definitionFlashpointVendor =
    milestoneFlashpointQuestItem &&
      Object.values(manifest.DestinyVendorDefinition).find(v => {
        if (milestoneFlashpointQuestItem.destinationHash === 1993421442) {
          return v.locations && v.locations.find(l => l.destinationHash === 3669933163);
        } else {
          return v.locations && v.locations.find(l => l.destinationHash === milestoneFlashpointQuestItem.destinationHash);
        }
      });
    
    // console.log(definitionMilestoneFLashpoint, milestoneFlashpointQuestItem, definitionFlashpointVendor)
    
    weeklies.push({
      el: (
        <li key='rest' className='flashpoint'>
          <div className='icon'>
            <span className='destiny-patrol' />
          </div>
          <div className='properties'>
            <div className='text'>
              <div className='name'>{definitionMilestoneFLashpoint.displayProperties && definitionMilestoneFLashpoint.displayProperties.name}: {manifest.DestinyDestinationDefinition[milestoneFlashpointQuestItem.destinationHash].displayProperties.name}</div>
              <div className='description'>{t('{{vendorName}} is waiting for you at {{destinationName}}.', { vendorName: definitionFlashpointVendor.displayProperties && definitionFlashpointVendor.displayProperties.name, destinationName: manifest.DestinyDestinationDefinition[milestoneFlashpointQuestItem.destinationHash].displayProperties.name })}</div>
            </div>
          </div>
        </li>
      )
    });

    return (
      <div className='view' id='sit-rep'>
        <div className='module'>
          <div className='sub-header'>
            <div>{t('Dailies')}</div>
          </div>
          <div>None at this time.</div>
          <ul className='list milestones'>{dailies.map(m => m.el)}</ul>
          <div className='sub-header'>
            <div>{t('Weeklies')}</div>
          </div>
          <ul className='list milestones'>{weeklies.map(m => m.el)}</ul>
        </div>
        <div className='module'>
          <div className='sub-header'>
            <div>{t('Ranks')}</div>
          </div>
          <div className='ranks'>
            {[2772425241, 2626549951, 2000925172].map(hash => {
              return <Ranks key={hash} hash={hash} data={{ membershipType: member.membershipType, membershipId: member.membershipId, characterId: member.characterId, characters: member.data.profile.characters.data, characterProgressions }} />;
            })}
          </div>
        </div>
        <div className='module'>
          <div className='sub-header'>
            <div>Bungie.net</div>
          </div>
          <div className=''></div>
        </div>
        {group ? (
          <div className='module clan-roster'>
            <div className='sub-header'>
              <div>{t('Clan roster')}</div>
              <div>{groupMembers.members.filter(member => member.isOnline).length} online</div>
            </div>
            <div className='refresh'>{groupMembers.loading && groupMembers.members.length !== 0 ? <Spinner mini /> : null}</div>
            {groupMembers.loading && groupMembers.members.length === 0 ? <Spinner /> : <Roster mini showOnline />}
          </div>
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    groupMembers: state.groupMembers,
    collectibles: state.collectibles
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(SitRep);
