const fs = require('fs');
const process = require('process');
const fetch = require('node-fetch');

const outputPath = 'src/data/lowlines/maps/index.json';

function work(input) {
  const output = {};
  
  output.destination = {
    hash: input.data.map.destinationHash,
    name: input.data.map.name,
    description: input.data.map.description,
    id: input.data.map.id
  };

  output.map = {
    width: input.data.map.width,
    height: input.data.map.height,
    layers: input.data.map.layers,
    bubbles: input.data.map.locations.map(location => ({
      name: location.title,
      id: location.id,
      type: location.public ? 'region' : location.lostSector ? 'lost-sector' : 'suburb',
      nodes: location.nodes.filter(node => ['title', 'fast-travel'].includes(node.type)).map(node => {
        const n = {
          id: node.id,
          type: node.type,
          x: node.x,
          y: node.y
        }

        // if (node.type === 'title') n.name = location.title

        return n;
      })
    }))
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(output));
  
}

fetch('https://lowlidev.com.au/destiny/api/v2/map/data/io?locale=en')
    .then(res => res.json())
    .then(json => work(json));

