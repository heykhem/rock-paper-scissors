import { supabase } from "./supabase.js";
import * as Auth from "./auth.js";
import * as UI from "./ui.js";

export function winCheck(user, computer) {
  if (user === computer) return null;
  return (user - computer + 3) % 3 === 1;
}

export async function saveGameHistory({
  userId,
  opponentId,
  userAvatar,
  opponentAvatar,
  opponentName,
  userScore,
  opponentScore,
  status,
  matchDuration,
  rounds,
  roomId,
  gameType,
}) {
  try {
    const { data, error } = await supabase.from("game_history").insert([
      {
        user_id: userId,
        opponent_id: opponentId,
        user_avatar: userAvatar,
        opponent_avatar: opponentAvatar,
        opponent_name: opponentName,
        user_score: userScore,
        opponent_score: opponentScore,
        status: status,
        match_duration: matchDuration,
        rounds: rounds ? rounds : null,
        room_id: roomId,
        game_type: gameType,
        played_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    console.log("✅ Game saved to history:", data);
    return data;
  } catch (err) {
    console.error("❌ Failed to save game history:", err.message);
    return null;
  }
}
