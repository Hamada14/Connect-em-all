const express = require('express');
const os = require('os');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');

const UserManager = require('./UserManager').UserManager;
const PostManager = require('./PostManager').PostManager;

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
  expires: new Date(Date.now() + (30 * 86400 * 1000))
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
      birthdate: user[0].BIRTH_DATE,
      userId: user[0].USER_ID
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
      userId: req.session.user.userId,
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
app.post('/api/are_friends', async (req, res) => {
  let userId1 = req.body.userId1;
  let userId2 = req.body.userId2;
  let errors = await friendsManager.areFriends(userId1, userId2);
  res.status(OK_STATUS_CODE)
  res.send({ errors : errors })
  res.end()
});

// request body contains firstUserEmail and secondUserEmail
app.post('/api/add_friend', async (req, res) => {
  let userId = req.body.userId;
  let friendId = req.body.friendId;
  let errors = await friendsManager.addFriend(userId, friendId);
  res.status(OK_STATUS_CODE)
  res.send({ errors : errors })
  res.end()
});

// request body contains firstUserEmail and secondUserEmail
app.post('/api/delete_friend', async (req, res) => {
  let userId = req.body.userId;
  let friendId = req.body.friendId;
  let errors = await friendsManager.deleteFriend(userId, friendId);
  res.status(OK_STATUS_CODE)
  res.send({ errors : errors })
  res.end()
});

// request body contains firstUserEmail and secondUserEmail
app.post('/api/accept_friend_request', async (req, res) => {
  let userId = req.body.userId;
  let friendId = req.body.friendId;
  let errors = await friendsManager.acceptFriendRequest(userId, friendId);
  res.status(OK_STATUS_CODE)
  res.send({ errors : errors })
  res.end()
});

// request body contains firstUserEmail and secondUserEmail
app.post('/api/reject_friend_request', async (req, res) => {
  let userId = req.body.userId;
  let friendId = req.body.friendId;
  let errors = await friendsManager.rejectFriendRequest(userId, friendId);
  res.status(OK_STATUS_CODE)
  res.send({ errors : errors })
  res.end()
});

app.post('/api/has_friend_request', async (req, res) => {
  let userId = req.body.userId;
  let friendId = req.body.friendId;
  let hasFriendRequest = await friendsManager.hasFriendRequest(userId, friendId);
  res.status(OK_STATUS_CODE);
  res.send({ hasFriendRequest: hasFriendRequest });
  res.end();
})

// request body contains userEmail
// return response that contains errors and friends
app.post('/api/get_friends', async (req, res) => {
  let userId = req.body.userId;
  let response = await friendsManager.getFriends(userId);
  res.status(OK_STATUS_CODE);
  res.send({ friends: response });
  res.end()
})

app.get('/api/has_user_by_id', async (req, res) => {
  let userId = req.query.userId;
  const userManager = new UserManager();
  let errors = await userManager.hasUserById(userId);
  res.status(OK_STATUS_CODE)
  res.send({ errors: errors })
  res.end()
})

app.post('/api/create_post', async (req, res) => {
  let writer = req.body.userId;
  let content = req.body.postContent;
  const postManager = new PostManager();
  postManager.createPost(writer, content);
  res.status(OK_STATUS_CODE);
  res.end();
})

app.get('/api/get_posts_by_user', async (req, res) => {
  let userId = req.query.userId;
  const postManager = new PostManager();
  const posts = await postManager.getPostsByUser(userId);
  res.status(OK_STATUS_CODE);
  res.send({ posts: posts })
  res.end();
})

app.get('/api/get_news_feed', async (req, res) => {
  let userId = req.query.userId;
  if(!req.session.user || !req.cookies.user_sid || userId != req.session.user.userId) {
    res.status(OK_STATUS_CODE);
    res.send({ errors: ['User is not loggedIn'] })
    res.end();
  }
  const postManager = new PostManager();
  const posts = await postManager.getNewsFeedForUser(userId);
  res.status(OK_STATUS_CODE);
  res.send({ posts: posts })
  res.end();
})

app.get('/api/toggle_like_post', async (req, res) => {
  let postId = req.query.postId;
  let userId = req.query.userId;
  if(!req.session.user || !req.cookies.user_sid || userId != req.session.user.userId) {
    res.status(OK_STATUS_CODE);
    res.send({ errors: ['User is not loggedIn'] })
    res.end();
  }
  const postManager = new PostManager();
  const data = await postManager.toggleLike(postId, userId);
  res.status(OK_STATUS_CODE);
  res.send({ likes: data.LIKES, likers: data.LIKERS })
  res.end();

})

app.post('/api/get_user_personal_info', async (req, res) => {
  let userId = req.body.userId;
  const userManager = new UserManager();
  let personalInfo = await userManager.getUserPersonalInfo(userId);
  res.status(OK_STATUS_CODE);
  res.send(personalInfo);
  res.end();
});

app.post('/api/get_user_friend_requests', async (req, res) => {
  let userId = req.body.userId;
  let friendRequests = await friendsManager.getFriendRequests(userId);
  res.status(OK_STATUS_CODE);
  res.send({ friendRequests: friendRequests });
  res.end();
})

app.post('/api/search_user_by_email', async (req, res) => {
  let email = req.body.email;
  const userManager = new UserManager();
  let user = await userManager.getUser(email);
  let errors = [];
  if(!user || !user[0] || user.length == 0) {
    errors = errors.concat("No user by this email");
  }
  res.status(OK_STATUS_CODE);
  res.send({
    userId: user && user[0] ? user[0].USER_ID : -1,
    errors: errors
  });
  res.end();
})

app.get('/api/get_post_comments', async (req, res) => {
  let postId = req.query.postId;
  const postManager = new PostManager();
  const comments = await postManager.getPostComments(postId);
  res.status(OK_STATUS_CODE);
  res.send({ comments: comments })
  res.end();
})


// req contains commenterId, postId, content
app.post('/api/add_comment', async (req, res) => {
  let commenterId = req.body.userId;
  if(!req.session.user || !req.cookies.user_sid || commenterId != req.session.user.userId) {
    res.status(OK_STATUS_CODE);
    res.send({ errors: ['User is not loggedIn'] })
    res.end();
  }
  let content = req.body.commentContent;
  let postId = req.body.postId;
  const postManager = new PostManager();
  postManager.addComment(postId, content, commenterId);
  res.status(OK_STATUS_CODE);
  res.end();
})


// eslint-disable-next-line no-console
app.listen(process.env.PORT || 8080, () => console.log(`Listening on the port ${process.env.PORT || 8080}!`));
