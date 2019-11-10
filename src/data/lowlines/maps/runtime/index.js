import i18next from 'i18next';

import manifest from '../../../../utils/manifest';

const cycleInfo = {
  epoch: {
    // start of cycle in UTC
    wanderingNightmares: new Date(`2019-10-01T17:00:00Z`).getTime()
  },
  cycle: {
    // how many week cycle
    wanderingNightmares: 4,
  },
  elapsed: {}, // elapsed time since cycle started
  week: {} // current week in cycle
};

const time = new Date().getTime();
const msPerWk = 604800000;

for (var cycle in cycleInfo.cycle) {
  cycleInfo.elapsed[cycle] = time - cycleInfo.epoch[cycle];
  cycleInfo.week[cycle] = Math.floor((cycleInfo.elapsed[cycle] / msPerWk) % cycleInfo.cycle[cycle]) + 1;
}

const hydrateObjectives = (member, objectives) => {
  const characterId = member && member.characterId;
  const characterRecords = member && member.data && member.data.profile.characterRecords.data;
  const profileRecords = member && member.data && member.data.profile.profileRecords.data.records;

  return objectives.map(o => {
    const definitionRecord = manifest.DestinyRecordDefinition[o.recordHash];

    const recordScope = definitionRecord.scope || 0;
    const recordData = recordScope === 1 ? characterRecords && characterRecords[characterId].records[definitionRecord.hash] : profileRecords && profileRecords[definitionRecord.hash];

    const data = recordData && recordData.objectives.find(d => d.objectiveHash === o.objectiveHash);

    return {
      ...o,
      ...data
    }
  });
}

export default member => {
  const nodes = {
    tower: [],
    edz: [],
    'the-moon': [
      {
        hash: 'wanderingNightmareHorkis',
        displayProperties: {
          name: manifest.DestinyObjectiveDefinition[1009409496].progressDescription,
          description: i18next.t("Defeat this Nightmare to progress record _{{recordName}}_.", { recordName: manifest.DestinyRecordDefinition[1842542594].displayProperties.name })
        },
        type: {
          hash: 'patrol-boss',
          name: i18next.t('Patrol boss'),
          category: 'enemy',
          race: 'cabal'
        },
        icon: 'destiny-patrol-boss-fallen-dusk',
        location: {
          destinationHash: 290444260,
          bubbleHash: 4025450777,
          points: [
            {
              x: 2,
              y: -429
            }
          ]
        },
        availability: {
          type: 'cycle',
          now: cycleInfo.week.wanderingNightmares === 2
        },
        related: {
          records: [
            {
              recordHash: 1842542594
            }
          ],
          objectives: [
            {
              recordHash: 1842542594,
              objectiveHash: 1009409496
            }
          ]
        },
        screenshot: '/static/images/screenshots/enemies/anchor-of-light_patrol-boss_nightmareHorkis.jpg'
      }
    ],
    'new-pacific-arcology': [],
    'arcadian-valley': [],
    'echo-mesa': [],
    'fields-of-glass': [],
    'hellas-basin': [],
    'tangled-shore': [],
    'dreaming-city': []
  }

  if (member && member.data) {
    const hydrated = {};

    for (const destination in nodes) {
      hydrated[destination] = nodes[destination].map(n => {
        
        return {
          ...n,
          related: n.related && {
            ...n.related,
            objectives: n.related.objectives && hydrateObjectives(member, n.related.objectives)
          }  
        }
      })
    }

    return hydrated;
  } else {
    return nodes;
  }
}