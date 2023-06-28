const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser"); //require cookie parser middleware

//set view engine as ejs
app.set("view engine", "ejs");

// Use middleware to encode form data to UTF-8 that is sent as a buffer
app.use(express.urlencoded({ extended: true }));

// Use middleware to Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(cookieParser());

//sample database
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Generate random string of 6 alphanumeric characters
function generateRandomString() {
  let result = "";
  const letters = {
    0: "a",
    1: "b",
    2: "c",
    3: "d",
    4: "e",
    5: "f",
    6: "g",
    7: "h",
    8: "i",
    9: "j",
    10: "k",
    11: "l",
    12: "m",
    13: "n",
    14: "o",
    15: "p",
    16: "q",
    17: "r",
    18: "s",
    19: "t",
    20: "u",
    21: "v",
    22: "w",
    23: "x",
    24: "y",
    25: "z",
  };

  const digits = {
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
  };

  // return random integer from the range 0,1,....,max-1
  function getRandomInteger(max) {
    return Math.floor(Math.random() * max);
  }

  while (result.length < 6) {
    const letterOrDigit = getRandomInteger(2);
    const upperOrLowerCase = getRandomInteger(2);

    if (letterOrDigit) {
      let letter = letters[getRandomInteger(26)];
      if (upperOrLowerCase) {
        letter = letter.toUpperCase();
      }
      result += letter;
    } else {
      const digit = digits[getRandomInteger(10)];
      result += digit;
    }
  }

  return result;
}

//****route handlers****//

app.get("/", (req, res) => {
  res.send("Hello!");
});

//render dynamic url values for the database and cookies at view urls_index when /urls endpoint receives GET
app.get("/urls", (req, res) => {
  res.render("urls_index", {
    urls: urlDatabase,
    username: req.cookies["username"],
  });
});

//Save new database entry with random string ID with a POST to /urls
app.post("/urls", (req, res) => {
  const id = generateRandomString(); //generate random id string
  urlDatabase[id] = req.body.longURL; //populate database with new id:LongURL key:value pair

  // The `res.redirect()` function sends back an HTTP 302 by default.
  // When an HTTP client receives a response with status 302, it will send
  // an HTTP request to the URL in the response
  res.redirect(`/urls/${id}`);
});

//Route handler: User sign up page
app.get("/register", (req, res) => {
  res.render("register");
});

//Set cookie value to username and send back cookie to browser, then redirect to /urls with a POST to route /logins
app.post("/login", (req, res) => {
  if (req.body.username.length) {
    res.cookie("username", req.body.username);
    return res.redirect("/urls");
  }

  res.status(400).send({ Error: "Please enter a Username" });
});

//Implement the /logout endpoint so that it clears the username cookie and redirects the user back to the /urls page.
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

//Display view urls_new with GET to /urls/new
app.get("/urls/new", (req, res) => {
  res.render("urls_new", { username: req.cookies["username"] });
});

//render view urls_show with dynamic data based on id when GET sent to /urls/:id
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  if (urlDatabase[id]) {
    return res.render("urls_show", {
      longURL: urlDatabase[id],
      id,
      username: req.cookies["username"],
    });
  }

  res
    .status(404)
    .send({ Error: "client requests a short URL with a non-existant id" });
});

//Redirect to longURL value based on id when GET is sent to /u/:id
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

//Delete database entry based on id when a POST is sent to /urls/:id/delete
app.post("/urls/:id/delete", (req, res) => {
  if (urlDatabase[req.params.id]) {
    delete urlDatabase[req.params.id];
    return res.redirect("/urls");
  }

  res
    .status(404)
    .send({ Error: "client requests a short URL with a non-existant id" });
});

//Update value to database entry based on id when a POST is sent to endpoint /urls/:id
app.post("/urls/:id", (req, res) => {
  if (urlDatabase[req.params.id]) {
    urlDatabase[req.params.id] = req.body.longURL;
    return res.redirect("/urls");
  }

  res
    .status(404)
    .send({ Error: "client requests a short URL with a non-existant id" });
});

//Respond with stringyfied JSON copy of database when a GET is sent to the /urls.json endpoint
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//listen on a given port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
