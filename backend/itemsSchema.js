import mongoose from "mongoose";
const Schema = mongoose.Schema;


const itemsSchema = new Schema({
    userCreated:String,
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
}, {timestamps: true});

const Items = mongoose.model('Items',itemsSchema);

export default Items;