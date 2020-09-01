const express = require('express');
const { render } = require('ejs');
const app = express();
const PORT = 8080 // default port
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.set('view engine', 'ejs'); // setting up the view engine with ejs
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))

// function to generate rando 6 character of ID to be used as key for the longURL.
function generateRandomString() {
  return Math.random().toString(36).substring(2, 8)
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

// routing in express
app.get('/', (req, res) => {
  res.send('Hello!')
})

// route to the list of short and long URL list
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
})

// route to new URL search query
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

// route to use shortURL to get to the longURL
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];


  const templateVars = {
    shortURL, longURL
  }
  res.render('urls_show', templateVars)
})

// POST route to post the new url in the database
app.post('/urls/', (req, res) => {

  const shortURL = generateRandomString();
  const longURL = req.body.longURL;

  urlDatabase[shortURL] = longURL

  res.redirect(`/urls/${shortURL}`)
})

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
})

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL
  delete urlDatabase[shortURL]
  res.redirect('/urls')
})


app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})