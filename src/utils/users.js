const fs = require("fs");
const path = require("path");

const log = require("./logger.js");

const dataDir = path.join(__dirname, "..", "..", "data");
const usersFile = path.join(dataDir, "users.json");

function loadUsers() {
  try {
    if (!fs.existsSync(usersFile)) {
      return {};
    }

    return JSON.parse(
      fs.readFileSync(usersFile, "utf8")
    );
  } catch (error) {
    log("error", "failed_load_users", {
      error: error.message
    });

    throw error;
  }
}

function saveUsers(users) {
  try {
    fs.mkdirSync(dataDir, {
      recursive: true
    });

    fs.writeFileSync(
      usersFile,
      JSON.stringify(users, null, 2),
      "utf8"
    );
  } catch (error) {
    log("error", "failed_save_users", {
      error: error.message
    });

    throw error;
  }
}

function saveUser(user) {
  const users = loadUsers();
  const id = String(user.id);
  const now = new Date().toISOString();
  const existingUser = users[id];

  users[id] = {
    id: user.id,
    firstName: user.first_name || null,
    username: user.username || null,
    firstSeen: existingUser?.firstSeen || now,
    lastSeen: now
  };

  saveUsers(users);

  return users[id];
}

function getUser(id) {
  const users = loadUsers();

  return users[String(id)] || null;
}

function getUsers() {
  return Object.values(loadUsers());
}

function getUserCount() {
  return getUsers().length;
}

module.exports = {
  saveUser,
  getUser,
  getUsers,
  getUserCount
};