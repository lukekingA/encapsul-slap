import GameService from "./gameService.js"

let _gameService = new GameService()

function updatePage() {
  let game = _gameService.Game
  let player = _gameService.Player
  let monster = _gameService.Monster

  let template = ''
  template += `
  <main class="row custom-height">
    <div class="col d-flex flex-column justify-content-end">
      <div class="row">
        <div class="col-3 text-left">
          <h3>Monster</h3>
          <h5>${monster.name}</h5>
          <div>
            <p>age: <span>${monster.strength.age}</span></p>
            <p>hunger: <span>${monster.hunger}</span></p>
            <p>health: <span>${monster.strength.health}</span></p>
            <div class="progressBar"> <span style="background-color:${monster.strength.health > 35 ? 
            'rgb(43, 194, 83)' : 'red'}; width:${monster.strength.health}%;"
            }
            "></span></div>
          </div>
        </div>
        <div class="col-6 d-flex flex-column justify-content-end">
          <div class="row">
            <div class="col d-flex justify-content-center">
              <img id="bearPicture" class="img-fluid" src="${game.session.monsterPic}" alt="">
            </div>
          </div>
          <div class="row">
            <div id="actions" class="col d-flex justify-content-around btn-group-sm">`
  for (let attack in player.attacks) {
    template += `
    <button id="${attack}"
    type="button"
    class="btn bg-dark text-white" ${game.session[attack] ? 'disabled' : ''}> ${
      player.addons[attack].set ? player.addons[attack].name : attack
    }</button>`
  }
  template += `
            </div>
          </div>
        </div>
        <div class="col-3 d-flex flex-column align-items-end">
          <h3>Player</h3>
          <h5>${player.name}</h5>
          <div class="w-100">
            <p class="text-right">health: <span>${player.strength.health}</span></p>
            <div class="progressBar"><span style="background-color:${player.strength.health > 35 ? 
            'rgb(43, 194, 83)' : 'red'}; width:${player.strength.health}%;"></span></div>
          </div>
          <p id="playerName" class="text-right">experience: <span>${player.experience}</span></p>`
  for (let key in player.addons) {
    template += `
    <button id="${player.addons[key].name}" class="btn bg-dark btn-sm text-white mt-2" type="button" data-upgrade="${key}" ${player.addons[key].set ? 'disabled' : ''}>${player.addons[key].name}</button>`
  }
  template +=
    `</div>
      </div>
    </div>
    </main>
     <footer class="row py-3 mt-3">
    <div class="col d-flex justify-content-between">
      <p>games: <span>${game.count}</span></p>
      <p>wins: <span>${player.wins}</span></p>
      <p>last hit: <span>${game.session.lastHitVal}</span></p>
      <button id="reset" type="button" class=" btn btn-sm bg-dark text-white">Reset</button>
    </div>
  </footer>`
  template += `<div id="nameBox" class="card popup ${game.getName ? '' : 'd-none'}">
      <div class="card-body text-center">
      <h4 class="card-title">Soldier</h4>
      <input id="setPlayerName" class="rounded pl-1" type="text" placeholder="Your Name"></input>
        <button
          id="player"
          class="btn btn-sm mt-2 bg-dark text-white"
          type="button"
          onclick="window.app.controlers.gameConstructor.setName()">
          OK
          </button>
      </div>
    </div>`
  document.getElementById('app').innerHTML = template
}

function setHandelers() {


  Array.from(document.querySelectorAll("#actions button")).forEach(button => {
    button.addEventListener("click", _gameService.attack);
  });

  Array.from(document.querySelectorAll("#playerName~button")).forEach(
    button => {
      button.addEventListener("click", _gameService.setAddons);
    }
  )
  document.getElementById("reset").addEventListener("click", _gameService.reset);

}

export default class GameControler {
  constructor() {
    console.log('gameConstructor built')
    _gameService.addsubscriber('game', updatePage)
    _gameService.addsubscriber('game', setHandelers)
    _gameService.addsubscriber('player', updatePage)
    _gameService.addsubscriber('player', setHandelers)
    _gameService.addsubscriber('monster', updatePage)
    _gameService.addsubscriber('monster', setHandelers)
    updatePage()
    setHandelers()
  }

  replay() {
    _gameService.replay()
  }

  setName() {
    let newName = 'Soldier'
    if ($("#setPlayerName").val()) {
      newName = $("#setPlayerName").val();
    }
    _gameService.setName(newName)

  }
}