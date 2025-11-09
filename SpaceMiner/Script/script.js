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
    energySCmultiplier: new Decimal(1),

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
    // Update Space-Crystals (SC) display
    const scElement = document.getElementById("sc");
    if (scElement) {
        scElement.textContent = format(game.sc); // Display Space-Crystals in scientific notation
    }

    // Update SC per second display
    const scPerSecondElement = document.getElementById("scPerSecond");
    if (scPerSecondElement) {
        scPerSecondElement.textContent = format(game.scPerSecond); // Display SC per second in scientific notation
    }

    // Update SC per click display
    const scPerClickElement = document.getElementById("scPerClick");
    if (scPerClickElement) {
        scPerClickElement.textContent = format(game.scPerClick); // Display SC per click in scientific notation
    }

    // Update miner cost display
    const minerElement = document.getElementById("minerCost");
    if (minerElement) {
        minerElement.textContent = format(game.minerCost); // Display miner cost in scientific notation
    }

    // Update energy and energy per second display
    const energyElement = document.getElementById("energy");
    const energyPerSecondElement = document.getElementById("energyPerSecond");
    if (energyElement) {
        energyElement.textContent = format(game.energy); // Display energy in scientific notation
    }
    if (energyPerSecondElement) {
        energyPerSecondElement.textContent = format(game.energyPerSecond); // Display energy per second in scientific notation
    }

    // Update energy upgrade costs
    updateEnergyUpgradeCosts();

    // Update miner button state
    updateMinerButton();

    // Call calculateEnergySCMultiplier
    if (typeof calculateEnergySCMultiplier === "function") {
        calculateEnergySCMultiplier();
    } else {
        console.error("calculateEnergySCMultiplier is not defined");
    }

    // Unlock the Generator Tab if the generator is unlocked
    addUnlock('generator', game.generatorUnlocked);

    // Unlock the Spaceship Tab only if the spaceship is repaired
    addUnlock('spaceshipTab', game.spaceshipRepaired);

    // Unlock the Space Tab only if space is unlocked
    addUnlock('spaceTab', game.spaceUnlocked);

    // Unlock the Energy Tab only if explicitly unlocked
    const energyTabUnlocked = localStorage.getItem('energyTabUnlocked') === 'true';
    addUnlock('energyTab', energyTabUnlocked);

    // Update the visibility of the unlock energy upgrades button
    const buyEnergyUpgradesButton = document.getElementById("buyEnergyUpgradesButton");
    if (buyEnergyUpgradesButton) {
        buyEnergyUpgradesButton.style.display = game.energyUpgradesUnlocked ? "none" : "block";
    }

    // Update the visibility of the repair ship button
    const repairShipButton = document.getElementById("repairShipButton");
    if (repairShipButton) {
        repairShipButton.style.display = game.spaceshipRepaired ? "none" : "block";
    }

    // Update the visibility of the unlock space button
    const unlockSpaceButton = document.getElementById("unlockSpaceButton");
    if (unlockSpaceButton) {
        unlockSpaceButton.style.display = game.spaceUnlocked ? "none" : "block";
    }

    // Update the visibility of the repair generator button
    const repairGeneratorButton = document.getElementById("repairGeneratorButton");
    if (repairGeneratorButton) {
        repairGeneratorButton.style.display = game.generatorUnlocked ? "none" : "block";
    }
}

function updateMinerButton() {
    const buyMinerButton = document.getElementById("buyMinerButton");
    if (buyMinerButton) {
        buyMinerButton.disabled = !game.sc.gte(game.minerCost); // Enable if SC >= miner cost
    }
}

function updatePerSecond() {
    console.log("Before updatePerSecond:", game.energy, "Type:", typeof game.energy);

    game.scPerSecond = game.miner; // Calculate SC/s from miners
    game.sc = game.sc.add(game.scPerSecond.div(10)); // Increment Space-Crystals
    game.energy = game.energy.add(game.energyPerSecond.div(10));

    // Only increment energy if the Generator Tab is unlocked
    const generatorUnlocked = localStorage.getItem('generatorUnlocked') === 'true';
    if (generatorUnlocked) {
        game.energy = game.energy.add(game.energyPerSecond.div(10)); // Increment energy
    }

    console.log("After updatePerSecond:", game.energy, "Type:", typeof game.energy);

    updateSmall(); // Update the UI
}

function updateEnergyUpgradeCosts() {
    game.energyUpgrades.forEach(upgrade => {
        const costElement = document.getElementById(`energyUpgrade${upgrade.id}Cost`);
        if (costElement) {
            costElement.textContent = format(upgrade.cost); // Display cost as a whole number
        }
    });
}

