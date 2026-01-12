import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { supabase } from "../_shared/supabaseClient.ts";
import { TABLES } from "../_shared/constants.ts";
import { Player } from "../_shared/types.ts";

const RIOT_API_KEY = Deno.env.get("RIOT_API_KEY");

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

Deno.serve(async () => {
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
        const { id, summoner_name, puuid, riot_pro_users, last_match_id, streamer_mode } = player;

        let url = "";

        //스머 모드일시 전적검색, 아닐시 실시간
        streamer_mode
            ? (url = `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=420&start=0&count=1&api_key=${RIOT_API_KEY}`)
            : (url = `https://kr.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}?api_key=${RIOT_API_KEY}`);

        await delay(200);

        try {
            const res = await fetch(url);
            if (!res.ok) {
                if (res.status === 403) {
                    console.error("❌ Riot API 키가 잘못되었습니다.");
                    return new Response(JSON.stringify({ error: "Riot API key unauthorized (403)" }), {
                        status: 403,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                if (res.status === 401) {
                    console.error("❌ Riot API 키가 만료되었습니다.");
                    return new Response(JSON.stringify({ error: "Riot API key expired or unauthorized (401)" }), {
                        status: 401,
                        headers: { "Content-Type": "application/json" },
                    });
                }
            }

            let is_online = false;
            let latest = last_match_id;

            // 스트리머 모드면 최신 매치 아이디와 저장된 매치 아이디가 다르면 방금 접속해서 게임 끝난것
            if (streamer_mode) {
                const data = await res.json();

                latest = data[0];
                if (!latest) {
                    console.warn(`⚠️ [${summoner_name}] 전적 데이터 없음`);
                    latest = last_match_id;
                    is_online = false;
                } else if (last_match_id && last_match_id !== latest) {
                    is_online = true;
                } else {
                    is_online = false;
                }
            } else {
                is_online = res.status === 200;
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
