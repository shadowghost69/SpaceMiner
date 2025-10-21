function produceSC() {
    game.sc = game.sc.add(game.scPerClick).max(0); // Add SC per click and ensure SC does not go below 0
    updateSmall(); // Refresh the display
}

function buyMiner() {
    if (game.sc.gte(game.minerCost)) {
        game.sc = game.sc.sub(game.minerCost).max(0); // Deduct cost and ensure SC does not go below 0
        game.miner = game.miner.add(1); // Increment miner count
        game.minerCost = game.minerCost.mul(1.1); // Increase miner cost
        updateSmall(); // Refresh the display
    } else {
        alert("Not enough Space Crystals to buy a miner!");
    }
}

function buyMaxMiner() {
    if (!game.sc.gte(game.minerCost)) {
        console.log("Not enough Space Crystals to buy miners.");
        return;
    }

    const BMamountCanBuy = Decimal.affordGeometricSeries( // Calculate the maximum number of miners the user can afford
        game.sc,
        new Decimal(20), // Starting cost of a miner
        new Decimal(1.1),
        game.miner
    );
    console.log("Max miners that can be bought:", BMamountCanBuy);

    if (BMamountCanBuy.eq(0)) {
        console.log("Cannot buy any miners.");
        return;
    }

    const BMCost = Decimal.sumGeometricSeries( // Calculate the total cost for the maximum miners
        BMamountCanBuy,
        new Decimal(20), // Starting cost of a miner
        new Decimal(1.1),
        game.miner
    );
    console.log("Total cost for max miners:", BMCost);

    game.sc = game.sc.sub(BMCost).max(0); // Subtract the total cost from Space-Crystals

    game.miner = game.miner.add(BMamountCanBuy); // Add the miners and update the miner cost
    game.minerCost = new Decimal(20).mul(Decimal.pow(1.1, game.miner));

    console.log("New miner count:", game.miner);
    console.log("New miner cost:", game.minerCost);

    // Refresh the display
    updateSmall();
}

function minerAutoBuyMax() {
  if (!game.minerAutoBuyMax) {
    game.minerAutoBuyMax = true
    document.getElementById("minerAutoBuyMaxButton").innerHTML = "Auto buy max: On"
  }
  else {
    game.minerAutoBuyMax = false
    document.getElementById("minerAutoBuyMaxButton").innerHTML = "Auto buy max: Off"
  }
}