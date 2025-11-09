function unlockGenerator() {
    if (game.sc.gte(25)) { // Check if the player has enough Space-Crystals
        game.sc = game.sc.sub(25); // Deduct the cost
        game.generatorUnlocked = true; // Unlock the generator
        document.getElementById('generator').style.display = 'block'; // Show the Generator Tab
        const repairGeneratorButton = document.getElementById('repairGeneratorButton');
        if (repairGeneratorButton) {
            repairGeneratorButton.style.display = 'none'; // Hide the "Unlock Generator" button
        }

        // Show the "Unlock Energy Upgrades" button
        const buyEnergyUpgradesButton = document.getElementById('buyEnergyUpgradesButton');
        if (buyEnergyUpgradesButton) {
            buyEnergyUpgradesButton.style.display = 'block';
        }

        console.log("%cGenerator repaired Successfully!", 'color: Turquoise; font-weight: bold;');
        updateSmall(); // Refresh the UI
    } else {
        alert("You need at least 250 Space-Crystals to unlock the generator!");
    }
}