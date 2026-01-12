export interface IUser {
  id: string;
  email: string | null;
  user_name: string;
  avatar_url: string | null;
  created_at: string;
}

export interface IProPlayerData {
  id: number;
  pro_name: string;
  puuid: string;
  summoner_name: string;
  tag_line: string;
  is_online: boolean;
  created_at: string;
  team_id: number | null;
  last_online: string | null;
  account_id: number;
  is_subscribed: true;
  streamer_mode: boolean;
  last_match_id: string | null;
}
