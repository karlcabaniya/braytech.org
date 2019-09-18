import fs from 'fs';
import fetch from 'node-fetch';
import Manifest from './manifest';
import _ from 'lodash';

const dump = JSON.parse(fs.readFileSync('src/data/lowlines/checklists/index.json'));
const path = 'src/data/lowlines/maps/nodes/index.json';
const input = JSON.parse(fs.readFileSync('src/data/lowlines/maps/nodes/index.json'));

let output = input;

async function run() {
  const manifest = await Manifest.getManifest();

  Object.entries(dump).forEach(([key, value]) => {

    value.forEach(entry => {
      // check if exists
      const index = output.findIndex(e => (
        entry.checklistHash
        && e.checklistId === parseInt(key, 10)
        && e.checklistHash === entry.checklistHash
      ) || (
          entry.recordHash
          && e.recordHash === entry.recordHash
        )
      );

      if (index > -1) {
        output[index] = {
          ...output[index],
          debug: {
            name: entry.sorts.name,
            number: entry.sorts.number
          },
          screenshot: output[index].screenshot && output[index].screenshot !== "/static/images/screenshots/" ? output[index].screenshot : false,
          description: output[index].description && output[index].description !== "" ? output[index].description : false
        };
      } else {
        output.push({
          checklistId: parseInt(key, 10),
          checklistHash: entry.checklistHash,
          recordHash: entry.recordHash,
          screenshot: false,
          description: false,
          debug: {
            name: entry.sorts.name,
            number: entry.sorts.number
          }
        });
      }
    });

  });

  output = _.orderBy(output, [e => e.checklistId, e => e.debug && e.debug.number, e => e.debug && e.debug.name]);

  fs.writeFileSync(path, JSON.stringify(output, null, '  '));

}

run();

