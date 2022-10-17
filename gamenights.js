const dateInput = document.querySelector('#dateInput');
const gameNightList = document.querySelector('#gameNightList');
const currentGameNightSelect = document.querySelector('#currentGameNightSelect');
const gamesContainer = document.getElementById('gamesContainer');

window.addEventListener('DOMContentLoaded', (e) => {
  let gameNights = JSON.parse(localStorage.getItem('gameNights')); 

  // Show list of game nights
  for (let i = 0; i < gameNights.length; i++) {
      if (i === 0) {
        gameNightList.innerHTML += 
          `
            <div class="container"> 
              <a href="#" class="list-group-item list-group-item-action py-3 lh-sm gameNight active bg-dark" aria-current="true" id="currentActive" data-date=${gameNights[i].date}>
              <div class="row justify-content-between"> 
                <div class="col fs-4 mb-1" id="currentGameNight" data-date=${gameNights[i].date}>${gameNights[i].date}</div>
                <button class="col-3 col-md-6 btn btn-danger removeGameNightButton">Remove</button>
              </div>
              </a>
            </div>
          `;
      } else {
          gameNightList.innerHTML +=
          `
            <div class="container"> 
              <a href="#" class="list-group-item list-group-item-action py-3 lh-sm gameNight" aria-current="true" data-date=${gameNights[i].date}>
              <div class="row justify-content-between"> 
                <div class="col fs-4 mb-1" data-date=${gameNights[i].date}>${gameNights[i].date}</div>
                <button class="col-3 col-md-6 btn btn-danger removeGameNightButton">Remove</button>
              </div>
              </a>
            </div>
          `;
      }

  }

  populateGameSelectMenu();

  // Show current game night
  const currentGameNight = document.querySelector('#currentGameNight').innerHTML;

  // Update the current game title
  currentGameNightTitle.innerHTML = `${currentGameNight}`;

  displayGameNight(currentGameNight);
})

currentGameNightSelect.addEventListener('change', (e) => {
  const currentGameNight = document.querySelector('#currentGameNight').innerHTML;
  let targetGame = e.target.value;
  let gameNights = JSON.parse(localStorage.getItem('gameNights'));

  // Make sure current game is not already in the list
  for (let i = 0; i < gameNights.length; i++) {
    if (gameNights[i].date === currentGameNight) {
      for (let j = 0; j < gameNights[i].games.length; j++) {
        if (gameNights[i].games[j] == targetGame) {
          alert('Game is already included in this game night');
          return;
        }
      }
      gameNights[i].games.push(targetGame);
      localStorage.setItem('gameNights', JSON.stringify(gameNights));
      alert(`Your game has been added to the current game night`)
      displayGameNight()
      return;
    }
  }
})


dateInput.addEventListener('change', (e) => {
  if (confirm ('Are you sure you want to add this date?')) {
    currentGameNight = {
      date: dateInput.value,
      games: []
    };

    if(localStorage.getItem('gameNights') === null) {
      let gameNights = [];
      gameNights.push(currentGameNight);
      localStorage.setItem('gameNights', JSON.stringify(gameNights));
    } else {
        // Get what is already in ls
        let gameNights = JSON.parse(localStorage.getItem('gameNights'));

        // Make sure current game night is not already in the list
        for (let i = 0; i < gameNights.length; i++) {
          if (gameNights[i].date === currentGameNight.date) {
            alert('This game night already exists');
            return;
          }
        }
        gameNights.push(currentGameNight);
        localStorage.setItem('gameNights', JSON.stringify(gameNights));
        alert('New game night added')
    }

    // Add the game night to the DOM
    gameNightList.innerHTML += 
          `
            <div class="container"> 
              <a href="#" class="list-group-item list-group-item-action py-3 lh-sm gameNight" aria-current="true" data-date=${currentGameNight.date}>
              <div class="row justify-content-between"> 
                <div class="col fs-4 mb-1" data-date=${currentGameNight.date}>${currentGameNight.date}</div>
                <button class="col-3 col-md-6 btn btn-outline-danger removeGameNightButton">Remove</button>
              </div>
              </a>
            </div>
          `;
  }

})

