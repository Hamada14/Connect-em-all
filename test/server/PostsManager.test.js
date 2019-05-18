const PostManager = require('server/PostManager').PostManager

describe('Create post tests', () => {

  const databaseHandler = require('server/database_handler')

  beforeAll(() => {
    databaseHandler.createPost = jest.fn()
  })

  it('Create post test', async() => {
    let postManager = new PostManager()
    await postManager.createPost(undefined, undefined)
    expect(databaseHandler.createPost).toBeCalled()
  })

})

describe('Get posts for a user tests', () => {

  const databaseHandler = require('server/database_handler')

  beforeAll(() => {
    databaseHandler.getPostsByUser = jest.fn()
  })

  it('Get empty posts test', async() => {
    databaseHandler.getPostsByUser.mockReturnValue([])
    const postManager = new PostManager()
    let posts = await postManager.getPostsByUser(1);
    expect(posts).toEqual([])
    expect(databaseHandler.getPostsByUser).toBeCalled()
  })

  it('Get non-empty list of posts', async() => {
    let mockPost1 = {POST_ID: 1, CONTENT: 'this is the content1', USER_ID: 1}
    let mockPost2 = {POST_ID: 2, CONTENT: 'this is the content1', USER_ID: 1}
    let mockPosts = [mockPost1, mockPost2]
    databaseHandler.getPostsByUser.mockReturnValue([mockPost1, mockPost2])
    let postManager = new PostManager()
    let actualPosts = await postManager.getPostsByUser(1)
    actualPosts.sort((a, b) => a.POST_ID - b.POST_ID)
    expect(actualPosts).toEqual(mockPosts)
    expect(databaseHandler.getPostsByUser).toBeCalled()
  })

})

describe('Get newsfeed for a user tests', () => {

  const databaseHandler = require('server/database_handler')

  beforeAll(() => {
    databaseHandler.getNewsFeedForUser = jest.fn()
  })

  it('Get empty posts test', async() => {
    databaseHandler.getNewsFeedForUser.mockReturnValue([])
    const postManager = new PostManager()
    let posts = await postManager.getNewsFeedForUser(1);
    expect(posts).toEqual([])
    expect(databaseHandler.getNewsFeedForUser).toBeCalled()
  })

  it('Get non-empty list of posts', async() => {
    let mockPost1 = {POST_ID: 1, CONTENT: 'this is the content1', USER_ID: 1}
    let mockPost2 = {POST_ID: 2, CONTENT: 'this is the content1', USER_ID: 1}
    let mockPosts = [mockPost1, mockPost2]
    databaseHandler.getNewsFeedForUser.mockReturnValue([mockPost1, mockPost2])
    let postManager = new PostManager()
    let actualPosts = await postManager.getNewsFeedForUser(1)
    actualPosts.sort((a, b) => a.POST_ID - b.POST_ID)
    expect(actualPosts).toEqual(mockPosts)
    expect(databaseHandler.getNewsFeedForUser).toBeCalled()
  })

})


