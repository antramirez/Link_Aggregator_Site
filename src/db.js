// db.js

const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

// add user schema
const UserSchema = mongoose.Schema({
  username: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, unique: true, required: true}
});

// add article schema
const ArticleSchema = mongoose.Schema({
  title: {type: String, required: true},
  url: {type: String, required: true},
  description: {type: String},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'UserSchema'}
});

// use plugin (for slug) for article
ArticleSchema.plugin(URLSlugs('title'));

// register schemas
mongoose.model("User", UserSchema);
mongoose.model("Article", ArticleSchema);

// connect to database
mongoose.connect('mongodb://localhost/hw06', { useNewUrlParser: true });
