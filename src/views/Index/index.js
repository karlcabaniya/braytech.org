import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import Moment from 'react-moment';
import cx from 'classnames';

import captainsLog from '../../data/captainsLog';

import './styles.css';

class Index extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className='view' id='index'>
        <div className='head'>
          <div className='logo-area'>
            <div className='logo-feature'>
              <div className='device'>
                <span className='destiny-clovis_bray_device' />
              </div>
            </div>
            <div className='name'>Braytech</div>
          </div>
          <div className='description'>Destiny 2 character progression, clans, triumphs, collections, and more.</div>
        </div>
        <div className='changelog'>
          Change log will return...
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    theme: state.theme
  };
}

export default compose(connect(mapStateToProps))(Index);
