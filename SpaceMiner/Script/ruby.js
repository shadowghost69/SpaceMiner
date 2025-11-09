function unlockRuby() {
  if (game.gold.gte(100)) {
    game.gold = game.gold.sub(100)
    document.getElementById("unlockRubyButton").style.display = "none"
    //document.getElementById("unlockMagicButton").style.display = "block"
    document.getElementsByClassName("rubyTab").style.display = "block"
    //document.getElementsByClassName("resourceRow")[3].style.display = "block"
    //addUnlock() //sets unlock to 3
  }
}

function rubyConvert() {
  if (game.rubyConvertCooldown == 0 && game.rubyToGet > 0) {
    game.ruby = game.ruby.add(game.rubyToGet)
    game.gold = new Decimal(0)
    game.rubyConvertCooldown = 3
    document.getElementById("rubyConvertButton").disabled = true
    document.getElementById("rubyConvertCooldown").innerHTML = game.rubyConvertCooldown
  }
}

//To-do: 

//make ruby upgrades and rubies entirely functional (with convert etc.)

//make the EnergySCMultiplier functional

//-change the whole UI to full screens with clickable upgrade buttons and clickable sprites like the mainbig.png for the space crystals 
// --> (please use placeholder for currently not available sprites like the ruby planet for exmample like the dragon sprite for the spaceship)

//-Revise unlocking 
// --> (with visual effects, camera should hover to the new area etc. -> User can switch between the normal "windows" so the generator, energy, space and magic tab later on with a arrow butto)

//-Make planets interactive (onclcik should come a small info box about the planet and a button to travel there if unlocked, so should be unaffected by the arrow feature)

//-Implement prestige (Magic reset at an certain point of space crystal amount giving magic points to spend on permanent upgrades, like a permanent energy boost etc.) 

//-fix the resource bar to show/hide the resource details (like in dodecadragons)

//-Optimize final code to reduceredundances and improve performance

//there are many bugs right now and im very thankful for any help!