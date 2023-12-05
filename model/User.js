import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    payment_details:[Object]
});

const User = mongoose.model('User',userSchema);

export default User;