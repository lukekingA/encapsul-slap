export default class Player {
  constructor(name) {
    this.name = name
    this.wins = 0
    this.strength = {
      health: 100,
      energy: 100
    }
    this.experience = 0
    this.attacks = {
      punch: 5,
      kick: 10,
      slap: 1
    }
    this.addons = {
      slap: {
        name: 'knife',
        set: false,
        value: 2,
        cost: 3,
        timer: 8,
        resetTimer: 8
      },
      punch: {
        name: "sword",
        set: false,
        value: 5,
        cost: 6,
        timer: 12,
        resetTimer: 12
      },
      kick: {
        name: "armor",
        set: false,
        value: -5,
        cost: 15,
        timer: 200,
        resetTimer: 200
      }
    }
  }
}