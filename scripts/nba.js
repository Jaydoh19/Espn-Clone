const apiKey = "0b7aa102-9811-48c5-bb0e-240a86838d37";

// Team logos
const teamLogos = {
  ATL: "https://a.espncdn.com/i/teamlogos/nba/500/atl.png",
  BOS: "https://a.espncdn.com/i/teamlogos/nba/500/bos.png",
  BKN: "https://a.espncdn.com/i/teamlogos/nba/500/bkn.png",
  CHA: "https://a.espncdn.com/i/teamlogos/nba/500/cha.png",
  CHI: "https://a.espncdn.com/i/teamlogos/nba/500/chi.png",
  CLE: "https://a.espncdn.com/i/teamlogos/nba/500/cle.png",
  DAL: "https://a.espncdn.com/i/teamlogos/nba/500/dal.png",
  DEN: "https://a.espncdn.com/i/teamlogos/nba/500/den.png",
  DET: "https://a.espncdn.com/i/teamlogos/nba/500/det.png",
  GSW: "https://a.espncdn.com/i/teamlogos/nba/500/gs.png",
  HOU: "https://a.espncdn.com/i/teamlogos/nba/500/hou.png",
  IND: "https://a.espncdn.com/i/teamlogos/nba/500/ind.png",
  LAC: "https://a.espncdn.com/i/teamlogos/nba/500/lac.png",
  LAL: "https://a.espncdn.com/i/teamlogos/nba/500/lal.png",
  MEM: "https://a.espncdn.com/i/teamlogos/nba/500/mem.png",
  MIA: "https://a.espncdn.com/i/teamlogos/nba/500/mia.png",
  MIL: "https://a.espncdn.com/i/teamlogos/nba/500/mil.png",
  MIN: "https://a.espncdn.com/i/teamlogos/nba/500/min.png",
  NOP: "https://a.espncdn.com/i/teamlogos/nba/500/no.png",
  NYK: "https://a.espncdn.com/i/teamlogos/nba/500/ny.png",
  OKC: "https://a.espncdn.com/i/teamlogos/nba/500/okc.png",
  ORL: "https://a.espncdn.com/i/teamlogos/nba/500/orl.png",
  PHI: "https://a.espncdn.com/i/teamlogos/nba/500/phi.png",
  PHX: "https://a.espncdn.com/i/teamlogos/nba/500/phx.png",
  POR: "https://a.espncdn.com/i/teamlogos/nba/500/por.png",
  SAC: "https://a.espncdn.com/i/teamlogos/nba/500/sac.png",
  SAS: "https://a.espncdn.com/i/teamlogos/nba/500/sa.png",
  TOR: "https://a.espncdn.com/i/teamlogos/nba/500/tor.png",
  UTA: "https://a.espncdn.com/i/teamlogos/nba/500/utah.png",
  WAS: "https://a.espncdn.com/i/teamlogos/nba/500/wsh.png"
};

//Displaying todays date
dayjs.extend(window.dayjs_plugin_localizedFormat);
const today = dayjs().format('LL');

document.querySelector(".line-text-2").innerHTML = today;


// Local date for today
function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


// Fetch + refresh data without reloading page
export async function updateNBAScores(gameNum) {
  const today = getTodayDate();
  const url = `https://api.balldontlie.io/v1/games?dates[]=${today}&per_page=100`;
  const container = document.querySelector('.game-grid');

  
  try {
    const res = await fetch(url, { headers: { 'Authorization': apiKey } });
    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      container.innerHTML = `<p>No NBA games today.</p>`;
      return;
    }

    // 🧹 Reset only the grid (not the page)
    container.innerHTML = '';

    // Limit to 6 cards
    const games = data.data.slice(0, gameNum);

    // 🎮 Create updated cards
    games.forEach(game => {
      const home = game.home_team.abbreviation;
      const away = game.visitor_team.abbreviation;
      const homeLogo = teamLogos[home] || '';
      const awayLogo = teamLogos[away] || '';

      // color code for live/final
      let statusColor = 'gray';
      if (game.status.includes('Q') || game.status.includes('OT')) statusColor = '#e22d2d';
      else if (game.status === 'Final') statusColor = '#2e8b57';

      // Convert UTC game start to local time
      const utcDate = new Date(game.date);
      const localDate = utcDate.toLocaleString('en-US', {
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric'
    });

      // Handle bad UTC timestamps
      let statusDisplay;
      if (!game.status || game.status.includes("T") || game.status === "Scheduled") {
        statusDisplay = localDate;
      } else {
        statusDisplay = game.status;
      };      

      const homeScore = game.home_team_score;
      const awayScore = game.visitor_team_score;

      // Decide who’s winning
      let homeScoreClass = "team-score";
      let awayScoreClass = "team-score";

      if (homeScore > awayScore) {
        homeScoreClass = "team-score winner-score"; // home team winning
      } else if (awayScore > homeScore) {
        awayScoreClass = "team-score winner-score"; // away team winning
      }

      const card = document.createElement('div');
      card.classList.add('game-card');
      card.innerHTML = `
        <div class="team-row">
          <div class="team">
            <div class="team-sub">
              <img src="${homeLogo}" alt="${home}" class="team-logo">
              <span class="team-name">${home}</span>
            </div>
            <span class="${homeScoreClass}">${homeScore}</span>
          </div>

          <div class="vs-separator">vs</div>

          <div class="team">
            <div class="team-sub">
              <img src="${awayLogo}" alt="${away}" class="team-logo">
              <span class="team-name">${away}</span>
            </div>
            <span class="${awayScoreClass}">${awayScore}</span>
          </div>
        </div>
        <div class="game-status" style="color:${statusColor}">${statusDisplay}</div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Error updating scores:', err);
    container.innerHTML = `<p>Error loading games.</p>`;
  }
}

updateNBAScores(15);

setInterval(() => {
  updateNBAScores(15);
}, 45000);

document.addEventListener("click", e => {
  if (e.target.closest(".game-card")) {
    console.log("clicked a card");
  }
});