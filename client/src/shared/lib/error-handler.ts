export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleSupabaseError(error: any, fallbackMessage: string): never {
  console.error(`Supabase Error:`, error);
  throw new ApiError(error?.message || fallbackMessage, error?.code, error);
}

export const ERROR_MESSAGES = {
  FETCH_TEAMS: '팀 목록을 불러올 수 없습니다',
  FETCH_PLAYERS: '선수 목록을 불러올 수 없습니다',
  FETCH_TEAM_INFO: '팀 정보를 찾을 수 없습니다',
  FETCH_LIVE_PLAYERS: '실시간 정보를 불러올 수 없습니다'
} as const;
