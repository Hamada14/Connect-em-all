const db = require("./database_handler");

class PostManager {

  constructor() {

  }

  createPost(writer, content) {
    return db.createPost(writer, content);
  }

  getNewsFeedForUser(userId) {
    return db.getNewsFeedForUser(userId);
  }

  getPostsByUser(userId) {
    return db.getPostsByUser(userId);
  }

  addComment(postId, content, commenterId){
	return db.addComment(postId, content, commenterId);
  }

  getPostComments(postId){
	return db.getPostComments(postId);
  }

  toggleLike(postId, userId) {

    return new Promise((resolve, rej) => {
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
  }
}


module.exports = {
  PostManager
}
