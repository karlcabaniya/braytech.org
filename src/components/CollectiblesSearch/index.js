import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import Collectibles from '../Collectibles';
import manifest from '../../utils/manifest';

import './styles.css';

class CollectiblesSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      search: ''
    };

    this.collectibles = Object.entries(manifest.DestinyCollectibleDefinition).filter(r => !r[1].redacted);
  }

  onSearchChange = e => {
    this.setState({ search: e.target.value });
    this.searchForCollectibles();
  };

  onSearchKeyPress = e => {
    // If they pressed enter, ignore the debounce and search
    if (e.key === 'Enter') this.searchForCollectibles.flush();
  };

  // Debounced so that we don't make an API request for every single
  // keypress - only when they stop typing.
  searchForCollectibles = debounce(async (term = this.state.search) => {
    if (!term || term.length < 2) {
      this.setState({ results: [] });
      return;
    };

    console.log(term);

    let results = this.collectibles.filter(r => {

      let name = r[1].displayProperties && r[1].displayProperties.name;
      let description = r[1].displayProperties && r[1].displayProperties.description;

      name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      description = description.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

      let conjoinedString = `${name} ${description}`;
      let regex = RegExp(term,'gi');

      if (regex.test(conjoinedString)) {
        return true;
      } else {
        return false;
      }
    });

    this.setState({ results });
    
  }, 500);

  render() {
    const { t } = this.props;
    const { results, search } = this.state;

    return (
      <div className={cx('collectibles-search', { 'has-results': results.length })}>
        <div className='form'>
          <div className='field'>
            <input onChange={this.onSearchChange} type='text' placeholder={t('enter name or description')} spellCheck='false' value={search} onKeyPress={this.onSearchKeyPress} />
          </div>
        </div>
        <ul className='list collection-items'>
          <Collectibles selfLinkFrom='/collections' {...this.props} hashes={results.map(r => r[0])} />
        </ul>
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
)(CollectiblesSearch);