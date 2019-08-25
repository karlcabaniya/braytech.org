import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import Records from '../Records';
import Collectibles from '../Collectibles';

import './styles.css';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      search: ''
    };

    this.index = [];
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.results !== this.state.results) {
      this.props.rebindTooltips();
    }
  }

  componentDidMount() {
    const { scope } = this.props;

    if (scope === 'records') {
      this.index.push(...Object.entries(manifest.DestinyRecordDefinition).filter(r => !r[1].redacted))
    } else if (scope === 'collectibles') {
      this.index.push(...Object.entries(manifest.DestinyCollectibleDefinition).filter(r => !r[1].redacted))
    }
  }

  onSearchChange = e => {
    this.setState({ search: e.target.value });
    this.performSearch();
  };

  onSearchKeyPress = e => {
    // If they pressed enter, ignore the debounce and search
    if (e.key === 'Enter') this.performSearch.flush();
  };

  performSearch = debounce((term = this.state.search) => {
    if (!term || term.length < 2) {
      this.setState({ results: [] });
      return;
    };

    console.log(term);

    let results = this.index.filter(r => {

      let name = r[1].displayProperties && r[1].displayProperties.name;
      let description = r[1].displayProperties && r[1].displayProperties.description;

      let definitionItem = r[1].itemHash ? manifest.DestinyInventoryItemDefinition[r[1].itemHash] : false;

      name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      description = description.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      let type = definitionItem && definitionItem.itemTypeAndTierDisplayName ? definitionItem.itemTypeAndTierDisplayName.normalize('NFD').replace(/[\u0300-\u036f]/g, "") : false;

      let conjoinedString = `${name} ${description}`;
      let regex = RegExp(term, 'gi');
      let regexType = RegExp(term.replace('type:','').trim(), 'gi');
      let typeMatch = /type:(.+)/gi.exec(term)

      if (typeMatch && regexType.test(type)) {
        return true;
      } else if (regex.test(conjoinedString)) {
        return true;
      } else {
        return false;
      }
    });

    this.setState({ results });
    
  }, 500);

  render() {
    const { t, scope } = this.props;
    const { results, search } = this.state;

    let display;
    if (scope === 'records') {
      display = (
        <ul className='list record-items'>
          <Records selfLinkFrom='/triumphs' hashes={results.map(r => r[0])} ordered />
        </ul>
      )
    } else if (scope === 'collectibles') {
      display = (
        <ul className='list collection-items'>
          <Collectibles selfLinkFrom='/collections' hashes={results.map(r => r[0])} ordered />
        </ul>
      )
    }

    return (
      <div className={cx('index-search', { 'has-results': results.length })}>
        <div className='form'>
          <div className='field'>
            <input onChange={this.onSearchChange} type='text' placeholder={t('enter name or description')} spellCheck='false' value={search} onKeyPress={this.onSearchKeyPress} />
          </div>
        </div>
        {display}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    tooltips: state.tooltips
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
)(Search);