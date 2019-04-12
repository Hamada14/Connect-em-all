const express = require('express');
const os = require('os');
const bodyParser = require('body-parser');

const UserManager = require('./UserManager');

const app = express();
const User = require("./User")
const cookieParser = require('cookie-parser');
const session = require('express-session');
const db = require('./database_handler');

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

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/dashboard');
  } else {
    next();
  }    
};


app.use(express.static('dist'));

app.use(bodyParser.json());

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

app.post('/api/register', async (req, res) => {
  const userManager = new UserManager();
  const errors = await userManager.registerUser(req.body);
  if(errors.length == 0) {
    res.status(OK_STATUS_CODE);
  } else {
    res.status(ERROR_STATUS_CODE);
  }
  res.send({ errors: errors })
  res.end()
});


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
        req.session.user = user;
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
