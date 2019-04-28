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
}


module.exports = {
  PostManager
}
