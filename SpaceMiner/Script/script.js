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

    energyUpgrades: [
        { id: 1, bought: new Decimal(0), cost: new Decimal(50)}, // Upgrade 1
        { id: 2, bought: new Decimal(0), cost: new Decimal(100)}, // Upgrade 2
        { id: 3, bought: new Decimal(0), cost: new Decimal(100)}, // Upgrade 3
        { id: 4, bought: new Decimal(0), cost: new Decimal(500)}, // Upgrade 4
        { id: 5, bought: new Decimal(0), cost: new Decimal(500)}, // Upgrade 5
        { id: 6, bought: new Decimal(0), cost: new Decimal(2e7)}, // Upgrade 6
    ],
    energy: new Decimal(0),
    energyPerSecond: new Decimal(1),

    generatorUnlocked: false,
    generatorStage: 1,
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
        scElement.textContent = format(game.sc); // Display Space-Crystals in scientific notation
    }

    const scPerSecondElement = document.getElementById("scPerSecond");
    if (scPerSecondElement) {
        scPerSecondElement.textContent = format(game.scPerSecond); // Display SC per second in scientific notation
    }

    const scPerClickElement = document.getElementById("scPerClick");
    if (scPerClickElement) {
        scPerClickElement.textContent = format(game.scPerClick); // Display SC per click in scientific notation
    }

    const minerElement = document.getElementById("minerCost");
    if (minerElement) {
        minerElement.textContent = format(game.minerCost); // Display miner cost in scientific notation
    }

    // Check and restore the visibility of the Generator Tab
    const generatorTab = document.getElementById('generator');
    const unlockButton = document.getElementById('unlockGeneratorButton');

    if (localStorage.getItem('generatorUnlocked') === 'true') {
        if (generatorTab) generatorTab.style.display = 'block'; // Show the Generator Tab
        if (unlockButton) unlockButton.style.display = 'none'; // Hide the "Repair Generator" button
    }

    // Check and restore the visibility of the Energy Tab
    const energyTab = document.getElementById('energyTab');
    const energyUpgradeButton = document.getElementById('buyEnergyUpgradesButton');
    if (localStorage.getItem('energyTabUnlocked') === 'true') {
        if (energyTab) energyTab.style.display = 'block'; // Show the Energy Tab
    }

    // Check and restore the visibility of the "Buy Energy Upgrades" button
    if (localStorage.getItem('buyEnergyUpgradesHidden') === 'true') {
        if (energyUpgradeButton) energyUpgradeButton.style.display = 'none'; // Hide the button
    }

    // Update energy and energyPerSecond in the UI
    const energyElement = document.getElementById("energy");
    const energyPerSecondElement = document.getElementById("energyPerSecond");
    if (energyElement) {
        energyElement.textContent = format(game.energy); // Display energy in scientific notation
    }
    if (energyPerSecondElement) {
        energyPerSecondElement.textContent = format(game.energyPerSecond); // Display energy per second in scientific notation
    }
    
    updateEnergyUpgradeCosts();

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
    game.energy = game.energy.add(game.energyPerSecond.div(10));
    updateSmall();
}

function updateEnergyUpgradeCosts() {
  game.energyUpgrades.forEach(upgrade => {
      const costElement = document.getElementById(`energyUpgrade${upgrade.id}Cost`);
      if (costElement) {
          costElement.textContent = format(upgrade.cost); // Display cost as a whole number
      }
  });
}

setInterval(updatePerSecond, 100); // Call this function every 100ms

function format(value) {
    const num = new Decimal(value);

    if (num.gte(1e6)) {
        // Use scientific notation for numbers greater than or equal to 1e6
        const parts = num.toExponential(2).split("e"); // Split into base and exponent
        const base = parts[0]; // The base (e.g., "1.23")
        const exponent = parts[1].replace("+", ""); // Remove the "+" sign from the exponent
        return `${base}e${exponent}`; // Combine base and exponent
    } 
    
    else {
        // Display as whole numbers for smaller values
        return num.toFixed(0); // No decimals
    }
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

    energy: game.energy.toString(),
    energyPerSecond: game.energyPerSecond.toString(),
    energyUpgrades: game.energyUpgrades.map(upgrade => ({
        id: upgrade.id,
        bought: upgrade.bought.toString(),
        cost: upgrade.cost.toString(),
    })),
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

      game.energy = new Decimal(parsedGame.energy);
      game.energyPerSecond = new Decimal(parsedGame.energyPerSecond);

      game.energyUpgrades = parsedGame.energyUpgrades
          ? parsedGame.energyUpgrades.map(upgrade => ({
              id: upgrade.id,
              bought: new Decimal(upgrade.bought),
              cost: new Decimal(upgrade.cost),
          }))
          : [
              { id: 1, bought: new Decimal(0), cost: new Decimal(50) },
              { id: 2, bought: new Decimal(0), cost: new Decimal(100) },
              { id: 3, bought: new Decimal(0), cost: new Decimal(100) },
              { id: 4, bought: new Decimal(0), cost: new Decimal(500) },
              { id: 5, bought: new Decimal(0), cost: new Decimal(500) },
              { id: 6, bought: new Decimal(0), cost: new Decimal(2e7) },
          ];

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