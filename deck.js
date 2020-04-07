class Deck {
  constructor() {
    this.deck = [];
    this.reset();
    this.shuffle();
  }
  reset() {
    this.deck = [];
    const suits = ["♠", "♣", "♥", "♦"];
    const values = [
      "A",
      "K",
      "Q",
      "J",
      "10",
      "9",
      "8",
      "7",
      "6",
      "5",
      "4",
      "3",
      "2",
    ];
    for (let suit in suits) {
      for (let val in values) {
        let card = {
          suit: suits[suit],
          value: values[val],
        };
        this.deck.push(card);
      }
    }
  }
  shuffle() {
    const { deck } = this;
    let m = deck.length,
      i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      [deck[m], deck[i]] = [deck[i], deck[m]];
    }
    return this;
  }
  deal() {
    return this.deck.pop();
  }
}
module.exports = Deck;
