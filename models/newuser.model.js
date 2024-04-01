import mongoose from "mongoose";
const { Schema } = mongoose;

const NewuserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
 email: {
    type: String,
    required: true,
    unique: true,
  }, 
  password: {
    type: String,
    required: true,
  },
  
  phone: {
    type: String,
    required: false,
  },
  
  admin: {
    type: Boolean,
    default:false,
    required: false,
  },
},{
  timestamps:true
});

export default mongoose.model("Newuser", NewuserSchema)

