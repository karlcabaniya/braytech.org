import braytech_EN from '../data/manifest/en/braytech/';
import DestinyInventoryItemDefinition_EN from '../data/manifest/en/DestinyInventoryItemDefinition/';
import DestinyHistoricalStatsDefinition_EN from '../data/manifest/en/DestinyHistoricalStatsDefinition/';
import DestinyClanBannerDefinition from '../data/manifest/en/DestinyClanBannerDefinition/';

import DestinyHistoricalStatsDefinition_DE from '../data/manifest/de/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_ES from '../data/manifest/es/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_ESMX from '../data/manifest/es-mx/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_FR from '../data/manifest/fr/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_IT from '../data/manifest/it/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_JA from '../data/manifest/ja/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_KO from '../data/manifest/ko/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_PL from '../data/manifest/pl/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_PTBR from '../data/manifest/pt-br/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_RU from '../data/manifest/ru/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_ZHCHT from '../data/manifest/zh-cht/DestinyHistoricalStatsDefinition/';

const customs = {
  de: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_DE
  },
  en: {
    braytech: braytech_EN,
    DestinyClanBannerDefinition,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_EN
  },
  es: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_ES
  },
  'es-mx': {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_ESMX
  },
  fr: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_FR
  },
  it: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_IT
  },
  ja: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_JA
  },
  ko: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_KO
  },
  pl: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_PL
  },
  'pt-br': {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_PTBR
  },
  ru: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_RU
  },
  'zh-chs': {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_ZHCHT
  },
  'zh-cht': {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_ZHCHT
  }
}

const manifest = {
  set: (newManifest, lang) => {
    newManifest.BraytechDefinition = customs[lang].braytech;
    newManifest.DestinyHistoricalStatsDefinition = customs[lang].DestinyHistoricalStatsDefinition;
    newManifest.DestinyClanBannerDefinition = customs.en.DestinyClanBannerDefinition;
    Object.assign(newManifest.DestinyInventoryItemDefinition, customs[lang].DestinyInventoryItemDefinition);
    Object.assign(manifest, newManifest);
  }
};

export default manifest;
