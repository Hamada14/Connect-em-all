var mysql = require('mysql');

const utils = require('./utils');

function connectToDatabase() {
    
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'moamen',
    password: 'mysqlserver',
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
  let sqlCommand = "USE " + databaseName + ";";
  connection.query(sqlCommand, function (err, result) {
    if (err) { 
      console.log(err);
      throw err;
    }
  });
}

function creatUser(connection, userParams, databaseName) {
  useDatabase(connection, databaseName);
  let sqlAdd = "INSERT into USER (FULL_NAME, SALT, HASHED_PASSWORD, EMAIL, BIRTH_DATE) values (";
  sqlAdd += "\'" + userParams.fullName + "\',";
  sqlAdd += "\'" + userParams.salt + "\',";
  sqlAdd += "\'" + userParams.hashedPassword + "\',";
  sqlAdd += "\'" + userParams.email + "\',";
  sqlAdd += "\'" + userParams.birthdate + "\');";
  // sqlAdd = "select * from USER";
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
  sqlSelect = "SELECT * FROM USER WHERE email = \'" + email + "\';";
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
  let sqlSelect = "SELECT * FROM USER WHERE email = \'" + email + "\';";
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
  let sqlAdd = "UPDATE USER SET ";
  sqlAdd += "FULL_NAME='" + userInfo.fullName + "',";
  sqlAdd += "HASHED_PASSWORD='" + userInfo.hashedPassword + "',";
  sqlAdd += "BIRTH_DATE='" + userInfo.birthdate + "'";
  sqlAdd += "WHERE EMAIL='" + email + "';";
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
  let sqlQuery = "SELECT FROM FRIEND_REQUEST WHERE USER_ID={0} AND FRIEND_ID={1};";
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


exports.connectToDatabase = connectToDatabase; 
exports.creatUser = creatUser;
exports.getUserDetailsByEmail = getUserDetailsByEmail;
exports.hasUserByEmail = hasUserByEmail;
exports.updateUserInfo = updateUserInfo;
exports.areFriends = areFriends;
exports.isFriendRequestSent = isFriendRequestSent;
exports.sendFriendRequest = sendFriendRequest;
exports.removeFriendRequest = removeFriendRequest;
