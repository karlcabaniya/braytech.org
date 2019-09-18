import React from 'react';
import { sortBy } from 'lodash';

import store from './reduxStore';
import i18n from './i18n';

import data from '../data/lowlines/checklists';
import manifest from './manifest';

export const checklists = {
  // adventures
  4178338182: options =>
    checklist({
      checklistId: 4178338182,
      items: checklistItems(4178338182, true),
      characterBound: true,
      itemName: i => manifest.DestinyActivityDefinition[i.activityHash].displayProperties.name,
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return `${bubbleName}, ${destinationName}`;
      },
      itemLocationExt: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];
        const definitionBubble = definitionDestination && definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination && definitionDestination.displayProperties.name;
        const placeName = definitionPlace && definitionPlace.displayProperties.name && definitionPlace.displayProperties.name !== definitionDestination.displayProperties.name && definitionPlace.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return [bubbleName, destinationName, placeName].filter(s => s).join(', ');
      },
      sortBy: ['completed', 'destination', 'bubble', 'name'],
      checklistItemName: i18n.t('Adventure'),
      checklistItemName_plural: i18n.t('Adventures'),
      checklistIcon: 'destiny-adventure',
      checklistProgressDescription: i18n.t('Adventures undertaken'),
      ...options
    }),
  // region chests
  1697465175: options =>
    checklist({
      checklistId: 1697465175,
      characterBound: true,
      items: checklistItems(1697465175, true),
      sortBy: ['completed', 'destination', 'bubble'],
      itemName: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return bubbleName;
      },
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];

        const destinationName = definitionDestination.displayProperties.name;

        return destinationName;
      },
      itemLocationExt: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];
        const definitionBubble = definitionDestination && definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination && definitionDestination.displayProperties.name;
        const placeName = definitionPlace && definitionPlace.displayProperties.name && definitionPlace.displayProperties.name !== definitionDestination.displayProperties.name && definitionPlace.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return [bubbleName, destinationName, placeName].filter(s => s).join(', ');
      },
      checklistItemName: i18n.t('Region Chest'),
      checklistItemName_plural: i18n.t('Region Chests'),
      checklistIcon: 'destiny-region_chests',
      checklistProgressDescription: i18n.t('Chests opened'),
      ...options
    }),
  // lost sectors
  3142056444: options =>
    checklist({
      checklistId: 3142056444,
      characterBound: true,
      items: checklistItems(3142056444, true),
      sortBy: ['completed', 'destination', 'name'],
      itemName: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return bubbleName;
      },
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];

        const destinationName = definitionDestination.displayProperties.name;

        return destinationName;
      },
      itemLocationExt: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];
        const definitionBubble = definitionDestination && definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination && definitionDestination.displayProperties.name;
        const placeName = definitionPlace && definitionPlace.displayProperties.name && definitionPlace.displayProperties.name !== definitionDestination.displayProperties.name && definitionPlace.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return [bubbleName, destinationName, placeName].filter(s => s).join(', ');
      },
      checklistItemName: i18n.t('Lost Sector'),
      checklistItemName_plural: i18n.t('Lost Sectors'),
      checklistIcon: 'destiny-lost_sectors',
      checklistProgressDescription: i18n.t('Discovered'),
      ...options
    }),
  // ahamkara bones
  1297424116: options =>
    checklist({
      checklistId: 1297424116,
      items: checklistItems(1297424116),
      // sortBy: ['number'],
      itemName: i => {
        const definitionRecord = manifest.DestinyRecordDefinition[i.recordHash];
        const definitionLore = manifest.DestinyLoreDefinition[definitionRecord.loreHash];

        return definitionLore.displayProperties.name;
      },
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return `${bubbleName}, ${destinationName}`;
      },
      itemLocationExt: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];
        const definitionBubble = definitionDestination && definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination && definitionDestination.displayProperties.name;
        const placeName = definitionPlace && definitionPlace.displayProperties.name && definitionPlace.displayProperties.name !== definitionDestination.displayProperties.name && definitionPlace.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return [bubbleName, destinationName, placeName].filter(s => s).join(', ');
      },
      checklistItemName: i18n.t('Ahamkara Bones'),
      checklistItemName_plural: i18n.t('Ahamkara Bones'),
      checklistIcon: 'destiny-ahamkara_bones',
      checklistProgressDescription: i18n.t('Bones found'),
      ...options
    }),
  // corrupted eggs
  2609997025: options =>
    numberedChecklist('Egg', {
      checklistId: 2609997025,
      items: checklistItems(2609997025, false),
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return `${bubbleName}, ${destinationName}`;
      },
      itemLocationExt: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];
        const definitionBubble = definitionDestination && definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination && definitionDestination.displayProperties.name;
        const placeName = definitionPlace && definitionPlace.displayProperties.name && definitionPlace.displayProperties.name !== definitionDestination.displayProperties.name && definitionPlace.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return [bubbleName, destinationName, placeName].filter(s => s).join(', ');
      },
      checklistItemName: i18n.t('Corrupted Egg'),
      checklistItemName_plural: i18n.t('Corrupted Eggs'),
      checklistIcon: 'destiny-corrupted_eggs',
      checklistProgressDescription: i18n.t('Eggs destroyed'),
      ...options
    }),
  // cat statues
  2726513366: options =>
    numberedChecklist('Feline friend', {
      checklistId: 2726513366,
      items: checklistItems(2726513366),
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return `${bubbleName}, ${destinationName}`;
      },
      itemLocationExt: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];
        const definitionBubble = definitionDestination && definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination && definitionDestination.displayProperties.name;
        const placeName = definitionPlace && definitionPlace.displayProperties.name && definitionPlace.displayProperties.name !== definitionDestination.displayProperties.name && definitionPlace.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return [bubbleName, destinationName, placeName].filter(s => s).join(', ');
      },
      checklistItemName: i18n.t('Cat Statue'),
      checklistItemName_plural: i18n.t('Cat Statues'),
      checklistIcon: 'destiny-cat_statues',
      checklistProgressDescription: i18n.t('Feline friends satisfied'),
      ...options
    }),
  // sleeper nodes
  365218222: options =>
    checklist({
      checklistId: 365218222,
      items: checklistItems(365218222),
      sortBy: ['name', 'destination', 'bubble'],
      itemName: i => manifest.DestinyInventoryItemDefinition[i.itemHash].displayProperties.description.replace('CB.NAV/RUN.()', ''),
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return `${bubbleName}, ${destinationName}`;
      },
      itemLocationExt: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];
        const definitionBubble = definitionDestination && definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination && definitionDestination.displayProperties.name;
        const placeName = definitionPlace && definitionPlace.displayProperties.name && definitionPlace.displayProperties.name !== definitionDestination.displayProperties.name && definitionPlace.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return [bubbleName, destinationName, placeName].filter(s => s).join(', ');
      },
      checklistItemName: i18n.t('Sleeper Node'),
      checklistItemName_plural: i18n.t('Sleeper Nodes'),
      checklistIcon: 'destiny-sleeper_nodes',
      checklistProgressDescription: i18n.t('Nodes hacked'),
      ...options
    }),
  // ghost scans
  2360931290: options =>
    numberedChecklist('Scan', {
      checklistId: 2360931290,
      items: checklistItems(2360931290),
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return `${bubbleName}, ${destinationName}`;
      },
      itemLocationExt: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];
        const definitionBubble = definitionDestination && definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination && definitionDestination.displayProperties.name;
        const placeName = definitionPlace && definitionPlace.displayProperties.name && definitionPlace.displayProperties.name !== definitionDestination.displayProperties.name && definitionPlace.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return [bubbleName, destinationName, placeName].filter(s => s).join(', ');
      },
      checklistItemName: i18n.t('Ghost Scan'),
      checklistItemName_plural: i18n.t('Ghost Scans'),
      checklistIcon: 'destiny-ghost',
      checklistProgressDescription: i18n.t('Scans performed'),
      ...options
    }),
  // latent memories
  2955980198: options =>
    numberedChecklist('Memory', {
      checklistId: 2955980198,
      items: checklistItems(2955980198),
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return `${bubbleName}, ${destinationName}`;
      },
      itemLocationExt: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];
        const definitionBubble = definitionDestination && definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination && definitionDestination.displayProperties.name;
        const placeName = definitionPlace && definitionPlace.displayProperties.name && definitionPlace.displayProperties.name !== definitionDestination.displayProperties.name && definitionPlace.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return [bubbleName, destinationName, placeName].filter(s => s).join(', ');
      },
      checklistItemName: i18n.t('Lost Memory Fragment'),
      checklistItemName_plural: i18n.t('Lost Memory Fragments'),
      checklistIcon: 'destiny-lost_memory_fragments',
      checklistProgressDescription: i18n.t('Memories resolved'),
      ...options
    }),
  // lore: ghost stories
  1420597821: options =>
    checklist({
      checklistId: 1420597821,
      items: presentationItems(1420597821),
      sortBy: ['completed', 'destination', 'bubble'],
      itemName: i => {
        const definitionRecord = manifest.DestinyRecordDefinition[i.recordHash];
        const definitionLore = manifest.DestinyLoreDefinition[definitionRecord.loreHash];

        return definitionLore.displayProperties.name;
      },
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return `${bubbleName}, ${destinationName}`;
      },
      itemLocationExt: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];
        const definitionBubble = definitionDestination && definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination && definitionDestination.displayProperties.name;
        const placeName = definitionPlace && definitionPlace.displayProperties.name && definitionPlace.displayProperties.name !== definitionDestination.displayProperties.name && definitionPlace.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return [bubbleName, destinationName, placeName].filter(s => s).join(', ');
      },
      checklistItemName: i18n.t('Lore: Ghost Stories'),
      checklistItemName_plural: i18n.t('Lore: Ghost Stories'),
      checklistIcon: 'destiny-lore_scholar',
      checklistImage: '/static/images/extracts/ui/checklists/037e-00004869.png',
      checklistProgressDescription: i18n.t('Stories read'),
      ...options
    }),
  // lore: awoken of the reef
  3305936921: options =>
    checklist({
      checklistId: 3305936921,
      items: presentationItems(3305936921),
      sortBy: ['completed', 'destination', 'bubble'],
      itemName: i => {
        const definitionRecord = manifest.DestinyRecordDefinition[i.recordHash];
        const definitionLore = manifest.DestinyLoreDefinition[definitionRecord.loreHash];

        return definitionLore.displayProperties.name;
      },
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return `${bubbleName}, ${destinationName}`;
      },
      itemLocationExt: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];
        const definitionBubble = definitionDestination && definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination && definitionDestination.displayProperties.name;
        const placeName = definitionPlace && definitionPlace.displayProperties.name && definitionPlace.displayProperties.name !== definitionDestination.displayProperties.name && definitionPlace.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return [bubbleName, destinationName, placeName].filter(s => s).join(', ');
      },
      checklistItemName: i18n.t('Lore: Awoken of the Reef'),
      checklistItemName_plural: i18n.t('Lore: Awoken of the Reef'),
      checklistIcon: 'destiny-lore_scholar',
      checklistImage: '/static/images/extracts/ui/checklists/037e-00004874.png',
      checklistProgressDescription: i18n.t('Crystals resolved'),
      ...options
    }),
  // lore: forsaken prince
  655926402: options =>
    checklist({
      checklistId: 655926402,
      items: presentationItems(655926402),
      sortBy: ['completed', 'destination', 'bubble'],
      itemName: i => {
        const definitionRecord = manifest.DestinyRecordDefinition[i.recordHash];
        const definitionLore = manifest.DestinyLoreDefinition[definitionRecord.loreHash];

        return definitionLore.displayProperties.name;
      },
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];

        if (!definitionDestination) {
          return <em>Forsaken Campaign</em>;
        }

        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return `${bubbleName}, ${destinationName}`;
      },
      itemLocationExt: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];
        const definitionBubble = definitionDestination && definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination && definitionDestination.displayProperties.name;
        const placeName = definitionPlace && definitionPlace.displayProperties.name && definitionPlace.displayProperties.name !== definitionDestination.displayProperties.name && definitionPlace.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return [bubbleName, destinationName, placeName].filter(s => s).join(', ');
      },
      checklistItemName: i18n.t('Lore: Forsaken Prince'),
      checklistItemName_plural: i18n.t('Lore: Forsaken Prince'),
      checklistIcon: 'destiny-lore_scholar',
      checklistImage: '/static/images/extracts/ui/checklists/037e-00004886.png',
      checklistProgressDescription: i18n.t('Data caches decrypted'),
      ...options
    })
};

