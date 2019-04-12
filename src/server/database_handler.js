var mysql = require('mysql');

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

exports.connectToDatabase = connectToDatabase; 
exports.creatUser = creatUser;
exports.getUserDetailsByEmail = getUserDetailsByEmail;
exports.hasUserByEmail = hasUserByEmail;