import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import Moment from 'react-moment';
import cx from 'classnames';

import { ProfileLink } from '../../components/ProfileLink';
import ObservedImage from '../../components/ObservedImage';
import Button from '../../components/Button';
import captainsLog from '../../data/captainsLog';
import { ReactComponent as Logo } from '../../components/BraytechDevice.svg';

import './styles.css';

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      slogan: Math.floor(Math.random() * (2 - 0 + 1)) + 0,
      log: 0
    };
    this.logs = captainsLog.slice().reverse();
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  logPrevious = e => {
    if (this.state.log + 1 === this.logs.length) {
      return;
    }
    this.setState(prev => ({
      log: prev.log + 1
    }));
  }

  logNext = e => {
    if (this.state.log === 0) {
      return;
    }
    this.setState(prev => ({
      log: prev.log - 1
    }));
  }

  render() {
    let slogans = [
      {
        message: 'Where are the Sleeper Nodes?',
        link: {
          to: '/checklists',
          name: 'Checklists'
        }
      },
      {
        message: 'Wish I could track triumphs outside of the game...',
        link: {
          to: '/triumphs',
          name: 'Triumphs'
        }
      },
      {
        message: "What's happening for this week's endgame?",
        link: {
          to: '/this-week',
          name: 'This Week'
        }
      }
    ];

    return (
      <div className='view' id='index'>
        <div className='head'>
          <ObservedImage className='bg image' src='/static/images/Crimson_Header.jpg' />
          <div className='device'>
            <Logo />
          </div>
          <div className='slogan'>
            <div className='message'>{slogans[this.state.slogan].message}</div>
            {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
            <div className='link'>
              // <ProfileLink to={slogans[this.state.slogan].link.to}>{slogans[this.state.slogan].link.name}</ProfileLink>
            </div>
          </div>
        </div>
        <div className='modules'>
          <div className='coming-up'>
            <div className='page-header'>
              <div className='name'><span className='destiny-crimson_days' /> Crimson Days</div>
              <div className='description'>What's happening this week in Destiny</div>
            </div>
            <div className='text'>
              <blockquote>
                <p><em>“Do you hear that? Love beckons. And when love beckons, who among us can say no?”</em> —Lord Shaxx</p>
                <p>Crimson Days returns on Tuesday, February 12. This year’s event will be similar to the one from last year, but we have changed a few things up and added a few new rewards.</p>
                <p>Crimson Doubles is the 2v2 Crucible playlist at the center of the event. The combat scenario is 2v2 Clash with a round-based twist. Stay in close proximity to your partner and your abilities will recharge at a faster rate. Stray too far, and your enemies will be given a waypoint leading to your location. If you can’t find a partner, don’t worry, we’ll play matchmaker and find one for you. To sweeten the deal we will be turning on Valor bonuses throughout the event for both Crimson Doubles and all other Crucible modes.</p>
              </blockquote>
              <p>Read more on <a href='https://www.bungie.net/en/Explore/Detail/News/47607' target='_blank' rel='noopener noreferrer'>Bungie.net</a><span className='destiny-external' /></p>
            </div>
          </div>
          <div className='change-log'>
            <div className='sub-header sub'>
              <div>Change log</div>
            </div>
            <div className='log-state'>
              <div className='meta'>
                <div className='number'>{this.logs[this.state.log].version}</div>
                <div className='time'>
                  <Moment fromNow>{this.logs[this.state.log].date}</Moment>
                </div>
              </div>
              <div className='buttons'>
                <Button lined text={<span className='destiny-arrow_left' />} action={this.logPrevious} disabled={this.state.log + 1 === this.logs.length ? true : false} />
                <Button lined text={<span className='destiny-arrow_right' />} action={this.logNext} disabled={this.state.log === 0 ? true : false} />
              </div>
            </div>
            <ReactMarkdown className='log-content' source={this.logs[this.state.log].content} />
          </div>
          <div className='description'>
            <p>Braytech is a Destiny fan site that allows users to view and map checklists, track and view triumphs, inspect collectibles, and a few other things too.</p>
            <p>The name, Braytech, is that with which Clovis Bray designates their consumer products line; weapons, armour, etc.</p>
            <p>Braytech is a stringent exercise in game UI mimicry and quality over quantity. Additionally, it’s a learning exercise for the primary developer in terms of technology and acting on user feedback.</p>
          </div>
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
