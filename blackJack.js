const fs = require("fs");
const chalk = require("chalk");
const inquirer = require("inquirer");
const deck = require("./deck");
const banner = require("./banner");
const person = require("./Person");
const players = require("./players.json");

//variables
let shoe = new deck();
let player = "";
let dealer = new person("The Dealer");
let hiddenCard = chalk.black.bgWhite("??");

//Updates total score for both
function updateScores() {
  player.score = getScore(player.hand);
  dealer.score = getScore(dealer.hand);
}
//Keeps half of dealer score hidden until player stops
function updatedPlayerScore() {
  player.score = getScore(player.hand);
  dealer.score = getCardValue(dealer.hand[1]);
  if (dealer.score === 1) {
    dealer.score += 10;
  }
}
//Assigns value to each card
function getCardValue(card) {
  switch (card.value) {
    case "A":
      return 1;
    case "2":
      return 2;
    case "3":
      return 3;
    case "4":
      return 4;
    case "5":
      return 5;
    case "6":
      return 6;
    case "7":
      return 7;
    case "8":
      return 8;
    case "9":
      return 9;
    default:
      return 10;
  }
}
function updatePlayer(p) {
  players[p.name.replace(/\s+/g, "").toUpperCase()] = p;
  fs.writeFileSync("./players.json", JSON.stringify(players));
}
//Calculates the score based on the cards in the player and dealer hands
function getScore(cardArray) {
  let score = 0;
  let aceInTheHole = false;
  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score = score + getCardValue(card);
    if (card.value === "A") {
      aceInTheHole = true;
    }
  }
  if (aceInTheHole && score + 10 <= 21) {
    return score + 10;
  }
  return score;
}

function checkStats() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "return",
        message: chalk.bgWhite.black(
          `\n${player.name}:\nrecord: ${player.wins}-${player.losses}-${player.tie}\nMoney: $${player.money}\n`
        ),
        choices: ["BACK"],
      },
    ])
    .then(function () {
      whatToDo();
    });
}

function addMoney() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "money",
        message: chalk.bgWhite.black(
          `${player.name}:
          Bank: ${player.money}
          How much money would you like to add to your bank?`
        ),
        choices: ["$50", "$100", "$250", "$500", "$1000"],
      },
    ])
    .then(function (response) {
      money = parseInt(response.wager.replace("$", ""));
      player.money += money;
      console.log(`$${money} added to account.
        ${player.name} now has $${player.money}`);
      whatToDo();
    });
}

function whatToDo() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: chalk.bgWhite.black(
          `\nWelcome ${player.name}\nWhat would you like to do?`
        ),
        choices: ["Play Blackjack", "Check Stats", "Add Money", "Exit"],
      },
    ])
    .then(function (response) {
      if (response.action === "Play Blackjack") {
        initialBet();
      }
      if (response.action === "Check Stats") {
        checkStats();
      }
      if (response.action === "Add Money") {
        addMoney();
      }
    });
}
//Logs the results of the game and prompts to start a new game or exit
function whoWins(player) {
  if (player.score > 21) {
    console.log(`${player.name} has busted!`);
    console.log("The Dealer has won");
    player.losses++;
    updatePlayer(player);
  } else if (dealer.score > 21) {
    console.log("The Dealer has busted!");
    console.log(`${player.name} has won $${player.bet}`);
    player.wins++;
    player.money += player.bet * 2;
    updatePlayer(player);
  } else if (player.score <= 21 && dealer.score < 17) {
    return;
  } else if (player.score > dealer.score) {
    console.log(`${player.name} has won $${player.bet}`);
    player.wins++;
    player.money += player.bet * 2;
    updatePlayer(player);
  } else if (player.score < dealer.score) {
    if (dealer.score === 21) {
      console.log("21! The Dealer has won");
      player.losses++;
      updatePlayer(player);
    } else {
      console.log("The dealer has won.");
      player.losses++;
      updatePlayer(player);
    }
  } else {
    player.tie++;
    player.money += player.bet;
    updatePlayer(player);
    console.log("It's a push! The game is a tie!");
    console.log(
      `${player.name} receives their original bet of $${player.bet} back`
    );
  }
  setTimeout(function () {
    whatToDo();
  }, 2000);
}

function dealCards(player) {
  player.push(shoe.deal());
}
function getCard(card) {
  let deckCard = [];
  if (card.suit === "♠" || card.suit === "♣") {
    deckCard.push(chalk.black.bgWhite(card.value + "" + card.suit));
  } else {
    deckCard.push(chalk.red.bgWhite(card.value + "" + card.suit));
  }
  return deckCard;
}
function getAllCards(cardArr) {
  let deckCard = "";
  cardArr.forEach((card) => {
    if (card.suit === "♠" || card.suit === "♣") {
      deckCard =
        deckCard + " " + chalk.black.bgWhite(card.value + "" + card.suit);
    } else {
      deckCard =
        deckCard + " " + chalk.red.bgWhite(card.value + "" + card.suit);
    }
  });
  return deckCard;
}

