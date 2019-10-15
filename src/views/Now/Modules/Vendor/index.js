import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import manifest from '../../../../utils/manifest';
import * as ls from '../../../../utils/localStorage';
import * as bungie from '../../../../utils/bungie';
import Items from '../../../../components/Items';
import Spinner from '../../../../components/UI/Spinner';
import { NoAuth, DiffProfile } from '../../../../components/BungieAuth';

import './styles.css';

class Vendor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: false
    };

    this.auth = ls.get('setting.auth');
  }

  async componentDidMount() {
    const { member, hash: vendorHash } = this.props;

    const response = await bungie.GetVendor(member.membershipType, member.membershipId, member.characterId, vendorHash, [400, 402, 300, 301, 304, 305, 306, 307, 308, 600].join(','));

    if (response) {
      this.setState({
        loading: false,
        data: response
      })
    }

  }

  render() {
    const { t, member, hash: vendorHash } = this.props;
    
    if (!this.auth) {
      return <NoAuth inline />;
    }

    if (this.auth && !this.auth.destinyMemberships.find(m => m.membershipId === member.membershipId)) {
      return <DiffProfile inline />;
    }

    const definitionVendor = manifest.DestinyVendorDefinition[vendorHash];

    if (this.auth && this.auth.destinyMemberships.find(m => m.membershipId === member.membershipId) && this.state.loading) {
      return (
        <>
          <div className='module-header'>
            <div className='sub-name'>{definitionVendor.displayProperties.name}</div>
          </div>
          <Spinner />
        </>
      );
    }

    return (
      <>
        <div className='module-header'>
          <div className='sub-name'>{definitionVendor.displayProperties.name}</div>
        </div>
        
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(
    mapStateToProps
  ),
  withTranslation()
)(Vendor);
