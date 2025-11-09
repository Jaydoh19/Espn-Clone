import { updateScores } from "./nba.js";

//Displaying todays date
dayjs.extend(window.dayjs_plugin_localizedFormat);
const today = dayjs().format('LL');

document.querySelector(".line-text-2").innerHTML = today;




// Run immediately once
updateScores();

setInterval(() => {
  console.log("⏱ Refreshing scores...");
  updateScores();
}, 30000);

