import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';


import manifest from '../../utils/manifest';
import ObservedImage from '../../components/ObservedImage';


import ChecklistFactory from '../Checklists/ChecklistFactory';

import './styles.css';

class Maps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    const { t, member } = this.props;

    this.checklistFactory = new ChecklistFactory(t, member.data.profile, member.characterId, false);
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    console.log(this.checklistFactory.corruptedEggs({ requested: [1101252162, 1101252163, 1101252168, 1101252169, 1101252171, 1101252172, 1101252173, 1101252174, 1101252175], data: true }))
  }

  render() {
    return null
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
)(Maps);
