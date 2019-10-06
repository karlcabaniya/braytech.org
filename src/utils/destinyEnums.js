export const TITAN = 0;
export const HUNTER = 1;
export const WARLOCK = 2;
export const NO_CLASS = 3;

export const KINETIC_WEAPON = 2;
export const ENERGY_WEAPON = 3;
export const POWER_WEAPON = 4;

export const LEGENDARY = 4008398120;
export const EXOTIC = 2759499571;
export const UNCOMMON = 2395677314;
export const RARE = 2127292149;
export const COMMON = 3340296461;

export const XBOX = 1;
export const PLAYSTATION = 2;
export const PC_STEAM = 3;
export const PC_BLIZZARD = 4;
export const TIGERDEMON = 10;
export const BUNGIENEXT = 254;

export const PLATFORMS = {
  [XBOX]: 'xbox',
  [PLAYSTATION]: 'playstation',
  [PC_STEAM]: 'steam',
  [PC_BLIZZARD]: 'battlenet'
};

export const CLASSES = {
  [WARLOCK]: 'Warlock',
  [TITAN]: 'Titan',
  [HUNTER]: 'Hunter'
};

const flagEnum = (state, value) => !!(state & value);

export const enumerateRecordState = state => ({
  none: flagEnum(state, 0),
  recordRedeemed: flagEnum(state, 1),
  rewardUnavailable: flagEnum(state, 2),
  objectiveNotCompleted: flagEnum(state, 4),
  obscured: flagEnum(state, 8),
  invisible: flagEnum(state, 16),
  entitlementUnowned: flagEnum(state, 32),
  canEquipTitle: flagEnum(state, 64)
});

export const enumerateCollectibleState = state => ({
  none: flagEnum(state, 0),
  notAcquired: flagEnum(state, 1),
  obscured: flagEnum(state, 2),
  invisible: flagEnum(state, 4),
  cannotAffordMaterialRequirements: flagEnum(state, 8),
  inventorySpaceUnavailable: flagEnum(state, 16),
  uniquenessViolation: flagEnum(state, 32),
  purchaseDisabled: flagEnum(state, 64)
});

export const enumerateItemState = state => ({
  none: flagEnum(state, 0),
  locked: flagEnum(state, 1),
  tracked: flagEnum(state, 2),
  masterworked: flagEnum(state, 4)
});

export const enumeratePartyMemberState = state => ({
  none: flagEnum(state, 0),
  fireteamMember: flagEnum(state, 1),
  posseMember: flagEnum(state, 2),
  groupMember: flagEnum(state, 4),
  partyLeader: flagEnum(state, 8)
});

export const bookCovers = {
  2447807737: '037E-0000131E.png',
  396866327: '01A3-0000132F.png',
  1420597821: '037E-00001308.png',
  648415847: '037E-00001311.png',
  335014236: '037E-00001BE0.png',
  3472295814: '0560-000000D4.png',
  3239864233: '01A3-00001330.png',
  2541573665: '01A3-00001336.png',
  3305936921: '037E-0000130D.png',
  2077211754: '0560-000000C5.png',
  655926402: '01A3-000012F4.png',
  2026987060: '037E-00001328.png',
  2325462143: '037E-00001323.png',
  2203266100: '0560-000000CF.png',
  756584948: '0560-000000CA.png',
  3148269494: '0560-00001070.png',
  2741070862: '0560-00001065.png',
  3758802814: '0560-00001060.png',
  139066480: '0560-0000105C.png',
  3762408250: '0560-00001074.png',
  289742222: '0560-0000106A.png',
  1070500232: '0560-00006553.png',
  2721577348: '0560-00006558.png',
  2761772090: '0560-00006547.png'
};

export const sealImages = {
  2588182977: '037E-00001367.png',
  3481101973: '037E-00001343.png',
  147928983: '037E-0000134A.png',
  2693736750: '037E-0000133C.png',
  2516503814: '037E-00001351.png',
  1162218545: '037E-00001358.png',
  2039028930: '0560-000000EB.png',
  991908404: '0560-0000107E.png',
  3170835069: '0560-00006583.png',
  1002334440: '0560-00007495.png'
};

export const badgeImages = {
  3241617029: '01E3-00000278.png',
  1419883649: '01E3-00000280.png',
  3333531796: '01E3-0000027C.png',
  2904806741: '01E3-00000244.png',
  1331476689: '01E3-0000024C.png',
  2881240068: '01E3-00000248.png',
  3642989833: '01E3-00000266.png',
  2399267278: '037E-00001D4C.png',
  701100740: '01A3-0000189C.png',
  1420354007: '01E3-0000032C.png',
  1086048586: '01E3-00000377.png',
  2503214417: '0560-00000D7D.png',
  2759158924: '0560-00006562.png'
};

