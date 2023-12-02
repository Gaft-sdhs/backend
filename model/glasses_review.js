import mongoose from "mongoose";

const glasses_reviewSchema = new mongoose.Schema({
    glasses_name:{
        type:String,
        required:true
    },
    img_url:{
        type:String,
        required:true
    },
    review:{
        type:String,
        required:true
    },
    link:{
        type:String,
        required:true
    },
    writer:{
        type:String,
        required:true
    }
});

const glasses_review = mongoose.model('glasses_review',glasses_reviewSchema)
export default glasses_review;