const db = require("./database_handler");

const DATABASE_NAME = "social_media_db";

const NO_USER_BY_EMAIL_ERR = "Sorry, no user by this email";
const ARE_NOT_FRIENDS = "The aren't friends"

async function areFriends(firstUserEmail, secondUserEmail) {
  let connection = db.connectToDatabase();
  let firstUser = await db.getUserDetailsByEmail(connection, firstUserEmail, DATABASE_NAME);
  let secondUser = await db.getUserDetailsByEmail(connection, secondUserEmail, DATABASE_NAME);

  if(firstUser.length == 0 || secondUser.length == 0) {
    return [NO_USER_BY_EMAIL_ERR];  
  } else {
    let result = await db.areFriends(connection, DATABASE_NAME, firstUser[0].USER_ID, secondUser[0].USER_ID);
    if(result.length > 0) {
      return [ARE_NOT_FRIENDS];
    }
    return [];
  }
}

module.exports = {
  areFriends
}