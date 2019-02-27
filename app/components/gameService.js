import Game from '../models/game.js'
import Player from "../models/player.js"
import Monster from "../models/monster.js"

//Private
let _state = {
  game: new Game(),
  player: new Player('Soldier'),
  monster: new Monster()
}

let _subscribers = {
  game: [],
  player: [],
  monster: []
}

function setState(dataName, val) {
  _state[dataName] = val
  _subscribers[dataName].forEach(funk => funk())
}
//addonMonitor monitors the player attribute add ons that enhance the attack value of the slap and the punch plays. It adds attack value to the attack if the addon is set and counts the addon uses for cancelation
function addonMonitor() {
  let player = _state.player

  for (let addon in player.addons) {
    let tool = player.addons[addon];
    if (!tool.timer) {
      tool.set = false;
      $(`#${tool.name}`).attr("disabled", false);
      tool.timer = tool.resetTimer;
      $(`#${addon}`).text(addon);
    }
  }
}
//monsterAge sets a new random age for a new game 
function monsterAge() {
  let monster = _state.monster
  let game = _state.game
  let age = game.session.random * 5;
  monster.strength.energy -= age + 15;
  monster.strength.age = age < 15 ? "strong" : age < 30 ? "young" : "old";
}
//monsterHunger sets the random hunger value for a new game. This affects the attack value of the monster.
function monsterHunger() {
  let monster = _state.monster
  let game = _state.game
  monster.hunger = game.session.random * 10;
}
//monsterName sets the random monster name for a new game
function monsterName() {
  let monster = _state.monster
  let game = _state.game
  let index = 0;
  if (game.session.random < 4) {
    index = 0;
  } else if (game.session.random < 7) {
    index = 1;
  } else {
    index = 2;
  }
  monster.name = monster.names[index];
}
//monsterAttack gets called after the player attack values get handled in the attack function. The attack function then calls this and the monster attack gets handled
function monsterAttack() {
  let player = _state.player
  let monster = _state.monster

  let attackValue = monster.attacks.claw;
  if (Math.ceil(Math.random() * 10) > 5) {
    attackValue = monster.attacks.bite;
  }
  attackValue -= player.addons.kick.set ? player.addons.kick.value : 0;
  attackValue += attackValue * Math.floor(monster.hunger / 100);
  attackValue -= Math.floor(
    attackValue * (monster.strength.energy / 2 / 100)
  );
  if (player.strength.health - attackValue < 0) {
    player.strength.health = 0;
  } else {
    player.strength.health -= attackValue;
  }
}

function winGame() {
  let player = _state.player
  let monster = _state.monster
  let game = _state.game
  game.session.punch = true
  game.session.slap = true
  game.session.kick = true
  setState('game', game)
  game.count++;
  let picture = $("#bearPicture").attr("src");
  if (monster.strength.health < player.strength.health) {
    player.wins++;
    $("#bearPicture").attr("src", "assets/images/discraceBear.png");
    $("#bearPicture").addClass("win");
    setTimeout(() => {
      $("#bearPicture").removeClass("win");
      $("#bearPicture").attr("src", "assets/images/cool-Bear.png");
    }, 1000);
  } else {
    $("#bearPicture").attr("src", "assets/images/bear1.png");
    $("#bearPicture").addClass("lose");
    setTimeout(() => {
      $("#bearPicture").removeClass("lose");
      $("#bearPicture").attr("src", picture);
    }, 1800);
  }
  let winner = player.strength.health ? player.name : monster.name;
  //fix below the function call
  $("body").append(
    `<div id="winBox" class="card popup">
        <div class="card-body text-center">
          <h4 class="card-title">${winner} Has Won</h4>
          <button
            id="replay"
            class="btn btn-lg bg-dark text-white"
            type="button"
          onclick="app.controlers.gameConstructor.replay()">
            Play Again
          </button>
        </div>
      </div>`
  );

}

