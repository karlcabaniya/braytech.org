import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import ObservedImage from '../../components/ObservedImage';
import * as enums from '../../utils/destinyEnums';

import './styles.css';

class Items extends React.Component {
  constructor(props) {
    super(props);


  }

  componentDidMount() {
    
  }

  render() {
    const { t, member, items, inspect, action } = this.props;

    let output = [];

    items.forEach((item, i) => {
      let definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];
      let definitionBucket = item.bucketHash ? manifest.DestinyInventoryBucketDefinition[item.bucketHash] : false;

      if (!definitionItem) {
        console.log(`Items: Couldn't find item definition for ${item.itemHash}`);
        return;
      }

      let bucketName = definitionBucket && definitionBucket.displayProperties && definitionBucket.displayProperties.name.replace(' ','-').toLowerCase();

      output.push(
        <li
          key={i}
          className={cx(
            {
              tooltip: !this.props.disableTooltip,
              linked: true,
              masterworked: enums.enumerateItemState(item.state).masterworked,
              exotic: definitionItem.inventory && definitionItem.inventory.tierType === 6
            },
            bucketName,
          )}
          data-hash={item.itemHash}
          data-instanceid={item.itemInstanceId}
          data-state={item.state}
          onClick={e => {
            if (action) {
              action(e, item);
            }
          }}
        >
          <div className='icon'>
            <ObservedImage className='image' src={`https://www.bungie.net${definitionItem.displayProperties.icon}`} />
          </div>
          {inspect && definitionItem.itemHash ? <Link to={{ pathname: `/inspect/${definitionItem.itemHash}`, state: { from: this.props.selfLinkFrom } }} /> : null}
        </li>
      );
    });
    

    return output;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default connect(mapStateToProps)(Items);
