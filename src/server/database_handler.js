var mysql = require('mysql');

const utils = require('./utils');

let databaseName = "social_media_db";

function connectToDatabase() {

  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'social_media_db'
  });

  connection.connect(function(err) {
    if (err) {
      console.log("ERROR CONNECTION");
      throw err;
    }
    console.log("Connected!");
  });

  return connection;
}

function useDatabase(connection) {
  let sqlCmd = "USE {0};";
  sqlCmd = utils.substituteParams(sqlCmd, [databaseName]);
  connection.query(sqlCmd, function (err, result) {
    if (err) {
      console.log(err);
      throw err;
    }
  });
}

function creatUser(userParams) {
  let connection = connectToDatabase();
  useDatabase(connection);
  let sqlAdd = "INSERT into USER (FULL_NAME, SALT, HASHED_PASSWORD, EMAIL, BIRTH_DATE) values (\'{0}\', \'{1}\', \'{2}\', \'{3}\', \'{4}\');";
  sqlAdd = utils.substituteParams(sqlAdd, [userParams.fullName, userParams.salt, userParams.hashedPassword, userParams.email, userParams.birthdate])
  console.log(sqlAdd);
  connection.query(sqlAdd, function (err, result) {
    if (err) {
      throw err;
    }
    console.log("User inserted successfully");
  });

}

function getUserDetailsByEmail(email) {
  let connection = connectToDatabase();
  useDatabase(connection);
  sqlSelect = "SELECT * FROM USER WHERE email = \'{0}\';";
  sqlSelect = utils.substituteParams(sqlSelect, [email]);
  console.log(sqlSelect);
  return new Promise((resolve, reject) => {
    connection.query(sqlSelect, function (err, result) {
      if(err) {
        console.log("error");
        throw err;
      }
      resolve(result);
    });
  });
}

function hasUserByEmail(email) {
  let connection = connectToDatabase();
  useDatabase(connection);
  let sqlSelect = "SELECT * FROM USER WHERE email = \'{0}\';";
  sqlSelect = utils.substituteParams(sqlSelect, [email]);
  console.log(sqlSelect);
  return new Promise((resolve, reject) => {
    connection.query(sqlSelect, function (err, result) {
      if(err) {
        console.log("error");
        reject(err);
      }
      let veridict = false;
      if(result && result.length > 0) {
        veridict = true;
      }
      resolve(veridict);
    });
  });
}

function updateUserInfo(email, userInfo){
  let connection = connectToDatabase();
  useDatabase(connection);
  let sqlAdd = "UPDATE USER SET FULL_NAME='{0}', HASHED_PASSWORD='{1}', BIRTH_DATE='{2}' WHERE EMAIL='{3}';";
  sqlAdd = utils.substituteParams(sqlAdd, [userInfo.fullName, userInfo.hashedPassword, userInfo.birthdate, email]);
  console.log(sqlAdd);
  connection.query(sqlAdd, function (err, result) {
    if (err) {
      throw err;
    }
    console.log("User info updated successfully");
  });
}

function areFriends(firstUserId, secondUserId) {
  let connection = connectToDatabase();
  useDatabase(connection);
  let sqlQuery = "SELECT * FROM FRIEND WHERE USER_ID={0} AND FRIEND_ID={1};";
  sqlQuery = utils.substituteParams(sqlQuery, [firstUserId, secondUserId]);
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, (err, result) => {
      if(err) {
        console.log('error in database, are friends');
        throw err;
      }
      resolve(result);
    })
  })
}

function isFriendRequestSent(id1, id2) {
  let connection = connectToDatabase();
  useDatabase(connection);
  let sqlQuery = "SELECT * FROM FRIEND_REQUEST WHERE USER_ID={0} AND FRIEND_ID={1};";
  sqlQuery = utils.substituteParams(sqlQuery, [id1, id2]);
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, (err, result) => {
      if(err) {
        console.log('error in database, in friend request sent');
        throw err;
      }
      resolve(result)
    })
  })
}

