function buyEnergyUpgrades() {
    console.log("buyEnergyUpgrades function called");
    const energyTab = document.getElementById('energyTab');
    const energyUpgradeButton = document.getElementById('buyEnergyUpgradesButton');

    if (!energyTab || !energyUpgradeButton) {
        console.error("Energy Tab or Upgrade Button not found.");
        return;
    }

    // Check if the player has enough Space Crystals to unlock the Energy Tab
    if (game.sc.lt(50)) {
        alert("You need at least 50 Space Crystals to unlock the Energy Tab!");
        return;
    }

    // Deduct 50 Space Crystals and unlock the Energy Tab
    game.sc = game.sc.sub(50); // Deduct 50 SC
    energyTab.style.display = 'block'; // Show the Energy Tab
    energyUpgradeButton.style.display = 'none'; // Hide the "Energy Upgrade" button
    console.log("Energy Tab unlocked!");
    document.getElementsByClassName("upgradeGeneratorButton")[0].style.display = "block"; // Show the generator upgrade button
    addUnlock(); // Sets unlock to 2
    
    // Debugging localStorage
    console.log("Saving energyTabUnlocked to localStorage...");
    localStorage.setItem('energyTabUnlocked', 'true');
    localStorage.setItem('buyEnergyUpgradesHidden', 'true'); // Save the button state
    

    game.energyPerSecond = game.energyPerSecond.add(1).max(0); // Add energy per second and ensure energy does not go below 0
    updateSmall(); // Refresh the UI
}

function buyEnergyUpgrade(upgradeId) {
    const upgrade = game.energyUpgrades.find(upg => upg.id === upgradeId); // Find the upgrade by ID

    if (upgradeId === 1 && game.energy.gte(upgrade.cost)) {
        
        game.energy = game.energy.sub(upgrade.cost); // Deduct the cost
        upgrade.bought = upgrade.bought.add(1); // Increment the number of upgrades bought
        upgrade.cost = upgrade.cost.mul(1.5); // Increase the cost for the next upgrade

        // Increase the energy production rate
        game.energyPerSecond = game.energyPerSecond.mul(1.5);
    } 

    if (upgradeId === 2 && game.energy.gte(upgrade.cost)) {
        
        game.energy = game.energy.sub(upgrade.cost); // Deduct the cost
        upgrade.bought = upgrade.bought.add(1); // Increment the number of upgrades bought
        upgrade.cost = upgrade.cost.mul(1.5); // Increase the cost for the next upgrade

        // Increase the energy effect on miners production
        game.energyPerSecond = game.energyPerSecond.mul(1.5);
    } 

    if (upgradeId === 3 && game.energy.gte(upgrade.cost)) {
        
        game.energy = game.energy.sub(upgrade.cost); // Deduct the cost
        upgrade.bought = upgrade.bought.add(1); // Increment the number of upgrades bought
        upgrade.cost = upgrade.cost.mul(1.5); // Increase the cost for the next upgrade

        // Increase the Crystals/Click
        game.energyPerSecond = game.energyPerSecond.mul(1.5);
    } 

    if (upgradeId === 4 && game.energy.gte(upgrade.cost)) {
        
        game.energy = game.energy.sub(upgrade.cost); // Deduct the cost
        upgrade.bought = upgrade.bought.add(1); // Increment the number of upgrades bought
        upgrade.cost = upgrade.cost.mul(1.5); // Increase the cost for the next upgrade

        // Increase Crystal/Second through Miners
        game.energyPerSecond = game.energyPerSecond.mul(1.5);
    } 

    if (upgradeId === 5 && game.energy.gte(upgrade.cost)) {
        
        game.energy = game.energy.sub(upgrade.cost); // Deduct the cost
        upgrade.bought = upgrade.bought.add(1); // Increment the number of upgrades bought
        upgrade.cost = upgrade.cost.mul(1.5); // Increase the cost for the next upgrade

        // Increase Energy rate based on Crystals
        game.energyPerSecond = game.energyPerSecond.mul(1.5);
    } 
    
    if (upgradeId === 6 && game.energy.gte(upgrade.cost)) {
        
        game.energy = game.energy.sub(upgrade.cost); // Deduct the cost
        upgrade.bought = upgrade.bought.add(1); // Increment the number of upgrades bought
        upgrade.cost = upgrade.cost.mul(1.5); // Increase the cost for the next upgrade

        // 
        game.energyPerSecond = game.energyPerSecond.mul(1.5);
    } 

    else {
        console.log(`Not enough energy to buy Energy Upgrade ${upgradeId}`);
    }
    
    updateEnergyUpgradeCosts(); // Update the displayed costs

    updateSmall(); // Refresh the UI

}

window.buyEnergyUpgrade = buyEnergyUpgrade;
