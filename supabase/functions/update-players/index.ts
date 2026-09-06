import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { supabase } from "../_shared/supabaseClient.ts";
import { TABLES } from "../_shared/constants.ts";
import { Player } from "../_shared/types.ts";

const RIOT_API_KEY = Deno.env.get("RIOT_API_KEY");
const SOLO_QUEUE_ID = 420;

class RiotApiKeyError extends Error {
    status: number;

    constructor(status: number) {
        super(
            status === 403
                ? "Riot API key unauthorized (403)"
                : "Riot API key expired or unauthorized (401)"
        );
        this.status = status;
    }
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function assertValidRiotAuth(res: Response) {
    if (res.status === 403 || res.status === 401) {
        throw new RiotApiKeyError(res.status);
    }
}

async function fetchLatestSoloRankMatchId(
    puuid: string,
    previousMatchId: string | null,
    summonerName: string
) {
    const encodedPuuid = encodeURIComponent(puuid);
    const res = await fetch(
        `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodedPuuid}/ids?queue=${SOLO_QUEUE_ID}&start=0&count=1&api_key=${RIOT_API_KEY}`
    );

    assertValidRiotAuth(res);

    if (!res.ok) {
        console.warn(`⚠️ [${summonerName}] 최신 전적 조회 실패: ${res.status}`);
        return previousMatchId;
    }

    const data = await res.json();
    const latestMatchId = Array.isArray(data) ? data[0] : null;

    if (!latestMatchId) {
        console.warn(`⚠️ [${summonerName}] 최신 솔로랭크 전적 데이터 없음`);
        return previousMatchId;
    }

    return latestMatchId;
}

async function fetchActiveGameStatus(puuid: string) {
    const encodedPuuid = encodeURIComponent(puuid);
    const res = await fetch(
        `https://kr.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${encodedPuuid}?api_key=${RIOT_API_KEY}`
    );

    assertValidRiotAuth(res);

    return res.status === 200;
}

Deno.serve(async () => {
    if (!RIOT_API_KEY) {
        console.error("❌ Riot API 키가 설정되지 않았습니다.");
        return new Response(JSON.stringify({ error: "Missing Riot API key" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { data: players, error } = await supabase
        .from(TABLES.RIOT_ACCOUNTS)
        .select("*")
        .order("last_checked_at", { ascending: true })
        .limit(25)
        .returns<Player[]>();

    if (error || !players) {
        console.error("❌ 선수 데이터 가져오기 실패:", error);
        return new Response("Failed to fetch players", { status: 500 });
    }

    let successCount = 0;
    let failCount = 0;

    for (const player of players) {
        const { id, summoner_name, puuid, last_match_id, streamer_mode } = player;

        await delay(200);

        try {
            const latest = await fetchLatestSoloRankMatchId(
                puuid,
                last_match_id,
                summoner_name
            );

            let is_online: boolean;

            // 스트리머 모드면 최신 매치 아이디와 저장된 매치 아이디가 다를 때 한 번 online으로 처리
            if (streamer_mode) {
                is_online = Boolean(
                    last_match_id && latest && last_match_id !== latest
                );
            } else {
                await delay(200);
                is_online = await fetchActiveGameStatus(puuid);
            }

            const last_online = is_online ? new Date().toISOString() : player.last_online;

            const { error: updateError } = await supabase
                .from(TABLES.RIOT_ACCOUNTS)
                .update({
                    is_online,
                    last_online,
                    last_checked_at: new Date().toISOString(),
                    last_match_id: latest,
                })
                .eq("id", id);

            if (updateError) {
                failCount++;
                console.error(`❌ [${summoner_name}, ${id}] DB 업데이트 실패:`, updateError);
            } else {
                successCount++;
            }
        } catch (e) {
            if (e instanceof RiotApiKeyError) {
                console.error(`❌ ${e.message}`);
                return new Response(JSON.stringify({ error: e.message }), {
                    status: e.status,
                    headers: { "Content-Type": "application/json" },
                });
            }

            failCount++;
            console.error(`🔥 [${summoner_name}, ${id}] Riot API 호출 실패:`, e);
        }
    }

    console.log(`✅ 성공: ${successCount}건`);
    console.log(`❌ 실패: ${failCount}건`);

    return new Response(
        JSON.stringify({
            message: "Player statuses updated (25 players)",
            success: successCount,
            failed: failCount,
            total: players.length,
        }),
        { headers: { "Content-Type": "application/json" } }
    );
});
