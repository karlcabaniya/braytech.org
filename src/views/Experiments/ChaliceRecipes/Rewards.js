import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { orderBy } from 'lodash';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import { ProfileLink } from '../../../components/ProfileLink';
import ObservedImage from '../../../components/ObservedImage';
import { enumerateCollectibleState } from '../../../utils/destinyEnums';

class Collectibles extends React.Component {
  render() {
    const { t, member, matches } = this.props;
    const inspect = this.props.inspect ? true : false;

    const characterId = member.characterId;
    const characters = member.data.profile.characters.data;
    const character = characters.find(c => c.characterId === characterId);

    let output = [];

    let combos = this.props.items;

    if (!combos) {
      return null;
    }

    combos.forEach((c, i) => {
      if (!c.items.length) {
        return null;
      }

      // if (!this.props.matches && c.items.length > 1) {
      //   return null;
      // }

      c.items.forEach(hash => {
        // if (output.find(o => o.itemHash === hash)) {
        //   return;
        // }

        let definitionItem = manifest.DestinyInventoryItemDefinition[hash];

        if (!definitionItem) {
          return;
        }

        if (definitionItem.itemType === 2) {
          if (definitionItem.classType !== character.classType) {
            return;
          }
        }

        let definitionCollectible = manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash];

        let link = false;

        // selfLinkFrom

        try {
          let reverse1;
          let reverse2;
          let reverse3;

          manifest.DestinyCollectibleDefinition[definitionCollectible.hash].presentationInfo.parentPresentationNodeHashes.forEach(element => {
            let skip = false;
            manifest.DestinyPresentationNodeDefinition[498211331].children.presentationNodes.forEach(parentsChild => {
              if (manifest.DestinyPresentationNodeDefinition[parentsChild.presentationNodeHash].children.presentationNodes.filter(el => el.presentationNodeHash === element).length > 0) {
                skip = true;
                return; // if hash is a child of badges, skip it
              }
            });

            if (reverse1 || skip) {
              return;
            }
            reverse1 = manifest.DestinyPresentationNodeDefinition[element];
          });

          let iteratees = reverse1.presentationInfo ? reverse1.presentationInfo.parentPresentationNodeHashes : reverse1.parentNodeHashes;
          iteratees.forEach(element => {
            if (reverse2) {
              return;
            }
            reverse2 = manifest.DestinyPresentationNodeDefinition[element];
          });

          if (reverse2 && reverse2.parentNodeHashes) {
            reverse3 = manifest.DestinyPresentationNodeDefinition[reverse2.parentNodeHashes[0]];
          }

          link = `/collections/${reverse3.hash}/${reverse2.hash}/${reverse1.hash}/${definitionCollectible.hash}`;
        } catch (e) {
          console.log(e);
        }

        let state = 0;
        if (this.props.member.data) {
          const characterId = this.props.member.characterId;

          const characterCollectibles = this.props.member.data.profile.characterCollectibles.data;
          const profileCollectibles = this.props.member.data.profile.profileCollectibles.data;

          let scope = profileCollectibles.collectibles[definitionCollectible.hash] ? profileCollectibles.collectibles[definitionCollectible.hash] : characterCollectibles[characterId].collectibles[definitionCollectible.hash];
          if (scope) {
            state = scope.state;
          }
        }

        output.push({
          itemHash: hash,
          itemType: definitionItem.itemType,
          el: (
            <ul className='list' key={`${hash}-${i}`}>
              <li
                className={cx('tooltip', {
                  linked: link && this.props.selfLinkFrom,
                  undiscovered: enumerateCollectibleState(state).notAcquired
                })}
                data-hash={definitionCollectible.itemHash}
                onClick={e => {
                  this.props.onClick(e, c);
                }}
              >
                <div className='icon'>
                  <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionCollectible.displayProperties.icon}`} />
                </div>
                <div className='text'>
                  <div className='name'>{definitionCollectible.displayProperties.name}</div>
                  <div className='commonality'>{manifest.statistics.collections && manifest.statistics.collections[definitionCollectible.hash] ? manifest.statistics.collections[definitionCollectible.hash] : `0.00`}%</div>
                </div>
                {link && this.props.selfLinkFrom && !inspect ? <ProfileLink to={{ pathname: link, state: { from: this.props.selfLinkFrom } }} /> : null}
                {inspect && definitionCollectible.itemHash ? <Link to={{ pathname: `/inspect/${definitionCollectible.itemHash}`, state: { from: this.props.selfLinkFrom } }} /> : null}
              </li>
              <li
                className={cx('apply', {
                  linked: true
                })}
                onClick={e => {
                  this.props.onClick(e, c);
                }}
              >
                <i className='uniE176' />
              </li>
            </ul>
          )
        });
      });
    });

    return orderBy(output, [e => e.itemType], ['desc']).map(e => e.el);
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    collectibles: state.collectibles
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Collectibles);
