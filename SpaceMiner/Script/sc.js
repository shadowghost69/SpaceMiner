function produceSC() {
    game.sc = game.sc.add(game.scPerClick); // Add Space-Crystals per click
    updateSmall(); // Refresh the display
}

function buyMiner() {
    if (game.sc.gte(game.minerCost)) { // Check if enough Space-Crystals
        game.sc = game.sc.sub(game.minerCost).max(0); // Subtract cost
        game.miner = game.miner.add(1); // Increase miner count
        game.minerCost = game.minerCost.mul(1.1); // Increase cost for next miner
        updateSmall(); // Refresh the display
    }
}

function updateMinerButton() {
    const buyMinerButton = document.getElementById("buyMinerButton");
    if (buyMinerButton) {
        buyMinerButton.disabled = !game.sc.gte(game.minerCost); // Enable if SC >= miner cost
    }
}

function buyMaxMiner() {
    if (!game.sc.gte(game.minerCost)) {
        console.log("Not enough Space-Crystals to buy miners.");
        return;
    }

    console.log("Current SC:", game.sc);
    console.log("Miner Cost:", game.minerCost);

    const BMamountCanBuy = Decimal.affordGeometricSeries(game.sc, game.minerCost, new Decimal(1.1));
    console.log("Max miners that can be bought:", BMamountCanBuy);

    if (BMamountCanBuy.eq(0)) {
        console.log("Cannot buy any miners.");
        return;
    }

    const BMCost = Decimal.sumGeometricSeries(BMamountCanBuy, game.minerCost, new Decimal(1.1));
    console.log("Total cost for max miners:", BMCost);

    game.sc = game.sc.sub(BMCost).max(0);
    console.log("Remaining SC after purchase:", game.sc);

    game.miner = game.miner.add(BMamountCanBuy);
    game.minerCost = game.minerCost.mul(Decimal.pow(1.1, BMamountCanBuy));

    console.log("New miner count:", game.miner);
    console.log("New miner cost:", game.minerCost);

    updateSmall();
}