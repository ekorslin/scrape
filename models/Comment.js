var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new LibrarySchema object
// This is similar to a Sequelize model
var CommentSchema = new Schema({
  // `author` must be of type String
  author: String,
  // `title` must be of type String
  location: String,
  comment: String
});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Book model
module.exports = Comment;
