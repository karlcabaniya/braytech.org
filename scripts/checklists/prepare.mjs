import fs from 'fs';
import fetch from 'node-fetch';
import Manifest from '../manifest';
import _ from 'lodash';
import lowlines from './cache/checklists.json';

const outputPath = 'src/data/lowlines/checklists/index.json';
const outputData = JSON.parse(fs.readFileSync('src/data/lowlines/checklists/index.json'));

const assisted = JSON.parse(fs.readFileSync('scripts/dump/index.json'));
const nodes = [];

Object.keys(assisted).forEach(key => {
  if (!assisted[key].map.bubbles) return;

  assisted[key].map.bubbles.forEach(bubble => {
    bubble.nodes.forEach(node => {
      nodes.push(node);
    });
  })
});

// console.log(nodes)

// For when the mappings generated from lowlines' data don't have a
// bubbleHash but do have a bubbleId. Inferred by cross-referencing
// with https://docs.google.com/spreadsheets/d/1qgZtT1qbUFjyV8-ni73m6UCHTcuLmuLBx-zn_B7NFkY/edit#gid=1808601275
const manualBubbleNames = {
  default: 'The Farm',
  'high-plains': 'High Plains',
  erebus: 'The Shattered Throne',
  descent: 'The Shattered Throne',
  eleusinia: 'The Shattered Throne',
  'cimmerian-garrison': 'Cimmerian Garrison',
  'shattered-ruins': 'Shattered Ruins',
  'agonarch-abyss': 'Agonarch Abyss',
  'keep-of-honed-edges': 'Keep of Honed Edges',
  ouroborea: 'Ouroborea',
  'forfeit-shrine': 'Forfeit Shrine',
  adytum: 'The Corrupted',
  'queens-court': 'The Queens Court',
  'ascendant-plane': 'Dark Monastery'
};

// Anything here gets merged in to created items - use it when you need to
// override something in item()
const itemOverrides = {
  // Brephos II is listed as Temple of Illyn, but it's only available
  // during the strike, so hardcode it here to be consistent with the other
  // strike item.
  1370818869: {
    bubbleHash: false,
    bubbleName: 'The Corrupted'
  }
};

const itemDeletions = [
  1116662180, // Ghost Scan 74 / The Reservoir, Earth / UNAVAILABLE
  3856710545, // Ghost Scan 75 / The Reservoir, Earth / UNAVAILABLE
  508025838,  // Ghost Scan 76 / The Reservoir, Earth / UNAVAILABLE
];

const checklists = [
  4178338182, // adventures
  1697465175, // regionChests
  3142056444, // lostSectors
  1297424116, // ahamkaraBones
  2609997025, // corruptedEggs
  2726513366, // catStatues
  365218222,  // sleeperNodes
  2360931290, // ghostScans
  2955980198, // latentMemories
  2726513366, // catStatues
];

const presentationNodes = [
  1420597821, // ghostStories
  3305936921, // awokenOfTheReef
  655926402,  // forsakenPrince
];

function work(input) {
  const output = {
    checklists: {},
    records: {}
  };
  
  Object.entries(input.data.checklists).forEach(([id, indices]) => {
    if (!indices || indices.length === 0) return;
  
    const item = input.data.nodes[indices[0]];

    let ass = assisted.find(a => a.nodes.find(n => n.checklistHash === parseInt(id, 10))) || {};
    if (ass.nodes) ass = ass.nodes.find(n => n.checklistHash === parseInt(id, 10)) || {}
  
    output.checklists[id] = {
      destinationId: item.destinationId,
      destinationHash: item.destinationHash,
      bubbleId: item.bubbleId,
      bubbleHash: item.bubbleHash,
      recordHash: parseInt(item.node.recordHash, 10),
      node: {
        ...item.node,
        ...ass
      }
    };
  });
  
  Object.entries(input.data.records).forEach(([id, indices]) => {
    if (!indices || indices.length === 0) return;
  
    const item = input.data.nodes[indices[0]];

    let ass = assisted.find(a => a.nodes.find(n => n.checklistHash === parseInt(id, 10))) || {};
    if (ass.nodes) ass = ass.nodes.find(n => n.checklistHash === parseInt(id, 10)) || {}
  
    output.records[id] = {
      destinationId: item.destinationId,
      destinationHash: item.destinationHash,
      bubbleId: item.bubbleId,
      bubbleHash: item.bubbleHash,
      node: {
        ...item.node,
        ...ass
      }
    };
  });
  
  fs.writeFileSync(outputPath, JSON.stringify(output));
  
}

// fetch('https://lowlidev.com.au/destiny/api/v2/map/supported')
//     .then(res => res.json())
//     .then(json => work(json));