function sendFriendRequest(id1, id2) {
  let connection = connectToDatabase();
  useDatabase(connection);
  let sqlAdd = "INSERT INTO FRIEND_REQUEST (USER_ID, FRIEND_ID) VALUES ({0}, {1});";
  sqlAdd = utils.substituteParams(sqlAdd, [id1, id2]);
  connection.query(sqlAdd, (err, result) => {
    if(err) {
      console.log('error in database, in send friend request');
      throw err;
    }
  })
}

function removeFriendRequest(id1, id2) {
  let connection = connectToDatabase();
  useDatabase(connection);
  let sqlRemove = "DELETE FROM FRIEND_REQUEST WHERE USER_ID={0} AND FRIEND_ID={1}";
  sqlRemove = utils.substituteParams(sqlRemove, [id1, id2]);
  connection.query(sqlQuery, (err, result) => {
    if(err) {
      console.log('error in database, in remove friend request');
      throw err;
    }
  });
}

function addFriend(id1, id2) {
  let connection = connectToDatabase();
  useDatabase(connection);
  let sqlAdd = "INSERT INTO FRIEND (USER_ID, FRIEND_ID) VALUES (USER_ID={0} AND FRIEND_ID={1});";
  let directAdd = utils.substituteParams(sqlAdd, [id1, id2]);
  let reverseAdd = utils.substituteParams(sqlAdd, [id2, id1]);
  connection.query(directAdd, (err, result) => {
    if(err) {
      console.log('error in database, in add friend' + id1 + '->' + id2);
      throw err;
    }
    connection.query(reverseAdd, (err, result) => {
      if(err) {
        console.log('error in database, in add friend' + id2 + '->' + id1)
        throw err;
      }
    })
  })
}

function getFriendsById(id) {
  let connection = connectToDatabase();
  useDatabase(connection);
  let sqlQuery = "SELECT * FROM FRIEND WHERE USER_ID={0};";
  sqlQuery = utils.substituteParams(sqlQuery, [id]);
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, (err, result) => {
      if(err) {
        console.log("error in databse, in get friends by id");
        throw err;
      }
      resolve(result);
    })
  })
}

function getUserById(id) {
  let connection = connectToDatabase();
  useDatabase(connection);
  let sqlQuery = "SELECT * FROM USER WHERE USER_ID={0}";
  sqlQuery = utils.substituteParams(sqlQuery, [id]);
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, (err, result) => {
      if(err) {
        console.log("error in databse, in get user by id");
        throw err;
      }
      resolve(result);
    })
  })
}

function createPost(writer, content) {
  let connection = connectToDatabase();
  useDatabase(connection);
  let sqlQuery = "INSERT INTO POST(CONTENT, USER_ID) VALUES (\"{0}\", {1})";
  sqlQuery = utils.substituteParams(sqlQuery, [content, writer]);
  return new Promise((resolve) => {
    connection.query(sqlQuery, (err, result) => {
      if(err) {
        console.log("error in databse, in create post");
        console.log(err)
        throw err;
      }
      resolve(result);
    });
  });
}

function getPostsByUser(userId) {
  let connection = connectToDatabase();
  useDatabase(connection);
  let sqlQuery = "select POST.CONTENT, USER.FULL_NAME as FULL_NAME, USER.EMAIL as EMAIL, POST.CREATED_AT as CREATED_AT from POST," +
    "USER where POST.USER_ID = USER.USER_ID AND USER.USER_ID = {0} ORDER BY CREATED_AT DESC;"
  sqlQuery = utils.substituteParams(sqlQuery, [userId]);
  return new Promise((resolve) => {
    connection.query(sqlQuery, (err, result) => {
      if(err) {
        console.log("error in databse, in get user by id");
        throw err;
      }
      resolve(result);
    });
  });
}

exports.connectToDatabase = connectToDatabase;
exports.creatUser = creatUser;
exports.getUserDetailsByEmail = getUserDetailsByEmail;
exports.hasUserByEmail = hasUserByEmail;
exports.updateUserInfo = updateUserInfo;
exports.areFriends = areFriends;
exports.isFriendRequestSent = isFriendRequestSent;
exports.sendFriendRequest = sendFriendRequest;
exports.removeFriendRequest = removeFriendRequest;
exports.addFriend = addFriend;
exports.getFriendsById = getFriendsById;
exports.getUserById = getUserById;
exports.createPost = createPost;
exports.getPostsByUser = getPostsByUser;