export default checklists;

export function lookup(item) {
  const checklistId = Object.keys(data).find(key => data[key].find(entry => entry[item.key] === parseInt(item.value, 10)));
  const checklistEntry = checklistId && data[checklistId].find(entry => entry[item.key] === parseInt(item.value, 10));

  if (checklistEntry) {
    return {
      checklistId,
      [item.key]: checklistEntry && checklistEntry[item.key]
    }
  } else {
    return {}
  }
}

function checklist(options = {}) {
  const defaultOptions = {
    characterBound: false
  };

  options = { ...defaultOptions, ...options };

  const items = options.sortBy
    ? sortBy(options.items, [
        function(i) {
          return options.sortBy.map(by => i.sorts[by]);
        }
      ])
    : options.items;

  const response = options.requested && options.requested.key ? items.filter(i => options.requested.array.indexOf(i[options.requested.key]) > -1) : items;

  return {
    checklistId: options.checklistId,
    checklistItemName: options.checklistItemName,
    checklistItemName_plural: options.checklistItemName_plural,
    checklistIcon: options.checklistIcon,
    checklistImage: options.checklistImage,
    checklistProgressDescription: options.checklistProgressDescription,
    checklistCharacterBound: options.characterBound,
    totalItems: items.length,
    completedItems: items.filter(i => i.completed).length,
    items: response.map(i => ({
      ...i,
      formatted: {
        suffix: options.numbered ? i.sorts.number : '',
        number: i.sorts.number,
        name: options.itemName(i),
        location: options.itemLocation(i),
        locationExt: options.itemLocationExt(i)
      },
      completed: i.completed
    }))
  };
}

function numberedChecklist(name, options = {}) {
  return checklist({
    // sortBy: ['number'],
    numbered: true,
    itemName: i => name,
    ...options
  });
}

function checklistItems(checklistId, isCharacterBound) {
  const state = store.getState();
  const characterId = state.member.characterId;
  const profile = state.member.data && state.member.data.profile;

  const progressionSource = profile ? (isCharacterBound ? profile.characterProgressions.data[characterId] : profile.profileProgression.data) : false;
  const progression = progressionSource && progressionSource.checklists[checklistId];

  return data[checklistId].map(entry => {
    const completed = progression[entry.checklistHash];

    entry.sorts.completed = completed;

    return {
      ...entry,
      completed: completed
    };
  });
}

function presentationItems(presentationHash, dropFirst = true) {
  const state = store.getState();

  const profile = state.member.data && state.member.data.profile;

  return data[presentationHash]
    .map(entry => {
      const profileRecord = profile && profile.profileRecords.data.records[entry.recordHash];
      
      // if (!profileRecord) return false;

      const completed = profileRecord && profileRecord.objectives[0].complete;

      return {
        ...entry,
        completed: completed
      };
    })
    .filter(i => i);
}
