const db = require("./database_handler");

const DATABASE_NAME = "social_media_db";

const NO_USER_BY_EMAIL_ERR = "Sorry, no user by this email";
const ARE_NOT_FRIENDS = "The aren't friends"
const ALREADY_FRIENDS_ERR = "You are friends";
const FRIEND_REQUEST_ALREADY_SENT = "Friend request already sent";
const FRIEND_SENT_YOU_REQUEST = "You hava a friend request from";
const NO_FRIEND_REQUEST_REMOVE = "No friend request to cancel"
const NO_FRIEND_REQUEST_SENT = "No friend request sent";

async function areFriends(firstUserEmail, secondUserEmail) {
  let firstUser = await db.getUserDetailsByEmail(firstUserEmail, DATABASE_NAME);
  let secondUser = await db.getUserDetailsByEmail(secondUserEmail, DATABASE_NAME);

  if(firstUser.length == 0 || secondUser.length == 0) {
    return [NO_USER_BY_EMAIL_ERR];
  } else {
    let result = await db.areFriends(DATABASE_NAME, firstUser[0].USER_ID, secondUser[0].USER_ID);
    if(result && result.length > 0) {
      return [ARE_NOT_FRIENDS];
    }
    return [];
  }
}

async function addFriend(firstUserEmail, secondUserEmail) {
  let firstUser = await db.getUserDetailsByEmail(firstUserEmail, DATABASE_NAME);
  let secondUser = await db.getUserDetailsByEmail(secondUserEmail, DATABASE_NAME);
  if(firstUser.length == 0 || secondUser.length == 0) {
    return [NO_USER_BY_EMAIL_ERR];
  } else {
    let id1 = firstUser[0].USER_ID;
    let id2 = secondUser[0].USER_ID;
    let friendsCheck = await db.areFriends(DATABASE_NAME, id1, id1);
    if(!friendsCheck && friendsCheck.length == 0) {
      return [ALREADY_FRIENDS_ERR];
    }
    let friendRequestSent = await db.isFriendRequestSent(DATABASE_NAME, id1, id2);
    if(friendRequestSent && friendRequestSent.length > 0) {
      return [FRIEND_REQUEST_ALREADY_SENT];
    }
    let friendSentYouRequest = await db.isFriendRequestSent(DATABASE_NAME, id2, id1);
    if(friendSentYouRequest && friendSentYouRequest.length > 0) {
      return [FRIEND_SENT_YOU_REQUEST + " " + secondUserEmail];
    }
    db.sendFriendRequest(DATABASE_NAME, id1, id2);
    return [];
  }
}

async function rejectFriendRequest(firstUserEmail, secondUserEmail) {
  let firstUser = await db.getUserDetailsByEmail(firstUserEmail, DATABASE_NAME);
  let secondUser = await db.getUserDetailsByEmail(secondUserEmail, DATABASE_NAME);
  if(firstUser.length == 0 || secondUser.length == 0) {
    return [NO_USER_BY_EMAIL_ERR];
  } else {
    let id1 = firstUser[0].USER_ID;
    let id2 = secondUser[0].USER_ID;
    let friendRequestSent = await db.isFriendRequestSent(DATABASE_NAME, id2, id1);
    if(!friendRequestSent || friendRequestSent.length == 0) {
      return [NO_FRIEND_REQUEST_REMOVE];
    }
    db.removeFriendRequest(DATABASE_NAME, id1, id2);
    return [];
  }
}

async function acceptFriendRequest(firstUserEmail, secondUserEmail) {
  let firstUser = await db.getUserDetailsByEmail(firstUserEmail, DATABASE_NAME);
  let secondUser = await db.getUserDetailsByEmail(secondUserEmail, DATABASE_NAME);
  if(firstUser.length == 0 || secondUser.length == 0) {
    return [NO_USER_BY_EMAIL_ERR];
  } else {
    let id1 = firstUser[0].USER_ID;
    let id2 = secondUser[0].USER_ID;
    let friendRequestSent = await db.isFriendRequestSent(DATABASE_NAME, id2, id1);
    if(!friendRequestSent || friendRequestSent.length == 0) {
      return [NO_FRIEND_REQUEST_SENT];
    }
    db.removeFriendRequest(DATABASE_NAME, id1, id2);
    db.addFriend(DATABASE_NAME, id1, id2);
  }
}

async function getFriendsByIds(friendPairs) {
  let friends = [];
  for(let friendPair in friendPairs) {
    let friendDetails = await db.getUserById(DATABASE_NAME, friendPair.FRIEND_ID);
    let friend = {
      email: friendDetails[0].EMAIL,
      name: friendDetails[0].FULL_NAME
    };
    friends = friends.concat(friend);
  }
  return friends;
}

async function getFriends(email) {
  let response = {
    errors: [],
    friends: []
  }
  let user = await db.getUserDetailsByEmail(email);
  if(user.length == 0) {
    response.errors = [NO_USER_BY_EMAIL_ERR];
    return response;
  }
  let id = user[0].USER_ID;
  let friendIds = await db.getFriendsById(id);
  response.friends = await getFriendsByIds(friendIds);
  return response;
}

module.exports = {
  areFriends,
  addFriend,
  rejectFriendRequest,
  acceptFriendRequest,
  getFriends
}
