import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../../components/ObservedImage';
import * as enums from '../../../utils/destinyEnums';

class Items extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const { t, member, items, action } = this.props;

    let output = [];

    items.forEach((item, i) => {
      let definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

      if (!definitionItem) {
        console.log(`Items: Couldn't find item definition for ${item.itemHash}`, item);
        return;
      }

      output.push(
        <ul className='list' key={i}>
          <li
            className={cx({
              tooltip: !this.props.disableTooltip,
              linked: true,
              masterworked: enums.enumerateItemState(item.state).masterworked,
              exotic: definitionItem.inventory && definitionItem.inventory.tierType === 6
            })}
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
              <ObservedImage className='image' src={definitionItem.displayProperties.localIcon ? `${definitionItem.displayProperties.icon}` : `https://www.bungie.net${definitionItem.displayProperties.icon}`} />
            </div>
            <div className='text'>
              <div className='name'>{definitionItem.displayProperties.name}</div>
            </div>
          </li>
          <li
            className={cx('apply', {
              linked: true
            })}
            onClick={e => {
              if (action) {
                action(e, item);
              }
            }}
          >
            <i className='uniE176' />
          </li>
        </ul>
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
