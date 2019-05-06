
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import Moment from 'react-moment';
import cx from 'classnames';

import Globals from '../../utils/globals';
import { ProfileLink } from '../../components/ProfileLink';
import manifest from '../../utils/manifest';
import ObservedImage from '../../components/ObservedImage';
import MemberLink from '../../components/MemberLink';
import Spinner from '../../components/UI/Spinner';
import * as utils from '../../utils/destinyUtils';
import * as destinyEnums from '../../utils/destinyEnums';
import * as voluspa from '../../utils/voluspa';
import * as bungie from '../../utils/bungie';

class Group extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      response: false
    };
  }
  
  callVoulspa = async () => {
    this.setState((prevState, props) => {
      prevState.loading = true;
      return prevState;
    });

    let [memberRank] = await Promise.all([voluspa.memberRank(this.props.member.membershipType, this.props.member.membershipId)]);

    let response = {
      memberRank: memberRank ? memberRank : false
    };

    this.setState((prevState, props) => {
      prevState.loading = false;
      prevState.response = response;
      return prevState;
    });
  }

  async componentDidMount() {
    window.scrollTo(0, 0);

    // this.callVoulspa();

    let [groupMembers, groupRank] = await Promise.all([bungie.groupMembers(this.props.groupId), voluspa.groupRank(this.props.groupId)]);

    console.log(groupMembers, groupRank)
  }

  render() {
    const { t, membershipType, membershipId } = this.props;

    return (
      <div className='member'>
        <div className='head'>
          <div className='page-header'>
            <div className='name'>{t('Leaderboards')}</div>
            <div className='description'>{t("It's a long way to the top")}</div>
          </div>
        </div>
        <div className='wrap'>
          
        </div>
      </div>
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
)(Group);
