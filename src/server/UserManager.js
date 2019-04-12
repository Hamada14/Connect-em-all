const moment = require('moment');
const bcrypt = require('bcryptjs');

const db = require("./database_handler");
const User = require('./User');

class UserManager {
  
  constructor() {

  }

  async registerUser(userParams) {
    let connection = db.connectToDatabase();
    let databaseName = "social_media_db";
    let errors = await validateInformation(connection, databaseName, userParams)
    try {    
      if(errors.length == 0) {
        let salt = bcrypt.genSaltSync(saltRounds);
        let userRow = {
          email: userParams.email,
          hashedPassword: bcrypt.hashSync(userParams.password, salt),
          salt: salt,
          birthdate: userParams.birthdate,
          fullName: userParams.fullName
        }
        db.creatUser(connection, userRow, databaseName);
      }
    } catch(error) {
      console.log(error)
      return ["Congratulations for discovering a bug! please report"];
    }
    return errors;
  }

  getUser(email) {
    let connection = db.connectToDatabase();
    let user = new User(null);
    try {
      return user.getDetails(connection, 'social_media_db', email);
    } catch(error) {
      return null;
    }
  }
}


const DUPLICATE_EMAIL_ERROR = "Please use an unregistered email";
const INVALID_EMAIL_ERROR = "Please use a valid email";
const SHORT_PASSWORD_ERROR = "Please use password longer than 7 characters";
const NON_MATCHING_PASSWORD_ERROR = "Please make sure password is confirmed correctly";
const EMPTY_NAME_ERROR = "Please specify a name";
const INVALID_BIRTHDATE_ERROR = "Please specify a valid birthday";
const BIRTHDATE_IN_FUTURE_ERROR = "Come back when you're born";

const saltRounds = 10;


async function validateInformation(connection, databaseName, userInfo) {
  let errors = [];
  let emailErrors = await validateEmail(connection, databaseName, userInfo.email);
  errors = errors.concat(emailErrors);
  errors = errors.concat(validatePassword(userInfo.password, userInfo.confirmPassword));
  errors = errors.concat(validateName(userInfo.fullName));
  errors = errors.concat(validateBirthdate(userInfo.birthdate));
  return errors.filter((e1) => e1 != null);
}

async function validateEmail(connection, databaseName, email) {
  let errors = []
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let isValidEmail = re.test(String(email).toLowerCase());
  if(!isValidEmail)
    errors.push(INVALID_EMAIL_ERROR);
  let duplicateEmail = await db.hasUserByEmail(connection, email, databaseName);
  if(duplicateEmail)
    errors.push(DUPLICATE_EMAIL_ERROR);
  return errors;
}

function validatePassword(password, confirmPassword) {
  let errors = []
  const MIN_PASSWORD_LEN = 7;
  if(password == null || password.length < MIN_PASSWORD_LEN) {
    errors.push(SHORT_PASSWORD_ERROR);
  }
  if((confirmPassword != password) && errors.length == 0)
    errors.push(NON_MATCHING_PASSWORD_ERROR);
  return errors;
}

function validateName(fullName) {
  let errors = []
  if(fullName == null || fullName.length == 0) {
    errors.push(EMPTY_NAME_ERROR);
  }
  return errors;
}

function validateBirthdate(birthdate) {
  let errors = []
  let momentDate = moment(birthdate, "YYYY-MM-DD")
  if(birthdate == null || !momentDate.isValid()) {
    errors.push(INVALID_BIRTHDATE_ERROR);
  }
  if(birthdate && errors.length == 0 && moment().diff(momentDate) <= 0)
    errors.push(BIRTHDATE_IN_FUTURE_ERROR);
  return errors;
}

module.exports = { 
  UserManager,
  validateEmail,
  validatePassword,
  validateName,
  validateBirthdate,
  NON_MATCHING_PASSWORD_ERROR,
  SHORT_PASSWORD_ERROR,
  EMPTY_NAME_ERROR
}
