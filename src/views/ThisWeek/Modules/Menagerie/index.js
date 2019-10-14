import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import Collectibles from '../../../../components/Collectibles';
import Records from '../../../../components/Records';

import './styles.css';

class Menagerie extends React.Component {
  render() {
    const { t, member, cycleInfo } = this.props;
    const characters = member.data.profile.characters.data;

    const rotation = {
      1: {
        boss: t('Hasapiko, Beloved by Calus'),
        triumphs: [3141945846, 2422246606, 2422246593],
        items: [],
        collectibles: {
          0: [1692129580, 2678796997],
          1: [3376099856, 2678796997],
          2: [1572606157, 2678796997]
        }
      },
      2: {
        boss: t('Arunak, Beloved by Calus'),
        triumphs: [1959753477, 2422246607, 2472579457],
        items: [],
        collectibles: {
          0: [1692129580, 2678796997],
          1: [3376099856, 2678796997],
          2: [1572606157, 2678796997]
        }
      },
      3: {
        boss: t('Pagouri, Beloved by Calus'),
        triumphs: [2351146132, 2422246605, 2422246592],
        items: [],
        collectibles: {
          0: [1692129580, 2678796997],
          1: [3376099856, 2678796997],
          2: [1572606157, 2678796997]
        }
      }
    };

    return [
      <React.Fragment key='menagerie'>
        <div className='module-header'>
          <div className='sub-name'>{t('The Menagerie')}</div>
          <div className='name'>{rotation[cycleInfo.week.menagerie].boss}</div>
        </div>
        <h4>{t('Heroic Collectibles')}</h4>
        <ul className='list collection-items'>
          <Collectibles selfLinkFrom='/this-week' hashes={rotation[cycleInfo.week.menagerie].collectibles[characters.find(c => c.characterId === member.characterId).classType]} />
        </ul>
        <h4>{t('Triumphs')}</h4>
        <ul className='list record-items'>
          <Records selfLinkFrom='/this-week' hashes={rotation[cycleInfo.week.menagerie].triumphs} />
        </ul>
      </React.Fragment>
    ]
      .map(m => ({
        className: [],
        mods: [
          {
            className: [],
            component: m
          }
        ]
      }))
      .map((col, c) => {
        return (
          <div key={c} className={cx('column', ...col.className)}>
            {col.mods.map((mod, m) => {
              return (
                <div key={m} className={cx('module', ...mod.className)}>
                  {mod.component}
                </div>
              );
            })}
          </div>
        );
      });
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(Menagerie);
