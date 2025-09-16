// Initialize the game object
const game = {
    sc: new Decimal(0), // Space-Crystals
    scPerSecond: new Decimal(0), // Space-Crystals per second
    scPerClick: new Decimal(1), // Space-Crystals per click
    miner: new Decimal(0), // Number of miners
    minerCost: new Decimal(20), // Cost of hiring a miner
};

// Function to update the display
function updateSmall() {
    const scElement = document.getElementById("sc");
    if (scElement) {
        scElement.textContent = format(game.sc, 0);
    }

    const scPerSecondElement = document.getElementById("scPerSecond");
    if (scPerSecondElement) {
        scPerSecondElement.textContent = format(game.scPerSecond, 0);
    }

    const scPerClickElement = document.getElementById("scPerClick");
    if (scPerClickElement) {
        scPerClickElement.textContent = format(game.scPerClick, 0);
    }
}

// Function to update Space-Crystals per second
function updatePerSecond() {
    game.sc = game.sc.add(game.scPerSecond.div(10));
    updateSmall();
}

// Call this function every 100ms
setInterval(updatePerSecond, 100);

// Format function for displaying numbers
function format(value, decimals) {
    return value.toFixed(decimals);
}

// Call updateSmall immediately after initializing the game
updateSmall();