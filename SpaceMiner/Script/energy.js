function buyEnergyUpgrades() {
    if (game.sc.gte(50)) { // Check if the player has enough Space-Crystals
        game.sc = game.sc.sub(50); // Deduct the cost
        game.energyUpgradesUnlocked = true; // Mark energy upgrades as unlocked
        localStorage.setItem('energyTabUnlocked', 'true'); // Save the unlock state

        // Hide the "Buy Energy Upgrades" button
        const buyEnergyUpgradesButton = document.getElementById('buyEnergyUpgradesButton');
        if (buyEnergyUpgradesButton) buyEnergyUpgradesButton.style.display = 'none';

        // Show the "Upgrade Generator" button in the same location
        const upgradeGeneratorButton = document.getElementsByClassName('upgradeGeneratorButton')[0];
        if (upgradeGeneratorButton) upgradeGeneratorButton.style.display = 'block';

        console.log("%cEnergy Upgrades unlocked!", "color: turquoise; font-weight: bold;");
        updateSmall(); // Refresh the UI
    } else {
        alert("You need at least 50 Space-Crystals to unlock Energy Upgrades!");
    }
}

function buyEnergyUpgrade(upgradeId) {
    const upgrade = game.energyUpgrades.find(upg => upg.id === upgradeId); // Find the upgrade by ID

    if (!upgrade) {
        console.error(`%cEnergy Upgrade ${upgradeId} not found!`, "color: red; font-weight: bold;");
        return;
    }

    if (game.energy.gte(upgrade.cost)) {
        game.energy = game.energy.sub(upgrade.cost); // Deduct the cost
        upgrade.bought = upgrade.bought.add(1); // Increment the number of upgrades bought
        upgrade.cost = upgrade.cost.mul(1.5); // Increase the cost for the next upgrade

        // Apply the upgrade effect
        applyEnergyUpgradeEffect(upgradeId);

        console.log(`%cEnergy Upgrade ${upgradeId} purchased successfully!`, "color: green; font-weight: bold;");
    } else {
        console.log(`%cNot enough energy to buy Energy Upgrade ${upgradeId}`, "color: orange; font-weight: bold;");
    }

    updateEnergyUpgradeCosts(); // Update the displayed costs
    updateSmall(); // Refresh the UI
}

function applyEnergyUpgradeEffect(upgradeId) {
    switch (upgradeId) {
        case 1:
            // Increase energy production rate
            game.energyPerSecond = game.energyPerSecond.mul(1.5);
            break;
        case 2:
            // Increase energy effect on miners' production
            game.energyPerSecond = game.energyPerSecond.mul(1.5);
            break;
        case 3:
            // Increase Crystals per Click
            game.scPerClick = game.scPerClick.mul(1.5);
            break;
        case 4:
            // Increase Crystals per Second through Miners
            game.scPerSecond = game.scPerSecond.mul(1.5);
            break;
        case 5:
            // Increase energy rate based on Crystals
            game.energyPerSecond = game.energyPerSecond.mul(1.5);
            break;
        case 6:
            // Apply a custom effect for upgrade 6 (if needed)
            game.energyPerSecond = game.energyPerSecond.mul(1.5);
            break;
        default:
            console.warn(`%cNo effect defined for Energy Upgrade ${upgradeId}`, "color: yellow; font-weight: bold;");
    }
}

// Expose functions to the global scope if needed
window.buyEnergyUpgrade = buyEnergyUpgrade;
window.buyEnergyUpgrades = buyEnergyUpgrades;