async function run() {
  const manifest = await Manifest.getManifest();

  function checklistItem(id, item) {
    const mapping = lowlines.checklists[item.hash] || {};
    
    let ass = nodes.find(n => (n.checklistHash === parseInt(item.hash, 10)) || (n.activityHash === parseInt(item.activityHash, 10))) || {};
    // let ass = {};

    const destinationHash = item.destinationHash || mapping.destinationHash;
    const bubbleHash = item.bubbleHash || mapping.bubbleHash;

    // Try to find the destination, place and bubble by the hashes if we have them
    const destination = destinationHash && manifest.DestinyDestinationDefinition[destinationHash];
    const place = destination && manifest.DestinyPlaceDefinition[destination.placeHash];
    const bubble = bubbleHash && _.find(destination.bubbles, { hash: bubbleHash });

    // If the item has a name with a number in it, extract it so we can use it later
    // for sorting & display
    const numberMatch = item.displayProperties.name.match(/([0-9]+)/);
    const itemNumber = numberMatch && numberMatch[0];

    // Discover things needed only for adventures & sleeper nodes & bones
    // const activity = item.activityHash && manifest.DestinyActivityDefinition[item.activityHash];
    // const inventoryItem = manifest.DestinyInventoryItemDefinition[item.itemHash];
    // const record = mapping.recordHash && manifest.DestinyRecordDefinition[mapping.recordHash];
    // const lore = record && manifest.DestinyLoreDefinition[record.loreHash];

    // If we don't have a bubble, see if we can infer one from the bubble ID
    const bubbleName = (bubble && bubble.displayProperties.name) || (mapping && mapping.bubbleId && manualBubbleNames[mapping.bubbleId]);
    const backupBubbleName = !(bubble && bubble.displayProperties.name) && (mapping && mapping.bubbleId && manualBubbleNames[mapping.bubbleId]);

    let name = bubbleName;
    if (manifest.DestinyChecklistDefinition[365218222].entries.find(h => h.hash === item.hash)) {
      name = manifest.DestinyInventoryItemDefinition[item.itemHash].displayProperties.description.replace('CB.NAV/RUN.()', '');
    } else if (item.activityHash) {
      name = manifest.DestinyActivityDefinition[item.activityHash].displayProperties.name;
    } else if (mapping && mapping.recordHash) {
      const definitionRecord = manifest.DestinyRecordDefinition[mapping.recordHash];
      const definitionLore = manifest.DestinyLoreDefinition[definitionRecord.loreHash];

      if (definitionLore) name = definitionLore.displayProperties.name;
    }

    const lostSector = bubble && bubble.hash && outputData[3142056444].find(l => l.bubbleHash === bubble.hash) && id !== 3142056444;

    const points = [];

    if ((mapping && mapping.node) || (ass && ass.x)) points.push(mapping && mapping.node ? { x: mapping.node.x, y: mapping.node.y } : { x: ass.x, y: ass.y })

    return {
      destinationHash,
      bubbleHash,
      bubbleName: backupBubbleName,
      activityHash: item.activityHash,
      checklistHash: item.hash,
      itemHash: item && item.itemHash,
      recordHash: mapping.recordHash,
      points,
      sorts: {
        destination: destination && destination.displayProperties.name,
        bubble: bubbleName,
        place: place && place.displayProperties.name,
        name,
        number: itemNumber && parseInt(itemNumber, 10)
      },
      extended: {
        lostSector
      },
      ...itemOverrides[item.hash]
    };
  }

  function presentationItems(presentationHash, dropFirst = true) {
    const root = manifest.DestinyPresentationNodeDefinition[presentationHash];
    let recordHashes = root.children.records.map(r => r.recordHash);
    if (dropFirst) recordHashes = recordHashes.slice(1);

    return recordHashes
      .map((hash, itemNumber) => {
        const item = manifest.DestinyRecordDefinition[hash];

        const mapping = lowlines.records[hash];
    
        let ass = nodes.find(n => n.recordHash === parseInt(item.hash, 10)) || {};
        // let ass = {};
        
        const destinationHash = mapping && mapping.destinationHash;
        const destination = destinationHash && manifest.DestinyDestinationDefinition[destinationHash];
        const place = destination && manifest.DestinyPlaceDefinition[destination.placeHash];
        const bubble = destination && _.find(destination.bubbles, { hash: mapping.bubbleHash });

        // If we don't have a bubble, see if we can infer one from the bubble ID
        const bubbleName = (bubble && bubble.displayProperties.name) || (mapping && mapping.bubbleId && manualBubbleNames[mapping.bubbleId]);
        const backupBubbleName = !(bubble && bubble.displayProperties.name) && (mapping && mapping.bubbleId && manualBubbleNames[mapping.bubbleId]);

        let name = bubbleName;
        if (item.activityHash) {
          name = manifest.DestinyActivityDefinition[item.activityHash].displayProperties.name;
        } else if (mapping && mapping.recordHash) {
          const definitionRecord = manifest.DestinyRecordDefinition[mapping.recordHash];
          const definitionLore = manifest.DestinyLoreDefinition[definitionRecord.loreHash];
    
          if (definitionLore) name = definitionLore.displayProperties.name;
        }

        const lostSector = bubble && bubble.hash && outputData[3142056444].find(l => l.bubbleHash === bubble.hash);

        const points = [];
    
        if ((mapping && mapping.node) || (ass && ass.x)) points.push(mapping && mapping.node ? { x: mapping.node.x, y: mapping.node.y } : { x: ass.x, y: ass.y })

        return {
          destinationHash,
          bubbleHash: mapping && mapping.bubbleHash,
          bubbleName: backupBubbleName,
          recordName: item.displayProperties.name,
          recordHash: hash,
          points,
          sorts: {
            destination: destination && destination.displayProperties.name,
            bubble: bubbleName,
            place: place && place.displayProperties.name,
            name,
            number: (itemNumber + 1)
          },
          extended: {
            lostSector
          },
          ...itemOverrides[item.hash]
        };
      })
      .filter(i => i);
  }
  
  const lists = {};

  checklists.concat(presentationNodes).forEach(hash => {
    if (presentationNodes.includes(hash)) {
      lists[hash] = presentationItems(hash);
    } else {
      const checklist = manifest.DestinyChecklistDefinition[hash];

      lists[hash] = checklist.entries.filter(entry => itemDeletions.indexOf(entry.hash) < 0).map(entry => {
        return checklistItem(hash, entry);
      });
    }
  });

  fs.writeFileSync(outputPath, JSON.stringify(lists, null, '  '));
}

run();