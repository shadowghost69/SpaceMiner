//Unlocks energy upgrades
function buyEnergyUpgrades() {
  if (game.sc.gte(5000)) {
    game.sc = game.sc.sub(5000)
    document.getElementById("buyEnergyUpgradesButton").style.display = "none"
    document.getElementsByClassName("box")[4].style.display = "block"
    document.getElementsByClassName("upgradeGeneratorButton")[0].style.display = "block"
    addUnlock() //sets unlock to 2
  }
}