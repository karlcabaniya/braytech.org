import braytech_en from '../data/manifest/en/braytech/';
import DestinyInventoryItemDefinition_en from '../data/manifest/en/DestinyInventoryItemDefinition/';
import DestinyClanBannerDefinition from '../data/manifest/en/DestinyClanBannerDefinition/';

const customs = {
  de: {
    braytech: braytech_en,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_en
  },
  en: {
    braytech: braytech_en,
    DestinyClanBannerDefinition,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_en
  },
  es: {
    braytech: braytech_en,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_en
  },
  'es-mx': {
    braytech: braytech_en,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_en
  },
  fr: {
    braytech: braytech_en,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_en
  },
  it: {
    braytech: braytech_en,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_en
  },
  ja: {
    braytech: braytech_en,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_en
  },
  ko: {
    braytech: braytech_en,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_en
  },
  pl: {
    braytech: braytech_en,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_en
  },
  'pt-br': {
    braytech: braytech_en,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_en
  },
  ru: {
    braytech: braytech_en,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_en
  },
  'zh-chs': {
    braytech: braytech_en,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_en
  },
  'zh-cht': {
    braytech: braytech_en,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_en
  }
}

const manifest = {
  set: (newManifest, lang) => {
    newManifest.BraytechDefinition = customs[lang].braytech;
    newManifest.DestinyClanBannerDefinition = customs.en.DestinyClanBannerDefinition;
    Object.assign(newManifest.DestinyInventoryItemDefinition, customs[lang].DestinyInventoryItemDefinition);
    Object.assign(manifest, newManifest);
  }
};

export default manifest;
