import fs from 'fs';
import fetch from 'node-fetch';
import Manifest from './manifest';
import _ from 'lodash';

const input = JSON.parse(fs.readFileSync('src/data/lowlines/maps/original.json'));
const outputPath = 'src/data/lowlines/maps/index.json';

let output = {};

async function run() {
  const manifest = await Manifest.getManifest();

  Object.entries(input).forEach(([key, value]) => {
    if (!value.destination.hash) {
      output[key] = value;
      return;
    }

    const definitionDestination = manifest.DestinyDestinationDefinition[value.destination.hash];

    value.map.bubbles = value.map.bubbles.map(bubble => {
      let bubbleHash = definitionDestination.bubbles.find(b => b.displayProperties.name === bubble.name);

      if (!bubbleHash) console.log(bubble)

      return {
        hash: bubbleHash && bubbleHash.hash,
        ...bubble,
      }
    });

    output[key] = value;
  });


  fs.writeFileSync(outputPath, JSON.stringify(output));

}

run();

