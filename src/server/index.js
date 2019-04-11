const express = require('express');
const os = require('os');
const UserManager = require('./UserManager');
const app = express();
const User = require("./User")
var cookieParser = require('cookie-parser');
var session = require('express-session');

const OK_STATUS_CODE = 200;
const ERROR_STATUS_CODE = 400;

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'secret_session',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

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

// userManager = new UserManager();
// userManager.getUser("toto.me@gmail.com").then(result => console.log(result[0].FULL_NAME));
// console.log(result);

app.post('/api/login', (req, res) => {
    userManager = new UserManager();
    jsonUser = req.user;
    userManager.getUser(jsonUser.email)
    .then(result => {
        if(result && result[0].HASHED_PASSWORD === jsonUser.hashedPassword && result[0].SALT === jsonUser.passwordSalt) {
            newUser = {
                userName: result[0].FULL_NAME,
                email: result[0].EMAIL,
                hashedPassword: result[0].HASHED_PASSWORD,
                passwordSalt: result[0].SALT,
                birthdate: result[0].BIRTH_DATE
            };
            user = new User(newUser);
            res.status(OK_STATUS_CODE);
            return res.send("Successful login");
        } else {
            res.status(ERROR_STATUS_CODE);
            return res.send('Wrong email or password');
        }
    }) 
});
  
// connection = db.connectToDatabase();

// eslint-disable-next-line no-console
app.listen(process.env.PORT || 8080, () => console.log(`Listening on the port ${process.env.PORT || 8080}!`));
