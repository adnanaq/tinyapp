const express = require('express');
const { render } = require('ejs');
const app = express();
const PORT = 8080 // default port
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))

function generateRandomString() {
  console.log(Math.random().toString(36).substring(0, 7))
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

// routing in express
app.get('/', (req, res) => {
  res.send('Hello!')
})

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
})

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.post('/urls/', (req, res) => {
  console.log(req.body); // log the POST request's body to console.
  res.send('OK') // Responds with the OK.
})

app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]

  const templateVars = {
    shortURL, longURL
  }
  res.render('urls_show', templateVars)
})


app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})