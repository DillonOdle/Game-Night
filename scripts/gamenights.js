 import { fetchGames, displayGame } from './shared.js';

// These need to be declared globally for the event listeners to work
const dateInput = document.querySelector('#dateInput');
const gameNightList = document.querySelector('#gameNightList');
const currentGameNightSelect = document.querySelector('#currentGameNightSelect');
const gamesContainer = document.getElementById('gamesContainer');

// Display the game nights list and the current game night when the page loads
window.addEventListener('DOMContentLoaded', (e) => {
  let gameNights = JSON.parse(localStorage.getItem('gameNights')); 

  // Show list of game nights
  for (let i = 0; i < gameNights.length; i++) {
      if (i === 0) {
        addToGameNightList(gameNights[i].date, true);
      } else {
        addToGameNightList(gameNights[i].date, false);
      }
  }
  populateGameSelectMenu();
  displayGameNight();
});

// Listen for user input to add a game to a game night
currentGameNightSelect.addEventListener('change', (e) => {
  let targetGame = e.target.value;
  if (gameIsInGameNight(targetGame)) {
    alert('Game is already included in this game night');
    return
  } 
  addGameToGameNight(targetGame);
  displayGameNight();
});

// Listen for user input to add a new game night
dateInput.addEventListener('change', (e) => {
  if (confirm ('Are you sure you want to add this date?')) {
    const currentGameNight = {
      date: dateInput.value,
      games: []
    };

    if (gameNightInGameNights(currentGameNight)) {
        alert('This game night already exists');
        return;
    } else {
      addGameNight(currentGameNight)
    }
  }
})

gameNightList.addEventListener('click', (e) => {
  // Check if remove button is clicked. If not, check if the date itself has been clicked
  if (e.target.classList.contains('removeGameNightButton')){
    if (confirm('Are you sure you want to delete this game night?')) {
      if (currentGameNightIsActive(e.target)) {
        setFirstGameNightAsActive();
      }
      removeGameNight(e.target);
    }
  } else if (e.target.classList.contains('gameNight') || e.target.parentNode.parentNode.classList.contains('gameNight')) {
      if (!e.target.classList.contains('active') && !e.target.parentNode.parentNode.classList.contains('active')) {
        changeActiveGameNight(e.target);
      }
  }
});

gamesContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('removeGameButton')) {
    if (confirm('Are you sure you want to remove this game?')) {
      
      removeGameFromGameNight(e.target);
    }
  }
});

async function populateGameSelectMenu() {
  if(localStorage.getItem('gameIds') != null){
    const gameSelectMenu = document.querySelector('#currentGameNightSelect');
    let gameIds = JSON.parse(localStorage.getItem('gameIds'));
    const filter = {ids: gameIds};

    const games = await fetchGames(filter);
    games.forEach((game) => {
      gameSelectMenu.innerHTML += `<option value="${game.id}">${game.name}</option>`;
    });
  } 
}

async function displayGameNight() {
  setCurrentGameNightTitle();

  // Clear current game container contents
  gamesContainer.innerHTML = ``;

  let currentGameNight = getCurrentGameNightFromLS();
  // Add each game from the current game night to the DOM
  if (currentGameNight.games.length != 0) {  
    const filter = {ids: currentGameNight.games};    
    const games = await fetchGames(filter);  
    games.forEach((game) => {
      displayGame(gamesContainer, game, 'remove');
    })
  }
}

function gameIsInGameNight(targetGame) {
  const currentGameNight = document.querySelector('#currentGameNight').innerHTML;
  let gameNights = JSON.parse(localStorage.getItem('gameNights'));
  for (let i = 0; i < gameNights.length; i++) {
    if (gameNights[i].date === currentGameNight) {
      for (let j = 0; j < gameNights[i].games.length; j++) {
        if (gameNights[i].games[j] == targetGame) {
          return true;
        }
      }
    }
  }
  return false;
}

function addGameToGameNight(targetGame){
  const currentGameNight = document.querySelector('#currentGameNight').innerHTML;
  let gameNights = JSON.parse(localStorage.getItem('gameNights'));
  for (let i = 0; i < gameNights.length; i++) {
    if (gameNights[i].date === currentGameNight) {
        gameNights[i].games.push(targetGame);
        localStorage.setItem('gameNights', JSON.stringify(gameNights));
        alert(`Your game has been added to the current game night`);
    }
  }
}

function getGameNights(){
  if(localStorage.getItem('gameNights') === null) {
      return [];
  } else {
    return JSON.parse(localStorage.getItem('gameNights'));
  }
}

function gameNightInGameNights(gameNight) {
  let gameNights = getGameNights();
  for (let i = 0; i < gameNights.length; i++) {
    if (gameNights[i].date === gameNight.date) {
      return true;
    }
  }
  return false;
}

