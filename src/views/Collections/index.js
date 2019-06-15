import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { ProfileLink } from '../../components/ProfileLink';

import './styles.css';

import Root from './Root/';
import Node from './Node/';
import BadgeNode from './BadgeNode/';

class Collections extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    if (!this.props.match.params.quaternary) {
      window.scrollTo(0, 0);
    }

    this.props.rebindTooltips();
  }

  toggleCompleted = () => {
    let currentState = this.props.collectibles;
    let newState = {
      hideCompletedCollectibles: !currentState.hideCompletedCollectibles
    };

    this.props.setCollectibleDisplayState(newState);
  };

  render() {
    const { t } = this.props;
    let primaryHash = this.props.match.params.primary ? this.props.match.params.primary : false;

    let backLinkPath = this.props.location.state && this.props.location.state.from ? this.props.location.state.from : '/collections';

    let toggleCompletedLink = (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a className='button' onClick={this.toggleCompleted}>
        {this.props.collectibles.hideCompletedCollectibles ? (
          <>
            <i className='uniF16E' />
            {t('Show all')}
          </>
        ) : (
          <>
            <i className='uniF16B' />
            {t('Hide acquired')}
          </>
        )}
      </a>
    );

    if (!primaryHash) {
      return (
        <div className={cx('view', 'presentation-node', 'root')} id='collections'>
          <Root {...this.props} />
        </div>
      );
    } else if (primaryHash === 'badge') {
      return (
        <>
          <div className={cx('view', 'presentation-node')} id='collections'>
            <BadgeNode {...this.props} />
          </div>
          <div className='sticky-nav'>
            <div />
            <ul>
              <li>{toggleCompletedLink}</li>
              <li>
                <ProfileLink className='button' to={backLinkPath}>
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
        <>
          <div className={cx('view', 'presentation-node')} id='collections'>
            <Node {...this.props} primaryHash={primaryHash} />
          </div>
          <div className='sticky-nav'>
            <div />
            <ul>
              <li>{toggleCompletedLink}</li>
              <li>
                <ProfileLink className='button' to={backLinkPath}>
                  <i className='destiny-B_Button' />
                  {t('Back')}
                </ProfileLink>
              </li>
            </ul>
          </div>
        </>
      );
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    collectibles: state.collectibles
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCollectibleDisplayState: value => {
      dispatch({ type: 'SET_COLLECTIBLES', payload: value });
    },
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
)(Collections);
