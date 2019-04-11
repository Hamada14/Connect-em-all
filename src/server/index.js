const express = require('express');
const os = require('os');
const UserManager = require('./UserManager');
const app = express();
const db = require("./database_handler")

const OK_STATUS_CODE = 200;
const ERROR_STATUS_CODE = 400;


app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

app.post('/api/register', (req, res) => {
    userManager = new UserManager();
    successfullRegisteration = userManager.registerUser(req.user);
    if(successfullRegisteration) {
        res.status(OK_STATUS_CODE);
        return res.send('Received a POST HTTP method');
    } else {
        res.status(ERROR_STATUS_CODE);
        return res.send('Error registeraion: wrong email address')
    }
});

var user = {
    userName: "Moamen",
    email: "toto.me@gmail.com",
    hashedPassword: "hashedpassword",
    passwordSalt: "salt",
    userId: -1,
    cookie: null,
    profilePicture: null,
    cookie: null,
    birthdate: "2001-5-1"
}

userManager = new UserManager();
successfullRegisteration = userManager.registerUser(user);
console.log(successfullRegisteration);
  
// connection = db.connectToDatabase();

// eslint-disable-next-line no-console
app.listen(process.env.PORT || 8080, () => console.log(`Listening on the port ${process.env.PORT || 8080}!`));
