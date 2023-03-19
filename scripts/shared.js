const fetchGames = async(filter) => {
  const url = `http://localhost:8080/api`;
  const fields = ["thumb_url", "description", "name", "id"];
  try {
    const response = await fetch(url, {
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        filter: filter,
        fields: fields
      }),
      method: "POST"
    })
    const data = await response.json();
    return data.games;
  } catch (e) {
    console.log(e)
  }
}

function displayGame(container, data, type) {
  if (type == 'add') {
    gamesContainer.innerHTML += 
      `
        <div class="col col-sm-12 col-md-6 col-lg-4 col-xl-3 card gameCard">
          <h2 class="game-title">${data.name}</h2>
          <img src="${data.thumb_url}" class="my-auto gameImgTop" alt="${data.description}">
          <button type="button" class="btn btn-success mx-auto addGameButton" data-id="${data.id}">Add Game</button>
        </div>
      `;
  } else if (type == 'remove') {
    container.innerHTML += 
    `
    <div class="col col-sm-12 col-md-6 col-lg-4 col-xl-3 card gameCard">
      <h2 class="game-title">${data.name}</h2>
      <img src="${data.thumb_url}" class="my-auto gameImgTop" alt="${data.description}">
      <button type="button" class="btn btn-danger mx-auto removeGameButton" data-id="${data.id}">Remove Game</button>
    </div>
    `;
  }
}

export { fetchGames, displayGame };