var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Connect to mLab Database
mongoose.connect(process.env.DB);

// Tweet Schema
var TweetSchema = new Schema ({
    twid          : String,
    active        : Boolean,
    author        : String,
    avatar        : String,
    body          : String,
    date          : Date,
    screenName    : String,
    favorites     : Number,
    retweets      : Number
});

// Return a Tweet model based upon the defined schema

module.exports = Tweet = mongoose.model('Tweet', TweetSchema);

