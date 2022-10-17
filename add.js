const addSubmit = document.getElementById('addSubmit');
const  gamesContainer = document.getElementById('gamesContainer');

addSubmit.addEventListener('click', (e) => {
  const searchTerm = document.querySelector('#gameInput').value;
  const url = `https://api.boardgameatlas.com/api/search?order_by=rank&ascending=false&client_id=nGfOSls389&name=${searchTerm}`
  getGames(url)
  e.preventDefault()
});

gamesContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('addGameButton')) {
    if (confirm('Are you sure you want to add this game?')) {
      currentGameId = e.target.dataset.id;
      if(localStorage.getItem('gameIds') === null) {
        gameIds = [];
        gameIds.push(currentGameId);
        localStorage.setItem('gameIds', JSON.stringify(gameIds));
      } else {
          // Get what is already in ls
          gameIds = JSON.parse(localStorage.getItem('gameIds'));

          for (let i = 0; i < gameIds.length; i++) {
            if (gameIds[i] === currentGameId) {
              alert('This game is already in your library');
              return;
            }
          }
          // Push the new item
          gameIds.push(currentGameId);

          // Re set ls
          localStorage.setItem('gameIds', JSON.stringify(gameIds));
      }
      alert('Game successfully added to library');

      // Remove item from DOM
      e.target.parentNode.parentNode.remove()
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
            <button type="button" class="btn btn-success addGameButton" data-id="${game.id}">Add Game</button>
          </div>
        </div>
      `;
    })
  })
  .catch(console.error);
}
  