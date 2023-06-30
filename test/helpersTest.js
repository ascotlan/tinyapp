const { assert } = require("chai");

const { getUserByEmail } = require("../helper");

const testUsers = {
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

describe("getUserByEmail", function () {
  it("should return a user with valid email", function () {
    const user = getUserByEmail(testUsers, "user@example.com");
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID, "Id's should be equal");
  });

  it("should return null with invalid email", function () {
    const user = getUserByEmail(testUsers, "test@example.com");
    assert.isNull(user, "null");
  });

  it("should return null with empty database", function () {
    const user = getUserByEmail({}, "test@example.com");
    assert.isNull(user, "null");
  });

  it("should return null with undefined email", function () {
    const user = getUserByEmail({});
    assert.isNull(user, "null");
  });

  it("should return null with undefined database", function () {
    const user = getUserByEmail(undefined, "test@example.com");
    assert.isNull(user, "null");
  });
});
