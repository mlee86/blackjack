# WELCOME TO BLACKJACK

This is a refactored version of Blackjack that I created for a programming class assignment. A win/loss record is kept for each name entered in players.json and this record can be viewed either during the game or by running the command line arguement to check scores.

## Introduction

Blackjack is a game where a player is competing with the dealer to be the closest to 21 points without going over.
If the player is below 21 points, they can continue to receive cards until they either go over 21 and bust or decide to stay.
The dealer must continue to receive cards until they reach 17 points or bust.
The deck will reset and shuffle on the start of the program and when the deck is down to 26 cards.

## Required Packages

```
Chalk
Inquirer
FS
```

## Instructions

To begin the game, enter the command `npm start` in the terminal and enter your name when requested.
You will be dealt two cards along with the dealer. You can choose "hit" to recieve an additional card or "stay" to stay with your original two cards. If you choose "hit", you will be shown your new card and the score will be recalculated. When the player decides to "stay", the dealer will receive cards until they reach 17 points or bust by going over 21.
After each game, the player will be asked if they want to continue playing, leave the game, or look at their score for the game.
To exit the game, select the No option when prompted after a hand if you would like to continue.
To check a players score outside the game, enter the command `npm run score <name>` passing in the name of the user you want to check. If no user name is passed in, it will print out the records for every user.
