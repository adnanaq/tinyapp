// function to generate random 6 character for ID to be used as key for the longURL.
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};

// function to check matching email and return key
const checkEmail = (email, obj) => {
  for (let key in obj) {
    if (obj[key].email.toLowerCase() === email.toLowerCase()) {
      return key;
    }
  }
};

module.exports = { generateRandomString, checkEmail }