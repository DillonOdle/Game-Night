import { fetchGames, displayGame } from "./shared.js";

// These need to be declared globally for the event listeners to work
const addSubmit = document.getElementById('addSubmit');
const  gamesContainer = document.getElementById('gamesContainer');

addSubmit.addEventListener('click', (e) => {
  const searchTerm = document.querySelector('#gameInput').value;
  const filter = {name: searchTerm};
  getGames(filter)
  e.preventDefault()
});

gamesContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('addGameButton')) {
    if (confirm('Are you sure you want to add this game?')) {
      const currentGameId = e.target.dataset.id;

      if (gameIdIsInGames(currentGameId)){
        alert('This game is already in your library');
        return;
      }
      addGameToLibrary(currentGameId);
      removeGameFromDOM(e.target);
    }
  }
});
  
async function getGames(filter) {
  const gamesContainer = document.querySelector('#gamesContainer');
  gamesContainer.innerHTML = ``;
  const games = await fetchGames(filter);
  games.forEach(game => {
    displayGame(gamesContainer, game, 'add');
  });
}
  
function getGameIds() {
  if(localStorage.getItem('gameNights') === null) {
      return [];
  } else {
    return JSON.parse(localStorage.getItem('gameIds'));
  }
}

function gameIdIsInGames(currentGameId) {
  const gameIdsInLS = getGameIds();
  for (let i = 0; i < gameIdsInLS.length; i++) {
    if (gameIdsInLS[i] === currentGameId) {
      return true;
    }
  }
  return false;
}

function addGameToLibrary(currentGameId) {
  const gameIdsInLS = getGameIds();
  gameIdsInLS.push(currentGameId);
  localStorage.setItem('gameIds', JSON.stringify(gameIdsInLS));

  alert('Game successfully added to library');
}

function removeGameFromDOM(target) {
  target.parentNode.remove()
}