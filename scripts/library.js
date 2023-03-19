 import { fetchGames, displayGame } from './shared.js';

// This needs to be declared globally for the event listener to work
const gamesContainer = document.getElementById('gamesContainer');

window.addEventListener('DOMContentLoaded', (e) => {
  if(localStorage.getItem('gameIds') != null){
    const gameIds = JSON.parse(localStorage.getItem('gameIds'));
    const filter = {ids: gameIds};
    getGames(filter);
  } 
});

gamesContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('removeGameButton')) {
    if (confirm('Are you sure you want to delete this game?')) {
      removeGame(e.target);
    }
  }
});

async function getGames(filter) {
  const gamesContainer = document.querySelector('#gamesContainer');
  gamesContainer.innerHTML = ``;
  const games = await fetchGames(filter);
  games.forEach(game => {
    displayGame(gamesContainer, game, 'remove');
  });
}

function removeGame(target) {
  const currentGameId = target.dataset.id;
  let gameIds = JSON.parse(localStorage.getItem('gameIds'));

  for (let i = 0; i < gameIds.length; i++) {
    if (gameIds[i] === currentGameId) {
      gameIds.splice(i, 1)

      // Re set ls
      localStorage.setItem('gameIds', JSON.stringify(gameIds));
      alert('Game successfully removed from library');

      // Remove item from DOM
      target.parentNode.remove()
      
      return;
    }
  }
}