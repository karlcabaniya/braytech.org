import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import Button from '../../UI/Button';

import './styles.css';

class ServiceWorkerUpdate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.mounted = false;
  }

  componentWillMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidMount() {}

  refreshApp = () => {
    window.location.reload();
  }

  render() {
    const { t, updateAvailable } = this.props;

    if (updateAvailable) {
      return (
        <div id="service-worker-update">
          <div className='wrapper'>
            <div className='text'>
              {t('An update for Braytech is available. Please restart the app to start using it immediately.')}
            </div>
            <div className='action'>
              <Button text={t('Restart Braytech')} action={this.refreshApp} />
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default compose(
  connect(),
  withNamespaces()
)(ServiceWorkerUpdate);
