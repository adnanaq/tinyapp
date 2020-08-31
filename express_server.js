const express = require('express');
const { render } = require('ejs');
const app = express();
const PORT = 8080 // default port

app.set('view engine', 'ejs');

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

app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]

  const templateVars = {
    shortURL, longURL
  }

  // console.log(req.params.shiort)
  res.render('urls_show', templateVars)
})
app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})