const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//set view engine as ejs
app.set("view engine", "ejs");

// Use middleware to encode form data to UTF-8 that is sent as a buffer
app.use(express.urlencoded({ extended: true }));

//sample database
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

function generateRandomString() {
  let result = "";
  const letters = {
    1: "a",
    2: "b",
    3: "c",
    4: "d",
    5: "e",
    6: "f",
    7: "g",
    8: "h",
    9: "i",
    10: "j",
    11: "k",
    12: "l",
    13: "m",
    14: "n",
    15: "o",
    16: "p",
    17: "q",
    18: "r",
    19: "s",
    20: "t",
    21: "u",
    22: "v",
    23: "w",
    24: "x",
    25: "y",
    26: "z",
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
      let letter = letters[getRandomInteger(27)];
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

// route handlers
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  res.render("urls_index", { urls: urlDatabase });
});

app.post("/urls", (req, res) => {
  console.log(req.body, `ShortURL: ${generateRandomString()}`); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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
