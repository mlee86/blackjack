const players = require("./players.json");
function listAll() {
  let keys = Object.keys(players);
  keys.forEach((key) => {
    console.log(
      `${players[key].name} has a record of ${players[key].wins}-${players[key].losses}-${players[key].tie}`
    );
  });
}
function check(name) {
  if (name === undefined) {
    return listAll();
  }
  const user = players[name.toUpperCase()];
  if (user !== undefined) {
    console.log(
      `${user.name} has a record of ${user.wins}-${user.losses}-${user.tie}`
    );
  } else {
    console.log(name + " not found");
  }
}
check(process.argv[2]);