function replay() {
  let player = _state.player
  let monster = _state.monster
  let game = _state.game
  player.strength.health = 100;
  monster.strength.health = 100;
  monster.strength.energy = 100;
  game.session.random = Math.floor(Math.random() * 10);
  monster.attacks.bite++;
  monster.attacks.claw++;
  monsterName();
  monsterAge();
  monsterHunger();
  if (game.session.random * 10 < 50) {
    game.session.monsterPic = "./assets/images/bbear.png"
  } else {
    game.session.monsterPic = "./assets/images/abear.png"
  }

  if ($("#winBox")) {
    $("#winBox").remove();
  }
  game.session.punch = false
  game.session.slap = false
  game.session.kick = false
  setState('game', game)
  setState('player', player)
  setState('monster', monster)
}

export default class GameService {
  constructor() {
    console.log('gameService built')
    monsterAge()
    monsterHunger()
    monsterName()
  }

  addsubscriber(dataName, funk) {
    _subscribers[dataName].push(funk)
  }

  get Game() {
    let copy = JSON.stringify(_state.game)
    return JSON.parse(copy)
  }
  get Player() {
    let copy = JSON.stringify(_state.player)
    return JSON.parse(copy)
  }
  get Monster() {
    let copy = JSON.stringify(_state.monster)
    return JSON.parse(copy)
  }


  attack(event) {

    //attack evaluates the player attack and passes on to the monsterAttack function that evaluates the monster attack and sets values. It then tests for a winning condition and if so passes on to the winGame function for game end.
    let player = _state.player
    let monster = _state.monster
    let game = _state.game
    let attack = event.target.id;
    let value = player.attacks[attack];
    if (player.addons[attack] && player.addons[attack].set) {
      player.addons[attack].timer--;
      value += player.addons[attack].value;
    }
    addonMonitor();
    value = Math.floor(value + value * ((100 - monster.strength.energy) / 100));
    game.session.plays++;
    player.experience++;
    if (monster.strength.health - value < 0) {
      monster.strength.health = 0;
    } else {
      monster.strength.health -= value;
    }
    game.session.lastHitVal = value;
    monsterAttack();
    setState('game', game)
    if (!monster.strength.health || !player.strength.health) {
      winGame();
      return;
    }
    setState('game', game)
    setState('player', player)
    setState('monster', monster)
  }
  //setAddons sets the value of the player addons to true in the player class if the player has enough experience points to purchase the addon.
  setAddons(event) {
    let player = _state.player
    let value = event.target.dataset.upgrade;

    if (player.experience >= player.addons[value].cost) {
      player.addons[value].set = true;
      event.target.disabled = true;
      player.experience -= player.addons[value].cost;
      //$(`#${value}`).text(event.target.id);
      setState('player', player)
    } else {
      $(".col-6").prepend(
        `<h5 id='drop'>You Need ${player.addons[value].cost -
          player.experience} More Experience</h5>`
      );
      setTimeout(() => {
        $("#drop").remove();
      }, 800);
    }

  }

  reset() {
    let player = _state.player
    let monster = _state.monster
    let game = _state.game
    replay();
    player.experience = 0;
    monster.attacks.claw = 10;
    monster.attacks.bite = 18;
    for (let addon in player.addons) {
      let tool = player.addons[addon];
      tool.set = false;
      tool.timer = tool.resetTimer;
    }
    player.name = "Soldier";
    game.getName = true;
    player.wins = 0;
    game.count = 0;
    game.session.lastHitVal = 0
    for (let addon in player.addons) {
      player.addons[addon].set = false;
    }

    setState('game', game)
    setState('player', player)
    setState('monster', monster)
  }

  replay() {
    let player = _state.player
    let monster = _state.monster
    let game = _state.game
    replay()
    setState('game', game)
    setState('player', player)
    setState('monster', monster)
  }

  setName(name) {
    let player = _state.player
    let game = _state.game
    _state.player.name = name
    _state.game.getName = false
    setState('game', game)
    setState('player', player)
  }
}