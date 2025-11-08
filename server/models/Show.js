import mongoose from "mongoose";

const showSchema=new mongoose.Schema(
    {
        event:{type:string , required:true , ref: 'Event'},
        showDateTime:{type:string , required:true},
        showPrice:{type:string , required:true},
        occupiedSeats:{type: Object , default:{}},
    },{minimise:false}
)

const Show=mongoose.model("Show",showSchema)

export default Show;
