const db = require("./database_handler");

class PostManager {

  constructor() {

  }

  createPost(writer, content) {
    return db.createPost(writer, content);
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

}


module.exports = {
  PostManager
}
