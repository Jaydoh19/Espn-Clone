import { updateMLBScores } from "./mlb.js";
import { updateNBAScores } from "./nba.js";
import { updateNHLScores } from "./nhl.js";


//Displaying todays date
dayjs.extend(window.dayjs_plugin_localizedFormat);
const today = dayjs().format('LL');

document.querySelector(".line-text-2").innerHTML = today;




// Run immediately once
updateNBAScores(6);
updateNFLScores(6);
updateNHLScores(6);
updateMLBScores(6);

setInterval(() => {
  updateNBAScores(6);
  updateNFLScores(6);
  updateNHLScores(6);
  updateMLBScores(6);
}, 30000);

document.addEventListener("click", e => {
  if (e.target.closest(".game-card")) {
    console.log("clicked a card");
  }
});
