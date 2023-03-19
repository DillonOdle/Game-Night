window.addEventListener('DOMContentLoaded', (e) => {
  let gameIds = JSON.parse(localStorage.getItem('gameIds'));
  const currentGameCountUI = document.querySelector('#current-games-count');
  currentGameCountUI.innerHTML = `${gameIds.length}`;

  let gameNights = JSON.parse(localStorage.getItem('gameNights'));
  const currentGameNightCountUI = document.querySelector('#current-gamenights-count');
  currentGameNightCountUI.innerHTML = `${gameNights.length}`;
});