function addToGameNightList(date, isActive){
  if (isActive){
    gameNightList.innerHTML += 
    `
      <div class="container"> 
        <a href="#" class="list-group-item list-group-item-action py-3 lh-sm gameNight active bg-dark" aria-current="true" id="currentActive" data-date=${date}>
        <div class="row justify-content-between"> 
          <div class="col-sm-12 col-md-9 col-lg-8 fs-4 mb-1" id="currentGameNight" data-date=${date}>${date}</div>
          <button class="col-sm-12 col-md-3 col-lg-4 btn btn-danger removeGameNightButton">Remove</button>
        </div>
        </a>
      </div>
    `;
  } else {
    gameNightList.innerHTML +=
    `
      <div class="container"> 
        <a href="#" class="list-group-item list-group-item-action py-3 lh-sm gameNight" aria-current="true" data-date=${date}>
        <div class="row justify-content-between"> 
          <div class="col-sm-12 col-md-9 col-lg-8 fs-4 mb-1" data-date=${date}>${date}</div>
          <button class="col-sm-12 col-md-3 col-lg-4 btn btn-danger removeGameNightButton">Remove</button>
        </div>
        </a>
      </div>
    `;
  }
}

function addGameNight(gameNight) {
  let gameNights = getGameNights();
  // Add to LS
  gameNights.push(gameNight);
  localStorage.setItem('gameNights', JSON.stringify(gameNights));

  // Add to DOM
  const gameNightList = document.querySelector('#gameNightList');
  gameNightList.innerHTML += 
      `
        <div class="container"> 
          <a href="#" class="list-group-item list-group-item-action py-3 lh-sm gameNight" aria-current="true" data-date=${gameNight.date}>
          <div class="row justify-content-between"> 
            <div class="col-sm-12 col-md-9 col-lg-8 fs-4 mb-1" data-date=${gameNight.date}>${gameNight.date}</div>
            <button class="col-sm-12 col-md-3 col-lg-4 btn btn-danger removeGameNightButton">Remove</button>
          </div>
          </a>
        </div>
      `;

  alert('New game night added')
}

function setCurrentGameNightTitle() {
  let currentGameNightTitle = document.querySelector('#currentGameNightTitle');
  const currentGameNightContent = document.querySelector('#currentGameNight').innerHTML;
  currentGameNightTitle.innerHTML = `${currentGameNightContent}`;
}

function getCurrentGameNightFromLS() {
  let gameNights = JSON.parse(localStorage.getItem('gameNights'));

    // Find the current game night from ls
  for (let i = 0; i < gameNights.length; i++) {
    if (gameNights[i].date === currentGameNightTitle.innerHTML) {
      return gameNights[i];
    }
  }
}

function currentGameNightIsActive(target) {
  while (!target.classList.contains('gameNight')){
    target = target.parentNode;
  }
  if (target.classList.contains('active')) {
    return true;
  } else {
    return false;
  }
}

function setFirstGameNightAsActive() {
  let newActive = document.querySelectorAll('.gameNight')[0];
  newActive.classList.add('active');
  newActive.classList.add('bg-dark');
  newActive.setAttribute('id', 'currentActive');
  let currentGameNightTitle = document.querySelector('#currentGameNightTitle');
  currentGameNightTitle.innerHTML = newActive.dataset.date;
  newActive = newActive.firstChild.nextSibling.firstChild.nextSibling;
  newActive.setAttribute('id', 'currentGameNight');

  displayGameNight()
}

function removeGameNight(target) {
  let currentDate = target.previousSibling.previousSibling.innerHTML;
  let gameNights = JSON.parse(localStorage.getItem('gameNights'));
  for (let i = 0; i < gameNights.length; i++) {
    if (currentDate === gameNights[i].date) {
      gameNights.splice(i, 1);

      // Re set ls
      localStorage.setItem('gameNights', JSON.stringify(gameNights));
      alert('Game night successfully removed');

      // Remove item from DOM
      target.parentNode.parentNode.parentNode.remove()
    
      return;
    }
  }
}

function changeActiveGameNight(target) {
  // Remove previously active item
  let previousActive = document.querySelector('#currentActive');
  previousActive.classList.remove('active');
  previousActive.classList.remove('bg-dark');
  previousActive.removeAttribute('id');
  previousActive = previousActive.firstChild.nextSibling.firstChild.nextSibling;
  previousActive.removeAttribute('id');

  // Add active to current item
  while (target.nodeName != 'A' && target != null) {
    target = target.parentNode;
  }

  target.classList.add('active');
  target.classList.add('bg-dark');
  target.setAttribute('id', 'currentActive');
  let currentGameNightTitle = document.querySelector('#currentGameNightTitle');
  currentGameNightTitle.innerHTML = target.dataset.date;
  target = target.firstChild.nextSibling.firstChild.nextSibling;
  target.setAttribute('id', 'currentGameNight');

  displayGameNight()
}

function removeGameFromGameNight(target) {
  const currentGameId = target.dataset.id;
  let currentGameNightTitle = document.querySelector('#currentGameNightTitle');
  let gameNights = JSON.parse(localStorage.getItem('gameNights'));

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
            target.parentNode.remove()
      
            return;
          }
      }
    }
  }
}