import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import Characters from '../../components/UI/Characters';
import * as destinyUtils from '../../utils/destinyUtils';
import * as destinyEnums from '../../utils/destinyEnums';
import userFlair from '../../data/userFlair';

class Profile extends React.Component {
  render() {
    const { t, member, from } = this.props;

    const groups = member.data.groups.results;

    const timePlayed = Math.floor(
      Object.keys(member.data.profile.characters.data).reduce((sum, key) => {
        return sum + parseInt(member.data.profile.characters.data[key].minutesPlayedTotal);
      }, 0) / 1440
    );

    let flair = userFlair.find(f => f.user === member.membershipType + member.membershipId);
    let primaryFlair = false;
    if (flair) {
      primaryFlair = flair.trophies.find(t => t.primary);
    }

    return (
      <div className='user'>
        <div className='info'>
          <div className='displayName'>{member.data.profile.profile.data.userInfo.displayName}</div>
          {groups.length === 1 && <div className='clan'>{groups[0].group.name}</div>}
          <div className='stamps'>
            <div>
              <i className={`destiny-platform_${destinyEnums.PLATFORMS[member.membershipType].toLowerCase()}`} />
            </div>
            {flair
              ? flair.trophies.map((s, i) => {
                  return (
                    <div key={i}>
                      <i className={cx(s.icon, s.classnames)} />
                    </div>
                  );
                })
              : null}
          </div>
          <div className='basics'>
            <div>
              <div className='value'>
                {timePlayed} {timePlayed === 1 ? t('day played') : t('days played')}
              </div>
              <div className='name'>Time played accross characters</div>
            </div>
            <div>
              <div className='value'>{member.data.profile.profileRecords.data.score.toLocaleString('en-us')}</div>
              <div className='name'>Triumph score</div>
            </div>
            <div>
              <div className='value'>{destinyUtils.collectionTotal(member.data.profile).toLocaleString('en-us')}</div>
              <div className='name'>Collection total</div>
            </div>
          </div>
        </div>
        <Characters data={member.data} location={{ ...from }} characterClick={this.props.onCharacterClick} />
      </div>
    );
  }
}

Profile.propTypes = {
  onCharacterClick: PropTypes.func.isRequired,
  from: PropTypes.object.isRequired,
  member: PropTypes.object.isRequired
};

export default withNamespaces()(Profile);
