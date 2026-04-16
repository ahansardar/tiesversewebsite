const mongoose = require('mongoose');

const YoutubeVideoSchemas = new mongoose.Schema({
    title : {type : String, required : true},
    video_url : {type : String},
    thumbnail_url : {type : String},
    episode_id : {type : String},
    category : {type : String},
}, {timestamps : true});

module.exports = mongoose.model('YoutubeVideo', YoutubeVideoSchemas);
    
