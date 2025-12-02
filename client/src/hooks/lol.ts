const spellIdToFileName: Record<number, string> = {
  1: 'summoner_boost',
  3: 'summoner_exhaust',
  4: 'summoner_flash',
  6: 'summoner_haste',
  7: 'summoner_heal',
  11: 'summoner_smite',
  12: 'summoner_teleport_new',
  13: 'summonermana',
  14: 'summonerignite',
  21: 'summonerbarrier',
  32: 'summoner_mark'
};

export const getSpellName = (id: number): string | undefined =>
  spellIdToFileName[id];

const perkIdToPath: Record<number, string> = {
  8000: 'styles/7201_Precision',
  8005: 'styles/precision/presstheattack/presstheattack',
  8008: 'styles/precision/lethaltempo/lethaltempotemp',
  8010: 'styles/precision/conqueror/conqueror',
  8021: 'styles/precision/fleetfootwork/fleetfootwork',

  8100: 'styles/7200_Domination',
  8112: 'styles/domination/electrocute/electrocute',
  8124: 'styles/domination/predator/predator',
  8128: 'styles/domination/darkharvest/darkharvest',

  8200: 'styles/7202_Sorcery',
  8214: 'styles/sorcery/summonaery/summonaery',
  8229: 'styles/sorcery/arcanecomet/arcanecomet',
  8230: 'styles/sorcery/phaserush/phaserush',

  8300: 'styles/7203_Whimsy',
  8302: 'styles/inspiration/unsealedspellbook/unsealedspellbook',
  8303: 'styles/inspiration/firststrike/firststrike',
  8301: 'styles/inspiration/glacialaugment/glacialaugment',

  8400: 'styles/7204_Resolve',
  8401: 'styles/resolve/veteranaftershock/veteranaftershock',
  8437: 'styles/resolve/graspoftheundying/graspoftheundying',
  8465: 'styles/resolve/guardian/guardian'
};

export const getRunePath = (perkId: number): string =>
  perkIdToPath[perkId]?.toLowerCase() || `perk-images/perks/${perkId}.png`;

export const gameModeMap = {
  CLASSIC: '솔로랭크',
  CHERRY: '아레나',
  ARAM: '칼바람',
  URF: '우르프',
  KIWI: '증강 칼바람'
};
