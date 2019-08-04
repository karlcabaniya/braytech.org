import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import Moment from 'react-moment';
import Description from 'react-markdown';
import cx from 'classnames';

import { ProfileLink } from '../../components/ProfileLink';
import * as ls from '../../utils/localStorage';
import { NoAuth } from '../../components/BungieAuth';
import Spinner from '../../components/UI/Spinner';
import Button from '../../components/UI/Button';
import Checkbox from '../../components/UI/Checkbox';
import packageJSON from '../../../package.json';

import './styles.css';

class Suggestions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestions: {
        loading: true,
        data: false
      },
      form: {
        loading: false,
        visible: false,
        value: '',
        anon: false
      }
    };

    this.auth = ls.get('setting.auth');
  }

  init = async () => {
    if (!this.state.data) {
      let suggestions = await fetch('https://content.upliftnaturereserve.com/tc01/items/braytech_suggestions', {
        headers: {
          Authorization: `Bearer braytech`
        }
      });
      suggestions = await suggestions.json();

      if (suggestions && suggestions.data && this.mounted) {
        this.setState({
          suggestions: {
            loading: false,
            data: suggestions.data
          }
        });
      }
    }
  };

  postSuggestion = async () => {
    if (this.mounted) {
      if (this.state.form.value.length) {
        this.setState(p => {
          p.form.loading = true;
          return p;
        });

        let post = await fetch('https://content.upliftnaturereserve.com/tc01/items/braytech_suggestions', {
          method: 'post',
          headers: {
            Authorization: `Bearer braytech`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            braytech_version: packageJSON.version,
            membership_type: this.props.member.membershipType,
            membership_id: this.props.member.membershipId,
            description: this.state.form.value,
            anonymous: this.state.form.anon
          })
        });
        post = await post.json();

        console.log(post);

        this.setState(p => {
          p.form.loading = false;
          p.form.visible = false;
          p.form.value = '';
          return p;
        });
      }
    }
  };

  toggleForm = () => {
    if (this.mounted) {
      if (this.state.form.visible) {
        this.setState(p => {
          p.form.visible = false;
          return p;
        });
      } else {
        this.setState(p => {
          p.form.visible = true;
          return p;
        });
      }
    }
  };

  handleTextInput = e => {
    const value = e.target.value || '';

    if (this.mounted) {
      this.setState(p => {
        p.form.value = value;
        return p;
      });
    }
  };

  handleCheckboxInput = () => {
    console.log('hi');
    if (this.mounted) {
      if (this.state.form.anon) {
        this.setState(p => {
          p.form.anon = false;
          return p;
        });
      } else {
        this.setState(p => {
          p.form.anon = true;
          return p;
        });
      }
    }
  };

  componentDidMount() {
    this.mounted = true;
    window.scrollTo(0, 0);

    this.init();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t, viewport, match } = this.props;

    if (!this.auth) {
      return <NoAuth />;
    }

    let suggestions, detail;
    if (!this.state.suggestions.loading) {
      if (this.state.form.visible) {
        suggestions = (
          <>
            <div className='form'>
              <div className={cx('field', { disabled: this.state.form.loading })}>
                <textarea value={this.state.form.value} onChange={this.handleTextInput} placeholder='Describe your brilliant idea! The more you flesh it out and describe your idea, the more likely it is that we can discuss it further and that I can pursue it.' />
              </div>
              <Checkbox linked checked={this.state.form.anon} text={t('Remain anonymous')} action={this.handleCheckboxInput} />
            </div>
            <div className='actions'>
              <Button text={t('Send for review')} action={this.postSuggestion} disabled={this.state.form.value.length < 30 || this.state.form.loading} />
              <Button text={t('Scrap it')} action={this.toggleForm} />
            </div>
          </>
        );
      } else {
        suggestions = (
          <>
            <Button text={t('Make a suggestion')} action={this.toggleForm} />
            <ul className='list'>
              {this.state.suggestions.data.map(s => {
                return (
                  <li key={s.id} className='linked'>
                    <div className='text'>
                      <div className='votes'>0</div>
                      <div className='name'>{s.name}</div>
                      <div className='created-on'>
                        <Moment fromNow>{`${s.created_on.replace(' ', 'T')}Z`}</Moment>
                      </div>
                    </div>
                    <ProfileLink to={`/suggestions/${s.id}`} />
                  </li>
                );
              })}
            </ul>
          </>
        );
      }

      const suggestion = match.params.id && this.state.suggestions.data.find(s => s.id === parseInt(match.params.id, 10)) ? this.state.suggestions.data.find(s => s.id === parseInt(match.params.id, 10)) : this.state.suggestions.data[0];

      detail = suggestion ? (
        <>
          <div className='header'>
            <div className='name'>{suggestion.name}</div>
            <div className='created-on'>
              <Moment fromNow>{`${suggestion.created_on.replace(' ', 'T')}Z`}</Moment>
            </div>
          </div>
          <Description className='description' source={suggestion.description} />
        </>
      ) : null;
    } else {
      suggestions = <Spinner />;
    }

    if (viewport.width < 1024 && match.params.id) {
      return (
        <>
          <div className='view' id='suggestions'>
            <div className='padder'>
              <div className='module detail'>{detail}</div>
            </div>
          </div>
          <div className='sticky-nav'>
            <div />
            <ul>
              <li>
                <ProfileLink className='button' to='/suggestions'>
                  <i className='destiny-B_Button' />
                  {t('Back')}
                </ProfileLink>
              </li>
            </ul>
          </div>
        </>
      );
    } else {
      return (
        <div className='view' id='suggestions'>
          <div className='module head'>
            <div className='page-header'>
              <div className='name'>{t('Suggestions')}</div>
            </div>
          </div>
          <div className='padder'>
            {viewport.width < 1024 && this.state.form.visible ? null : <div className='module'>
              <p>{t("Hello Guardian! Braytech's feature set is largely user-inspired. You can directly impact the direction in which Braytech develops by sharing your points of pain and pleasure.")}</p>
              <p>{t('Use this opportunity to go on the record and make your voice heard.')}</p>
              <p>{t('Each suggestion is manually reviewed by me, Tom, before being published. Once published, others may vote on it, potentially affecting its priority.')}</p>
            </div>}
            <div className='module suggestions'>{suggestions}</div>
            {viewport.width >= 1024 ? <div className='module detail'>{detail}</div> : null}
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    viewport: state.viewport
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Suggestions);
