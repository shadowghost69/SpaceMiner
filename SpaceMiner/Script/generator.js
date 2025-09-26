function unlockGenerator() {
    const generator = document.getElementById('generator');
    const unlockButton = document.getElementById('unlockGeneratorButton');

    console.log("generator:", generator);
    console.log("unlockButton:", unlockButton);

    if (!generator || !unlockButton) {
        console.error("Generator elements not found.");
        return;
    }

    // Check if the player has enough Space Crystals (SC)
    if (game.sc.lt(250)) {
        alert("You need at least 250 Space Crystals to repair the generator!");
        return;
    }

    // Deduct 250 SC and unlock the generator
    game.sc = game.sc.sub(250).max(0);
    generator.style.display = 'block'; // Show the Generator Tab
    unlockButton.style.display = 'none'; // Hide the unlock button
    console.log("Generator repaired! Remaining SC:", game.sc);

    // Update the UI
    updateSmall();
}