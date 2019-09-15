import React from 'react';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import ProgressBar from '../UI/ProgressBar';
import Checkbox from '../UI/Checkbox';

import './styles.css';

const ChecklistItem = props => {
  const { completed, suffix, name, location } = props;

  return (
    <li className={cx({ completed })}>
      <Checkbox
        checked={completed}
        children={
          <>
            <div className='name'>{name}{suffix ? ` ${suffix}` : null}</div>
          </>
        }
      />
      <div className='location'>{location}</div>
    </li>
  );
};

const Checklist = props => {
  const { t, headless, totalItems, completedItems, characterBound, checklistName, checklistProgressDescription, items } = props;
  console.log(props);
  if (headless) {
    return (
      <>
        {items.length > 0 ? (
          <ul className='list checklist-items'>
            {items.map((entry, i) => (
              <ChecklistItem key={i} completed={entry.completed} name={entry.formatted.name} location={entry.formatted.location} />
            ))}
          </ul>
        ) : (
          <div className='info'>
            <div className='text'>{t('All complete')}</div>
          </div>
        )}
      </>
    );
  } else {
    return (
      <>
        <div className='module-header'>
          <div className='sub-name'>{t(checklistName)}</div>
          {characterBound ? (
            <div className='tooltip' data-hash='character_bound' data-table='BraytechDefinition'>
              <i className='segoe-uniE902' />
            </div>
          ) : null}
        </div>
        <ProgressBar
          objective={{
            progressDescription: t(checklistProgressDescription),
            completionValue: totalItems
          }}
          progress={{
            progress: completedItems
          }}
          hideCheck
          chunky
        />
        {items.length > 0 ? (
          <ul className='list checklist-items'>
            {items.map((entry, i) => (
              <ChecklistItem key={i} completed={entry.completed} {...entry.formatted} />
            ))}
          </ul>
        ) : (
          <div className='info'>
            <div className='text'>{t('All complete')}</div>
          </div>
        )}
      </>
    );
  }
};

export default withTranslation()(Checklist);
