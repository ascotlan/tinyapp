const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//set view engine as ejs
app.set("view engine", "ejs");

//sample database
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// route handlers
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  res.render("urls_index", { urls: urlDatabase });
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  res.render("urls_show", { longURL: urlDatabase[id], id });
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
