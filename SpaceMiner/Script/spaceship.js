function repairShip() {
    if (game.sc.gte(20)) { // Check if the player has enough Space-Crystals
        game.sc = game.sc.sub(20); // Deduct the cost
        game.spaceshipRepaired = true; // Mark the spaceship as repaired
        localStorage.setItem('spaceshipRepaired', 'true'); // Save the repair state
        document.getElementById('spaceshipTab').style.display = 'block'; // Show the Spaceship Tab
        document.getElementById('repairShipButton').style.display = 'none'; // Hide the "Repair Spaceship" button

        console.log("%cSpaceship repaired successfully!", "color: turquoise; font-weight: bold;");
        updateSmall(); // Refresh the UI
    } else {
        alert("You need at least 20 Space-Crystals to repair the spaceship!");
    }
}

function unlockSpace() {
    if (game.sc.gte(50)) { // Check if the player has enough Space-Crystals
        game.sc = game.sc.sub(50); // Deduct the cost
        game.spaceUnlocked = true; // Mark the Space Tab as unlocked
        localStorage.setItem('spaceUnlocked', 'true'); // Save the unlock state

        // Hide the "Unlock Space" button
        const unlockSpaceButton = document.getElementById('unlockSpaceButton');
        if (unlockSpaceButton) unlockSpaceButton.style.display = 'none';
        document.getElementById('spaceTab').style.display = 'block'; // Show the Space Tab

        console.log("%cSpace Tab unlocked!", "color: turquoise; font-weight: bold;");
        updateSmall(); // Refresh the UI
    } else {
        alert("You need at least 50 Space-Crystals to unlock the Space Tab!");
    }
}