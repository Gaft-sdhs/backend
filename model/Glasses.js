import mongoose from "mongoose";

const GlassesSchema = new mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    Title:{
        type:String,
        required:true
    },
    subtitle:{
        type:String,
        required:true
    },
});

const Glasses = mongoose.model('Glasses',GlassesSchema)
export default Glasses