import { useQuery, useQueryClient } from '@tanstack/react-query';
import { gamerInfo, Team } from '@/shared/types';
import { useToast } from '@/shared/hooks/useToast';
import { useEffect, useRef } from 'react';
import { supabase } from '@/shared/lib/supabase/client';
import { TABLES } from '@/shared/constants/db';
import { useUserId } from '@/shared/hooks/useAuth';

export function usePlayerList(team: string, initialData?: gamerInfo[]) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userId = useUserId();

  const {
    data: members = [],
    isLoading: loading,
    error
  } = useQuery<gamerInfo[]>({
    queryKey: ['players', team, userId],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc(
        'get_players_with_subscription',
        {
          team_abbr: team,
          ...(userId != null ? { current_user_id: userId } : {})
        }
      );

      if (error) {
        throw new Error('Failed to fetch players');
      }

      return data;
    },
    enabled: !!team,
    initialData,
    // 서버에서 가져온 데이터를 5분간 fresh하게 유지 (refetch 방지)
    staleTime: 5 * 60 * 1000,
    // 캐시를 10분간 유지
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Handle error via useEffect to avoid toast duplication
  useEffect(() => {
    if (error) {
      toast({
        description:
          '선수 목록을 불러 올 수 없습니다. 잠시 후 다시 시도해 주세요.'
      });
    }
  }, [error, toast]);

  // 선수 online 상태 테이블 실시간 업데이트
  useEffect(() => {
    if (!team || loading) return; // 데이터가 로딩 중일 경우 리턴

    const channel = supabase
      .channel('realtime-players')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: TABLES.RIOT_ACCOUNTS
        },
        (payload) => {
          const currentMembers = queryClient.getQueryData<gamerInfo[]>([
            'players',
            team,
            userId
          ]);
          if (!currentMembers) return;

          const newOnline = payload.new?.is_online;
          const proUserId = payload.new?.pro_user_id;
          const accountId = payload.new?.id;

          // 현재 팀의 선수인지, 선수이면 누구인지 리턴
          const currentMember = currentMembers.find(
            (member) => member.id === proUserId
          );

          if (!currentMember) return;

          const oldOnline = currentMember.is_online;
          //새로 받아온게 지금 보는 계정이 아닌 다른 부계정이고 상태가 online이면 새로고침
          if (currentMember.account_id !== accountId) {
            if (newOnline) {
              if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
              }
              debounceTimerRef.current = setTimeout(() => {
                queryClient.invalidateQueries({
                  queryKey: ['players', team, userId]
                });
                toast({ description: '🎉실시간 업데이트 완료🎉' });
              }, 3000);
            }
          }

          // 새로 받아온 계정이 지금 보는 계정이고 상태가 바뀌었으면
          if (currentMember.account_id === accountId) {
            if (newOnline !== oldOnline) {
              if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
              }

              debounceTimerRef.current = setTimeout(() => {
                queryClient.invalidateQueries({
                  queryKey: ['players', team, userId]
                });

                toast({ description: '🎉실시간 업데이트 완료🎉' });
              }, 3000);
            }
          }
        }
      )
      .subscribe();

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [team, queryClient, loading, userId, toast]);

  return { members, loading };
}
