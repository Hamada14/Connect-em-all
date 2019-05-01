const friendsManager = require('server/FriendsManager');

describe("Check friendship tests", () => {

  const databaseHandler = require('server/database_handler')
  
  beforeAll(() => {
    jest.unmock('server/FriendsManager.js');
    databaseHandler.areFriends = jest.fn();
  });

  it("Already friends test", async() => {
    databaseHandler.areFriends.mockReturnValue(['There is a friends tuple']);
    let errors = await friendsManager.areFriends(1, 2)
    expect(errors.length).toEqual(0);
    expect(databaseHandler.areFriends).toBeCalled();
  })

  it("Not friends test", async() => {
    databaseHandler.areFriends.mockReturnValue([]);
    let errors = await friendsManager.areFriends(1, 2)
    expect(errors.length).toEqual(1)
    expect(errors[0]).toEqual(friendsManager.ARE_NOT_FRIENDS);
    expect(databaseHandler.areFriends).toBeCalled()
  })

})

describe("Add friend tests", () => {

  const databaseHandler = require('server/database_handler')

  beforeAll(() => {
    jest.unmock('server/FriendsManager.js')
    databaseHandler.isFriendRequestSent = jest.fn()
    databaseHandler.areFriends = jest.fn()
    databaseHandler.sendFriendRequest = jest.fn()
  })

  it("Already friends test", async() => {
    databaseHandler.areFriends.mockReturnValue(['There is friends tuple'])
    let errors = await friendsManager.addFriend(1, 2)
    expect(errors.length).toEqual(1)
    expect(errors[0]).toEqual(friendsManager.ALREADY_FRIENDS_ERR)
    expect(databaseHandler.isFriendRequestSent).not.toBeCalled()
  })

  it('Add a non-friend but a friend request was sent by the sender user', async() => {
    databaseHandler.areFriends.mockReturnValue([])
    databaseHandler.isFriendRequestSent
                   .mockReturnValueOnce(['There is a friend request sent'])
                   .mockReturnValue([])
    let errors = await friendsManager.addFriend(1, 2)
    expect(errors.length).toEqual(1)
    expect(errors[0]).toEqual(friendsManager.FRIEND_REQUEST_ALREADY_SENT)
    expect(databaseHandler.areFriends).toBeCalled()
    expect(databaseHandler.isFriendRequestSent).toBeCalled()
  })

  it('Add a non-friend but a friend request is sent by the reciver', async() => {
    databaseHandler.areFriends.mockReturnValue([])
    databaseHandler.isFriendRequestSent
                   .mockReturnValueOnce([])
                   .mockReturnValue(['There is a friend request sent'])
    let id1 = 1
    let id2 = 2
    let errors = await friendsManager.addFriend(id1, id2)
    expect(errors.length).toEqual(1)
    expect(errors[0]).toEqual(friendsManager.FRIEND_SENT_YOU_REQUEST + " " + id2)
    expect(databaseHandler.areFriends).toBeCalled()
    expect(databaseHandler.isFriendRequestSent).toBeCalled()
  })

  it('Add a non-friend where a friend request is not sent by both of them', async() => {
    databaseHandler.areFriends.mockReturnValue([])
    databaseHandler.isFriendRequestSent
                   .mockReturnValueOnce([])
                   .mockReturnValue([])
    let errors = await friendsManager.addFriend(1, 2)
    expect(errors.length).toEqual(0)
    expect(databaseHandler.areFriends).toBeCalled()
    expect(databaseHandler.isFriendRequestSent).toBeCalled()
  })

})

describe('Rejecting friend requet tests', () => {
  
  const databaseHandler = require('server/database_handler')

  beforeAll(() => {
    jest.unmock('server/FriendsManager.js')
    databaseHandler.removeFriendRequest = jest.fn()
    databaseHandler.isFriendRequestSent = jest.fn()
  })

  it('Reject a friend a friend request that is not sent', async() => {
    databaseHandler.isFriendRequestSent.mockReturnValue([])
    let errors = await friendsManager.rejectFriendRequest(1, 2)
    expect(errors.length).toEqual(1)
    expect(errors[0]).toEqual(friendsManager.NO_FRIEND_REQUEST_REMOVE)
    expect(databaseHandler.isFriendRequestSent).toBeCalled()
    expect(databaseHandler.removeFriendRequest).not.toBeCalled()
  })

  it('Reject a friend request that is already sent', async() => {
    databaseHandler.isFriendRequestSent.mockReturnValue(['There is a friend request'])
    databaseHandler.removeFriendRequest.mockReturnValue([])
    let errors = await friendsManager.rejectFriendRequest(1, 2)
    expect(errors.length).toEqual(0)
    expect(databaseHandler.isFriendRequestSent).toBeCalled()
    expect(databaseHandler.removeFriendRequest).toBeCalled()
  })

})

