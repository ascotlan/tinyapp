// Check if usr registration email already exists in the users database
const getUserByEmail = function(users, email) {
  const profiles = users ? Object.values(users) : [];
  for (const profile of profiles) {
    if (profile.email === email) {
      return profile;
    }
  }

  return null;
};

module.exports = { getUserByEmail };