export const associationsCollectionsBadgesClasses = {
  5678666: 2,
  7761993: 2,
  24162924: 2,
  51250598: 2,
  272447096: 0,
  278453589: 1,
  282080253: 2,
  308119616: 1,
  397176300: 1,
  437406379: 2,
  454888209: 0,
  543101070: 1,
  555927954: 2,
  558738844: 0,
  604768449: 0,
  805054563: 1,
  811225638: 0,
  964388375: 1,
  1003644562: 0,
  1040898483: 2,
  1080375723: 1,
  1115203081: 0,
  1127243461: 2,
  1172293868: 2,
  1187972104: 2,
  1234074769: 1,
  1269917845: 2,
  1367826044: 2,
  1481732726: 1,
  1521772351: 1,
  1573256543: 2,
  1802049362: 0,
  1813275880: 1,
  1860141931: 2,
  1875194813: 0,
  1893032045: 0,
  2084683608: 2,
  2180056767: 1,
  2283697615: 1,
  2516153921: 0,
  2591952283: 2,
  2598675734: 0,
  2607543675: 1,
  2623445341: 1,
  2652561747: 0,
  2721277575: 0,
  2761465119: 0,
  2765771634: 1,
  3083337344: 2,
  3149147086: 1,
  3233768126: 1,
  3252380766: 0,
  3304578900: 0,
  3711698756: 2,
  3745240322: 1,
  3784478466: 0,
  4107433557: 0,
  4108787242: 0
};

export const associationsCollectionsBadges = [
  {
    recordHash: 3488769908, // Destinations: Red War
    badgeHash: 2904806741
  },
  {
    recordHash: 2676320666, // Destinations: Curse of Osiris and Warmind
    badgeHash: 1331476689
  },
  {
    recordHash: 4269157841, // Destinations: Forsaken
    badgeHash: 2881240068
  },
  {
    recordHash: 751035753, // Raid: Last Wish
    badgeHash: 1086048586
  },
  {
    recordHash: 1522035006, // Destinations: Dreaming City
    badgeHash: 3642989833
  },
  {
    recordHash: 1975718024, // Playing for Keeps
    badgeHash: 1420354007
  },
  {
    recordHash: 4160670554, // Annual Pass: Black Armory
    badgeHash: 2399267278
  },
  {
    recordHash: 2794426212, // Annual Pass: Jokers Wild
    badgeHash: 2503214417
  },
  {
    recordHash: 52802522, // Mint in Box
    badgeHash: 2759158924
  }
];

export const nightfalls = {
  272852450: {
    triumphs: [1039797865, 3013611925],
    items: [],
    collectibles: [2466440635, 1766893928],
    ordealHashes: []
  },
  522318687: {
    triumphs: [165166474, 1871570556],
    items: [],
    collectibles: [1534387877, 1766893929],
    ordealHashes: [966580527, 1193451437, 2357524344, 3392133546, 4196546910]
  },
  629542775: {
    triumphs: [],
    items: [],
    collectibles: [],
    ordealHashes: []
  },
  936308438: {
    triumphs: [2692332187, 1398454187],
    items: [],
    collectibles: [2448009818, 3490589931],
    ordealHashes: [102545131, 1272746497, 1822476598, 4044386747]
  },
  1034003646: {
    triumphs: [599303591, 3399168111],
    items: [],
    collectibles: [1186314105, 465974149],
    ordealHashes: []
  },
  1282886582: {
    triumphs: [1526865549, 2140068897],
    items: [],
    collectibles: [3036030067, 3490589927],
    ordealHashes: []
  },
  1391780798: {
    triumphs: [3042714868, 4156350130],
    items: [],
    collectibles: [],
    ordealHashes: []
  },
  3034843176: {
    triumphs: [3951275509, 3641166665],
    items: [],
    collectibles: [1099984904, 1410290331],
    ordealHashes: []
  },
  3108813009: {
    triumphs: [2836924866, 1469598452],
    items: [],
    collectibles: [1279318101, 2263264048],
    ordealHashes: []
  },
  3145298904: {
    triumphs: [3340846443, 4267516859],
    items: [],
    collectibles: [3036030066, 3490589921],
    ordealHashes: []
  },
  3280234344: {
    triumphs: [2099501667, 1442950315],
    items: [],
    collectibles: [1333654061, 3490589926],
    ordealHashes: [997759433, 1114928259, 2021103427, 3815447166]
  },
  3289589202: {
    triumphs: [1060780635, 1142177491],
    items: [],
    collectibles: [1152758802, 3490589930],
    ordealHashes: [282531137, 1198226683, 2380555126, 3407296811]
  },
  3372160277: {
    triumphs: [1329556468, 413743786],
    items: [],
    collectibles: [1602518767, 3896331530],
    ordealHashes: []
  },
  3701132453: {
    triumphs: [3450793480, 3847579126],
    items: [],
    collectibles: [1074861258, 3314387486],
    ordealHashes: []
  },
  3718330161: {
    triumphs: [2282894388, 3636866482],
    items: [],
    collectibles: [1279318110, 3490589924],
    ordealHashes: []
  },
  3856436847: {
    triumphs: [],
    items: [],
    collectibles: [],
    ordealHashes: [694558778, 1940967975, 2359276231]
  },
  4259769141: {
    triumphs: [3973165904, 1498229894],
    items: [],
    collectibles: [1718922261, 3490589925],
    ordealHashes: [1173782160, 1244305605, 1390900084, 3094633658]
  }
}

export const ordealHashes = Object.values(nightfalls).reduce((a, h) => {
  return [
    ...a,
    ...h.ordealHashes
  ]
}, []);