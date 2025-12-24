export function winCheck(user, computer) {
  if (user === computer) return null;
  return (user - computer + 3) % 3 === 1;
}

export async function saveGameHistory(userId, gameData) {
  const { data, error } = await supabase.from("game_history").insert([
    {
      user_id: userId,
      opponent: gameData.opponent,
      result: gameData.result,
      user_score: gameData.userScore,
      opponent_score: gameData.computerScore,
      duration: gameData.duration,
    },
  ]);

  if (error) console.error("Error saving history:", error);
  return data;
}
