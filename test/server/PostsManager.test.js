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