describe('Accepting a friend request tests', () => {

  const databaseHandler = require('server/database_handler')

  beforeAll(() => {
    jest.unmock('server/FriendsManager.js')
    databaseHandler.removeFriendRequest = jest.fn()
    databaseHandler.isFriendRequestSent = jest.fn()
    databaseHandler.addFriend = jest.fn()
  })

  it('Accepting a friend request that is not sent', async() => {
    databaseHandler.isFriendRequestSent.mockReturnValue([])
    let errors = await friendsManager.acceptFriendRequest(1, 2)
    expect(errors.length).toEqual(1)
    expect(errors[0]).toEqual(friendsManager.NO_FRIEND_REQUEST_SENT)
    expect(databaseHandler.isFriendRequestSent).toBeCalled()
    expect(databaseHandler.removeFriendRequest).not.toBeCalled()
    expect(databaseHandler.addFriend).not.toBeCalled()
  })

  it('Accepting a friend request that is really sent', async() => {
    databaseHandler.isFriendRequestSent.mockReturnValue(['There is friend request'])
    let errors = await friendsManager.acceptFriendRequest(1, 2)
    expect(errors.length).toEqual(0)
    expect(databaseHandler.isFriendRequestSent).toBeCalled()
    expect(databaseHandler.removeFriendRequest).toBeCalled()
    expect(databaseHandler.addFriend).toBeCalled()
  })
})

describe('Deleting friend tests', () => {

  const databaseHandler = require('server/database_handler')

  beforeAll(() => {
    jest.unmock('server/FriendsManager.js')
    databaseHandler.deleteFriend = jest.fn()
  })

  it('Delete a friend', async() => {
    friendsManager.deleteFriend(1, 2)
    expect(databaseHandler.deleteFriend).toBeCalled()
  })

})

describe('Checking if a friend request is sent tests', () => {

  const databaseHandler = require('server/database_handler')

  beforeAll(() => {
    jest.unmock('server/FriendsManager.js')
    databaseHandler.isFriendRequestSent = jest.fn()
  })

  it("Check if friend request is sent", async () => {
    databaseHandler.isFriendRequestSent.mockReturnValue(['Friend request tuple'])
    let veridict = await friendsManager.hasFriendRequest(1, 2)
    expect(veridict).toEqual(true)
    expect(databaseHandler.isFriendRequestSent).toBeCalled()
  })

  it("Check if friend request is not sent", async () => {
    databaseHandler.isFriendRequestSent.mockReturnValue([])
    let veridict = await friendsManager.hasFriendRequest(1, 2)
    expect(veridict).toEqual(false)
    expect(databaseHandler.isFriendRequestSent).toBeCalled()
  })

})

describe('Getting friends by id tests', () => {
  
  const databaseHandler = require('server/database_handler')

  beforeAll(() => {
    databaseHandler.getFriendsById = jest.fn()
  })

  it('Get empty friends list test', async() => {
    databaseHandler.getFriendsById.mockReturnValue([])
    let friends = await friendsManager.getFriends(1)
    expect(friends).toEqual([])
    expect(databaseHandler.getFriendsById).toBeCalled()
  })

  it('Get occupied friends list test', async() => {
    let mockUser1 = {USER_ID: 2, EMAIL: 'email1@domain.com', FULL_NAME: 'User 1 full name'}
    let mockUser2 = {USER_ID: 3, EMAIL: 'email2@domain.com', FULL_NAME: 'User 2 full name'}
    let friendsDatabaseMock = [mockUser1, mockUser2]
    databaseHandler.getFriendsById.mockReturnValue(friendsDatabaseMock)
    let actualFriends = await friendsManager.getFriends(1)
    actualFriends.sort((a, b) => a.USER_ID - b.USER_ID)
    let expectedUser1 = {userId: 2, email: 'email1@domain.com', fullName: 'User 1 full name'}
    let expectedUser2 = {userId: 3, email: 'email2@domain.com', fullName: 'User 2 full name'}
    let expectedFriends = [expectedUser1, expectedUser2]
    expect(actualFriends).toEqual(expectedFriends)
    expect(databaseHandler.getFriendsById).toBeCalled()
  })

})

describe('Getting friends requests by id tests', () => {
  
  const databaseHandler = require('server/database_handler')

  beforeAll(() => {
    databaseHandler.getUserFriendRequests = jest.fn()
  })

  it('Get empty friends requests list test', async() => {
    databaseHandler.getUserFriendRequests.mockReturnValue([])
    let friends = await friendsManager.getFriendRequests(1)
    expect(friends).toEqual([])
    expect(databaseHandler.getUserFriendRequests).toBeCalled()
  })

  it('Get occupied friends list test', async() => {
    let mockUser1 = {USER_ID: 2, EMAIL: 'email1@domain.com', FULL_NAME: 'User 1 full name'}
    let mockUser2 = {USER_ID: 3, EMAIL: 'email2@domain.com', FULL_NAME: 'User 2 full name'}
    let friendsDatabaseMock = [mockUser1, mockUser2]
    databaseHandler.getUserFriendRequests.mockReturnValue(friendsDatabaseMock)
    let actualFriends = await friendsManager.getFriendRequests(1)
    actualFriends.sort((a, b) => a.USER_ID - b.USER_ID)
    let expectedUser1 = {userId: 2, email: 'email1@domain.com', fullName: 'User 1 full name'}
    let expectedUser2 = {userId: 3, email: 'email2@domain.com', fullName: 'User 2 full name'}
    let expectedFriends = [expectedUser1, expectedUser2]
    expect(actualFriends).toEqual(expectedFriends)
    expect(databaseHandler.getUserFriendRequests).toBeCalled()
  })

})