function playerAction() {
  let lastCard = getCard(player.hand[player.hand.length - 1]);
  console.log(`${player.name} was dealt ${lastCard}`);
  console.log(`${player.name} has: 
          ${getAllCards(player.hand)}\n`);
  console.log(`\nThe Dealer has: 
          ${hiddenCard}  ${getCard(dealer.hand[1])} \n`);
  console.log(
    `${player.name} now has ${player.score} and the dealer has ${dealer.score}`
  );
  console.log(`Current bet is: $${player.bet}`);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
}

function dealerAction() {
  let lastCard = getCard(dealer.hand[dealer.hand.length - 1]);
  console.log(`The dealer was dealt: ${lastCard}`);
  console.log(`${player.name} has: 
          ${getAllCards(player.hand)}\n`);
  console.log(`\nThe Dealer has: 
          ${getAllCards(dealer.hand)}\n`);
  console.log(
    `${player.name} has ${player.score} and the dealer has ${dealer.score}`
  );
  console.log(`Current bet is: $${player.bet}`);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
}

function dealerTurn() {
  updateScores();
  console.log(`The Dealer has: 
  ${getAllCards(dealer.hand)}
  \nThe Dealer has ${dealer.score}`);
  if (dealer.score < 17) {
    var interval = setInterval(dealerHit, 1500);
    function dealerHit() {
      if (dealer.score >= 17) {
        clearInterval(interval);
      } else {
        dealCards(dealer.hand), updateScores(), dealerAction();
        whoWins(player);
      }
    }
  } else {
    setTimeout(function () {
      whoWins(player);
    }, 1500);
  }
}

function ask() {
  let options = [];
  if (player.turn > 1) {
    options = ["Hit", "Stay"];
  } else {
    options = ["Hit", "Stay", "Double Down"];
  }
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: chalk.bgWhite.black(
          `\n${player.name} currently has ${player.score} \nThe Dealer currently has ${dealer.score}\nCurrent bet: ${player.bet}\nWould you like to hit or stay?`
        ),
        choices: options,
      },
    ])
    .then(function (response) {
      if (response.action === "Hit") {
        dealCards(player.hand);
        updatedPlayerScore();
        playerAction();
        if (player.score <= 21) {
          setTimeout(function () {
            player.turn++;
            ask();
          }, 1500);
        } else {
          setTimeout(function () {
            whoWins(player);
          }, 1500);
        }
      } else if (response.action === "Double Down") {
        if (player.money < player.bet) {
          console.log(
            "You do not have enough money to double down, please select another option"
          );
          ask();
        } else {
          player.money -= player.bet;
          player.bet *= 2;
          dealCards(player.hand);
          updatedPlayerScore();
          playerAction();
          dealerTurn();
        }
      } else {
        dealerTurn();
      }
    });
}
function initialBet() {
  player.bet = 0;
  inquirer
    .prompt([
      {
        type: "list",
        name: "wager",
        message: chalk.bgWhite.black(
          `\n${player.name}:\nBank: $${player.money}\nPlease make an inital bet to play`
        ),
        choices: ["$5", "$10", "$15", "$20", "$50"],
      },
    ])
    .then(function (response) {
      wager = parseInt(response.wager.replace("$", ""));
      if (wager > player.money) {
        console.log(
          "You do not have that much money available, please select a smaller bet"
        );
        initialBet();
      } else {
        player.money -= wager;
        player.bet = wager;
        startGame();
      }
    });
}

/*
Initializes the actual game. This will set both hands to empty, create a deck and deal random cards
The function will also prompt for user to hit or stay
*/
function startGame() {
  player.hand = [];
  dealer.hand = [];
  player.turn = 0;
  if (shoe.deck.length <= 26) {
    console.log("Time to shuffle the deck");
    shoe.reset();
    console.log(getAllCards(shoe.deck));
    shoe.shuffle();
  }
  dealCards(player.hand);
  dealCards(dealer.hand);
  dealCards(player.hand);
  dealCards(dealer.hand);
  updatedPlayerScore();
  setTimeout(function () {
    player.turn++;
    console.log(`${player.name} has been dealt: 
    ${getAllCards(player.hand)}\n${player.name} has ${player.score}\n`);
  }, 500);
  setTimeout(function () {
    console.log(`\nThe Dealer has been dealt: 
    ${hiddenCard}  ${getCard(dealer.hand[1])} \nThe Dealer has ${dealer.score}`);
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
    ask();
  }, 1500);
}
//First prompt to get the players name and start the gameplay
function getName() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: banner.welcome,
      },
    ])
    .then(function (p) {
      console.log(
        chalk.bgWhite.black(
          `${banner.banner}Thanks ${p.name} Good luck to you!${banner.banner}`
        )
      );
      var keys = Object.keys(players);
      key = keys.find((item) => {
        return item === p.name.toUpperCase();
      });
      if (key === undefined) {
        player = new person(p.name);
        playerKey = player.name.replace(/\s+/g, "").toUpperCase();
        players[playerKey] = player;
        updatePlayer(player);
      } else {
        player = players[key];
      }
      // startGame();
      if (player.money < 10) {
        player.money = 100;
      }
      whatToDo();
    });
}

getName();
