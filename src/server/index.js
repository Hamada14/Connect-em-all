const express = require('express');
const os = require('os');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');

const UserManager = require('./UserManager').UserManager;
const friendsManager = require('./FriendsManager');

const OK_STATUS_CODE = 200;


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

app.use(bodyParser.json());

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

app.post('/api/register', async (req, res) => {
  const userManager = new UserManager();
  const errors = await userManager.registerUser(req.body);
  res.status(OK_STATUS_CODE);
  res.send({ errors: errors })
  res.end()
});



app.post('/api/login', async(req, res) => {
  const userManager = new UserManager();
  const jsonUser = req.body;
  let errors = await userManager.validateUser(jsonUser)
  if(errors.length == 0) {
    let user = await userManager.getUser(jsonUser.email);
    req.session.user = {
      hashedPassword: user[0].HASHED_PASSWORD,
      passwordSalt: user[0].SALT,
      fullName: user[0].FULL_NAME,
      email: user[0].EMAIL,
      birthdate: user[0].BIRTH_DATE
    };
  } 
  res.status(OK_STATUS_CODE);
  res.send({ errors: errors });
  res.end();
    
});

app.get('/api/is_logged_in', (req, res) => {
  let loggedInVeridict = {
    loggedIn: false,
    fullName: null,
    email: null
  }
  if(req.session.user && req.cookies.user_sid) {
    loggedInVeridict = {
      loggedIn: true,
      hashedPassword: req.session.user.hashedPassword,
      fullName: req.session.user.fullName,
      email: req.session.user.email,
      birthdate: req.session.user.birthdate
    }
  }
  res.status(OK_STATUS_CODE);
  res.send(loggedInVeridict);
})

app.get('/api/sign_out', (req, res) => {
  req.session.user = undefined;
  res.status(OK_STATUS_CODE);
  res.end();
})

app.post('/api/update_info', async (req, res) => {
  let newUserInfo = {
    oldPassword: req.body.oldPassword,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    fullName: req.body.fullName,
    birthdate: req.body.birthdate
  };

  const userManager = new UserManager();
  const errors = await userManager.updateUserInfo(req.session, newUserInfo);
  if(errors.length == 0) {
    req.session.user.fullName = newUserInfo.fullName;
    req.session.user.birthdate = req.body.birthdate;
    req.session.user.hashedPassword = bcrypt.hashSync(newUserInfo.password, req.session.user.passwordSalt);
  }
  res.status(OK_STATUS_CODE);
  res.send({ errors: errors })
  res.end()
});

// request body contains firstUserEmail and secondUserEmail
app.post('/api/are_friends', (req, res) => {
  let firstUserEmail = req.body.firstUserEmail;
  let secondUserEmail = req.body.secondUserEmail;
  let errors = friendsManager.areFriends(firstUserEmail, secondUserEmail);
  res.status(OK_STATUS_CODE)
  res.send({ errors : errors })
  res.end()
});

app.post('/api/add_friend', (req, res) => {

});

app.post('/api/accept_friend_request', (req, res) => {

});

app.post('/api/reject_friend_request', (req, res) => {

});

app.post('/api/get_friends_by_mail', (req, res) => {

})


// eslint-disable-next-line no-console
app.listen(process.env.PORT || 8080, () => console.log(`Listening on the port ${process.env.PORT || 8080}!`));
