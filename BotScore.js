var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Connect to mLab Database
mongoose.connect(process.env.DB);

// Tweet Schema
var BotScoreSchema = new Schema ({
    score       : String,
    friend      : String,
    sentiment   : String,
    temporal    : String,
    user        : String,
    network     : String,
    content     : String
});

// Return a Tweet model based upon the defined schema

module.exports = BotScore = mongoose.model('BotScore', BotScoreSchema);

