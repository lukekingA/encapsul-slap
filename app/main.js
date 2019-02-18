import GameControler from './components/gameControler.js'


class App {
  constructor() {
    this.controlers = {
      gameConstructor: new GameControler()
    }
  }
}

window.app = new App()