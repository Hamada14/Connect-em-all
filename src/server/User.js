var db = require("./database_handler");

class User {
    constructor(jsonUser) {
        this.userName = jsonUser.userName;
        this.email = jsonUser.email;
        this.hashedPassword = jsonUser.hashedPassword;
        this.passwordSalt = jsonUser.passwordSalt;
        this.userId = jsonUser.userId;
        this.cookie = jsonUser.cookie;
        this.profilePicture = jsonUser.profilePicture;
        this.cookie = jsonUser.cookie;
        this.birthdate = jsonUser.birthdate;
    }

    register(connection, databaseName) {
        if(!this._isValidMail()) {
            throw "Invalid email address exception";
        }
        console.log("create user");
        db.creatUser(connection, this, databaseName);
    }

    _isValidMail() {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(this.email).toLowerCase());
    }
}

module.exports = User;
