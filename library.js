const gamesContainer = document.getElementById('gamesContainer');

window.addEventListener('DOMContentLoaded', (e) => {
  if(localStorage.getItem('gameIds') != null){
    gameIds = JSON.parse(localStorage.getItem('gameIds'));
    const url = `https://api.boardgameatlas.com/api/search?order_by=rank&ascending=false&client_id=nGfOSls389&ids=${gameIds}`
    getGames(url);
  } 
});

gamesContainer.addEventListener('click', (e) => {

  if (e.target.classList.contains('removeGameButton')) {
    if (confirm('Are you sure you want to delete this game?')) {
      currentGameId = e.target.dataset.id;
      // Get ls
      let gameIds = JSON.parse(localStorage.getItem('gameIds'));

      for (let i = 0; i < gameIds.length; i++) {
        if (gameIds[i] === currentGameId) {
          gameIds.splice(i, 1)

          // Re set ls
          localStorage.setItem('gameIds', JSON.stringify(gameIds));
          alert('Game successfully removed from library');

          // Remove item from DOM
          e.target.parentNode.parentNode.remove()
          
          return;
        }
      }
    }
  }
});

function getGames(url) {
  const gamesContainer = document.querySelector('#gamesContainer');
  gamesContainer.innerHTML = ``;
  fetch(url)
  .then((response) => response.json())
  .then((data) => {
    data.games.forEach((game) => {
      gamesContainer.innerHTML += 
      `
        <div class="card p-3 m-2 gameCard">
          <img src="${game.thumb_url}" class="gameImgTop" alt="${game.description}">
          <div class="card-body">
            <h5 class="game-title">${game.name}</h5>
            <p class="game-text">${game.description_preview}</p>
            <button type="button" class="btn btn-danger removeGameButton" data-id="${game.id}">Remove Game</button>
          </div>
        </div>
      `;
    })
  })
  .catch(console.error);
}