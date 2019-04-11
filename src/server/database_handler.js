var mysql = require('mysql');

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

function creatUser(connection, user, databaseName) {
    useDatabase(connection, databaseName);
    sqlAdd = "INSERT into USER (FULL_NAME, SALT, HASHED_PASSWoRD, EMAIL, BIRTH_DATE) values (";
    sqlAdd += "\'" + user.userName + "\',";
    sqlAdd += "\'" + user.passwordSalt + "\',";
    sqlAdd += "\'" + user.hashedPassword + "\',";
    sqlAdd += "\'" + user.email + "\',";
    sqlAdd += "\'" + user.birthdate + "\');";
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
    let queryResult = null;
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

exports.connectToDatabase = connectToDatabase; 
exports.creatUser = creatUser;
exports.getUserDetailsByEmail = getUserDetailsByEmail;