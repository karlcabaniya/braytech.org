import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';
import moment from 'moment';
import { orderBy } from 'lodash';

import * as destinyUtils from '../../utils/destinyUtils';
import * as bungie from '../../utils/bungie';
import { ProfileLink } from '../ProfileLink';
import MemberLink from '../MemberLink';
import Spinner from '../UI/Spinner';

import './styles.css';
import manifest from '../../utils/manifest';

class RosterLeaderboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: {
        sort: false,
        dir: 'desc'
      },
      board: false
    };
  }

  componentDidMount() {
    this.mounted = true;

    this.callGetClanLeaderboards();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  callGetClanLeaderboards = async () => {
    const { member, mode } = this.props;
    const group = member.data.groups.results.length > 0 ? member.data.groups.results[0].group : false;

    if (group) {
      const board = await bungie.GetClanLeaderboards(group.groupId, [mode]);

      console.log(Object.values(board)[0]);

      if (this.mounted) {
        this.setState({ board: Object.values(board)[0] });
      }
    }
  };

  changeSortTo = to => {
    this.setState((prevState, props) => {
      prevState.order.dir = prevState.order.sort === to && prevState.order.dir === 'desc' ? 'asc' : 'desc';
      prevState.order.sort = to;
      return prevState;
    });
  };

  render() {
    const { t, member } = this.props;
    const group = member.data.groups.results.length > 0 ? member.data.groups.results[0].group : false;

    // const isSelf = m.profile.profile.data.userInfo.membershipType.toString() === member.membershipType && m.profile.profile.data.userInfo.membershipId === member.membershipId;

    // <MemberLink type={m.destinyUserInfo.membershipType} id={m.destinyUserInfo.membershipId} groupId={m.destinyUserInfo.groupId} displayName={m.destinyUserInfo.displayName} hideEmblemIcon={!m.isOnline} />

    // <li key={m.destinyUserInfo.membershipType + m.destinyUserInfo.membershipId} className={cx('row', { self: isSelf })}>

    if (this.state.board) {
      const boards = Object.entries(this.state.board).map(([statId, data]) => {
        const definitionStat = manifest.DestinyHistoricalStatsDefinition[statId];

        return {
          name: statId,
          el: (
            <div className='module'>
              <div className='module-header'>
                <div className='sub-name'>{definitionStat.statName}</div>
              </div>
              <ul key={statId} className='list leaderboard'>
                {data.entries.map(m => {
                  return (
                    <li key={m.player.destinyUserInfo.membershipId} className={cx('row', { self: false })}>
                      <ul>
                        <li className='col rank'>{m.rank}</li>
                        <li className='col member'>
                          <MemberLink type={m.player.destinyUserInfo.membershipType} id={m.player.destinyUserInfo.membershipId} groupId={group.groupId} displayName={m.player.destinyUserInfo.displayName} />
                        </li>
                        <li className='col value'>{m.value.basic.displayValue}</li>
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
          )
        };
      });

      let order = this.state.order;

      // ranks.unshift({
      //   sorts: {},
      //   el: {
      //     full: (
      //       <li key='header-row' className='row header'>
      //         <ul>
      //           <li className='col member' />

      //         </ul>
      //       </li>
      //     )
      //   }
      // });

      return boards.map(e => e.el);
    } else {
      return <Spinner />;
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

function mapDispatchToProps(dispatch) {
  return {
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
  withTranslation()
)(RosterLeaderboard);
