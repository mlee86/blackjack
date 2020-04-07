const chalk = require("chalk");
let banner =
  chalk.black("♠") +
  " " +
  chalk.red("♥") +
  " " +
  chalk.black("♣") +
  " " +
  chalk.red("♦");
const displays = {
  banner: banner,
  welcome: chalk.bgWhite.black(
    "\n" + banner,
    banner,
    banner,
    banner,
    banner,
    banner,
    banner,
    banner,
    banner,
    `
.------..------..------..------..------..------..------..------..------.
|B.--. ||L.--. ||A.--. ||C.--. ||K.--. ||J.--. ||A.--. ||C.--. ||K.--. |
| :(): || :/\\: || (\\/) || :/\\: || :/\\: || :(): || (\\/) || :/\\: || :/\\: |
| ()() || (__) || :\\/: || :\\/: || :\\/: || ()() || :\\/: || :\\/: || :\\/: |
| '--'B|| '--'L|| '--'A|| '--'C|| '--'K|| '--'J|| '--'A|| '--'C|| '--'K|
\`------'\`------'\`------'\`------'\`------'\`------'\`------'\`------'\`------'` +
      "\n" +
      banner,
    banner,
    banner,
    banner,
    banner,
    banner,
    banner,
    banner,
    banner,
    `\n${banner} ${banner} Welcome to Blackjack! What is your name?${banner} ${banner} \n` +
      banner,
    banner,
    banner,
    banner,
    banner,
    banner,
    banner,
    banner,
    banner,
    "\n"
  ),
};
module.exports = displays;
