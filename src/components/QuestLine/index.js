import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import Items from '../Items';

import './styles.css';

class QuestLine extends React.Component {
  render() {
    const { t, member, hash } = this.props;

    let definitionItem = hash && manifest.DestinyInventoryItemDefinition[hash];

    if (definitionItem && definitionItem.objectives.questlineItemHash) {
      definitionItem = manifest.DestinyInventoryItemDefinition[definitionItem.objectives.questlineItemHash]
    }
    
    if (definitionItem && definitionItem.setData && definitionItem.setData.itemList && definitionItem.setData.itemList.length) {
      console.log(definitionItem)

      return (
        <ul className='list inventory-items'>
          <Items items={definitionItem.setData.itemList} />
        </ul>
      )
    }

    return null;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default connect(mapStateToProps)(QuestLine);
