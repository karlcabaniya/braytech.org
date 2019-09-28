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
  '7761993': 2,
  '24162924': 2,
  '51250598': 2,
  '272447096': 0,
  '282080253': 2,
  '308119616': 1,
  '397176300': 1,
  '437406379': 2,
  '454888209': 0,
  '543101070': 1,
  '555927954': 2,
  '558738844': 0,
  '604768449': 0,
  '811225638': 0,
  '964388375': 1,
  '1003644562': 0,
  '1040898483': 2,
  '1080375723': 1,
  '1115203081': 0,
  '1172293868': 2,
  '1187972104': 2,
  '1234074769': 1,
  '1269917845': 2,
  '1367826044': 2,
  '1481732726': 1,
  '1521772351': 1,
  '1573256543': 2,
  '1802049362': 0,
  '1860141931': 2,
  '1875194813': 0,
  '1893032045': 0,
  '2084683608': 2,
  '2180056767': 1,
  '2283697615': 1,
  '2516153921': 0,
  '2591952283': 2,
  '2598675734': 0,
  '2607543675': 1,
  '2623445341': 1,
  '2652561747': 0,
  '2761465119': 0,
  '2765771634': 1,
  '3149147086': 1,
  '3233768126': 1,
  '3252380766': 0,
  '3711698756': 2,
  '3745240322': 1,
  '3784478466': 0,
  '4108787242': 0
}

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