const fs = require("fs");
const chalk = require("chalk");
const inquirer = require("inquirer");
const deck = require("./deck");
const banner = require("./banner");
const person = require("./Person");
const players = require("./players.json");
//variables
let playerScore = 0;
let dealerScore = 0;
let playerCards = [];
let dealerCards = [];
let shoe = new deck();
let playerName = "";
let player = ""; //new person
//Updates total score for both
function updateScores() {
  playerScore = getScore(playerCards);
  dealerScore = getScore(dealerCards);
}
//Keeps half of dealer score hidden until player stops
function updatedPlayerScore() {
  playerScore = getScore(playerCards);
  dealerScore = getCardValue(dealerCards[1]);
  if (dealerScore === 1) {
    dealerScore += 10;
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
//Logs the results of the game and prompts to start a new game or exit
function whoWins(player) {
  if (playerScore > 21) {
    console.log(`${playerName} has busted!`);
    console.log("The Dealer has won");
    player.losses++;
    updatePlayer(player);
    setTimeout(function () {
      playAgain();
    }, 2000);
  } else if (dealerScore > 21) {
    console.log("The Dealer has busted!");
    console.log(`${playerName} has won`);
    player.wins++;
    updatePlayer(player);
    setTimeout(function () {
      playAgain();
    }, 2000);
  } else if (playerScore <= 21 && dealerScore < 17) {
    return;
  } else if (playerScore > dealerScore) {
    console.log(`${playerName} has won`);
    player.wins++;
    updatePlayer(player);
    setTimeout(function () {
      playAgain();
    }, 2000);
  } else if (playerScore < dealerScore) {
    if (dealerScore === 21) {
      console.log("21! The Dealer has won");
      player.losses++;
      updatePlayer(player);
      setTimeout(function () {
        playAgain();
      }, 2000);
    } else {
      console.log("The dealer has won.");
      player.losses++;
      updatePlayer(player);
      setTimeout(function () {
        playAgain();
      }, 2000);
    }
  } else {
    player.tie++;
    updatePlayer(player);
    console.log("It's a push! The game is a tie!");
    setTimeout(function () {
      playAgain();
    }, 2000);
  }
}
function playAgain(name) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: chalk.bgWhite.black(
          `\nGreat game ${playerName}\nWould you like to push your luck with another game?`
        ),
        choices: ["Yes", "No", "Check Score"],
      },
    ])
    .then(function (response) {
      if (response.action === "Yes") {
        console.log(chalk.bgRed.black(`Another round, ${playerName}!`));
        startGame(name);
      } else if (response.action === "Check Score") {
        console.log(
          `${playerName} has a record of: ${player.wins}-${player.losses}-${player.tie}`
        );
        setTimeout(function () {
          playAgain();
        }, 2500);
      } else {
        console.log(
          chalk.bgRed.black(
            `Thanks for playing ${playerName.toString("").toUpperCase()}`
          )
        );
      }
    });
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
/*
Initializes the actual game. This will set both hands to empty, create a deck and deal random cards
The function will also prompt for user to hit or stay
*/
function startGame() {
  playerCards = [];
  dealerCards = [];
  if (shoe.deck.length <= 26) {
    console.log("Time to shuffle the deck");
    shoe.reset();
    console.log(getAllCards(shoe.deck));
    shoe.shuffle();
  }
  let hiddenCard = "🃏";
  dealCards(playerCards);
  dealCards(dealerCards);
  dealCards(playerCards);
  dealCards(dealerCards);
  updatedPlayerScore();
  let playerTurn = 1;
  let dealerTurn = 1;
  setTimeout(function () {
    console.log(`${playerName} has been dealt: 
    ${getAllCards(playerCards)}\n${playerName} has ${playerScore}\n`);
    // let pc = getAllCards(playerCards)
    // console.log(pc);
  }, 500);
  setTimeout(function () {
    console.log(
      `\nThe Dealer has been dealt: 
    ${hiddenCard}  ${getCard(dealerCards[1])} \nThe Dealer has ${dealerScore}`
    );
    ask(playerName);
  }, 1500);
  function ask() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "action",
          message: chalk.bgWhite.black(
            `\n${playerName} currently has ${playerScore} \nWould you like to hit or stay?`
          ),
          choices: ["Hit", "Stay"],
        },
      ])
      .then(function (response) {
        if (response.action === "Hit") {
          dealCards(playerCards);
          console.log(
            `${playerName} was dealt ${getCard(playerCards[playerTurn + 1])}`
          );
          updatedPlayerScore();
          console.log(`${playerName} has: 
          ${getAllCards(playerCards)}\n`);
          console.log(
            `\nThe Dealer has: 
          ${hiddenCard}  ${getCard(dealerCards[1])} \n`
          );
          console.log(
            `${playerName} now has ${playerScore} and the dealer has ${dealerScore}`
          );
          playerTurn++;
          if (playerScore <= 21) {
            setTimeout(function () {
              ask();
            }, 1500);
          } else {
            setTimeout(function () {
              whoWins(player);
            }, 1500);
          }
        } else {
          updateScores();
          console.log(`The Dealer has: 
          ${getAllCards(dealerCards)}
          \nThe Dealer has ${dealerScore}`);
          if (dealerScore < 17) {
            var interval = setInterval(dealerHit, 1500);
            function dealerHit() {
              if (dealerScore >= 17) {
                clearInterval(interval);
              } else {
                dealCards(dealerCards),
                  updateScores(),
                  console.log(`${playerName} has: 
                  ${getAllCards(playerCards)}\n`);
                console.log(
                  `\nThe Dealer has: 
                    ${getAllCards(dealerCards)}\n`
                );
                console.log(
                  `${playerName} now has ${playerScore} and the dealer has ${dealerScore}`
                );
                dealerTurn++;
                whoWins(player);
              }
            }
          } else {
            setTimeout(function () {
              whoWins(player);
            }, 1500);
          }
        }
      });
  }
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
        fs.writeFileSync(
          "./players.json",
          JSON.stringify(players),
          function () {
            console.log("name added:");
          }
        );
      } else {
        player = players[key];
      }
      playerName = player.name;
      startGame();
    });
}
getName();
