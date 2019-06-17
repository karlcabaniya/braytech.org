const fs = require('fs');
const process = require('process');

const outputPath = 'src/data/chaliceData/index.json';

// if (process.argv.length !== 3) {
//   console.log('Syntax: prepareChaliceData.js <csvExport.json>');
//   process.exit(1);
// }

//const input = JSON.parse(fs.readFileSync(process.argv[2]));
const input = JSON.parse(fs.readFileSync('P:/help.json'));

const manifest = JSON.parse(fs.readFileSync('P:/aggregate-0a10bfd0-2d5d-4d4c-9804-0a20e4e23da9.json'));


const chalice = manifest.DestinyInventoryItemDefinition[1115550924];
let chaliceSlots = Object.entries(chalice.sockets.socketEntries)
  .map(([key, value]) => {
    let indexes = chalice.sockets.socketCategories.find(c => c.socketCategoryHash === 3483578942).socketIndexes;
    if (indexes.includes(parseInt(key, 10))) {
      return value;
    } else {
      return false;
    }
  })
  .filter(f => f);

let runes = {
  slot1: chaliceSlots[0].reusablePlugItems.map(p => p.plugItemHash),
  slot2: chaliceSlots[1].reusablePlugItems.map(p => p.plugItemHash),
  slot3: chaliceSlots[2].reusablePlugItems.map(p => p.plugItemHash)
};

runes.purple = [...runes.slot1, ...runes.slot2, ...runes.slot3].filter(r => {
  let definitionPlug = manifest.DestinyInventoryItemDefinition[r];
  let identities = ['penumbra.runes.legendary.rune0', 'penumbra.runes.legendary.rune1', 'penumbra.runes.legendary.rune2'];

  if (definitionPlug && identities.includes(definitionPlug.plug.plugCategoryIdentifier)) {
    return true;
  } else {
    return false;
  }
});
runes.red = [...runes.slot1, ...runes.slot2, ...runes.slot3].filter(r => {
  let definitionPlug = manifest.DestinyInventoryItemDefinition[r];
  let identities = ['penumbra.runes.legendary.rune3', 'penumbra.runes.legendary.rune4', 'penumbra.runes.legendary.rune5'];

  if (definitionPlug && identities.includes(definitionPlug.plug.plugCategoryIdentifier)) {
    return true;
  } else {
    return false;
  }
});
runes.green = [...runes.slot1, ...runes.slot2, ...runes.slot3].filter(r => {
  let definitionPlug = manifest.DestinyInventoryItemDefinition[r];
  let identities = ['penumbra.runes.legendary.rune6', 'penumbra.runes.legendary.rune7', 'penumbra.runes.legendary.rune8'];

  if (definitionPlug && identities.includes(definitionPlug.plug.plugCategoryIdentifier)) {
    return true;
  } else {
    return false;
  }
});
runes.blue = [...runes.slot1, ...runes.slot2, ...runes.slot3].filter(r => {
  let definitionPlug = manifest.DestinyInventoryItemDefinition[r];
  let identities = ['penumbra.runes.legendary.rune9', 'penumbra.runes.legendary.rune10', 'penumbra.runes.legendary.rune11'];

  if (definitionPlug && identities.includes(definitionPlug.plug.plugCategoryIdentifier)) {
    return true;
  } else {
    return false;
  }
});


let output = [];


let armors = {

  "Random Class Item": [919186882, 4256272077, 25091086, 874856664, 527652447, 2252973221, 3306564654, 3602032567, 1980768298, 1135872734, 1250649843, 4105225180],

  "Tangled Web Class Item": [919186882, 4256272077, 25091086],
  "Exodus Down Class Item": [874856664, 527652447, 2252973221],
  "Reverie Dawn Class Item": [3306564654, 3602032567, 1980768298],
  "Opulent Class Item": [1135872734, 1250649843, 4105225180],

  "Random Hands": [3609169817, 2502004600, 42219189, 3875829376, 1678216306, 2029766091, 2761343386, 1705856569, 2503434573, 1370039881, 3072788622, 392500791],

  "Tangled Web Hands": [3609169817, 2502004600, 42219189],
  "Exodus Down Hands": [3875829376, 1678216306, 2029766091],
  "Reverie Dawn Hands": [2761343386, 1705856569, 2503434573],
  "Opulent Hands": [1370039881, 3072788622, 392500791],

  "Random Boots": [537272242, 2206284939, 1618341271, 3545981149, 2953649850, 2079454604, 344548395, 3174233615, 188778964, 1285460104, 1661981723, 1776578009],
  
  "Tangled Web Boots": [537272242, 2206284939, 1618341271],
  "Exodus Down Boots": [3545981149, 2953649850, 2079454604],
  "Reverie Dawn Boots": [344548395, 3174233615, 188778964],
  "Opulent Boots": [1285460104, 1661981723, 1776578009],

  "Random Chest": [2562470699, 1034149520, 2648545535, 2218838661, 126418248, 1156448694, 2859583726, 4070309619, 1593474975, 2026757026, 2856582785, 3759327055],
  
  "Tangled Web Chest": [2562470699, 1034149520, 2648545535],
  "Exodus Down Chest": [2218838661, 126418248, 1156448694],
  "Reverie Dawn Chest": [2859583726, 4070309619, 1593474975],
  "Opulent Chest": [2026757026, 2856582785, 3759327055],

  "Random Helm": [2982412348, 1664085089, 4261835528, 2731698402, 2172333833, 582151075, 2824453288, 4097166900, 185695659, 831222279, 906236408, 1420117606],
  
  "Tangled Web Helm": [2982412348, 1664085089, 4261835528],
  "Exodus Down Helm": [2731698402, 2172333833, 582151075],
  "Reverie Dawn Helm": [2824453288, 4097166900, 185695659],
  "Opulent Helm": [831222279, 906236408, 1420117606]
}

