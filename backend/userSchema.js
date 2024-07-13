import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:false
    }
}, {timestamps: true});
//no need the timestamps at all
const User = mongoose.model('Users', userSchema);

export default User;