class Person {
  name;
  wins;
  losses;
  tie;
  hand;
  score;
  money;
  bet;
  turn;
  constructor(name){
    this.name = name,
    this.wins = 0,
    this.losses = 0,
    this.tie = 0,
    this.hand = [],
    this.score = 0,
    this.money = 0
    this.bet = 0;
    this.turn = 0
  }

}

module.exports = Person;
