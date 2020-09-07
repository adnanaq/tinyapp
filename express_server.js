const express = require('express');
const app = express();
const PORT = 8080; // default port
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const { generateRandomString, getUserByEmail, urlsForUser } = require('./helpers/helpers');

// setting up middlewares to be used in the project
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));

// links database
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "aJ48lW" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "aJ48lW" }
};

// object with empty database
const users = {};

// routing to home page
app.get('/', (req, res) => {

  req.session['user_id'] ? res.redirect('/urls') : res.redirect('/login');
});

// route to the list of short and long URL list
app.get('/urls', (req, res) => {

  const urlDatabaseFiltered = urlsForUser(req.session['user_id'], urlDatabase);

  const templateVars = {
    urls: urlDatabaseFiltered,
    user: users[req.session['user_id']]
  };

  req.session['user_id'] ? res.render('urls_index', templateVars) : res.send('Only registered users cna view the URLs');
});


// route to new URL search query
app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.session['user_id']]
  };

  req.session['user_id'] ? res.render('urls_new', templateVars) : res.redirect('/login');
});

// route to use shortURL/IDs to get to the longURL
app.get('/urls/:shortURL', (req, res) => {

  const shortURL = req.params.shortURL;

  if (!urlDatabase[shortURL]) {
    return res.send('Given URL ID does not exist!')
  }

  const longURL = urlDatabase[shortURL]['longURL'];

  const templateVars = {
    shortURL,
    longURL,
    user: users[req.session['user_id']]
  };

  if (req.session['user_id']) {
    if (urlDatabase[shortURL]['userID'] === req.session['user_id']) {
      return res.render('urls_show', templateVars);
    } else {
      return res.send('Cannot get the URL, Do not own it!.')
    };
  } else {
    return res.send('Please login to get the URL list!')
  }
});

// route to redirect to the actual website
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]['longURL'];
  longURL ? res.redirect(longURL) : res.send('The URL does not exist!')
});


// POST route to post/update the new url in the database
app.post('/urls', (req, res) => {

  const shortURL = generateRandomString();
  let longURL = req.body.longURL;
  const userID = req.session['user_id'];

  // validating if the entered URL starts with any http protocol
  if (longURL.match(/^(https:\/\/|http:\/\/)/g) === null) {
    longURL = 'http://' + longURL;
  }

  if (req.session['user_id']) {
    urlDatabase[shortURL] = { "longURL": longURL, "userID": userID };

    return res.redirect(`/urls/${shortURL}`);
  }
  return res.send('Please sign-in/register to add the URL!')
});

// route to delete URL using the key
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  if (req.session['user_id']) {
    if (urlDatabase[shortURL]['userID'] === req.session['user_id']) {
      delete urlDatabase[shortURL];
      return res.redirect('/urls')
    } else {
      return res.send('Cannot Delete, Do not own the URL!')
    }
  }
  res.send('Unauthorized/Unregistered user cannot delete the link');
});

// Edit the existing longURLs
app.post('/urls/:shortURL', (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;

  if (req.session['user_id']) {
    if (urlDatabase[shortURL]['userID'] === req.session['user_id']) {
      urlDatabase[shortURL]['longURL'] = longURL;
      return res.redirect('/urls');
    } else {
      return res.send('Cannot Edit the URL. Do not own it!')
    }
  }
  res.send('Please login/register to Edit the URL!')
});


// route to login page
// GET /login
app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.session['user_id']]
  };
  res.render('login_form', templateVars);
});

// route to registration page
// READ
// GET /register
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.session['user_id']]
  };
  res.render('registration_page', templateVars);
});

// route to feed infromation to login page
// POST /login
app.post('/login', (req, res) => {
  // storing the provided username in tthe cookies

  const email = req.body.email;
  const password = req.body.password;

  const emailkey = getUserByEmail(email, users);

  // if email doesn't exist
  if (!emailkey) {
    return res.status(400).send('User cannot be found!');
  }

  if (emailkey) {
    if (bcrypt.compareSync(password, users[emailkey].password)) {
      req.session.user_id = emailkey;
      return res.redirect('/urls');
    }
    return res.status(403).send('Incorrect Password');
  }
});

// route to fetch information from form on registration page
// POST /register
app.post('/register', (req, res) => {
  // checking if email or pssword is empty string
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('Missing email or password');
  }

  // checking if email already exits in the users object
  if (getUserByEmail(req.body.email, users)) {
    return res.status(400).send('Email already exist!');
  } else {

    const randomID = generateRandomString();
    users[randomID] = {
      id: randomID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };

    req.session['user_id'] = randomID;
    res.redirect('/urls');
  }
});

// route to logout
//GET /logout
app.get('/logout', (req, res) => {
  // clearing the cookie by logging-out
  console.log(req.session['user_id']);
  req.session = null;
  res.redirect('/urls');
});

// listening to the server at port 8080
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});