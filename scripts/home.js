import { updateScores } from "./nba.js";

//Displaying todays date
dayjs.extend(window.dayjs_plugin_localizedFormat);
const today = dayjs().format('LL');

document.querySelector(".line-text-2").innerHTML = today;




// Run immediately once
updateScores(6);

setInterval(() => {
  updateScores(6);
}, 15000);

