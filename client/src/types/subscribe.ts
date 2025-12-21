{
  /* 선수 정보 & 인게임 정보 */
}
export interface IIngameBoxProps extends gamerInfo {
  isOpen: boolean;
  onBoxClick: () => void;
  loggedIn: boolean;
}

export interface gamerInfo {
  created_at?: string | null;
  account_id: number;
  id: number;
  pro_name: string;
  puuid: string;
  summoner_name: string;
  tag_line: string;
  team_id?: number | null;
  is_online: boolean;
  last_online?: string | null;
  is_subscribed?: boolean;
  league: string | null;
  last_match_id: string | null;
}
