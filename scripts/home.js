//Displaying todays date

dayjs.extend(window.dayjs_plugin_localizedFormat);
const today = dayjs().format('LL');

document.querySelector(".line-text-2").innerHTML = today;

const apiKey = "0b7aa102-9811-48c5-bb0e-240a86838d37";

// Get today's date in YYYY-MM-DD format
const todaysGames = new Date().toISOString().split('T')[0];

// Fetch today's NBA games
fetch(`https://api.balldontlie.io/v1/games?dates[]=${todaysGames}`, {
  headers: {
    'Authorization': apiKey
  }
})
.then(response => response.json())
.then(data => {
  const games = data.data;
  const container = document.querySelector('.game-grid');
  container.innerHTML = ''; // clear the "Loading..." text

  if (games.length === 0) {
    container.innerHTML = '<p>No games today.</p>';
    return;
  }



  // ✅ Limit to 6 games
  const limitedGames = games.slice(0, 6);

  limitedGames.forEach(game => {
    const gameDiv = document.createElement('div');
    gameDiv.classList.add('game-card');
    gameDiv.innerHTML = `
      <div class="team-row">
        <div class="team">
          <img src="">
          <span class="team-name">${game.home_team.full_name}</span>
        </div>
        <span class="team-score">${game.home_team_score}</span>
      </div>
      
      <div class="team-row">
        <div class="team">
          <img src="">
          <span class="team-name">${game.visitor_team.full_name}</span>
        </div>
        <span class="team-score">${game.visitor_team_score}</span>
      </div>

      <div class="game-status">
        ${game.status}
      </div>
    `;
    container.appendChild(gameDiv);
  });
})
.catch(error => {
  console.error("Error fetching games:", error);
  document.querySelector('.nba-container').innerHTML = '<p>Error loading games.</p>';
});