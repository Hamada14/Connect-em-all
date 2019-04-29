const db = require("./database_handler");

const DATABASE_NAME = "social_media_db";

const NO_USER_BY_EMAIL_ERR = "Sorry, no user by this email";
const ARE_NOT_FRIENDS = "The aren't friends"
const ALREADY_FRIENDS_ERR = "You are friends";
const FRIEND_REQUEST_ALREADY_SENT = "Friend request already sent";
const FRIEND_SENT_YOU_REQUEST = "You hava a friend request from";
const NO_FRIEND_REQUEST_REMOVE = "No friend request to cancel"
const NO_FRIEND_REQUEST_SENT = "No friend request sent";

async function areFriends(userId1, userId2) {
  let result1 = await db.areFriends(userId1, userId2);
  let result2 = await db.areFriends(userId2, userId1);
  if((result1 && result1.length > 0) || (result2 && result2.length > 0)) {
    return [];
  }
  return [ARE_NOT_FRIENDS];
}

async function addFriend(userId, friendId) {
  let friendsCheck = await db.areFriends(userId, friendId);
  if(friendsCheck && friendsCheck.length != 0) {
    return [ALREADY_FRIENDS_ERR];
  }
  let friendRequestSent = await db.isFriendRequestSent(userId, friendId);
  if(friendRequestSent && friendRequestSent.length > 0) {
    return [FRIEND_REQUEST_ALREADY_SENT];
  }
  let friendSentYouRequest = await db.isFriendRequestSent(friendId, userId);
  if(friendSentYouRequest && friendSentYouRequest.length > 0) {
    return [FRIEND_SENT_YOU_REQUEST + " " + friendId];
  }
  db.sendFriendRequest(userId, friendId);
  return [];
}

async function rejectFriendRequest(userId, friendId) {
  let friendRequestSent = await db.isFriendRequestSent(userId, friendId);
  if(!friendRequestSent || friendRequestSent.length == 0) {
    return [NO_FRIEND_REQUEST_REMOVE];
  }
  db.removeFriendRequest(userId, friendId);
  return [];
}

async function acceptFriendRequest(userId, friendId) {
  let friendRequestSent = await db.isFriendRequestSent(userId, friendId);
  if(!friendRequestSent || friendRequestSent.length == 0) {
    return [NO_FRIEND_REQUEST_SENT];
  }
  await db.removeFriendRequest(userId, friendId);
  await db.addFriend(userId, friendId);
}

async function deleteFriend(userId, friendId) {
  await db.deleteFriend(userId, friendId);
}

async function hasFriendRequest(userId, friendId) {
  let friendRequestSent = await db.isFriendRequestSent(userId, friendId);
  return friendRequestSent && friendRequestSent.length != 0;
}

async function getFriends(userId) {
  let friends = await db.getFriendsById(userId);
  return friends.map(friend => { return { userId: friend.USER_ID, email: friend.EMAIL, fullName: friend.FULL_NAME }});
}

module.exports = {
  areFriends,
  addFriend,
  rejectFriendRequest,
  acceptFriendRequest,
  getFriends,
  hasFriendRequest,
  deleteFriend
}
