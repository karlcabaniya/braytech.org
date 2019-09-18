import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import Manifest from './manifest';
import _ from 'lodash';

const dump = JSON.parse(fs.readFileSync('src/data/lowlines/checklists/index.json'));
const input = JSON.parse(fs.readFileSync('src/data/lowlines/maps/nodes/index.json'));

let output = input;

async function run() {
  // const manifest = await Manifest.getManifest();

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
        let screenshot = output[index].screenshot && output[index].screenshot !== "" ? output[index].screenshot : false;

        if (parseInt(key, 10) === 2360931290 && output[index].debug && output[index].debug.number) {
          screenshot = getScreenshot('ghost-scans', output[index].debug.number)
        }

        if (parseInt(key, 10) === 3142056444 && output[index].debug && output[index].debug.name) {
          screenshot = getScreenshot('lost-sectors', output[index].debug.name.toLowerCase().replace(/'/g,'').replace(/ /g,'-'))
        }

        output[index] = {
          ...output[index],
          // debug: {
          //   name: entry.sorts.name,
          //   number: entry.sorts.number
          // },
          screenshot,
          // description: output[index].description && output[index].description !== "" ? output[index].description : false
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

  fs.writeFileSync('src/data/lowlines/maps/nodes/index.json', JSON.stringify(output, null, '  '));

}

function getScreenshot(listName, pattern) {
  let screenshot = false;
  const look = fromDir(`public/static/images/screenshots/${listName}/`, `${listName}_${pattern}`);
  if (look.length === 1) screenshot = `/static/images/screenshots/${listName}/${look[0]}`;

  return screenshot;
}

function fromDir(startPath, filter) {

  if (!fs.existsSync(startPath)) {
    console.log('no dir ', startPath);
    return;
  }

  const pattern = new RegExp(filter);
console.log(pattern)
  const files = fs.readdirSync(startPath);

  const results = [];

  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);

    if (stat.isDirectory()) {
      fromDir(filename, filter);

    } else if (pattern.test(filename)) {
      results.push(files[i]);

    }
  }

  return results;
}

run();
