const db = require("./database_handler");

class PostManager {

  constructor() {

  }

  createPost(writer, content) {
    return db.createPost(writer, content);
  }

  async convertLikers(posts) {
    let result = await Promise.all(posts.map(async (post) => {
      let likers = [];
      if(post.LIKES) {
        const likerIds = post.LIKES.split(',');
        likers = await Promise.all(likerIds.map((like_id) => db.getUserById(like_id)))
        for(let i = 0; i < likers.length; i++) {
          likers[i] = likers[i][0]
        }
      }
      post.LIKERS = likers;
      return post;
    }))
    return result;
  }


  async getNewsFeedForUser(userId) {
    let result = await db.getNewsFeedForUser(userId);
    return await this.convertLikers(result);
  }

  async getPostsByUser(userId) {
    return await this.convertLikers(await db.getPostsByUser(userId));
  }

  addComment(postId, content, commenterId) {
    if(content || content.length != 0) {
        return db.addComment(postId, content, commenterId);
    }
  }

  getPostComments(postId){
    return db.getPostComments(postId);
  }

  async toggleLike(postId, userId) {
    let result = await new Promise((resolve, rej) => {
      db.isPostLikedByUser(postId, userId).then(isLiked => {
        let res;
        if (isLiked) {
          res = db.unlikePost(postId, userId);
        } else {
          res = db.likePost(postId, userId);
        }

        db.getPostLikes(postId).then(data => {
          resolve(data);
        });
      });
    });
    let likers = [];
    if(result.LIKES) {
      const likerIds = result.LIKES.split(',');
      likers = await Promise.all(likerIds.map((like_id) => db.getUserById(like_id)))
      for(let i = 0; i < likers.length; i++) {
        likers[i] = likers[i][0]
      }
    }
    result.LIKERS = likers;
    return result;
  }
}


module.exports = {
  PostManager
}
