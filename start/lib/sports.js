const fetch = require('node-fetch');
const axios = require('axios');

// Safe versions of your functions to handle undefined properties
async function formatStandings(leagueCode, leagueName, { m, reply }) {
  try {
    const apiUrl = `${global.api}/football?code=${leagueCode}&query=standings`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data?.result?.standings) {
      return reply(`❌ Failed to fetch ${leagueName} standings. Please try again later.`);
    }

    const standings = data.result.standings;
    let message = `*⚽ ${leagueName} Standings ⚽*\n\n`;
    
    standings.forEach((team) => {
      const position = team.position || 'N/A';
      const teamName = team.team || 'Unknown Team';
      const played = team.played || 0;
      const won = team.won || 0;
      const draw = team.draw || 0;
      const lost = team.lost || 0;
      const goalsFor = team.goalsFor || 0;
      const goalsAgainst = team.goalsAgainst || 0;
      const goalDifference = team.goalDifference || 0;
      const points = team.points || 0;
      
      let positionIndicator = '';
      if (leagueCode === 'CL' || leagueCode === 'EL') {
        if (position <= (leagueCode === 'CL' ? 4 : 3)) positionIndicator = '🌟 ';
      } else {
        if (position <= 4) positionIndicator = '🌟 '; 
        else if (position === 5 || position === 6) positionIndicator = '⭐ ';
        else if (position >= standings.length - 2) positionIndicator = '⚠️ '; 
      }

      message += `*${positionIndicator}${position}.* ${teamName}\n`;
      message += `   📊 Played: ${played} | W: ${won} | D: ${draw} | L: ${lost}\n`;
      message += `   ⚽ Goals: ${goalsFor}-${goalsAgainst} (GD: ${goalDifference > 0 ? '+' : ''}${goalDifference})\n`;
      message += `   � Points: *${points}*\n\n`;
    });

    if (leagueCode === 'CL' || leagueCode === 'EL') {
      message += '\n*🌟 = Qualification for next stage*';
    } else {
      message += '\n*🌟 = UCL | ⭐ = Europa | ⚠️ = Relegation*';
    }
    
    reply(message);
  } catch (error) {
    console.error(`Error fetching ${leagueName} standings:`, error);
    reply(`❌ Error fetching ${leagueName} standings. Please try again later.`);
  }
}

module.exports = {
       formatStandings,
       formatMatches,
       formatUpcomingMatches,
       formatTopScorers}