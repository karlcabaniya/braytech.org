import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import manifest from '../../../utils/manifest';
import Items from '../../../components/Items';

import InventoryViewsLinks from '../InventoryViewsLinks';

import './styles.css';

class Postmaster extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.rebindTooltips();
  }

  render() {
    const { t, member } = this.props;

    const inventory = member.data.profile.profileInventory.data.items.slice().concat(member.data.profile.characterInventories.data[member.characterId].items);

    const postmaster = inventory.filter(i => i.bucketHash === 215593132);

    return (
      <div className='view postmaster' id='inventory'>
        <InventoryViewsLinks />
        {postmaster.length ? (
          <div className='module'>
            <div className='sub-header'>
              <div>{t('Postmaster')}</div>
              <div>{postmaster.length}/21</div>
            </div>
            <ul className='list inventory-items'>
              <Items items={postmaster} />
            </ul>
          </div>
        ) : (
          <div className='module'>
            <div className='properties'>
              <div className='name'>{t('Check check check')}</div>
              <div className='description'>
                <p>{manifest.DestinyFactionDefinition[1838583129] && manifest.DestinyFactionDefinition[1838583129].displayProperties && manifest.DestinyFactionDefinition[1838583129].displayProperties.description}</p>
                <p>{t("You've not yet lost anything. Get back out into the world and seek further enlightenment. Your stuff will be here.")}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
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
  withNamespaces()
)(Postmaster);
