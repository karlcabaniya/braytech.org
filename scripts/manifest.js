const fs = require('fs');
const _ = require('lodash');

const compare = {
  new: JSON.parse(fs.readFileSync('./scripts/new.json')),
  old: JSON.parse(fs.readFileSync('./scripts/old.json'))
}

function difference(object, base) {
  return _.transform(object, (result, value, key) => {

    if (key === 'index') return;

		if (!_.isEqual(value, base[key])) {
			result[key] = _.isObject(value) && _.isObject(base[key]) ? difference(value, base[key]) : value;
		}
  });
}

let diff = difference(compare.new, compare.old);

fs.writeFileSync('./scripts/difference.json', JSON.stringify(diff));

