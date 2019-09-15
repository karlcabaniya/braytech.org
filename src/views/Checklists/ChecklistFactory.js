import React from 'react';
import { sortBy } from 'lodash';

import Checklist from './Checklist';
import ChecklistItem from './ChecklistItem';

import checklists from '../../data/lowlines/checklists';
import manifest from '../../utils/manifest';

class ChecklistFactory {
  constructor(t, profile, characterId, hideCompletedItems) {
    this.t = t;
    this.profile = profile;
    this.characterId = characterId;
    this.hideCompletedItems = hideCompletedItems;

    console.log(checklists);
  }

  adventures(options = {}) {
    return this.checklist({
      name: this.t('Adventures'),
      icon: 'destiny-adventure',
      progressDescription: this.t('Adventures undertaken'),
      items: this.checklistItems(4178338182, true),
      characterBound: true,
      itemName: i => manifest.DestinyActivityDefinition[i.activityHash].displayProperties.name,
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return `${bubbleName}, ${destinationName}`;
      },
      sortBy: ['completed', 'destination', 'bubble', 'name'],
      ...options
    });
  }

  regionChests(options = {}) {
    return this.checklist({
      name: this.t('Region Chests'),
      icon: 'destiny-region_chests',
      progressDescription: this.t('Region chests opened'),
      items: this.checklistItems(1697465175, true),
      sortBy: ['completed', 'destination', 'bubble'],
      characterBound: true,
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
      ...options
    });
  }

  lostSectors(options = {}) {
    return this.checklist({
      name: this.t('Lost Sectors'),
      icon: 'destiny-lost_sectors',
      progressDescription: this.t('Lost Sectors discovered'),
      characterBound: true,
      items: this.checklistItems(3142056444, true),
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
      ...options
    });
  }

  ahamkaraBones(options = {}) {
    return this.checklist({
      name: this.t('Ahamkara Bones'),
      icon: 'destiny-ahamkara_bones',
      progressDescription: this.t('Bones found'),
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
      // sortBy: ['number'],
      items: this.checklistItems(1297424116),
      ...options
    });
  }

  corruptedEggs(options = {}) {
    return this.numberedChecklist('Egg', {
      name: this.t('Corrupted Eggs'),
      icon: 'destiny-corrupted_eggs',
      progressDescription: this.t('Eggs destroyed'),
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return `${bubbleName}, ${destinationName}`;
      },
      items: this.checklistItems(2609997025, false),
      ...options
    });
  }

  catStatues(options = {}) {
    return this.numberedChecklist('Feline friend', {
      name: this.t('Cat Statues'),
      icon: 'destiny-cat_statues',
      progressDescription: this.t('Feline friends satisfied'),
      items: this.checklistItems(2726513366),
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return `${bubbleName}, ${destinationName}`;
      },
      ...options
    });
  }

  sleeperNodes(options = {}) {
    return this.checklist({
      name: this.t('Sleeper Nodes'),
      icon: 'destiny-sleeper_nodes',
      items: this.checklistItems(365218222),
      progressDescription: this.t('Sleeper nodes hacked'),
      itemName: i => manifest.DestinyInventoryItemDefinition[i.itemHash].displayProperties.description.replace('CB.NAV/RUN.()', ''),
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return `${bubbleName}, ${destinationName}`;
      },
      sortBy: ['name', 'destination', 'bubble'],
      ...options
    });
  }

  ghostScans(options = {}) {
    return this.numberedChecklist('Scan', {
      name: this.t('Ghost Scans'),
      icon: 'destiny-ghost',
      items: this.checklistItems(2360931290),
      progressDescription: this.t('Ghost scans performed'),
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return `${bubbleName}, ${destinationName}`;
      },
      ...options
    });
  }

  latentMemories(options = {}) {
    return this.numberedChecklist('Memory', {
      name: this.t('Lost Memory Fragments'),
      icon: 'destiny-lost_memory_fragments',
      items: this.checklistItems(2955980198),
      progressDescription: this.t('Memories destroyed'),
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];
        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return `${bubbleName}, ${destinationName}`;
      },
      ...options
    });
  }

  ghostStories(options = {}) {
    return this.checklist({
      name: this.t('Lore: Ghost Stories'),
      image: '/static/images/extracts/ui/checklists/037e-00004869.png',
      items: this.presentationItems(1420597821),
      progressDescription: this.t('Stories found'),
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
      sortBy: ['completed', 'destination', 'bubble'],
      ...options
    });
  }

  awokenOfTheReef(options = {}) {
    return this.checklist({
      name: this.t('Lore: Awoken of the Reef'),
      image: '/static/images/extracts/ui/checklists/037e-00004874.png',
      items: this.presentationItems(3305936921),
      progressDescription: this.t('Crystals resolved'),
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
      sortBy: ['completed', 'destination', 'bubble'],
      ...options
    });
  }

  forsakenPrince(options = {}) {
    return this.checklist({
      name: this.t('Lore: Forsaken Prince'),
      image: '/static/images/extracts/ui/checklists/037e-00004886.png',
      items: this.presentationItems(655926402),
      progressDescription: this.t('Data caches decrypted'),
      itemName: i => {
        console.log(i);
        const definitionRecord = manifest.DestinyRecordDefinition[i.recordHash];
        const definitionLore = manifest.DestinyLoreDefinition[definitionRecord.loreHash];

        return definitionLore.displayProperties.name;
      },
      itemLocation: i => {
        const definitionDestination = manifest.DestinyDestinationDefinition[i.destinationHash];

        if (!definitionDestination) {
          return <em>{this.t('Forsaken Campaign')}</em>;
        }

        const definitionBubble = definitionDestination.bubbles.find(b => b.hash === i.bubbleHash);

        const destinationName = definitionDestination.displayProperties.name;
        const bubbleName = (definitionBubble && definitionBubble.displayProperties && definitionBubble.displayProperties.name) || i.bubbleName;

        return `${bubbleName}, ${destinationName}`;
      },
      sortBy: ['completed', 'destination', 'bubble'],
      ...options
    });
  }

  checklist(options = {}) {
    const defaultOptions = {
      characterBound: false,
      mapPath: i => i.destinationHash && `destiny/maps/${i.destinationHash}/${i.hash}`
    };

    options = { ...defaultOptions, ...options };

    const items = options.sortBy
      ? sortBy(options.items, [
          function(i) {
            return options.sortBy.map(by => i.sorts[by]);
          }
        ])
      : options.items;
    const requested = options.requested;
    const visible = this.hideCompletedItems ? items.filter(i => !i.completed) : requested && requested.length ? items.filter(i => requested.indexOf(i.hash) > -1) : items;

    if (options.data) {
      return {
        totalItems: items.length,
        completedItems: items.filter(i => i.completed).length,
        items: visible.map(i => ({
            ...i,
            name: options.itemName(i),
            completed: i.completed
          })
        )
      };
    }

    const checklist = (
      <Checklist key={options.name} name={options.name} characterBound={options.characterBound} headless={options.headless} progressDescription={options.progressDescription} totalItems={items.length} completedItems={items.filter(i => i.completed).length}>
        {visible.map(i => (
          <ChecklistItem key={i.hash} completed={i.completed} name={options.itemName(i)} location={options.itemLocation(i)} mapPath={options.mapPath(i)} />
        ))}
      </Checklist>
    );

    return {
      name: options.name,
      icon: options.icon,
      image: options.image,
      checklist: checklist
    };
  }

  numberedChecklist(name, options = {}) {
    return this.checklist({
      // sortBy: ['number'],
      itemName: i => `${this.t(name)} ${i.sorts.number}`,
      ...options
    });
  }

  checklistItems(checklistId, isCharacterBound) {
    const progressionSource = this.profile ? (isCharacterBound ? this.profile.characterProgressions.data[this.characterId] : this.profile.profileProgression.data) : false;
    const progression = progressionSource && progressionSource.checklists[checklistId];

    return checklists[checklistId].map(entry => {
      const completed = progression[entry.checklistHash];

      entry.sorts.completed = completed;

      return {
        ...entry,
        completed: completed
      };
    });
  }

  presentationItems(presentationHash, dropFirst = true) {
    return checklists[presentationHash]
      .map(entry => {
        const profileRecord = this.profile.profileRecords.data.records[entry.recordHash];
        if (!profileRecord) return false;
        const completed = profileRecord.objectives[0].complete;

        return {
          ...entry,
          completed: completed
        };
      })
      .filter(i => i);
  }
}

export default ChecklistFactory;
