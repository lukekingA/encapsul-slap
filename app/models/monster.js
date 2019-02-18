export default class Monster {
  constructor() {
    this.names = ['Ragnor', 'Terrorificus', 'Bill']
    this.name = ''
    this.strength = {
      health: 100,
      energy: 100, //affected by age, random
      age: ""
    }
    this.hunger = 0
    this.attacks = {
      bite: 18,
      claw: 10
    }
  }


}