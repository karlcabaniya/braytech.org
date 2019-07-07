import React from 'react';
import { compose } from 'redux';
import { withNamespaces } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import Moment from 'react-moment';
import queryString from 'query-string'

import * as ls from '../../utils/localStorage';
import * as bungie from '../../utils/bungie';
import * as destinyEnums from '../../utils/destinyEnums';
import Button from '../UI/Button';
import Spinner from '../UI/Spinner';
import ObservedImage from '../ObservedImage';

import './styles.css';

class BungieAuth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      memberships: false
    };
  }

  getAccessTokens = async code => {   
    let response = await bungie.GetOAuthAccessToken(`client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&grant_type=authorization_code&code=${code}`);

    console.log(response);

    if (this.mounted) {
      this.getMemberships();
    }
  }

  getMemberships = async () => {
    let response = await bungie.GetMembershipDataForCurrentUser();

    console.log(response);

    if (this.mounted) {
      this.setState((prevState, props) => {
        prevState.loading = false;
        prevState.memberships = response;
        return prevState;
      });
    }
  }

  componentDidMount() {
    this.mounted = true;

    const { location } = this.props;
    const tokens = ls.get('setting.auth');

    const code = queryString.parse(location.search) && queryString.parse(location.search).code;

    if (!tokens && code) {
      this.getAccessTokens(code);
    } else if (tokens) {
      console.log(tokens);

      this.getMemberships();
    } else if (this.mounted) {
      this.setState((prevState, props) => {
        prevState.loading = false;
        return prevState;
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t, location } = this.props;
    const { loading, memberships } = this.state;
    
    const code = queryString.parse(location.search) && queryString.parse(location.search).code;

    if (code) {
      return <Redirect to='/settings' />;
    }

    if (loading) {
      return <Spinner mini />;
    } else {
      if (memberships) {
        return (
          <div className='bungie-auth'>
            <div className='member'>
              <ObservedImage className='image background' src={`https://www.bungie.net/img/UserThemes/${memberships.bungieNetUser.profileThemeName}/header.jpg`} />
              <div className='details'>
                <div className='icon'>
                  <ObservedImage className='image' src={`https://www.bungie.net${memberships.bungieNetUser.profilePicturePath}`} />
                </div>
                <div className='text'>
                  <div className='displayName'>{memberships.bungieNetUser.displayName}</div>
                  <div className='firstAccess'><Moment format='DD/MM/YYYY'>{memberships.bungieNetUser.firstAccess}</Moment></div>
                </div>
              </div>
            </div>
            <div className='memberships'>
              <h4>{t('Associated memberships')}</h4>
              <ul className='list'>
                {memberships.destinyMemberships.map(m => {

                  return (
                    <li key={m.membershipId} className='linked'>
                      <div className='icon'><span className={`destiny-platform_${destinyEnums.PLATFORMS[m.membershipType].toLowerCase()}`} /></div>
                      <div className='displayName'>{memberships.bungieNetUser.blizzardDisplayName && m.membershipType === 4 ? memberships.bungieNetUser.blizzardDisplayName : m.displayName}</div>
                    </li>
                  );
                })}
              </ul>
              <div className='info'>
                <p>{t("These are the memberships that are currenty associated with your Bungie.net profile.")}</p>
              </div>
            </div>
            <h4>{t('Authentication data')}</h4>
            <Button text={t('Forget me')} action={() => {
              ls.del('setting.auth');
              this.setState((prevState, props) => {
                prevState.memberships = false;
                return prevState;
              });
            }} />
            <div className='info'>
              <p>{t("Delete the authentication data stored on your device. While unnecessary, this function is provided for your peace of mind.")}</p>
            </div>
          </div>
        );
      } else {
        return (
          <div className='bungie-auth'>
            <Button
              text='Authorize'
              action={() => {
                window.location = `https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&response_type=code`;
              }}
            />
          </div>
        );
      }
    }
  }
}

export default compose(
  withNamespaces()
)(BungieAuth);