let random = Math.floor(Math.random() * 10);

export default class Game {
  constructor() {
    this.session = {
      plays: 0,
      lastHitVal: 0,
      random: random,
      punch: false,
      kick: false,
      slap: false,
      monsterPic: '../assets/images/abear.png'
    }
    this.getName = true
    this.count = 0
  }
}