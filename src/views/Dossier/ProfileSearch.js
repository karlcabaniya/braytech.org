/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import debounce from 'lodash/debounce';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import * as destinyEnums from '../../utils/destinyEnums';
import * as ls from '../../utils/localStorage';
import * as bungie from '../../utils/bungie';
import Spinner from '../../components/Spinner';

const SearchResult = p => {
  let stored = ls.get('dossier.profiles') || [];
  
  return (
  <li className={cx({ selected: p.selected && stored.length > 0 })}>
    <ul className='list'>
      <li className='linked'>
        <a onClick={() => p.onProfileClick(p.profile.membershipType, p.profile.membershipId, p.profile.displayName)}>
          <span className={`destiny-platform_${destinyEnums.PLATFORMS[p.profile.membershipType].toLowerCase()}`} />
          {p.profile.displayName}
        </a>
      </li>
      {p.selected && stored.length > 0 ? (
        <li className={cx('linked', 'profile-remove-handler')}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/anchor-has-content */}
        <a onClick={() => p.onProfileRemoveClick(p.profile.membershipType, p.profile.membershipId)} />
      </li>
      ) : null}
    </ul>
  </li>
)};

class ProfileSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: false,
      search: '',
      searching: false
    };
    this.mounted = false;
  }

  componentWillMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    // If we don't do this, the searchForPlayers may attempt to setState on
    // an unmounted component. We can't cancel it as it's using
    // fetch, which doesn't support cancels :(
    this.mounted = false;
  }

  onSearchChange = e => {
    this.setState({ search: e.target.value });
    this.searchForPlayers();
  };

  onSearchKeyPress = e => {
    // If they pressed enter, ignore the debounce and search right meow. MEOW, SON.
    if (e.key === 'Enter') this.searchForPlayers.flush();
  };

  // Debounced so that we don't make an API request for every single
  // keypress - only when they stop typing.
  searchForPlayers = debounce(async () => {
    const displayName = this.state.search;
    if (!displayName) return;

    this.setState({ searching: true });
    try {
      const results = await bungie.playerSearch('-1', displayName);
      if (this.mounted) this.setState({ results: results, searching: false });
    } catch (e) {
      // If we get an error here it's usually because somebody is being cheeky
      // (eg entering invalid search data), so log it only.
      console.warn(`Error while searching for ${displayName}: ${e}`);
    }
  }, 500);

  profileList(profiles, selected = false) {
    return profiles.map(p => <SearchResult key={p.membershipId} onProfileClick={this.profileClick} onProfileRemoveClick={this.profileRemoveClick} profile={p} selected={selected} />);
  }

  resultsElement() {
    const { results, searching } = this.state;

    if (searching) {
      return null;
    }

    if (results && results.length > 0) {
      return this.profileList(results);
    } else if (results) {
      return <li className='no-profiles'>{this.props.t('No profiles found')}</li>;
    }

    return null;
  }

  profileClick = (membershipType, membershipId, displayName) => {
    window.scrollTo(0, 0);

    membershipType = membershipType.toString();

    let profiles = ls.get('dossier.profiles') || [];
    if (profiles.length === 0) {
      ls.update(
        'dossier.profiles',
        {
          membershipType: this.props.member.membershipType,
          membershipId: this.props.member.membershipId,
          displayName: this.props.member.data.profile.profile.data.userInfo.displayName
        },
        true,
        9
      );
      ls.update('dossier.profiles', { membershipType, membershipId, displayName }, true, 9);
    } else {
      ls.update('dossier.profiles', { membershipType, membershipId, displayName }, true, 9);
    }

    this.props.onProfilesChange();
  };

  profileRemoveClick = (membershipType, membershipId) => {
    window.scrollTo(0, 0);

    membershipType = membershipType.toString();

    let profiles = ls.get('dossier.profiles') || [];

    profiles = profiles.filter(p => p.membershipId !== membershipId);
    
    ls.set('dossier.profiles', profiles);

    this.props.onProfilesChange();
  };

  render() {
    const { t } = this.props;
    const { search, searching } = this.state;

    let stored = ls.get('dossier.profiles') || [];
    let profiles = stored.length > 0 ? stored : [
      {
        membershipType: this.props.member.membershipType,
        membershipId: this.props.member.membershipId,
        displayName: this.props.member.data.profile.profile.data.userInfo.displayName
      }
    ];

    return (
      <>
        <div className='sub-header sub'>
          <div>{t('Search for player')}</div>
        </div>
        <div className='form'>
          <div className='field'>
            <input onChange={this.onSearchChange} type='text' placeholder={t('insert gamertag')} spellCheck='false' value={search} onKeyPress={this.onSearchKeyPress} />
          </div>
        </div>

        <div className='results'>{searching ? <Spinner mini /> : <ul className='list'>{this.resultsElement()}</ul>}</div>

        {profiles.length > 0 && (
          <>
            <div className='sub-header sub'>
              <div>{t('Selected')}</div>
            </div>
            <div className='results'>
              <ul className='list'>{this.profileList(profiles, true)}</ul>
            </div>
          </>
        )}
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
  connect(mapStateToProps),
  withNamespaces()
)(ProfileSearch);
