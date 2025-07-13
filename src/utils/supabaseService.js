import supabase from '../lib/supabase';

// Player profile functions
export async function createOrUpdatePlayer(playerName) {
  // First check if player exists
  const { data: existingPlayer } = await supabase
    .from('player_profiles_a5b7c9d1e3')
    .select('*')
    .eq('name', playerName)
    .single();

  if (existingPlayer) {
    // Player exists, return the profile
    return existingPlayer;
  } else {
    // Create new player profile
    const { data, error } = await supabase
      .from('player_profiles_a5b7c9d1e3')
      .insert([
        { name: playerName }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating player profile:', error);
      return null;
    }

    return data;
  }
}

export async function getLeaderboard() {
  const { data, error } = await supabase
    .from('player_profiles_a5b7c9d1e3')
    .select('*')
    .order('total_score', { ascending: false });

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return data || [];
}

export async function recordGameResult(playerName, result, difficulty) {
  const difficultyMultiplier = {
    'easy': 1,
    'medium': 2,
    'hard': 3
  };
  
  const score = calculateScore(result, difficulty);

  // First, record the game result
  const { error: gameError } = await supabase
    .from('game_results_a5b7c9d1e3')
    .insert([
      { 
        player_name: playerName, 
        result, 
        difficulty,
        score
      }
    ]);

  if (gameError) {
    console.error('Error recording game result:', gameError);
    return false;
  }

  // Then, update player profile
  const { data: player } = await supabase
    .from('player_profiles_a5b7c9d1e3')
    .select('*')
    .eq('name', playerName)
    .single();

  if (!player) {
    // Create player if not exists
    await createOrUpdatePlayer(playerName);
  }

  // Update player stats
  const { error: updateError } = await supabase
    .from('player_profiles_a5b7c9d1e3')
    .update({
      total_score: player ? player.total_score + score : score,
      wins: player ? player.wins + (result === 'win' ? 1 : 0) : (result === 'win' ? 1 : 0),
      losses: player ? player.losses + (result === 'loss' ? 1 : 0) : (result === 'loss' ? 1 : 0),
      draws: player ? player.draws + (result === 'draw' ? 1 : 0) : (result === 'draw' ? 1 : 0),
      games_played: player ? player.games_played + 1 : 1,
      updated_at: new Date()
    })
    .eq('name', playerName);

  if (updateError) {
    console.error('Error updating player profile:', updateError);
    return false;
  }

  return true;
}

function calculateScore(result, difficulty) {
  const difficultyMultiplier = {
    'easy': 1,
    'medium': 2,
    'hard': 3
  };

  const resultPoints = {
    'win': 3,
    'draw': 1,
    'loss': 0
  };

  return resultPoints[result] * difficultyMultiplier[difficulty];
}