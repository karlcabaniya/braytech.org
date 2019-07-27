import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import lodash from 'lodash';
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

    // let items = [265428940,267290351,95537029,48790291,33795475,181754010,452400791,1560678953,1588254578,1897536429,2016937064,2032131120,2087899461,2381907801,2542725780,2671982863,2834933816,2925817709,3184938442,3389746221,3953986336,566102034,646486611,683947069,814933120,874877120,924779391,930064526,955394464,1045929536,1045929537,1046955906,1280248869,1444655707,1449701838,1471723144,1533012008,1539578239,1711459689,2038017661,2225838050,2294119165,2541494210,2871095181,2916219759,3134905452,3163467796,3342375124,3830186047,3958460049,4049365947].map(hash => {

    //   let def = manifest.DestinyInventoryItemDefinition[hash];
    //   return ({
    //     tier: def.inventory.tierType,
    //     hash
    //   })
    // });

    // items = lodash.orderBy(items, [i => i.tier], ['desc'])

    // console.log(JSON.stringify(items.map(i => i.hash)))
    
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
