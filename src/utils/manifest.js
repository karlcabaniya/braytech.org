import customs from '../data/manifestCustoms';

const manifest = {
  set: newManifest => {
    newManifest.BraytechDefinition = customs.BraytechDefinition;
    Object.assign(newManifest.DestinyInventoryItemDefinition, customs.DestinyInventoryItemDefinition);
    Object.assign(manifest, newManifest);
  }
};

export default manifest;
