// Check if usr registration email already exists in the users database
const getUserByEmail = function (users, email) {
  const profiles = users ? Object.values(users) : [];
  for (const profile of profiles) {
    if (profile.email === email) {
      return profile;
    }
  }

  return null;
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

module.exports = { getUserByEmail, generateRandomString };
