/**
 * 서브 타입 전적기록용
 */
export interface StreamerModePerks {
  styles: Array<{
    style: number;
    description: string;
    selections: any[];
  }>;
  statPerks: any;
}

export interface StreamerModePlayerFields {
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  summoner1Id: number;
  summoner2Id: number;
  perks: StreamerModePerks; // 👈 여기서 기존 perks를 전적용으로 덮어씀
}
export interface StreamerModeGameFields {
  gameEndTimestamp: number;
}

/**
 * 메인 타입 (Intersection 순서 조정)
 */
export type LiveGameParticipant<T = object> = T & {
  puuid: string;
  summonerName: string;
  championId: number;
  spell1Id: number;
  spell2Id: number;
  perks: {
    perkStyle: number;
    perkSubStyle: number;
    perkIds: number[];
  };
};

export type LiveGameData<T = object, G = object> = G & {
  gameMode: string;
  gameStartTime: number;
  gameLength: number;
  participants: LiveGameParticipant<T>[];
  gameQueueConfigId: number;
};
