import mongoose from "mongoose";

const eventSchema=new mongoose.Schema(
    {
        _id:{type:String, required:true},
        title:{type:String, required:true},
        overview:{type:String, required:true},
        poster_path:{type:String, required:true},
        backdrop_path:{type:String, required:true},
        release_date:{type:String, required:true},
        tagline:{type:String},
        generes:{type:String, required:true},
        casts:{type:String, required:true},
        vote_average:{type:String, required:true},
        runtime:{type:String, required:true},
        
    },{timestamps:true}
)

const Event=mongoose.model('Event',eventSchema)

export default Event;

