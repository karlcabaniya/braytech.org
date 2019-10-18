import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { BungieAuthButton } from '../../../../components/BungieAuth';

import './styles.css';

class AuthUpsell extends React.Component {
  render() {
    const { t, member } = this.props;

    return (
      <div className='wrap'>
        <div className='headline'>{t('Hey {{displayName}}, did you know you can authorize Braytech with Bungie.net for access to more features', { displayName: member.data.profile.profile.data.userInfo.displayName })}</div>
        <div className='text'>
          <p>{t("Most of Braytech's features are available to all users and depend on publically available data, but some of Destiny's features require more explicit access permissions which you can grant to Braytech by authorizing with Bungie.net.")}</p>
          <p>{t("You're a handful of clicks away from simple clan management, inspecting your bounties and quests, receiving helpful reminders regarding your inventory, monitoring your seasonal artifact, and more...")}</p>
        </div>
        <BungieAuthButton />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(AuthUpsell);
