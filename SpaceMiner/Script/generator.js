function unlockGenerator() {
    const generatorTab = document.getElementById('generator');
    const unlockButton = document.getElementById('unlockGeneratorButton');

    if (!generatorTab || !unlockButton) {
        console.error("Generator elements not found.");
        return;
    }

    // Check if the player has enough Space Crystals (SC)
    if (game.sc.lt(250)) {
        alert("You need at least 250 Space Crystals to repair the generator!");
        return;
    }

    // Deduct 250 SC and unlock the generator
    game.sc = game.sc.sub(250).max(0); // Deduct 250 SC
    generatorTab.style.display = 'block'; // Show the Generator Tab
    unlockButton.style.display = 'none'; // Hide the "Repair Generator" button
    console.log("Generator unlocked!");
    addUnlock(); // Sets unlock to 1

    // Save the unlocked state in localStorage
    localStorage.setItem('generatorUnlocked', 'true');

    // Update the UI
    updateSmall();
}