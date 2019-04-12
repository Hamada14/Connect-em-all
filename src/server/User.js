const db = require("./database_handler");

class User {
  constructor(jsonUser) {
    if(jsonUser) {
      this.fullName = jsonUser.fullName;
      this.email = jsonUser.email;
      this.hashedPassword = jsonUser.hashedPassword;
      this.passwordSalt = jsonUser.passwordSalt;
      this.userId = jsonUser.userId;
      this.cookie = jsonUser.cookie;
      this.profilePicture = jsonUser.profilePicture;
      this.cookie = jsonUser.cookie;
      this.birthdate = jsonUser.birthdate;
    }
  }

  getDetails(connection, databaseName, email) {
    return db.getUserDetailsByEmail(connection, email, databaseName);
  }
}

module.exports = User;
