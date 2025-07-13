import supabase from '../lib/supabase';

// Calculate score based on result and difficulty
export function calculateScore(result, difficulty) {
  const difficultyMultiplier = {
    'easy': 1,
    'medium': 2,
    'hard': 3,
    'timed': 4 // Add multiplier for timed mode
  };
  
  const resultPoints = {
    'win': 3,
    'draw': 1,
    'loss': 0
  };
  
  return resultPoints[result] * difficultyMultiplier[difficulty];
}

// Create or update player in the database
export async function createOrUpdatePlayer(name) {
  try {
    // Check if player exists
    const { data: existingPlayer } = await supabase
      .from('players_tictactoe')
      .select('*')
      .eq('name', name)
      .single();
    
    if (existingPlayer) {
      // Update last login time
      await supabase
        .from('players_tictactoe')
        .update({ last_login: new Date().toISOString() })
        .eq('name', name);
      
      return existingPlayer;
    } else {
      // Create new player
      const newPlayer = {
        name,
        total_score: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        games_played: 0,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('players_tictactoe')
        .insert(newPlayer)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error creating/updating player:', error);
    return null;
  }
}

// Record a game result
export async function recordGameResult(playerName, result, difficulty) {
  try {
    // Get player
    const { data: player } = await supabase
      .from('players_tictactoe')
      .select('*')
      .eq('name', playerName)
      .single();
    
    if (!player) {
      console.error('Player not found');
      return false;
    }
    
    // Calculate score for this game
    const score = calculateScore(result, difficulty);
    
    // Update player stats
    const updates = {
      total_score: player.total_score + score,
      games_played: player.games_played + 1,
      last_game_at: new Date().toISOString()
    };
    
    // Update specific result counter
    if (result === 'win') {
      updates.wins = player.wins + 1;
    } else if (result === 'loss') {
      updates.losses = player.losses + 1;
    } else if (result === 'draw') {
      updates.draws = player.draws + 1;
    }
    
    // Update player record
    const { error: updateError } = await supabase
      .from('players_tictactoe')
      .update(updates)
      .eq('name', playerName);
    
    if (updateError) throw updateError;
    
    // Record game in game_history table
    const { error: historyError } = await supabase
      .from('game_history_tictactoe')
      .insert({
        player_name: playerName,
        result,
        difficulty,
        score,
        created_at: new Date().toISOString()
      });
    
    if (historyError) throw historyError;
    
    return true;
  } catch (error) {
    console.error('Error recording game result:', error);
    return false;
  }
}

// Get leaderboard data
export async function getLeaderboard() {
  try {
    const { data, error } = await supabase
      .from('players_tictactoe')
      .select('*')
      .order('total_score', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

// Get player stats
export async function getPlayerStats(playerName) {
  try {
    const { data, error } = await supabase
      .from('players_tictactoe')
      .select('*')
      .eq('name', playerName)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return null;
  }
}

// Get player game history
export async function getPlayerHistory(playerName) {
  try {
    const { data, error } = await supabase
      .from('game_history_tictactoe')
      .select('*')
      .eq('player_name', playerName)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching player history:', error);
    return [];
  }
}