let weapons = {
  "Random SMG": [2105827099, 2681395357, 105567493, 174192097],
  "Random Sniper": [3297863558, 4190932264, 1684914716, 3100452337],
  "Random Power Weapon": [991314988, 3776129137, 3740842661, 1642384931],
  "Random Hand Cannon": [4077196130, 2429822977, 334171687, 4211534763],
  "Random Sidearm": [79075821, 3967155859, 3222518097, 1843044399],
  "Random Fusion Rifle": [3027844940, 3445437901, 4124357815, 3027844941],
  "Random Shotgun": [1327264046, 2217366863, 2919334548, 636912560]
}

let masterworks = {
  "Handling Masterwork": "v400.plugs.weapons.masterworks.stat.hndling",
  "Stability Masterwork": "v400.plugs.weapons.masterworks.stat.stability",
  "Range Masterwork": "v400.plugs.weapons.masterworks.stat.range",
  "Reload Masterwork": "v400.plugs.weapons.masterworks.stat.reload",
  "Arc Resist": 3130025796,
  "Void Resist": 1576279482,
  "Solar Resist": 3789923095,
  "Arc": 3130025796,
  "Void": 1576279482,
  "Solar": 3789923095
}

let armorTypes = {
  "Mobility": 2951930089,
  "Recovery": 270846462,
  "Resilient": 2287852220,
  "Resilience": 2287852220
}

input.forEach(r => {

  let t0 = [];
  let t1 = [];
  let t2 = [];
  let t3 = [];
  let t4 = false;
  let t5 = false;
  let t6 = false;

  Object.values(manifest.DestinyInventoryItemDefinition).forEach(i => {
    let i1 = r.result.toLowerCase();
    let i2 = i.displayProperties ? i.displayProperties.name.toLowerCase() : 'nah';

    if (![2,3].includes(i.itemType)) {
      return;
    }

    if (armors[r.result]) {
      t0 = armors[r.result];
      if (/Random/i.test(r.result)) {
        t6 = true;
      }
    } else if (weapons[r.result]) {
      t0 = weapons[r.result];
      t6 = true;
    } else if (i1 === i2) {
      t0 = [i.hash];
    }

    if (masterworks[r.masterwork]) {
      t4 = masterworks[r.masterwork];
    }

    if (armors[r.result] && armorTypes[r.armorType]) {
      t5 = armorTypes[r.armorType];
    }

  });
  
  let r1 = r.slot1.toLowerCase();

  if (r1 === 'any purple') {
    t1.push('braytech_purple_rune');
  } else if (r1 === 'any red') {
    t1.push('braytech_red_rune');
  } else if (r1 === 'any green') {
    t1.push('braytech_green_rune');
  } else if (r1 === 'any blue') {
    t1.push('braytech_blue_rune');
  } else {
    runes.slot1.forEach(b => {
      let def = manifest.DestinyInventoryItemDefinition[b];
      let r2 = def.displayProperties.name.toLowerCase();

      if (r1 === r2) {
        t1.push(b);
        return;
      }
    });
  }

  let r2 = r.slot2.toLowerCase();

  if (r2 === 'any purple') {
    t2.push('braytech_purple_rune');
  } else if (r2 === 'any red') {
    t2.push('braytech_red_rune');
  } else if (r2 === 'any green') {
    t2.push('braytech_green_rune');
  } else if (r2 === 'any blue') {
    t2.push('braytech_blue_rune');
  } else {
    runes.slot1.forEach(b => {
      let def = manifest.DestinyInventoryItemDefinition[b];
      let d1 = def.displayProperties.name.toLowerCase();

      if (r2 === d1) {
        t2.push(b);
        return;
      }
    });
  }

  let r3 = r.slot3.toLowerCase();

  if (r3 === 'any purple') {
    t3.push('braytech_purple_rune');
  } else if (r3 === 'any red') {
    t3.push('braytech_red_rune');
  } else if (r3 === 'any green') {
    t3.push('braytech_green_rune');
  } else if (r3 === 'any blue') {
    t3.push('braytech_blue_rune');
  } else {
    runes.slot1.forEach(b => {
      let def = manifest.DestinyInventoryItemDefinition[b];
      let d1 = def.displayProperties.name.toLowerCase();

      if (r3 === d1) {
        t3.push(b);
        return;
      }
    });
  }

  let ttt = {
    items: t0,
    combo: [t1, t2, t3],
    csv: r
  }

  if (t4) {
    ttt.masterwork = t4;
  }

  if (t5) {
    ttt.intrinsic = t5;
  }

  if (t6) {
    ttt.random = t6;
  }

  output.push(ttt);

});






fs.writeFileSync(outputPath, JSON.stringify(output));