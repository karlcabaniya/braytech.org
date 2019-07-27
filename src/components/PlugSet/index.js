import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import ObservedImage from '../ObservedImage';

import './styles.css';

class PlugSet extends React.Component {
  constructor(props) {
    super(props);

    this.scrollToRecordRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.highlight && this.scrollToRecordRef.current !== null) {
      window.scrollTo({
        top: this.scrollToRecordRef.current.offsetTop + this.scrollToRecordRef.current.offsetHeight / 2 - window.innerHeight / 2
      });
    }
  }

  render() {
    const { t, member, set, plugs, forceDisplay, collectibles } = this.props;

    const data = member.data.profile.profilePlugSets && member.data.profile.profilePlugSets.data && member.data.profile.profilePlugSets.data.plugs[set];
    //const definitionPlugSet = manifest.DestinyCollectibleDefinition[set];

    if (!data) return null;

    let output = [];

    plugs.forEach(hash => {
      const definitionItem = manifest.DestinyInventoryItemDefinition[hash];

      output.push(
        <li
          key={definitionItem.hash}
          className={cx('tooltip', {
            completed: data.find(p => p.plugItemHash === definitionItem.hash && p.enabled)
          })}
          data-hash={definitionItem.hash}
        >
          <div className='icon'>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionItem.displayProperties.icon}`} />
          </div>
          <div className='text'>
            <div className='name'>{definitionItem.displayProperties.name}</div>
            <div className='gfg'>{definitionItem.hash}</div>
          </div>
        </li>
      );
    });
    

    if (output.length === 0 && collectibles && collectibles.hideCompletedCollectibles && !forceDisplay) {
      output.push(
        <li key='lol' className='all-completed'>
          <div className='properties'>
            <div className='text'>{t('All discovered')}</div>
          </div>
        </li>
      );
    }

    return output;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    collectibles: state.collectibles
  };
}

export default compose(
  connect(
    mapStateToProps
  ),
  withNamespaces()
)(PlugSet);
