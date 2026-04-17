const mongoose = require('mongoose');
const bcrypt  =require('bcryptjs');

const AdminUserSchema= new mongoose.Schema({
    email  :{type: String,  required:true, unique:true},
    password  :{type: String, required:true},
},
{timestamp:true});

AdminUserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password= await bcrypt.hash(this.password,  10);
    next();
});

module.exports= mongoose.model('AdminUser', AdminUserSchema);

