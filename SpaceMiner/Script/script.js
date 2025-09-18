const game = {
    sc: new Decimal(0), // Space-Crystals
    scPerSecond: new Decimal(0), // Space-Crystals per second
    scPerClick: new Decimal(1), // Space-Crystals per click
    miner: new Decimal(0), // Number of miners
    minerCost: new Decimal(20), // Cost of hiring a miner
};

function updateSmall() {
    const scElement = document.getElementById("sc");
    if (scElement) {
        scElement.textContent = game.sc.toFixed(0); // Update Space-Crystals
    }

    const scPerSecondElement = document.getElementById("scPerSecond");
    if (scPerSecondElement) {
        scPerSecondElement.textContent = game.scPerSecond.toFixed(0); // Update SC per second
    }

    const scPerClickElement = document.getElementById("scPerClick");
    if (scPerClickElement) {
        scPerClickElement.textContent = game.scPerClick.toFixed(0); // Update SC per click
    }

    const minerElement = document.getElementById("minerCost");
    if (minerElement) {
        minerElement.textContent = game.minerCost.toFixed(0); // Update miner cost
    }

    updateMinerButton();
}

function updatePerSecond() { // Function to update Space-Crystals per second
    game.scPerSecond = game.miner; // Calculate SC/s from miners
    game.sc = game.sc.add(game.scPerSecond.div(10));
    updateSmall();
}

setInterval(updatePerSecond, 100); // Call this function every 100ms

function format(value, decimals) { // Format function for displaying numbers
    return value.toFixed(decimals);
}

updateSmall(); // Call updateSmall immediately after initializing the game

function save() {
  game.lastSave = Date.now();

  const gameToSave = {
    ...game,
    sc: game.sc.toString(),
    scPerSecond: game.scPerSecond.toString(),
    scPerClick: game.scPerClick.toString(),
    miner: game.miner.toString(),
    minerCost: game.minerCost.toString(),
  };

  try {
    localStorage.setItem("SpaceSave", JSON.stringify(gameToSave));
    localStorage.setItem("SpaceLastSaved", game.lastSave);
    console.log("Game saved successfully!");
  } catch (error) {
    console.error("Failed to save game:", error);
  }
}

function setAutoSave() { // Function to enable autosave
  const autosaveInterval = 500; // Autosave every 0.5 seconds
  setInterval(save, autosaveInterval);
}

setAutoSave(); // Call setAutoSave during game initialization

function load() {
  const savedGame = localStorage.getItem("SpaceSave");
  if (savedGame) {
    try {
      const parsedGame = JSON.parse(savedGame);

      game.sc = new Decimal(parsedGame.sc);
      game.scPerSecond = new Decimal(parsedGame.scPerSecond);
      game.scPerClick = new Decimal(parsedGame.scPerClick);
      game.miner = new Decimal(parsedGame.miner);
      game.minerCost = new Decimal(parsedGame.minerCost);

      console.log("Game loaded successfully!");
    } catch (error) {
      console.error("Failed to load game:", error);
    }
  } else {
    console.log("No saved game found.");
  }
}

load(); // Call load during game initialization

function reset() {
    game.sc = new Decimal(0);
    game.scPerSecond = new Decimal(0);
    game.scPerClick = new Decimal(1);
    game.miner = new Decimal(0);
    game.minerCost = new Decimal(20);

    updateSmall(); // Refresh the display after resetting
}
