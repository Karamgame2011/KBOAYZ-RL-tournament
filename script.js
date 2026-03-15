// script.js
const password = "1313";

// Persistent storage keys
const POINTS_KEY = "rl_points";
const STARS_KEY = "rl_stars";
const MULT_KEY = "rl_mult";
const PENALTY_KEY = "rl_penalty";

// Initialize if not present
if(!localStorage.getItem(POINTS_KEY)) {
  localStorage.setItem(POINTS_KEY, JSON.stringify({
    "Karam":0,"Abood":0,"Belal":0,"Omar":0,"Zaid":50,"Joud":30
  }));
}
if(!localStorage.getItem(STARS_KEY)) {
  localStorage.setItem(STARS_KEY, JSON.stringify({
    "Karam":0,"Abood":0,"Belal":0,"Omar":0,"Zaid":0,"Joud":0
  }));
}
if(!localStorage.getItem(MULT_KEY)) localStorage.setItem(MULT_KEY, JSON.stringify({}));
if(!localStorage.getItem(PENALTY_KEY)) localStorage.setItem(PENALTY_KEY, JSON.stringify({}));

// Helper to update leaderboard table
function updateLeaderboard() {
  const table = document.getElementById("scoreTable");
  const points = JSON.parse(localStorage.getItem(POINTS_KEY));
  const stars = JSON.parse(localStorage.getItem(STARS_KEY));
  const mult = JSON.parse(localStorage.getItem(MULT_KEY));
  const penalty = JSON.parse(localStorage.getItem(PENALTY_KEY));
  for(let i=1;i<table.rows.length;i++){
    let player = table.rows[i].cells[0].innerText;
    table.rows[i].cells[1].innerText = points[player];
    let status = "";
    if(stars[player]>0) status += "★".repeat(stars[player])+" ";
    if(mult[player]) status += "1.5× next game ";
    if(penalty[player]) status += "15 sec penalty";
    table.rows[i].cells[2].innerText = status;
  }
}

// Edit leaderboard points
function editPoints() {
  let pass = prompt("Enter password to edit points:");
  if(pass !== password) return alert("Wrong password");

  const table = document.getElementById("scoreTable");
  let points = JSON.parse(localStorage.getItem(POINTS_KEY));
  let mult = JSON.parse(localStorage.getItem(MULT_KEY));
  let penalty = JSON.parse(localStorage.getItem(PENALTY_KEY));

  for(let i=1;i<table.rows.length;i++){
    let player = table.rows[i].cells[0].innerText;
    let current = points[player];
    let newScore = prompt(`Enter points for ${player}:`, current);
    if(newScore === null) continue;
    let pts = parseInt(newScore);
    if(mult[player]){
      pts = Math.round(pts*1.5);
      mult[player]=false;
    }
    if(penalty[player]){
      penalty[player]=false;
    }
    points[player] = pts;
  }

  localStorage.setItem(POINTS_KEY, JSON.stringify(points));
  localStorage.setItem(MULT_KEY, JSON.stringify(mult));
  localStorage.setItem(PENALTY_KEY, JSON.stringify(penalty));
  updateLeaderboard();
}

// Use Power Ticket
function useTicket() {
  let pass = prompt("Enter password to use ticket:");
  if(pass !== password) return alert("Wrong password");

  const table = document.getElementById("scoreTable");
  let points = JSON.parse(localStorage.getItem(POINTS_KEY));
  let stars = JSON.parse(localStorage.getItem(STARS_KEY));
  let mult = JSON.parse(localStorage.getItem(MULT_KEY));
  let penalty = JSON.parse(localStorage.getItem(PENALTY_KEY));

  let playerNames = Object.keys(points);
  let man = prompt("Enter Man of the Match name:", playerNames[0]);
  if(!playerNames.includes(man)) return alert("Invalid player");

  // Add a star to MVP
  stars[man] = stars[man]+1;

  let choice = prompt("Choose ticket:\n1 = Steal 150 pts\n2 = 1.5x next game\n3 = 15 sec penalty");

  if(choice=="1"){
    let target = prompt("Enter player to steal 150 points from:");
    if(!playerNames.includes(target)||target===man) return alert("Invalid target");
    points[man]+=150;
    points[target]-=150;
  } else if(choice=="2"){
    mult[man]=true;
  } else if(choice=="3"){
    let target = prompt("Enter player to apply 15 sec penalty:");
    if(!playerNames.includes(target)||target===man) return alert("Invalid target");
    penalty[target]=true;
  } else return alert("Invalid choice");

  localStorage.setItem(POINTS_KEY, JSON.stringify(points));
  localStorage.setItem(STARS_KEY, JSON.stringify(stars));
  localStorage.setItem(MULT_KEY, JSON.stringify(mult));
  localStorage.setItem(PENALTY_KEY, JSON.stringify(penalty));
  updateLeaderboard();
}

// Schedule page: edit scores and man of the match
function editSchedule() {
  let pass = prompt("Enter password to edit schedule:");
  if(pass !== password) return alert("Wrong password");

  const table = document.getElementById("scheduleTable");
  const points = JSON.parse(localStorage.getItem(POINTS_KEY));
  const stars = JSON.parse(localStorage.getItem(STARS_KEY));

  for(let i=1;i<table.rows.length;i++){
    let team1 = table.rows[i].cells[0].innerText;
    let team2 = table.rows[i].cells[2].innerText;
    let currentScore = table.rows[i].cells[1].innerText;
    let newScore = prompt(`Enter score for ${team1} vs ${team2}:`, currentScore);
    if(newScore!==null) table.rows[i].cells[1].innerText = newScore;

    let mvp = prompt(`Enter Man of the Match for ${team1} vs ${team2}:`, "");
    if(mvp!==null && points[mvp]!==undefined){
      stars[mvp]=stars[mvp]+1;
    }
  }

  localStorage.setItem(STARS_KEY, JSON.stringify(stars));
  updateLeaderboard();
}

// On page load
window.onload = function(){
  if(document.getElementById("scoreTable")) updateLeaderboard();
};
