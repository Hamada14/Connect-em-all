const db = require("./database_handler");
const User = require("./User");

class UserManager {

    constructor() {

    }

    registerUser(jsonUser) {
        let connection = db.connectToDatabase();
        let newUser = new User(jsonUser);
        try {
            newUser.register(connection, "social_media_db");
            // connection.end();
        } catch(error) {
            // connection.end();
            return false;
        }
        return true;
    }
}

module.exports = UserManager;