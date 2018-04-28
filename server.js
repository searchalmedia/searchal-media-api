// Require dependencies
var express = require('express');
var bodyParser = require('body-parser');
var Twitter = require('twitter');
var mongoose = require('mongoose');
var cors = require('cors');
var Tweet = require('./Tweet');
var botometer = require('node-botometer');

// Express instance
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Router instance
var router = express.Router();

// Connect to mLab Database
mongoose.connect(process.env.DB);

// new Twitter instance with auth variables
var client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_SECRET,
    app_only_auth: true
});

var botmeter = new botometer({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: null,
    access_token_secret: null,
    app_only_auth: true,
    mashape_key: process.env.MASHAPE_KEY,
    rate_limit: 0,
    log_progress: true,
    include_user: true,
    include_timeline: false,
    include_mentions: false
});

// search for tweets route

router.route('/search')
    .post(function(req, res) {
        var tweetList = [];

        if (!req.body.searchKey) {
            res.json({success: false, msg: 'Please pass search key.'});
        }
        else {
            var key = req.body.searchKey;

            client.get('search/tweets', {q: key, result_type: 'popular'}, function (error, tweets, response) {

                tweets.statuses.forEach(function(tweets){

                    tweetEntry = new Tweet();

                    tweetEntry.twid = tweets.id_str;
                    tweetEntry.active = false;
                    tweetEntry.author = tweets.user.name;
                    tweetEntry.avatar = tweets.user.profile_image_url_https;
                    tweetEntry.body = tweets.text;
                    tweetEntry.date = tweets.created_at;
                    tweetEntry.screenName = tweets.user.screen_name;

                    tweetEntry.save(function(err) {
                        if (err) {
                            return res.send(err);
                        }
                    });
                });

                res.json({ success: true, message: 'Tweets created!'});

            });
        }
    });

/*
router.route('/bot')
    .post(function (req, res) {
        if (!req.body.userName) {
            res.json({success: false, msg: 'Please pass username.'});
        }
        else {
            var names = [];
            names[0] = req.body.userName;
            botmeter.getBatchBotScores(names, data => {
                console.log(data);
            });
        }
    });
*/

app.use('/', router);
app.listen(process.env.PORT || 8080);
console.log("Listening on port " + (process.env.PORT || 8080));
