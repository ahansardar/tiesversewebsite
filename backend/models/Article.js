const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title : {type :String, required : true},
    description : {type: String},
    image_url : {type : String},
    display_id : {type : String},
    author : {type : String},
    read_time : { type : String},
    link : { type : String},
    content : { type : String},
},
{timestamps : true});

module.exports = mongoose.model('Article' , ArticleSchema);