describe('Toggle like tests', () => {

  const databaseHandler = require('server/database_handler')
  const postId = 1;
  const userId1 = 123;
  const userId2 = 1234;
  const userId3 = 12345;

  beforeEach(() => {
    jest.setTimeout(5000);
  });

  beforeAll(() => {
    databaseHandler.likePost = jest.fn()
    databaseHandler.unlikePost = jest.fn()
    databaseHandler.getPostLikes = jest.fn()
    databaseHandler.isPostLikedByUser = jest.fn()

  })

  it('adds like for a post', async() => {
    let postManager = new PostManager();

    databaseHandler.likePost.mockReturnValue(
        new Promise((resolve, rej) => {
            resolve(true);
        }))

    databaseHandler.getPostLikes.mockReturnValue(
        new Promise((resolve, rej) => {
            resolve({LIKES:userId1.toString()});
        }))

    databaseHandler.isPostLikedByUser.mockReturnValue(
        new Promise((resolve, rej) => {
            resolve(false);
        }))

    let likes = await postManager.toggleLike(postId, userId1);

    expect(likes.LIKES).toBe(userId1.toString())

    expect(databaseHandler.isPostLikedByUser).toBeCalled()
    expect(databaseHandler.likePost).toBeCalled()
    expect(databaseHandler.getPostLikes).toBeCalled()
  })

  it('removes like for a post', async() => {
    let postManager = new PostManager();

    databaseHandler.unlikePost.mockReturnValue(
        new Promise((resolve, rej) => {
            resolve(true);
        }))

    databaseHandler.getPostLikes.mockReturnValue(
        new Promise((resolve, rej) => {
            resolve({});
        }))

    databaseHandler.isPostLikedByUser.mockReturnValue(
        new Promise((resolve, rej) => {
            resolve(true);
        }))

    let likes = await postManager.toggleLike(postId, userId1);

    expect(likes.LIKES).toBe(undefined)

    expect(databaseHandler.isPostLikedByUser).toBeCalled()
    expect(databaseHandler.unlikePost).toBeCalled()
    expect(databaseHandler.getPostLikes).toBeCalled()
  })

  it('count multiple likes for a post', async() => {
    let postManager = new PostManager();

    databaseHandler.likePost.mockReturnValue(
        new Promise((resolve, rej) => {
            resolve(true);
        }))

    databaseHandler.getPostLikes
          .mockReturnValueOnce(
              new Promise((resolve, rej) => {
                  resolve({LIKES:userId1.toString()});
              }))
          .mockReturnValueOnce(
              new Promise((resolve, rej) => {
                  resolve({LIKES:userId1.toString() + "," + userId2.toString()});
              }))
          .mockReturnValueOnce(
              new Promise((resolve, rej) => {
                  resolve({LIKES:userId1.toString() + "," + userId2.toString() + "," + userId3.toString()});
              }))

    databaseHandler.isPostLikedByUser.mockReturnValue(
        new Promise((resolve, rej) => {
            resolve(false);
        }))

    let likes;

    likes = await postManager.toggleLike(postId, userId1);
    expect(likes.LIKES).toBe(userId1.toString())

    likes = await postManager.toggleLike(postId, userId2);
    expect(likes.LIKES).toBe(userId1.toString() + "," + userId2.toString())

    likes = await postManager.toggleLike(postId, userId3);
    expect(likes.LIKES).toBe(userId1.toString() + "," + userId2.toString() + "," + userId3.toString())

    expect(databaseHandler.isPostLikedByUser).toHaveBeenCalledTimes(3)
    expect(databaseHandler.likePost).toHaveBeenCalledTimes(3)
    expect(databaseHandler.getPostLikes).toHaveBeenCalledTimes(3)
  })
})

describe('Add comment tests', () => {

  const databaseHandler = require('server/database_handler')

  beforeAll(() => {
    databaseHandler.addComment = jest.fn()
    databaseHandler.addComment.mockReturnValue([])
  })

  it('adds comment correctly', async() => {
    let postManager = new PostManager()
    await postManager.addComment(1, 'comment', 2)
    expect(databaseHandler.addComment).toBeCalled()
  })

  it('add empty comment', async() => {
    let postManager = new PostManager()
    databaseHandler.addComment.mockReturnValue([])
    await postManager.addComment(1, '', 2)
    expect(databaseHandler.addComment).not.toBeCalled()
  })

})

describe('Get comments for a post tests', () => {

  const databaseHandler = require('server/database_handler')

  beforeAll(() => {
    databaseHandler.getPostComments = jest.fn()
  })

  it('Gets an empty list of comments', async() => {
    databaseHandler.getPostComments.mockReturnValue([])
    const postManager = new PostManager()
    let comments = await postManager.getPostComments(1);
    expect(comments).toEqual([])
    expect(databaseHandler.getPostComments).toBeCalled()
  })

  it('Gets a non-empty list of comments', async() => {
    let mockComment1 = {CREATED_AT: 0, CONTENT: 'content1', FULL_NAME: "a"}
    databaseHandler.getPostComments.mockReturnValue([mockComment1])
    let postManager = new PostManager()
    let comments = await postManager.getPostComments(1)
    expect(comments).toEqual([mockComment1])
    expect(databaseHandler.getPostComments).toBeCalled()
  })

  it('Gets comments sorted newest first', async() => {
    let mockComment1 = {CREATED_AT: 0, CONTENT: 'content1', FULL_NAME: "a"}
    let mockComment2 = {CREATED_AT: 1, CONTENT: 'content2', FULL_NAME: "b"}
    let mockComment3 = {CREATED_AT: 2, CONTENT: 'content3', FULL_NAME: "c"}
    let sortedComments = [mockComment1, mockComment2, mockComment3]
    databaseHandler.getPostComments.mockReturnValue(sortedComments)
    let postManager = new PostManager()
    let comments = await postManager.getPostComments(1)
    comments.sort((a, b) => a.CREATED_AT - b.CREATED_AT)
    expect(comments).toEqual(sortedComments)
    expect(databaseHandler.getPostComments).toBeCalled()
  })




})
