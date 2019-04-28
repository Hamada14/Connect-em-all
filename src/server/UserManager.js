const moment = require('moment');
const bcrypt = require('bcryptjs');

const db = require("./database_handler");

const User = require('./User');

const DUPLICATE_EMAIL_ERROR = "Please use an unregistered email";
const INVALID_EMAIL_ERROR = "Please use a valid email";
const SHORT_PASSWORD_ERROR = "Please use password longer than 7 characters";
const NON_MATCHING_PASSWORD_ERROR = "Please make sure password is confirmed correctly";
const EMPTY_NAME_ERROR = "Please specify a name";
const INVALID_BIRTHDATE_ERROR = "Please specify a valid birthday";
const BIRTHDATE_IN_FUTURE_ERROR = "Come back when you're born";
const WRONG_PASSWORD = "Wrong Password";
const EMPTY_EMAIL_ERROR = "Empty email address, please add a valid email";
const EMPTY_PASSWORD = "Empty password, please fill in a valid password";
const WRONG_EMAIL_OR_PASSWORD_ERROR = "wrong email or password";
const USER_DOESNOT_EXIST = "This user doesn't exist";


const saltRounds = 10;

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

  async updateUserInfo(session, newUserInfo) {
    let connection = db.connectToDatabase();
    let databaseName = "social_media_db";
    let errors = await validateNewInfo(session, newUserInfo)
    try {
      if(errors.length == 0) {
        let dbRow = {
          hashedPassword: bcrypt.hashSync(newUserInfo.password, session.user.passwordSalt),
          birthdate: newUserInfo.birthdate,
          fullName: newUserInfo.fullName
        }
        db.updateUserInfo(connection, session.user.email, dbRow, databaseName)
      }else{
        return errors;
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

  validateLoginUser(jsonUser) {
    return this.getUser(jsonUser.email).then(result => {
      let errors = []
      if(result && result.length > 0) {
        let password = jsonUser.password;
        let hashedPassword = bcrypt.hashSync(password, result[0].SALT);
        if(result[0].HASHED_PASSWORD !== hashedPassword) {
          errors.push(WRONG_EMAIL_OR_PASSWORD_ERROR)
        }
      } else {
        errors.push(WRONG_EMAIL_OR_PASSWORD_ERROR);
      }
      return errors
    });
  }

  validateUser(jsonUser) {
    let errors = [];
    if(checkEmptyString(jsonUser.email)) {
      errors = errors.concat(EMPTY_EMAIL_ERROR)
    }
    if(checkEmptyString(jsonUser.password)) {
      errors = errors.concat(EMPTY_PASSWORD);
    }
    if(errors.length > 0) {
      return new Promise((resolve, reject) => {
        resolve(errors)
      });
    }
    return this.validateLoginUser(jsonUser);
  }

  async hasUserById(userId) {
    let errors = [];
    let connection = db.connectToDatabase();
    let users = await db.getUserById(connection, "social_media_db", userId);
    if(!users || users.length == 0) {
      errors = errors.concat(USER_DOESNOT_EXIST);
    }
    return errors;
  }
}

function checkEmptyString(str) {
  return !str || str.length == 0;
}


async function validateInformation(connection, databaseName, userInfo) {
  let errors = [];
  let emailErrors = await validateEmail(connection, databaseName, userInfo.email);
  errors = errors.concat(emailErrors);
  errors = errors.concat(validatePassword(userInfo.password, userInfo.confirmPassword));
  errors = errors.concat(validateName(userInfo.fullName));
  errors = errors.concat(validateBirthdate(userInfo.birthdate));
  return errors.filter((e1) => e1 != null);
}

async function validateNewInfo(session, newUserInfo){
  let errors = [];
  let hashedPassword = bcrypt.hashSync(newUserInfo.oldPassword, session.user.passwordSalt);
  if(hashedPassword != session.user.hashedPassword){
    errors = errors.concat(WRONG_PASSWORD);
  }
  errors = errors.concat(validatePassword(newUserInfo.password, newUserInfo.confirmPassword));
  errors = errors.concat(validateName(newUserInfo.fullName));
  errors = errors.concat(validateBirthdate(newUserInfo.birthdate));
  return errors.filter((e1) => e1 != null);
}

async function validateEmail(connection, databaseName, email) {
  let errors = []
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
  EMPTY_NAME_ERROR,
  INVALID_BIRTHDATE_ERROR,
  BIRTHDATE_IN_FUTURE_ERROR,
  INVALID_EMAIL_ERROR,
  DUPLICATE_EMAIL_ERROR
}
