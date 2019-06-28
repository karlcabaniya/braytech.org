import customs from '../data/manifestCustoms';

const manifest = {
  set: newManifest => {
    newManifest.BraytechFlairDefinition = customs.BraytechFlairDefinition;
    Object.assign(newManifest.DestinyInventoryItemDefinition, customs.DestinyInventoryItemDefinition);
    Object.assign(manifest, newManifest);
  }
};

export default manifest;
