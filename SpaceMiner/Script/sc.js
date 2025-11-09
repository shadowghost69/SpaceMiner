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
        alert("%cNot enough Space Crystals to buy a miner!", "color: Orange; font-weight: bold;");
    }
}

function buyMaxMiner() {
    if (!game.sc.gte(game.minerCost)) {
        console.log("%cNot enough Space Crystals to buy miners.", "color: Orange; font-weight: bold;");
        return;
    }

    const BMamountCanBuy = Decimal.affordGeometricSeries( // Calculate the maximum number of miners the user can afford
        game.sc,
        new Decimal(20), // Starting cost of a miner
        new Decimal(1.1),
        game.miner
    );

    if (BMamountCanBuy.eq(0)) {
        console.log("%cCannot buy any miners.", "color: Orange; font-weight: bold;");
        return;
    }

    const BMCost = Decimal.sumGeometricSeries( // Calculate the total cost for the maximum miners
        BMamountCanBuy,
        new Decimal(20), // Starting cost of a miner
        new Decimal(1.1),
        game.miner
    );

    game.sc = game.sc.sub(BMCost).max(0); // Subtract the total cost from Space-Crystals

    game.miner = game.miner.add(BMamountCanBuy); // Add the miners and update the miner cost
    game.minerCost = new Decimal(20).mul(Decimal.pow(1.1, game.miner));

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