gameNightList.addEventListener('click', (e) => {
  // Check if remove button is clicked. If not, check if the date itself has been clicked
  if (e.target.classList.contains('removeGameNightButton')){
    if (confirm('Are you sure you want to delete this game night?')) {
      let currentDate = e.target.previousSibling.previousSibling.innerHTML;

      // Check if this is the current active game night. Set a new one if it is
      let active = e.target;
      while (!active.classList.contains('gameNight')){
        active = active.parentNode;
      }
      if (active.classList.contains('active')) {
        let newActive = document.querySelectorAll('.gameNight');
        if (newActive) {
          newActive = newActive[0];
          newActive.classList.add('active');
          newActive.classList.add('bg-dark');
          newActive.setAttribute('id', 'currentActive');
          let currentGameNightTitle = document.querySelector('#currentGameNightTitle');
          currentGameNightTitle.innerHTML = newActive.dataset.date;
          newActive = newActive.firstChild.nextSibling.firstChild.nextSibling;
          newActive.setAttribute('id', 'currentGameNight');

          displayGameNight()
        }
      }

      let gameNights = JSON.parse(localStorage.getItem('gameNights'));
      for (let i = 0; i < gameNights.length; i++) {
        if (currentDate === gameNights[i].date) {
          gameNights.splice(i, 1);

          // Re set ls
          localStorage.setItem('gameNights', JSON.stringify(gameNights));
          alert('Game night successfully removed');

          // Remove item from DOM
          e.target.parentNode.parentNode.parentNode.remove()
          
          return;
        }
      }
    }
  } else if (e.target.classList.contains('gameNight') || e.target.parentNode.parentNode.classList.contains('gameNight')) {
      if (!e.target.classList.contains('active') && !e.target.parentNode.parentNode.classList.contains('active')) {
        // Remove previously active item
        previousActive = document.querySelector('#currentActive');
        previousActive.classList.remove('active');
        previousActive.classList.remove('bg-dark');
        previousActive.removeAttribute('id');
        previousActive = previousActive.firstChild.nextSibling.firstChild.nextSibling;
        previousActive.removeAttribute('id');

        // Add active to current item
        let targetGameNight = e.target;
        while (targetGameNight.nodeName != 'A' && targetGameNight != null) {
          targetGameNight = targetGameNight.parentNode;
        }

        targetGameNight.classList.add('active');
        targetGameNight.classList.add('bg-dark');
        targetGameNight.setAttribute('id', 'currentActive');
        let currentGameNightTitle = document.querySelector('#currentGameNightTitle');
        currentGameNightTitle.innerHTML = targetGameNight.dataset.date;
        targetGameNight = targetGameNight.firstChild.nextSibling.firstChild.nextSibling;
        targetGameNight.setAttribute('id', 'currentGameNight');

        displayGameNight()
      }
  }
});

gamesContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('removeGameButton')) {
    if (confirm('Are you sure you want to remove this game?')) {
      currentGameId = e.target.dataset.id;

      let currentGameNightTitle = document.querySelector('#currentGameNightTitle');
      let gameNights = JSON.parse(localStorage.getItem('gameNights'));
      let currentGameNight;

      // Find the current game night from ls
      for (let i = 0; i < gameNights.length; i++) {
        if (gameNights[i].date === currentGameNightTitle.innerHTML) {
          for (let j = 0; j < gameNights[i].games.length; j++) {
              if (gameNights[i].games[j] === currentGameId) {
                gameNights[i].games.splice(j, 1)
                
                // Re set ls
                localStorage.setItem('gameNights', JSON.stringify(gameNights));
                alert('Game successfully removed from game night');

                // Remove item from DOM
                e.target.parentNode.parentNode.remove()
          
                return;
              }
          }
        }
      }
    }
  }
});

function populateGameSelectMenu() {
  if(localStorage.getItem('gameIds') != null){
    const gameSelectMenu = document.querySelector('#currentGameNightSelect');
    gameIds = JSON.parse(localStorage.getItem('gameIds'));
    const url = `https://api.boardgameatlas.com/api/search?order_by=rank&ascending=false&client_id=nGfOSls389&ids=${gameIds}`

    fetch(url)
    .then((response) => response.json())
    .then((data) => {
    data.games.forEach((game) => {
      gameSelectMenu.innerHTML += `<option value="${game.id}">${game.name}</option>`;
      })
    })
    .catch(console.error);
  } 
}

function displayGameNight() {
  let currentGameNightTitle = document.querySelector('#currentGameNightTitle');
  let gameNights = JSON.parse(localStorage.getItem('gameNights'));
  let currentGameNight;

  // Clear current game container contents
  gamesContainer.innerHTML = ``;

  // Find the current game night from ls
  for (let i = 0; i < gameNights.length; i++) {
    if (gameNights[i].date === currentGameNightTitle.innerHTML) {
      currentGameNight = gameNights[i];
      break;
    }
  }

  // Add each game from the current game night to the DOM
  if (currentGameNight.games.length != 0) {
    const url = `https://api.boardgameatlas.com/api/search?order_by=rank&ascending=false&client_id=nGfOSls389&ids=${currentGameNight.games}`

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
}