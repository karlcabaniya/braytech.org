import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import ProgressBar from '../../components/UI/ProgressBar';

const Checklist = props => {
  const { t, name, characterBound, totalItems, progressDescription, completedItems, children } = props;

  return (
    <>
      <div className='module-header'>
        <div className='sub-name'>{name}</div>
        {characterBound ? <div className='tooltip' data-hash='character_bound' data-table='BraytechDefinition'><i className='segoe-uniE902' /></div> : null}
      </div>
      <ProgressBar
        objectiveDefinition={{
          progressDescription,
          completionValue: totalItems
        }}
        playerProgress={{
          progress: completedItems
        }}
        hideCheck
        chunky
      />
      {children.length > 0 ? (
        <ul className='list no-interaction'>{children}</ul>
      ) : (
        <div className='info'>
          <div className='text'>{t("All complete")}</div>
        </div>
      )}
    </>
  );
};

Checklist.propTypes = {
  name: PropTypes.node.isRequired,
  characterBound: PropTypes.bool.isRequired,
  progressDescription: PropTypes.string.isRequired,
  totalItems: PropTypes.number.isRequired,
  completedItems: PropTypes.number.isRequired
};

export default withNamespaces()(Checklist);
