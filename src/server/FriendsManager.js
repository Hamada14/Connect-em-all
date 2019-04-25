const db = require("./database_handler");

const DATABASE_NAME = "social_media_db";

const NO_USER_BY_EMAIL_ERR = "Sorry, no user by this email";
const ARE_NOT_FRIENDS = "The aren't friends"

const ALREADY_FRIENDS_ERR = "You are friends";

const FRIEND_REQUEST_ALREADY_SENT = "Friend request already sent";
const FRIEND_SENT_YOU_REQUEST = "You hava a friend request from";

const NO_FRIEND_REQUEST_REMOVE = "No friend request to remove"

async function areFriends(firstUserEmail, secondUserEmail) {
  let connection = db.connectToDatabase();
  let firstUser = await db.getUserDetailsByEmail(connection, firstUserEmail, DATABASE_NAME);
  let secondUser = await db.getUserDetailsByEmail(connection, secondUserEmail, DATABASE_NAME);

  if(firstUser.length == 0 || secondUser.length == 0) {
    return [NO_USER_BY_EMAIL_ERR];  
  } else {
    let result = await db.areFriends(connection, DATABASE_NAME, firstUser[0].USER_ID, secondUser[0].USER_ID);
    if(result && result.length > 0) {
      return [ARE_NOT_FRIENDS];
    }
    return [];
  }
}

async function addFriend(firstUserEmail, secondUserEmail) {
  let connection = db.connectToDatabase(); 
  let firstUser = await db.getUserDetailsByEmail(connection, firstUserEmail, DATABASE_NAME);
	let secondUser = await db.getUserDetailsByEmail(connection, secondUserEmail, DATABASE_NAME);
	if(firstUser.length == 0 || secondUser.length == 0) {
		return [NO_USER_BY_EMAIL_ERR];
	} else {
		let id1 = firstUser[0].USER_ID;
		let id2 = secondUser[0].USER_ID;
		let friendsCheck =  await db.areFriends(connection, DATABASE_NAME, id1, id1);
		if(!friendsCheck && friendsCheck.length == 0) {
			return [ALREADY_FRIENDS_ERR];
		}
		let friendRequestSent = await db.isFriendRequestSent(connection, DATABASE_NAME, id1, id2);
		if(friendRequestSent && friendRequestSent.length > 0) {
			return [FRIEND_REQUEST_ALREADY_SENT];
		}
		let friendSentYouRequest = await db.isFriendRequestSent(connection, DATABASE_NAME, id2, id1);
		if(friendSentYouRequest && friendSentYouRequest.length > 0) {
			return [FRIEND_SENT_YOU_REQUEST + " " + secondUserEmail];
		}
		db.sendFriendRequest(connection, DATABASE_NAME, id1, id2);
		return [];
	}
}

async function rejectFriendRequest(firstUserEmail, secondUserEmail) {
	let connection = db.connectToDatabase(); 
  let firstUser = await db.getUserDetailsByEmail(connection, firstUserEmail, DATABASE_NAME);
	let secondUser = await db.getUserDetailsByEmail(connection, secondUserEmail, DATABASE_NAME);
	if(firstUser.length == 0 || secondUser.length == 0) {
		return [NO_USER_BY_EMAIL_ERR];
	} else {
		let id1 = firstUser[0].ID;
		let id2 = secondUser[0].ID;
		let friendRequestSent = await db.isFriendRequestSent(connection, DATABASE_NAME, id2, id1);
		if(!friendRequestSent || friendRequestSent.length == 0) {
			return [NO_FRIEND_REQUEST_REMOVE];
		}
		db.removeFriendRequest(connection, DATABASE_NAME, id1, id2);
		return [];
	}
}

module.exports = {
	areFriends,
	addFriend,
	rejectFriendRequest
}