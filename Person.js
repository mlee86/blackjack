class Person {
  constructor(name) {
    (this.name = name), (this.wins = 0), (this.losses = 0), (this.tie = 0);
  }
}
module.exports = Person;
