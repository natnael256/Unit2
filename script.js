const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");
const playerDetailsContainer = document.getElementById(
  "player-details-container"
);

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2302-acc-pt-web-pt-b";
// Use the APIURL variable for fetch requests
const APIURL =
  "https://fsa-puppy-bowl.herokuapp.com/api/2302-ACC-PT-WEB-PT-B/players";

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(APIURL);
    const result = await response.json();
    console.log("Fetched players:", result);
    console.log(result.data.player);
    return result.data.players;
  } catch (err) {
    console.error("trouble fetching players!");
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}/${playerId}`);
    const resultSingleplay = await response.json();
    console.log(resultSingleplay.data.player);
    return resultSingleplay.data.player;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

const addNewPlayer = async (newPlayer) => {
  try {
    const response = await fetch(APIURL + "players", {
      method: "POST",
    });
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error("Something went wrong with adding that player!", err);
  }
};

const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}/${playerId}`, {
      method: "DELETE",
    });
    const jsonResponse = await response.json();
    console.log(jsonResponse);
  } catch (err) {
    console.error(`Trouble removing player #${playerId} from the roster!`, err);
  }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    const form = document.createElement("form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = event.target.elements.name.value;
      const position = event.target.elements.position.value;
      const imageUrl = event.target.elements.imageUrl.value;

      const newPlayer = {
        name,
        position,
        imageUrl,
      };

      await addNewPlayer(newPlayer);
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
      form.reset();
    });

    form.innerHTML = `
    <h2>Add New Player</h2>
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
    <label for="position">Position:</label>
    <input type="text" id="position" name="position" required>
    <label for="imageUrl">Image URL:</label>
    <input type="text" id="imageUrl" name="imageUrl" required>
    <button type="submit">Add Player</button>
  `;

    newPlayerFormContainer.appendChild(form);
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
  playerContainer.innerHTML = "";
  playerList.forEach((player) => {
    const playerElement = document.createElement("div");
    playerElement.classList.add("player");
    playerElement.innerHTML = `
      <h2>${player.name}</h2>
      <p>Breed: ${player.breed}</p>
      <p>Status: ${player.status}</p>
      <img src="${player.imageUrl}" alt="">
      <button class="see-details" data-player-id="${player.id}">See details</button>
      <button class="remove-player" data-player-id="${player.id}">Remove from roster</button>
    `;

    // Append the player element to the player container
    playerContainer.appendChild(playerElement);

    const detailsButton = playerElement.querySelector(".see-details");
    detailsButton.addEventListener("click", async (event) => {
      const playerId = event.target.dataset.playerId;
      const player = await fetchSinglePlayer(playerId);
      showPlayerDetails(player);
    });

    const removeButton = playerElement.querySelector(".remove-player");
    removeButton.addEventListener("click", async (event) => {
      const playerId = event.target.dataset.playerId;
      await removePlayer(playerId);
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
    });
  });
};

const showPlayerDetails = (player) => {
  playerDetailsContainer.innerHTML = `
    <div class="player-details">
      <h2>${player.name}</h2>
      <p>Breed: ${player.breed}</p>
      <p>Status: ${player.status}</p>
      <img src="${player.imageUrl}" alt="">
      <button class="close-button">Close</button>
    </div>
  `;

  const closeButton = playerDetailsContainer.querySelector(".close-button");
  closeButton.addEventListener("click", () => {
    playerDetailsContainer.innerHTML = "";
    // Go back to the first page by reloading
    window.location.reload();
  });

  playerDetailsContainer.classList.add("active");
};
//calling the init function

const init = async () => {
  try {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    renderNewPlayerForm();
  } catch (err) {
    console.error("Something went wrong during initialization!", err);
  }
};

init();
