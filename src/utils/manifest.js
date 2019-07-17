import braytech_EN from '../data/manifest/en/braytech/';
import DestinyInventoryItemDefinition_EN from '../data/manifest/en/DestinyInventoryItemDefinition/';
import DestinyHistoricalStatsDefinition_EN from '../data/manifest/en/DestinyHistoricalStatsDefinition/';
import DestinyClanBannerDefinition from '../data/manifest/en/DestinyClanBannerDefinition/';

const customs = {
  de: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN
  },
  en: {
    braytech: braytech_EN,
    DestinyClanBannerDefinition,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_EN
  },
  es: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN
  },
  'es-mx': {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN
  },
  fr: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN
  },
  it: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN
  },
  ja: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN
  },
  ko: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN
  },
  pl: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN
  },
  'pt-br': {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN
  },
  ru: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN
  },
  'zh-chs': {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN
  },
  'zh-cht': {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN
  }
}

const manifest = {
  set: (newManifest, lang) => {
    newManifest.BraytechDefinition = customs[lang].braytech;
    newManifest.DestinyHistoricalStatsDefinition = customs.en.DestinyHistoricalStatsDefinition;
    newManifest.DestinyClanBannerDefinition = customs.en.DestinyClanBannerDefinition;
    Object.assign(newManifest.DestinyInventoryItemDefinition, customs[lang].DestinyInventoryItemDefinition);
    Object.assign(manifest, newManifest);
  }
};

export default manifest;