function calculateEnergySCMultiplier() {
    console.log("Before calculation:", game.energy, "Type:", typeof game.energy);

    // Ensure game.energy is a Decimal
    if (!(game.energy instanceof Decimal)) {
        console.error("game.energy is not a Decimal. Converting it now.");
        game.energy = new Decimal(game.energy || 0);
    }

    // Calculate the Energy-Space Crystal Multiplier
    game.energySCMultiplier = game.energy
        .div(10)
        .add(1)
        .log10()
        .mul(2)
        .add(1)
        .mul(new Decimal(1.25).pow(game.energyUpgrades[2].bought.pow(0.8)));

    console.log("After calculation:", game.energySCMultiplier, "Type:", typeof game.energySCMultiplier);

    // Update the multiplier display
    const multiplierElement = document.getElementById("energySCMultiplier");
    if (multiplierElement) {
        multiplierElement.textContent = format(game.energySCMultiplier, 2);
    }
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

game.energyPerSecond = game.energyPerSecond.add(1).max(0); // Add energy per second and ensure energy does not go below 0

function setAutoSave() {
    const autosaveInterval = 500; // Autosave every 0.5 seconds
    setInterval(save, autosaveInterval);

    // Log "Game saved successfully!" every 60 seconds
    const logSaveInterval = 60000; // 60 seconds
    setInterval(() => {
        console.log(
            `%cGame saved successfully at ${new Date(game.lastSave).toLocaleTimeString()}`,
            'color: green; font-weight: bold;'
        );
    }, logSaveInterval);
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

function save() {
    game.lastSave = Date.now();

    const gameToSave = {
        ...game,
        sc: game.sc.toString(), // Save Space-Crystals
        scPerSecond: game.scPerSecond.toString(), // Save SC per second
        scPerClick: game.scPerClick.toString(), // Save SC per click
        miner: game.miner.toString(), // Save miner count
        minerCost: game.minerCost.toString(), // Save miner cost
        energy: game.energy.toString(), // Save energy
        energyPerSecond: game.energyPerSecond.toString(), // Save energy per second
        energyUpgrades: game.energyUpgrades.map(upgrade => ({
            id: upgrade.id,
            bought: upgrade.bought.toString(),
            cost: upgrade.cost.toString(),
        })), // Save energy upgrades
        generatorUnlocked: game.generatorUnlocked, // Save generator unlock status
        spaceshipRepaired: game.spaceshipRepaired, // Save spaceship repair status
        spaceUnlocked: game.spaceUnlocked, // Save Space Tab unlock status
        energyUpgradesUnlocked: game.energyUpgradesUnlocked || false, // Save energy upgrades unlock status
    };

    try {
        // Save the game state to localStorage
        localStorage.setItem("SpaceSave", JSON.stringify(gameToSave));
        localStorage.setItem("SpaceLastSaved", game.lastSave);

        // Save the visibility of specific buttons
        const buttons = [
            { id: 'buyEnergyUpgradesButton', key: 'buyEnergyUpgradesButtonVisible' },
            { id: 'repairGeneratorButton', key: 'repairGeneratorButtonVisible' },
            { id: 'repairShipButton', key: 'repairShipButtonVisible' },
            { id: 'unlockSpaceButton', key: 'unlockSpaceButtonVisible' },
        ];

        buttons.forEach(button => {
            const element = document.getElementById(button.id);
            if (element) {
                localStorage.setItem(button.key, element.style.display !== 'none');
            }
        });

    } catch (error) {
        console.error("%cFailed to save game:", "color: red; font-weight: bold;", error);
    }
}

window.save = save; // Call save during game initialization

function load() {
    const savedGame = localStorage.getItem("SpaceSave");
    if (savedGame) {
        try {
            const parsedGame = JSON.parse(savedGame);

            // Restore game variables
            game.sc = new Decimal(parsedGame.sc);
            game.scPerSecond = new Decimal(parsedGame.scPerSecond);
            game.scPerClick = new Decimal(parsedGame.scPerClick);
            game.miner = new Decimal(parsedGame.miner);
            game.minerCost = new Decimal(parsedGame.minerCost);
            game.energy = new Decimal(parsedGame.energy || 0);
            game.energyPerSecond = new Decimal(parsedGame.energyPerSecond);

            // Restore energy upgrades
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

            // Restore unlock states
            game.generatorUnlocked = parsedGame.generatorUnlocked || false;
            game.spaceshipRepaired = parsedGame.spaceshipRepaired || false;
            game.spaceUnlocked = parsedGame.spaceUnlocked || false;
            game.energyUpgradesUnlocked = parsedGame.energyUpgradesUnlocked || false;

            // Restore button visibility
            const buttons = [
                { id: 'repairGeneratorButton', key: 'repairGeneratorButtonVisible', condition: game.generatorUnlocked },
                { id: 'repairShipButton', key: 'repairShipButtonVisible', condition: game.spaceshipRepaired },
                { id: 'unlockSpaceButton', key: 'unlockSpaceButtonVisible', condition: game.spaceUnlocked },
                { id: 'buyEnergyUpgradesButton', key: 'buyEnergyUpgradesButtonVisible', condition: !game.energyUpgradesUnlocked },
            ];

            buttons.forEach(button => {
                const element = document.getElementById(button.id);
                const isVisible = localStorage.getItem(button.key) === 'true';
                if (element) {
                    element.style.display = button.condition ? 'none' : (isVisible ? 'block' : 'none');
                }
            });

            // Restore Energy Tab visibility
            const energyTabUnlocked = localStorage.getItem('energyTabUnlocked') === 'true';
            addUnlock('energyTab', energyTabUnlocked);

            // Restore Generator Tab visibility
            addUnlock('generator', game.generatorUnlocked);

            // Restore Spaceship Tab visibility
            addUnlock('spaceshipTab', game.spaceshipRepaired);

            // Restore Space Tab visibility
            addUnlock('spaceTab', game.spaceUnlocked);

            console.log("%cGame loaded successfully!", "color: green; font-weight: bold;");
        } catch (error) {
            console.error("%cFailed to load game:", "color: red; font-weight: bold;", error);
        }
    } else {
        console.log("%cNo saved game found.", "color: red; font-weight: bold;");
    }
}

function reset() {
    // Reset game variables
    game.unlocks = 0;
    game.lastUpdate = Date.now();
    game.lastSave = 0;
    game.timePlayed = 0;
    game.currentTab = 0;

    game.sc = new Decimal(0); // Reset Space-Crystals
    game.scPerSecond = new Decimal(0); // Reset SC per second
    game.scPerClick = new Decimal(1); // Reset SC per click
    game.miner = new Decimal(0); // Reset miners
    game.minerCost = new Decimal(20); // Reset miner cost

    game.generatorUnlocked = false; // Reset generator unlock status
    game.generatorStage = 1; // Reset generator stage

    game.energy = new Decimal(0); // Reset energy
    game.energyPerSecond = new Decimal(1); // Reset energy per second

    game.spaceshipRepaired = false; // Reset spaceship repair status
    game.spaceUnlocked = false; // Reset Space Tab unlock status
    game.energyUpgradesUnlocked = false; // Reset energy upgrades unlock status

    game.energyUpgrades = [ // Reset energy upgrades
        { id: 1, bought: new Decimal(0), cost: new Decimal(50) },
        { id: 2, bought: new Decimal(0), cost: new Decimal(100) },
        { id: 3, bought: new Decimal(0), cost: new Decimal(100) },
        { id: 4, bought: new Decimal(0), cost: new Decimal(500) },
        { id: 5, bought: new Decimal(0), cost: new Decimal(500) },
        { id: 6, bought: new Decimal(0), cost: new Decimal(2e7) },
    ];

    // Clear saved data from localStorage
    localStorage.removeItem("SpaceSave");
    localStorage.removeItem("energyTabUnlocked");
    localStorage.removeItem("repairGeneratorButtonVisible");
    localStorage.removeItem("repairShipButtonVisible");
    localStorage.removeItem("spaceUnlocked");
    localStorage.removeItem("buyEnergyUpgradesButtonVisible");

    // Reset UI elements
    const tabs = ['generator', 'energyTab', 'spaceshipTab', 'spaceTab'];
    tabs.forEach(tabId => {
        const tab = document.getElementById(tabId);
        if (tab) tab.style.display = 'none'; // Hide all tabs
    });

    const buttons = [
        'repairShipButton',
        'repairGeneratorButton',
        'unlockSpaceButton',
        'buyEnergyUpgradesButton',
    ];
    buttons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) button.style.display = 'block'; // Show all relevant buttons
    });

    console.log("%cAll progress has been reset.", "color: red; font-weight: bold;");

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
    const element = document.getElementById(id);
    if (element) {
        const currentDisplay = element.style.display;
        const newDisplay = condition ? 'block' : 'none';

        // Only log if the display state changes
        if (currentDisplay !== newDisplay) {
            console.log(`%cUnlocking ${id}: ${condition ? 'Visible' : 'Hidden'}`, "color: turquoise; font-weight: bold;");
        }

        element.style.display = newDisplay;
    } else {
        console.error("%cElement with ID '${id}' not found.", "color: red; font-weight: bold;");
    }
}


if (addUnlock >= 2) {
    document.getElementsByClassName("upgradeGeneratorButton")[0].style.display = "block"; // Show the generator upgrade button
}
//Das muss gefixxt werden lol