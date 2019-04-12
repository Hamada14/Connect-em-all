const express = require('express');
const os = require('os');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

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
  res.status(OK_STATUS_CODE);
  res.send({ errors: errors })
  res.end()
});


app.post('/api/login', (req, res) => {
  const userManager = new UserManager();
  const jsonUser = req.body;
  userManager.getUser(jsonUser.email)
    .then(result => {
      const errors = [];
      if(result && result.length > 0) {
        let password = jsonUser.password;
        let hashedPassword = bcrypt.hashSync(password, result[0].SALT);
        if(result[0].HASHED_PASSWORD !== hashedPassword) {
          return res.send('Wrong email or password')
        }
        const newUser = {
          userName: result[0].FULL_NAME,
          email: result[0].EMAIL,
          hashedPassword: result[0].HASHED_PASSWORD,
          passwordSalt: result[0].SALT,
          birthdate: result[0].BIRTH_DATE
        };
        const user = new User(newUser);
        req.session.user = user;
      } else {
        errors.push('Wrong email or password');
      }
      res.status(OK_STATUS_CODE);
      res.send({ errors: errors});
      res.end()
    }) 
});

app.get('/api/is_loggedin', (req, res) => {
  let loggedInVeridict = {
    loggedIn: false,
    userName: null,
    email: null
  }
  if(req.session.user && req.cookies.user_sid) {
    loggedInVeridict = {
      loggedIn: true,
      userName: req.session.user.userName,
      email: req.session.user.email
    }
  } 
  res.status(OK_STATUS_CODE);
  res.send(loggedInVeridict);
})

  
// connection = db.connectToDatabase();


// eslint-disable-next-line no-console
app.listen(process.env.PORT || 8080, () => console.log(`Listening on the port ${process.env.PORT || 8080}!`));
