// db.js

const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

// add user schema
const UserSchema = mongoose.Schema({
  username: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, unique: true, required: true}
});

// register model
const User = mongoose.model("User", UserSchema);

// add article schema
const ArticleSchema = mongoose.Schema({
  title: {type: String, required: true},
  url: {type: String, required: true},
  description: {type: String},
  userId: {type: mongoose.Schema.Types.ObjectId, unique: true, required: true, ref: User}
});

// use plugin (for slug) for article
ArticleSchema.plugin(URLSlugs('title'));

// register model
mongoose.model("Article", ArticleSchema);

// connect to database
mongoose.connect('mongodb://localhost/hw06', { useNewUrlParser: true });
