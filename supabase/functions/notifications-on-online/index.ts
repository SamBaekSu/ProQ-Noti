import { createClient } from "npm:@supabase/supabase-js@2";
import { JWT } from "npm:google-auth-library@9";
import { TABLES } from "../_shared/constants.ts";
interface RiotAccountRecord {
    id: number;
    pro_user_id: number;
    summoner_name: string;
    is_online: boolean;
}

// 이 함수는 UPDATE 이벤트만 처리하므로 타입을 더 명확하게 지정
interface WebhookPayload {
    type: "UPDATE";
    table: string;
    record: RiotAccountRecord;
    old_record: RiotAccountRecord; // UPDATE 이벤트는 항상 old_record를 포함해야 함
    schema: "public";
}

Deno.serve(async (req) => {
    try {
        const payload: WebhookPayload = await req.json();

        // is_online 상태가 false -> true로 변경되었는지 확인
        if (payload.old_record.is_online === true || payload.record.is_online === false) {
            return new Response(JSON.stringify({ message: "No status change to online." }), {
                status: 200,
            });
        }

        const proUserId = payload.record.pro_user_id;
        const proSummonerName = payload.record.summoner_name;
        console.log(
            `Player ${proSummonerName} (pro_user_id: ${proUserId}) is now online. Finding subscribers to create notifications...`
        );

        // 관리자용 Supabase 클라이언트 생성
        const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

        // 해당 선수 리그 정보
        const { data: pro_league, error } = await supabase
            .from(TABLES.RIOT_PRO_USERS)
            .select("league")
            .eq("id", proUserId)
            .single();

        // 해당 프로 선수를 구독하는 모든 user_id 조회
        const { data: subscribers, error: subscriberError } = await supabaseAdmin
            .from(TABLES.SUBSCRIBE)
            .select("user_id")
            .eq("riot_pro_user_id", proUserId);

        if (subscriberError) throw subscriberError;

        if (!subscribers || subscribers.length === 0) {
            return new Response(JSON.stringify({ message: "No subscribers found." }), { status: 200 });
        }

        // notifications 테이블에 삽입할 데이터 배열 생성
        const notificationsToInsert = subscribers.map((subscriber) => ({
            user_id: subscriber.user_id, // 알림을 받을 유저
            body:
                pro_league?.league === "LPL"
                    ? `${proSummonerName} 방금 게임을 마쳤습니다. 전적을 확인해주세요.`
                    : `${proSummonerName} 방금 게임을 시작했습니다!`,
        }));

        console.log(`Creating ${notificationsToInsert.length} notification rows...`);

        // notifications 테이블에 여러 행을 한 번에 삽입
        const { error: insertError } = await supabaseAdmin
            .from(TABLES.NOTIFICATIONS) // 당신의 알림 테이블 이름 확인
            .insert(notificationsToInsert);

        if (insertError) throw insertError;

        return new Response(
            JSON.stringify({ success: true, message: `${notificationsToInsert.length} notifications created.` }),
            {
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (err) {
        console.error("❌ Top-level server error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        });
    }
});
