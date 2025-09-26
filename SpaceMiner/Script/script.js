const game = {

    unlocks: 0,
    lastUpdate: Date.now(),
    lastSave: 0,
    timePlayed: 0,
    currentTab: 0,

    sc: new Decimal(0), // Space-Crystals
    scPerSecond: new Decimal(0), // Space-Crystals per second
    scPerClick: new Decimal(1), // Space-Crystals per click
    miner: new Decimal(0), // Number of miners
    minerCost: new Decimal(20), // Cost of hiring a miner
    generatorUnlocked: false, // Track if the generator is unlocked

    energy: new Decimal(0),
    energyPerSecond: new Decimal(1),
    //I still need to condense these into an array *cries*
    energyGoldMultiplier: new Decimal(1),
    energyAutoMaxAll: true,
    energyUpgrade1Bought: new Decimal(0),
    energyUpgrade1Cost: new Decimal(50),
    energyUpgrade2Bought: new Decimal(0),
    energyUpgrade2Cost: new Decimal(100),
    energyUpgrade3Bought: new Decimal(0),
    energyUpgrade3Cost: new Decimal(100),
    energyUpgrade4Bought: new Decimal(0),
    energyUpgrade4Cost: new Decimal(500),
    energyUpgrade5Bought: new Decimal(0),
    energyUpgrade5Cost: new Decimal(500),
    energyUpgrade6Bought: new Decimal(0),
    energyUpgrade6Cost: new Decimal(2e7),
    dragonStage: 1,
};

const BMamountCanBuy = Decimal.affordGeometricSeries(
    game.sc,
    new Decimal(20), // Starting cost of a miner
    new Decimal(1.1),
    game.miner
);

const BMCost = Decimal.sumGeometricSeries(
    BMamountCanBuy,
    new Decimal(20), // Starting cost of a miner
    new Decimal(1.1),
    game.miner
);

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

function updateMinerButton() {
    const buyMinerButton = document.getElementById("buyMinerButton");
    if (buyMinerButton) {
        buyMinerButton.disabled = !game.sc.gte(game.minerCost); // Enable if SC >= miner cost
    }
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

function changeTab(tabIndex) {
    const settingsTab = document.getElementById('settingsTab');
    const resourcesTab = document.getElementById('resourcesTab');

    if (tabIndex === 1) {
        // Show the Settings Tab and hide the Resources Tab
        if (settingsTab) settingsTab.style.display = 'block';
        if (resourcesTab) resourcesTab.style.display = 'none';
    } else if (tabIndex === 2) {
        // Show the Resources Tab and hide the Settings Tab
        if (resourcesTab) resourcesTab.style.display = 'block';
        if (settingsTab) settingsTab.style.display = 'none';
    } else if (tabIndex === 0) {
        // Close both tabs
        if (settingsTab) settingsTab.style.display = 'none';
        if (resourcesTab) resourcesTab.style.display = 'none';
    }
}

window.changeTab = changeTab;

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

    localStorage.removeItem("SpaceSave");
    console.log("Saved data cleared.");

    updateSmall(); // Refresh the display after resetting
}

function hardReset() { //If the user confirms the hard reset, resets all variables, saves and refreshes the page
  if (confirm("Are you sure you want to reset?")) {
    reset()
    save()
    location.reload()
  }
}

function addUnlock(id, condition) {
    console.log(`addUnlock called with ID: ${id}, Condition: ${condition}`);
    const element = document.getElementById(id);
    if (element) {
        element.style.display = condition ? 'block' : 'none';
    } else {
        console.error(`Element with ID '${id}' not found.`);
    }
}