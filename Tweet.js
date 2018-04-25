var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Connect to mLab Database
mongoose.connect(process.env.DB);

// Tweet Schema
var TweetSchema = new Schema ({
    twid       : String,
    active     : Boolean,
    author     : String,
    avatar     : String,
    body       : String,
    date       : Date,
    screenName : String
});

// getTweets method to return tweets from the database
TweetSchema.statics.getTweets = function(page, skip, callback) {

    // Array of tweets
    var tweets = [];

    var start = (page * 10) + (skip * 1);

    // Query database , using skip and limit to have page chunks
    Tweet.find({}, 'twid active author avatar body date screenName',
        {skip: start, limit: 10}).sort({date: 'desc'}).exec(function (err, docs) {

        if(!err) { // If there are no errors
            tweets = docs; // tweets exist
            tweets.forEach(function(tweet){
                tweet.active = true; // Set each tweet to active
            })
        }

        // Pass tweets back to callback
        callback(tweets);
    })
};

// Return a Tweet model based upon the defined schema

module.exports = Tweet = mongoose.model('Tweet', TweetSchema);

