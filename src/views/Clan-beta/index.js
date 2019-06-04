import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import './styles.css';

import AboutView from './about.js';
import RosterView from './roster.js';

class Clan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { t, member } = this.props;
    const group = member.data.groups.results.length > 0 ? member.data.groups.results[0].group : false;

    if (group) {
      if (this.props.view === 'roster') {
        return <RosterView {...this.props} group={group} />;
      } else {
        return <AboutView {...this.props} group={group} />;
      }
    } else {
      return (
        <div className='view no-clan' id='clan'>
          <div className='no-clan'>
            <div className='properties'>
              <div className='name'>{t('No clan affiliation')}</div>
              <div className='description'>
                <p>{t('Clans are optional groups of friends that enhance your online gaming experience. Coordinate with your clanmates to take on co-op challenges or just simply represent them in your solo play to earn extra rewards.')}</p>
                <p>{t("Join your friend's clan, meet some new friends, or create your own on the companion app or at bungie.net.")}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    groupMembers: state.groupMembers
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Clan);
