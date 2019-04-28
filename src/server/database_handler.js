var mysql = require('mysql');

const utils = require('./utils');

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

function useDatabase(connection, databaseName) {
  let sqlCmd = "USE {0};";
  sqlCmd = utils.substituteParams(sqlCmd, [databaseName]);
  connection.query(sqlCmd, function (err, result) {
    if (err) { 
      console.log(err);
      throw err;
    }
  });
}

function creatUser(connection, userParams, databaseName) {
  useDatabase(connection, databaseName);
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

function getUserDetailsByEmail(connection, email, databaseName) {
  useDatabase(connection, databaseName);
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

function hasUserByEmail(connection, email, databaseName) {
  useDatabase(connection, databaseName);
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

function updateUserInfo(connection, email, userInfo, databaseName){
  useDatabase(connection, databaseName);
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

function areFriends(connection, databaseName, firstUserId, secondUserId) {
  useDatabase(connection, databaseName);
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

function isFriendRequestSent(connection, databaseName, id1, id2) {
  useDatabase(connection, databaseName);
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

function sendFriendRequest(connection, databaseName, id1, id2) {
  useDatabase(connection, databaseName);
  let sqlAdd = "INSERT INTO FRIEND_REQUEST (USER_ID, FRIEND_ID) VALUES ({0}, {1});";
  sqlAdd = utils.substituteParams(sqlAdd, [id1, id2]);
  connection.query(sqlAdd, (err, result) => {
    if(err) {
      console.log('error in database, in send friend request');
      throw err;
    }
  })
}

function removeFriendRequest(connection, databaseName, id1, id2) {
  useDatabase(connection, databaseName);
  let sqlRemove = "DELETE FROM FRIEND_REQUEST WHERE USER_ID={0} AND FRIEND_ID={1}";
  sqlRemove = utils.substituteParams(sqlRemove, [id1, id2]);
  connection.query(sqlQuery, (err, result) => {
    if(err) {
      console.log('error in database, in remove friend request');
      throw err;
    }
  });
}

function addFriend(connection, databaseName, id1, id2) {
  useDatabase(connection, databaseName);
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

function getFriendsById(connection, databaseName, id) {
  useDatabase(connection, databaseName);
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

function getUserById(connection, id) {
  useDatabase(connection, databaseName);
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