// Generate random 6 character for ID to be used as key for the longURL.
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};

// Check matching email and return key
const getUserByEmail = (email, database) => {
  for (let key in database) {
    if (database[key].email.toLowerCase() === email.toLowerCase()) {
      return key;
    }
  }
};

// filter the user in the database
// based on the user_ID
const urlsForUser = (id, db) => {
  let filteredDB = {}

  for (let key in db) {
    if (id === db[key]['userID']) {
      filteredDB[key] = db[key]
    }
  }
  return filteredDB;
}

module.exports = { generateRandomString, getUserByEmail, urlsForUser }