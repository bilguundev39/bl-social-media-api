module.exports = {
  async up(db, client) {
    // these indicies are used in pagination
    db.collection('posts').createIndex({commentCount: 1})
    db.collection('posts').createIndex({commentCount: 1, createAt: 1})
    db.collection('posts').createIndex({commentCount: 1, createAt: 1, _id: 1})
  },

  async down(db, client) {
    db.collection('posts').dropIndex({commentCount: 1})
    db.collection('posts').dropIndex({commentCount: 1, createAt: 1})
    db.collection('posts').dropIndex({commentCount: 1, createAt: 1, _id: 1})
  }
};
