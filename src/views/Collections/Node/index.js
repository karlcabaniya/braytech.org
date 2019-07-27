import React from 'react';
import cx from 'classnames';

import ObservedImage from '../../../components/ObservedImage';
import { ProfileNavLink } from '../../../components/ProfileLink';
import * as ls from '../../../utils/localStorage';
import * as paths from '../../../utils/paths';
import manifest from '../../../utils/manifest';
import { enumerateCollectibleState } from '../../../utils/destinyEnums';

import Collectibles from '../../../components/Collectibles';
import PlugSet from '../../../components/PlugSet';

class PresentationNode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: ls.get('setting.hideCompletedRecords') ? ls.get('setting.hideCompletedRecords') : false
    };
  }

  toggleCompleted = () => {
    let currentSetting = ls.get('setting.hideCompletedRecords') ? ls.get('setting.hideCompletedRecords') : false;

    ls.set('setting.hideCompletedRecords', currentSetting ? false : true);

    this.setState({
      hideCompleted: ls.get('setting.hideCompletedRecords')
    });
  };

  render() {
    const { member, collectibles } = this.props;
    const characterId = member.characterId;
    const characterCollectibles = member.data.profile.characterCollectibles.data;
    const profileCollectibles = member.data.profile.profileCollectibles.data;
    const characters = member.data.profile.characters.data;
    const character = characters.find(c => c.characterId === characterId);

    let classNodes = {
      0: [811225638, 2598675734],
      1: [3745240322, 2765771634],
      2: [1269917845, 1573256543]
    };

    let primaryHash = this.props.primaryHash;
    let primaryDefinition = manifest.DestinyPresentationNodeDefinition[primaryHash];

    let secondaryHash = this.props.match.params.secondary || false;
    let secondaryChildNodeFind = primaryDefinition.children.presentationNodes.find(child => classNodes[character.classType].includes(child.presentationNodeHash));
    if (!secondaryHash && secondaryChildNodeFind) {
      secondaryHash = secondaryChildNodeFind.presentationNodeHash;
    } else if (!secondaryHash) {
      secondaryHash = primaryDefinition.children.presentationNodes[0].presentationNodeHash;
    }

    let secondaryDefinition = manifest.DestinyPresentationNodeDefinition[secondaryHash];

    let tertiaryHash = this.props.match.params.tertiary || false;
    const tertiaryChildNodeFind = secondaryDefinition.children.presentationNodes.find(child => classNodes[character.classType].includes(child.presentationNodeHash));
    if (!tertiaryHash && tertiaryChildNodeFind) {
      tertiaryHash = tertiaryChildNodeFind.presentationNodeHash;
    } else if (!tertiaryHash) {
      tertiaryHash = secondaryDefinition.children.presentationNodes[0].presentationNodeHash;
    }

    const definitionTertiary = manifest.DestinyPresentationNodeDefinition[tertiaryHash];

    const quaternaryHash = this.props.match.params.quaternary ? this.props.match.params.quaternary : false;

    let primaryChildren = [];
    primaryDefinition.children.presentationNodes.forEach(child => {
      let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];

      let isActive = (match, location) => {
        if (secondaryDefinition.hash === child.presentationNodeHash) {
          return true;
        } else {
          return false;
        }
      };

      primaryChildren.push(
        <li key={node.hash} className='linked'>
          <ProfileNavLink isActive={isActive} to={`/collections/${primaryHash}/${node.hash}`}>
            <ObservedImage className={cx('image', 'icon')} src={`${!node.displayProperties.localIcon ? 'https://www.bungie.net' : ''}${node.displayProperties.icon}`} />
          </ProfileNavLink>
        </li>
      );
    });

    let secondaryChildren = [];
    secondaryDefinition.children.presentationNodes.forEach(child => {
      let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];

      if (node.redacted) {
        return;
      }

      let states = [];

      let state = 0;
      node.children.collectibles.forEach(c => {
        const definitionCollectible = manifest.DestinyCollectibleDefinition[c.collectibleHash];

        let scope = profileCollectibles.collectibles[definitionCollectible.hash] ? profileCollectibles.collectibles[definitionCollectible.hash] : characterCollectibles[characterId].collectibles[definitionCollectible.hash];
        if (scope) {
          state = scope.state;
        }

        states.push(state);
      });

      let isActive = (match, location) => {
        if (definitionTertiary.hash === child.presentationNodeHash) {
          return true;
        } else {
          return false;
        }
      };

      let secondaryProgress = states.filter(state => !enumerateCollectibleState(state).notAcquired).length;
      let secondaryTotal = collectibles && collectibles.hideInvisibleCollectibles ? states.filter(state => !enumerateCollectibleState(state).invisible).length : states.length;

      secondaryChildren.push(
        <li key={node.hash} className={cx('linked', { completed: secondaryProgress === secondaryTotal && secondaryTotal !== 0 })}>
          <ProfileNavLink isActive={isActive} to={`/collections/${primaryHash}/${secondaryHash}/${node.hash}`}>
            {node.displayProperties.name}
          </ProfileNavLink>
        </li>
      );
    });
    
    
    return (
      <div className='node'>
        <div className='header'>
          <div className='name'>
            {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
            {primaryDefinition.displayProperties.name} <span>{primaryDefinition.children.presentationNodes.length !== 1 ? <>// {secondaryDefinition.displayProperties.name}</> : null}</span>
          </div>
        </div>
        <div className='children'>
          <ul
            className={cx('list', 'primary', {
              'single-primary': primaryDefinition.children.presentationNodes.length === 1
            })}
          >
            {primaryChildren}
          </ul>
          <ul className='list secondary'>{secondaryChildren}</ul>
        </div>
        <div className='collectibles'>
          {definitionTertiary.children.items && definitionTertiary.children.items.length ? (
            <ul className={cx('list', 'tertiary', 'inventory-items', 'as-tab')}>
              <PlugSet set={3224618006} plugs={definitionTertiary.children.items} />
            </ul>
          ) : (
            <ul className={cx('list', 'tertiary', 'collection-items', { sets: primaryHash === '1605042242' })}>
              <Collectibles {...this.props} {...this.state} node={definitionTertiary.hash} highlight={quaternaryHash} inspect selfLinkFrom={paths.removeMemberIds(this.props.location.pathname)} />
            </ul>
          )}
        </div>
      </div>
    );
  }
}

export default PresentationNode;
