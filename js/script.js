/* Battle Simulator - JavaScript */


$(function() {
/* ---------------------------------------------------- */
/* ----------------- Global Variables ----------------- */
/* ---------------------------------------------------- */

var playerName = null,
    playerChar = null,
    $playerDescription = $(".character-select-description div"),
    $player = $('.player'),
    $battle = $('.battle'),
    $computer = $('.computer'),
    battleText = "<p>A new challenger awaits....</p><br>",
    computerChar = null,
    abilityChosen = null;


// Array containing class attributes of all possible player characters 
var playerClassAttributes = [
  {
    classType: "Jedi Guardian",
    classDescription: "The way of the Lightsaber",
    health: {min: 40, max: 80, lvl: 25},
    strength: {min: 10, max: 18, lvl: 2},
    force: {min: 8, max: 14, lvl: 1},
    agility: {min: 1, max: 5, lvl: 2},
    constitution: {min: 10, max: 15, lvl: 2},
    abilities: [
      {lvl: 1, ability: "Force Push", description: "knocked the opponent backwards with the force", power: 30, effect: function() {}},
      {lvl: 2, ability: "Force Heal", description: "used the force to heal - HP (+80)", power: 0, effect: function(self, enemy) {self.currentHealth += 80; if (self.currentHealth > self.maxHealth) self.currentHealth = self.maxHealth;}},
      {lvl: 3, ability: "Power Strike", description: "struck a critical hit! - STR (+5)", power: 30, effect: function(self, enemy) {self.strength += 5;}},
      {lvl: 6, ability: "Lightsaber Throw", description: "used lightsaber as a projectile!", power: 40, effect: function() {}},
      {lvl: 9, ability: "Force Projectile", description: "propelled debris and lowered opponents defence! - AC (-5)", power: 50, effect: function(self, enemy) {enemy.ac -= 5;}},
      {lvl: 12, ability: "Force Pull", description: "forcefully pulled and slowed the opponent! - AGI (-4)", power: 40, effect: function(self, enemy) {enemy.agility -= 4;}},
      {lvl: 15, ability: "Focus Attack", description: "channelled the power of the force! - STR (+15)", power: 35, effect: function(self, enemy) {self.strength += 15;}}
    ]
  },

  {
    classType: "Jedi Consular",
    classDescription: "The way of the Force",
    health: {min: 20, max: 40, lvl: 20},
    strength: {min: 8, max: 14, lvl: 1},
    force: {min: 10, max: 18, lvl: 2},
    agility: {min: 10, max: 15, lvl: 4},
    constitution: {min: 5, max: 10, lvl: 2},
    abilities: [
      {lvl: 1, ability: "Force Push", description: "knocked the opponent backwards with the force", power: 30, effect: function(self, enemy) {}},
      {lvl: 2, ability: "Force Heal", description: "used the force to heal - HP (+120)", power: 0, effect: function(self, enemy) {self.currentHealth += 100; if (self.currentHealth > self.maxHealth) self.currentHealth = self.maxHealth;}},
      {lvl: 3, ability: "Force Block", description: "used the force to help repel damage - AC (+8)", power: 0, effect: function(self, enemy) {self.ac += 8;}},
      {lvl: 6, ability: "Force Projectile", description: "propelled debris and lowered opponents defence! - AC (-5)", power: 60, effect: function(self, enemy) {enemy.ac -= 5;}},
      {lvl: 9, ability: "Force Lift", description: "smashed the opponent into the ground!", power: 50, effect: function(self, enemy) {}},
      {lvl: 12, ability: "Force Influence", description: "weakened the opponent! - CON (-2) | STR (-3) | AGI (-4)", power: 0, effect: function(self, enemy) {enemy.constitution -= 2; enemy.strength -= 3; enemy.agility -= 4;}},
      {lvl: 15, ability: "Force Focus", description: "channelled the power of the force - AGI (+8) | FOR (+10)", power: 0, effect: function(self, enemy) {self.agility += 8; self.force += 10;}}
    ]
  }
];


// Array containing class attributes of all possible computer characters
var compClassAttributes = [
  {
    classType: "Inquisitor",
    health: {min: 10, max: 25, lvl: 20},
    strength: {min: 4, max: 12, lvl: 2},
    force: {min: 5, max: 8, lvl: 1},
    agility: {min: 5, max: 12, lvl: 2},
    constitution: {min: 4, max: 8, lvl: 2},
    xpReward: {min: 200, max: 350},
    weapon: new Lightsaber("Standard", "Double", "Red", false),
    armour: new Armour("Light Battle Armour", 5),
    abilities: [
      {ability: "Force Push", description: "knocked you backwards using the force!", power: 15, effect: function(self, playerCharacter) {}}
    ],
  },
  
  {
    classType: "Sith Warrior",
    health: {min: 10, max: 30, lvl: 30},
    strength: {min: 4, max: 16, lvl: 2},
    force: {min: 5, max: 14, lvl: 2},
    agility: {min: 5, max: 12, lvl: 3},
    constitution: {min: 5, max: 10, lvl: 3},
    xpReward: {min: 250, max: 400},
    weapon: new Lightsaber("Electrum", "Single", "Red", true),
    armour: new Armour("Medium Battle Armour", 10),
    abilities: [
      {ability: "Force Push", description: "knocked you backwards using the force!", power: 15, effect: function(self, playerCharacter) {}},
      {ability: "Force Choke", description: "choked you with the power of the dark side! - CON (-1)", power: 45, effect: function(self, playerCharacter) {playerCharacter.constitution -= 1;}}
    ],
  },
  
  {
    classType: "Sith Lord",
    health: {min: 20, max: 50, lvl: 40},
    strength: {min: 10, max: 25, lvl: 3},
    force: {min: 10, max: 25, lvl: 3},
    agility: {min: 10, max: 15, lvl: 3},
    constitution: {min: 6, max: 10, lvl: 4},
    xpReward: {min: 400, max: 650},
    weapon: new Lightsaber("Curved", "Single", "Red", false),
    armour: new Armour("Robes", 1),
    abilities: [
      {ability: "Force Push", description: "knocked you backwards using the force!", power: 15, effect: function(self, playerCharacter) {}},
      {ability: "Force Choke", description: "choked you with the power of the dark side! - CON (-2)", power: 20, effect: function(self, playerCharacter) {playerCharacter.constitution -= 2;}},
      {ability: "Force Lightning", description: "unleashed the power of the dark side! - AGI (-3) | CON (-3)", power: 30, effect: function(self, playerCharacter) {playerCharacter.constitution -= 3; playerCharacter.agility -= 3;}}
    ],
  },

  {
    classType: "Stormtrooper",
    health: {min: 5, max: 15, lvl: 10},
    strength: {min: 2, max: 8, lvl: 1},
    force: {min: 0, max: 0, lvl: 0},
    agility: {min: 1, max: 4, lvl: 1},
    constitution: {min: 1, max: 5, lvl: 1},
    xpReward: {min: 30, max: 80},
    weapon: new RangedWeapon("E-11 Blaster Rifle", 10),
    armour: new Armour("Stormtrooper Armour", 8),
    abilities: [
      {ability: "Thermal Detonator", description: "caused a powerful explosion!", power: 35, effect: function(self, playerCharacter) {}},
    ]
  },
  
  {
    classType: "Bounty Hunter",
    health: {min: 10, max: 20, lvl: 15},
    strength: {min: 3, max: 10, lvl: 2},
    force: {min: 0, max: 0, lvl: 0},
    agility: {min: 5, max: 8, lvl: 2},
    constitution: {min: 3, max: 7, lvl: 2},
    xpReward: {min: 100, max: 200},
    weapon: new RangedWeapon("Blaster Pistols", 20),
    armour: new Armour("Heavy Battle Armour", 20),
    abilities: [
    {ability: "Flamethrower", description: "sprayed an arc of fire! - AGI (-3)", power: 30, effect: function(self, playerCharacter) {playerCharacter.agility -= 3;}},
    {ability: "Rocket Attack", description: "caused a devastating explosion! - AC(-3)", power: 50, effect: function(self, playerCharacter) {playerCharacter.ac -= 3;}}
    ],
  },
  
  {
    classType: "Tusken Raider",
    health: {min: 5, max: 15, lvl: 5},
    strength: {min: 1, max: 2, lvl: 1},
    force: {min: 0, max: 0, lvl: 0},
    agility: {min: 1, max: 3, lvl: 1},
    constitution: {min: 1, max: 3, lvl: 1},
    xpReward: {min: 5, max: 10},
    weapon: new RangedWeapon("Tusken Cycler Rifle", 5),
    armour: new Armour("Robes", 1),
    abilities: [
      {ability: "Tusken Yell!", description: "waved his hands in the air...", power: 0, effect: function(self, playerCharacter) {}}
    ],
  }
];



/* ---------------------------------------------------- */
/* ------------------- Constructors ------------------- */
/* ---------------------------------------------------- */

// Game constructor
function Game() {

  // Generate an inclusive random integer between a min and max value
  this.random = function(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
  };
}



// Character constructor
function Character() {

  this.setup = function(classAttributes, charName, chosenClass, lvl, items) {
    // Set character class (profession)
    for (var c = 0; c < classAttributes.length; c++) {
      if (chosenClass == classAttributes[c].classType) {
        this.classAttr = classAttributes[c];
      }
    }

    // Set inventory contents
    this.inventory = {weapon: null, armour: null};
    for (item in items) {
      this.inventory[item] = items[item];
    }

    // Set character info and stats
    this.charName = charName;
    this.lvl = lvl;
    this.charClass = this.classAttr.classType;
    this.abilities = this.classAttr.abilities;
    this.statRoll();
    this.setAc();
  };

  
  this.statRoll = function() {
    // Roll or re-roll starting stats
    this.maxHealth = (100 + this.random(this.classAttr.health.min, this.classAttr.health.max)) + (this.lvl * this.classAttr.health.lvl);
    this.strength = this.random(this.classAttr.strength.min, this.classAttr.strength.max) + (this.lvl * this.classAttr.strength.lvl);
    this.force = this.random(this.classAttr.force.min, this.classAttr.force.max) + (this.lvl * this.classAttr.force.lvl);
    this.agility = this.random(this.classAttr.agility.min, this.classAttr.agility.max) + (this.lvl * this.classAttr.agility.lvl);
    this.constitution = this.random(this.classAttr.constitution.min, this.classAttr.constitution.max) + (this.lvl * this.classAttr.constitution.lvl);
    this.currentHealth = this.maxHealth;
    this.setAc();
    this.baseStats = {
      strBase: this.strength - (this.lvl * this.classAttr.strength.lvl),
      forBase: this.force - (this.lvl * this.classAttr.force.lvl),
      agiBase: this.agility - (this.lvl * this.classAttr.agility.lvl),
      conBase: this.constitution - (this.lvl * this.classAttr.constitution.lvl)
    };
  };

  
  this.setAc = function() {
    // Set total armour class (ac) rating
    this.ac = this.constitution + this.inventory.armour.defence;
  };


  this.atkPower = function() {
    // Calculate attack power of character with equipped weapon
    return this.inventory.weapon.power + this.strength;
  };


  this.defRating = function() {
    // Calculate defence rating of character with equipped armour and agility bonus
    return this.ac + this.random(0, Math.round(this.agility / 2));
  };


  this.defend = function(dmg) {
    // Calculate how much damage is absorbed by defence rating
    var def = Math.round(this.defRating() / 100 * dmg);
    return (dmg - def === 0 ? 0 : dmg - def);
  };


  this.combat = function(enemy, action) {
    var dmg = null,
        battleText = "";

    // Decide which character attacks first
    if (this.agility >= enemy.agility) {

      // Damage inflicted
      dmg = this.attack(action, enemy);
      dmg[1] = enemy.defend(dmg[1]);
      enemy.currentHealth -= dmg[1];
      enemy.setAc();
      battleText += "<p>" + this.charName + " used " + action + " - " + enemy.charClass + " received " + dmg[1] + " dmg</p>";
      if (dmg[0]) battleText += "<p>" + this.charName + " " + dmg[0] + "</p>";
      if (enemy.currentHealth <= 0) {
        return battleText;
      }

      // Damage received
      dmg = enemy.attack(this);
      dmg[1] = this.defend(dmg[1]);
      this.currentHealth -= dmg[1];
      this.setAc();
      battleText += "<p>" + enemy.charClass + " used " + dmg[0] + " - " + this.charName + " received " + dmg[1] + " dmg</p>";
      if (dmg[2]) battleText += "<p>" + enemy.charClass + " " + dmg[2] + "</p>";

    } else {

      // Damage received
      dmg = enemy.attack(this);
      dmg[1] = this.defend(dmg[1]);
      this.currentHealth -= dmg[1];
      this.setAc();
      battleText += "<p>" + enemy.charClass + " used " + dmg[0] + " - " + this.charName + " received " + dmg[1] + " dmg</p>";
      if (dmg[2]) battleText += "<p>" + enemy.charClass + " " + dmg[2] + "</p>";
      if (this.currentHealth <= 0) {
        return battleText;
      }

      // Damage inflicted
      dmg = this.attack(action, enemy);
      dmg[1] = enemy.defend(dmg[1]);
      enemy.currentHealth -= dmg[1];
      enemy.setAc();
      battleText += "<p>" + this.charName + " used " + action + " - " + enemy.charClass + " received " + dmg[1] + " dmg</p>";
      if (dmg[0]) battleText += "<p>" + this.charName + " " + dmg[0] + "</p>";

    }

    return battleText;
  };


  this.viewWeapon = function() {
    if (this.inventory.weapon.itemName === "Lightsaber") {
      return "<p>Type: " + this.inventory.weapon.itemName + "<br>Hilt: " + this.inventory.weapon.hiltType + "<br>Blade: " + this.inventory.weapon.bladeType + "<br>Crystal: " + this.inventory.weapon.crystal + "<br>Power: " + this.inventory.weapon.power + "</p><br>";
    } else {
      return "<p>Type: " + this.inventory.weapon.itemName + "<br>Power: " + this.inventory.weapon.power + "</p><br>";
    }
  };


  this.viewArmour = function() {
    return "<p>Type: " + this.inventory.armour.itemName + "<br>Defence: " + this.inventory.armour.defence + "</p>";
  };
}



// Player character constructor
function Player(classAttributes, charName, chosenClass, lvl, items) {

  this.xp = 0;
  this.nextLvl = 250;


  this.lvlUp = function(xpReward) {
    // Reset player stats from previous battle
    this.resetStats();

    // Update total xp
    this.xp += xpReward;

    // Check for max level
    if (this.lvl === 15) return "";

    // Check for level up
    if (this.xp >= this.nextLvl) {
      this.lvl += 1;

      // Upgrade stats
      this.maxHealth += this.classAttr.health.lvl;
      this.strength += this.classAttr.strength.lvl;
      this.force += this.classAttr.force.lvl;
      this.agility += this.classAttr.agility.lvl;
      this.constitution += this.classAttr.constitution.lvl;
      this.setAc();
      
      // Set next level
      this.nextLvl = this.xp * 2;

      // Restore health
      this.currentHealth = this.maxHealth;

      // Update available abilities
      this.updateAbilitiesMenu();

      // Update player
      return "<br><p><span class='level-up'>Level up!<br>" + this.charName + " is now level " + this.lvl + "!</span></p>";
    }

    return "";
  };

 
  this.attack = function(action, enemy) {
    // Calculate damage inflicted to computer character
    if (action === this.inventory.weapon.itemName) {
      return [null, this.atkPower()];
    } else {
      var playerSelection = null;
      
      for (var i = 0; i < this.abilities.length; i++) {
        if (action === this.abilities[i].ability) {
          playerSelection = this.abilities[i];
          break;
        }
      }

      playerSelection.effect(this, enemy);

      if (playerSelection.power === 0) {
        return [playerSelection.description, playerSelection.power];
      } else {
        return [playerSelection.description, playerSelection.power + this.force];
      }
    }
  };


  this.resetStats = function() {
    this.strength = this.baseStats.strBase + (this.lvl * this.classAttr.strength.lvl);
    this.force = this.baseStats.forBase + (this.lvl * this.classAttr.force.lvl);
    this.agility = this.baseStats.agiBase + (this.lvl * this.classAttr.agility.lvl);
    this.constitution = this.baseStats.conBase + (this.lvl * this.classAttr.constitution.lvl);
    this.setAc()
  };


  this.equipItem = function(item) {
    this.inventory[item.itemType] = item;
  };


  this.die = function() {
    if (this.currentHealth <= 0) return "<p><span class='lose'>" + this.charName + " was defeated<br>Game over</span></p>";
  };


  this.viewStats = function() {
  // Display character stats and return overview
    return "<p style='font-weight:700'>Lv." + this.lvl + " " + this.charClass + "</p><p>XP (" + this.xp + ")  Next Lv (" + this.nextLvl + ")<br><br>HP (" + this.maxHealth + "/" + this.currentHealth + ")<br>AC (" + this.ac + ")<br>Strength (" + this.strength + ")<br>Force (" + this.force + ")<br>Agility (" + this.agility + ")<br>Constitution (" + this.constitution + ")</p>";
  };


  this.updateAbilitiesMenu = function() {
    var abilitiesMenuText = "";

    for (i = 0; i < this.abilities.length; i++) {
      if (this.lvl >= this.abilities[i].lvl) {
        abilitiesMenuText += "<li>" + this.abilities[i].ability + "</li>";
      }
    }

    $('.abilities').html(abilitiesMenuText);
  };


  // Initialise player character
  this.setup(classAttributes, charName, chosenClass, lvl, items);
}



// Computer character constructor
function Comp(classAttributes, charName, chosenClass, lvl, items) {

  // Calculate damage inflicted to player character
  this.attack = function(playerCharacter) {
    if (this.random(1, 6) >= 5) {
      var compSelection = this.random(0, this.abilities.length - 1);

      this.abilities[compSelection].effect(this, playerCharacter);

      if (this.abilities[compSelection].power > 0) {
        return [this.abilities[compSelection].ability, this.abilities[compSelection].power + this.force, this.abilities[compSelection].description];
      } else {
        return [this.abilities[compSelection].ability, 0, this.abilities[compSelection].description];
      }

    } else {
      return [this.inventory.weapon.itemName, this.atkPower()];
    }
  };


  this.viewStats = function() {
    return "<p style='font-weight:700'>Lv." + this.lvl + " " + this.charClass + "</p><p>XP Reward (" + this.xpReward +")<br><br>HP (" + this.maxHealth + "/" + this.currentHealth + ")<br>AC (" + this.ac + ")<br>Strength (" + this.strength + ")<br>Force (" + this.force + ")<br>Agility (" + this.agility + ")<br>Constitution (" + this.constitution + ")</p>";
  };


  this.giveXp = function() {
    return this.xpReward;
  };


  this.die = function() {
    if (this.currentHealth <= 0) {
      return "<p><span class='win'>" + this.charClass + " was defeated!<br>Gained " + this.xpReward + "XP</span></p>";
    }
  };


  // Initialise computer character
  this.setup(classAttributes, charName, chosenClass, lvl, items);
  this.xp = 0;
  this.xpReward = this.random(this.classAttr.xpReward.min, this.classAttr.xpReward.max ) * this.lvl;
}



// Lightsaber constructor
function Lightsaber(hiltType, bladeType, colour, dual) {

  this.itemType = "weapon";
  this.itemName = (dual ? "Dual Lightsabers" : "Lightsaber"); 
  this.hiltType = hiltType;
  this.bladeType = bladeType;
  this.crystal = colour;
  this.dualWieldBonus = (dual === true ? 2 : 1);

  this.forge = function() {
    switch (hiltType) {
      case "Standard":
        if (this.bladeType === "Single") this.power = 15 * this.dualWieldBonus;
        if (this.bladeType === "Double") {
          this.dualWieldBonus = 0;
          this.power = 30;
        }
        break;

      case "Electrum":
        if (this.bladeType === "Single") this.power = 20 * this.dualWieldBonus;
        if (this.bladeType === "Double") {
          this.dualWieldBonus = 0;
          this.power = 40;
        }
        break;

      case "Curved":
        if (this.bladeType === "Single") this.power = 25 * this.dualWieldBonus;
        if (this.bladeType === "Double") {
          this.dualWieldBonus = 0;
          this.power = 50;
        }
        break;
    }
  };

  this.forge();
}



// Ranged weapon constructor
function RangedWeapon(itemName, power) {

  this.itemType = "weapon";
  this.itemName = itemName;
  this.power = power;
}



// Armour constructor
function Armour(itemName, defence) {

  this.itemType = "armour";
  this.itemName = itemName;
  this.defence = defence;
}



/* ---------------------------------------------------- */
/* -------------------- Prototypes -------------------- */
/* ---------------------------------------------------- */

Character.prototype = new Game();
Player.prototype = new Character();
Comp.prototype = new Character();



/* ---------------------------------------------------- */
/* ----------------- Battle Simulation ---------------- */
/* ---------------------------------------------------- */

/* ------------ Character Selection Screen ------------ */

$(".profession").on('click', function() {
  // Create new character
  playerName = $("input:text[name=characterName]").val();

  if (!playerName) {
    $playerDescription.empty();
    alert("Please enter a character name");
    return;
  }

  if ($(this).hasClass("jedi-guardian")) {
    playerChar = new Player(playerClassAttributes, playerName, "Jedi Guardian", 1, {weapon: new Lightsaber("Standard", "Single", "Blue", false), armour: new Armour("Medium Battle Armour", 15)});
  }

  if ($(this).hasClass("jedi-consular")) {
    playerChar = new Player(playerClassAttributes, playerName, "Jedi Consular", 1, {weapon: new Lightsaber("Standard", "Single", "Green", false), armour: new Armour("Light Battle Armour", 10)});
  }

  // Update character selection description box
  $playerDescription.empty()
                    .filter(".r1-c1").html("<p style='font-weight:700'>" + playerChar.charClass + "</p><p>" + playerChar.classAttr.classDescription + "</p>").end()
                    .filter(".r2-c1").html("<p>Health (" + playerChar.maxHealth + ")<br>Strength (" + playerChar.strength + ")<br>Agility (" + playerChar.agility + ")</p>").end()
                    .filter(".r2-c2").html("<p>Armour (" + playerChar.ac + ")<br>Force (" + playerChar.force + ")<br>Constitution (" + playerChar.constitution + ")</p>").end()
  
  // Update simulator player stats
  $player.find('.player-name').empty().html(playerChar.charName);
  $player.find('.player-stats').empty().html(playerChar.viewStats());

  // Update simulator player inventory
  $player.find('.player-weapon').empty().html(playerChar.viewWeapon());
  $player.find('.player-armour').empty().html(playerChar.viewArmour());

  // Update simulator player abilities
  playerChar.updateAbilitiesMenu();
});


$(".submit").on('click', function() {
  // Confirm selection
  if (playerChar) {
    $(".character-select").hide();
    $(".simulator").show();
  } else {
    alert("Please create a character");
  }
});



/* ------------------- Battle Screen ------------------ */

// Initiate simulation
newComputerChar(1);
$battle.find('.battle-window').html(battleText);
computerChar.currentHealth = 40;


$battle.on('click', ".attack, .abilities li", function() {
  // Initiate a single attack turn
  // Check for character death
  if (playerChar.currentHealth <= 0 || computerChar.currentHealth <= 0) {
    return;
  }

  // Calculate damage
  if ($(this).html() === "Attack") {
    battleText += playerChar.combat(computerChar, playerChar.inventory.weapon.itemName) + "<br>";
  } else {
    for (i = 0; i < playerChar.abilities.length; i++) {
      if ($(this).html().match(playerChar.abilities[i].ability)) {
        battleText += playerChar.combat(computerChar, playerChar.abilities[i].ability) + "<br>";
      }
    }
  }

  // Update stats
  $player.find('.player-stats').empty().html(playerChar.viewStats());
  $computer.find('.computer-stats').empty().html(computerChar.viewStats());

  // If player defeated - show game over menu
  if (playerChar.currentHealth <= 0) {
    // Process player defeat
    battleText += playerChar.die();

    // Show game over menu
    $computer.find('.simulator-menu-1').show();
  }

  if (computerChar.currentHealth <= 0) {
    // Process computer defeat, allocate XP reward and check for level-up
    battleText += computerChar.die();
    battleText += playerChar.lvlUp(computerChar.giveXp());
    $player.find('.player-stats').empty().html(playerChar.viewStats());

    // Show next opponent menu
    $computer.find('.simulator-menu-2').show();
  }

  // Update battle window and auto scroll down
  $battle.find('.battle-window').empty().html(battleText).stop().animate({scrollTop: $(".battle-window")[0].scrollHeight}, 800);
});


$computer.on('click', '.new-game', function() {
  // Start a new game
  location.reload(true);
});


$computer.on('click', ".next-opponent", function() {
  // Create next opponent
  $computer.find('.simulator-menu-2').hide();
  battleText = "<p>A new challenger awaits....</p><br>";
  $battle.find('.battle-window').empty().html(battleText);

  if ($(this).html() === "Easy") {
    (playerChar.lvl === 1 ? newComputerChar(1) : newComputerChar(playerChar.lvl - 1));
  } else if ($(this).html() === "Medium") {
    newComputerChar(playerChar.lvl);
  } else if ($(this).html() === "Hard") {
    newComputerChar(playerChar.lvl + 1);
  }
});



/* ---------------------------------------------------- */
/* --------------------- Functions -------------------- */
/* ---------------------------------------------------- */

function newComputerChar(newCharLevel) {
  // Random character generator
  var randomNumber = Math.floor((Math.random() * ((compClassAttributes.length -1) - 0 + 1)) + 0);
      randomChar = null;

  for (i = 0; i < compClassAttributes.length; i++) {
    if (randomNumber === i) {
      randomChar = compClassAttributes[i];
      break;
    }
  }

  // Create new computer character
  computerChar = new Comp(compClassAttributes, "Computer", randomChar.classType, newCharLevel, {weapon: randomChar.weapon, armour: randomChar.armour});
  
  // Update computer stats
  $computer.find('.computer-stats').empty().html(computerChar.viewStats());

  // Update computer inventory
  $computer.find('.computer-weapon').html(computerChar.viewWeapon());
  $computer.find('.computer-armour').html(computerChar.viewArmour());
}
})