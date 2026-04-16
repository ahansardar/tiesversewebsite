const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title : {type :String, required : true},
    description : {type: String},
    date : {type : String},
    time : {type : String},
    status : {type : String},
    form_link : {type : String},
    image_url : {type : String},

    is_featured : {type : Boolean, default : false},
},
{timestamps : true});

module.exports = mongoose.model('Event' , EventSchema);