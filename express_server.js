const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieSession = require("cookie-session"); //require cookie session middleware
const bcrypt = require("bcryptjs"); //password hashing algorithm

//set view engine as ejs
app.set("view engine", "ejs");

// Use middleware to encode form data to UTF-8 that is sent as a buffer
app.use(express.urlencoded({ extended: true }));

// Use middleware to Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

//sample url database
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

//sample user database
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

// Check if usr registration email already exists in the users database
const getUserByEmail = function (email) {
  for (profile of Object.values(users)) {
    if (profile.email === email) {
      return profile;
    }
  }

  return null;
};

//returns the URLs where the userID is equal to the id of the currently logged-in user
const urlsForUser = (id) => {
  const result = {};
  for (let urlId in urlDatabase) {
    if (urlDatabase[urlId].userID === id) {
      result[urlId] = urlDatabase[urlId];
    }
  }
  return result;
};

// Generate random string of 6 alphanumeric characters
const generateRandomString = function () {
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
};

//****route handlers****//

app.get("/", (req, res) => {
  res.send("Hello!");
});

//render dynamic url values for the database and cookies at view urls_index when /urls endpoint receives GET
app.get("/urls", (req, res) => {
  const id = req.session.user_id; //To read a decrypted cookie value
  if (id) {
    return res.render("urls_index", {
      urls: urlsForUser(id),
      user: users[id],
    });
  }
  res.render("landingPage", { user: "" });
});

//Save new database entry with random string ID with a POST to /urls
app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    return res.status(403).render("error", {
      error: "Only Registered Users Can Shorten URLs",
    });
  }

  const id = generateRandomString(); //generate random id string
  urlDatabase[id] = {
    longURL: req.body.longURL,
    userID: req.session.user_id,
  }; //populate database with new id:LongURL key:value pair

  // The `res.redirect()` function sends back an HTTP 302 by default.
  // When an HTTP client receives a response with status 302, it will send
  // an HTTP request to the URL in the response
  res.redirect(`/urls/${id}`);
});

//Route handler: GET User sign up page
app.get("/register", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls");
  }
  res.render("register", { user: "", error: "" });
});

//Route handler: GET User login page
app.get("/login", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls");
  }
  res.render("login", { user: "", error: "" });
});

//Route handler: POST user sign up data and create a new user
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const user = getUserByEmail(req.body.email);

  if (req.body.email.length && req.body.password.length && !user) {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    users[id] = {
      id,
      email: req.body.email,
      password: hashedPassword,
    };

    req.session.user_id = id; // set the user_id key on a session

    return res.redirect("/urls");
  }

  res.status(400).render("register", {
    user: "",
    error: `${user.email} is already in use. Try another email address.`,
  });
});

//Set cookie value to user_id and send back cookie to browser, then redirect to /urls with a POST to route /logins
app.post("/login", (req, res) => {
  const user = getUserByEmail(req.body.email);
  const correctPassword = user
    ? bcrypt.compareSync(req.body.password, user.password)
    : null;
  if (user && correctPassword) {
    req.session.user_id = user.id; //set the user_id key on a session
    return res.redirect("/urls");
  }

  res.status(403).render("login", {
    user: "",
    error:
      "Email and/or password does not exist. Please try again or register new account.",
  });
});

//Implement the /logout endpoint so that it clears the user_id cookie and redirects the user back to the /urls page.
app.post("/logout", (req, res) => {
  req.session = null; //destroy a session
  res.redirect("/login");
});

//Display view urls_new with GET to /urls/new
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  res.render("urls_new", { user: users[req.session.user_id] });
});

//render view urls_show with dynamic data based on id when GET sent to /urls/:id
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const userDb = urlsForUser(req.session.user_id);

  if (req.session.user_id) {
    if (userDb[id]) {
      res.render("urls_show", {
        longURL: userDb[id].longURL,
        id,
        user: users[req.session.user_id],
      });
    } else if (urlDatabase[id]) {
      res.status(403).render("missing", {
        user: users[req.session.user_id],
        error:
          "client request for a shortened URL denied because you do not have permission to access resource.",
      });
    } else {
      res.status(404).render("missing", {
        user: users[req.session.user_id],
        error: "client requests a shortened URL with a non-existant id.",
      });
    }
  } else {
    res.status(401).render("missing", {
      user: users[req.session.user_id],
      error:
        "client request for a shortened URL denied because you are not logged in.",
    });
  }
});

//Redirect to longURL value based on id when GET is sent to /u/:id
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  res.redirect(longURL);
});

//Delete database entry based on id when a POST is sent to /urls/:id/delete
app.post("/urls/:id/delete", (req, res) => {
  const userDb = urlsForUser(req.session.user_id);

  if (req.session.user_id) {
    if (userDb[req.params.id]) {
      delete urlDatabase[req.params.id];
      res.redirect("/urls");
    } else if (urlDatabase[req.params.id]) {
      res.status(403).render("error", {
        error:
          "client cannot delete this shortened URL because you do not have permission to access this resource.",
      });
    } else {
      res.status(404).render("error", {
        error: "client trying to delete a shortened URL with a non-existant id",
      });
    }
  } else {
    res.status(401).render("error", {
      error:
        "client cannot delete a shortened URL because you are not logged in.",
    });
  }
});

//Update value to database entry based on id when a POST is sent to endpoint /urls/:id
app.post("/urls/:id", (req, res) => {
  const userDb = urlsForUser(req.session.user_id);

  if (req.session.user_id) {
    if (userDb[req.params.id]) {
      urlDatabase[req.params.id].longURL = req.body.longURL;
      res.redirect("/urls");
    } else if (urlDatabase[req.params.id]) {
      res.status(403).render("error", {
        error:
          "client cannot update this shortened URL because you do not have permission to access this resource.",
      });
    } else {
      res.status(404).render("error", {
        error: "client trying to update a shortened URL with a non-existant id",
      });
    }
  } else {
    res.status(401).render("error", {
      error:
        "client cannot update a shortened URL because you are not logged in.",
    });
  }
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
