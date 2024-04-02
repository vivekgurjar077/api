import mongoose from "mongoose";
const { Schema } = mongoose;

const ReqtutorSchema = new Schema(
  {

    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    
    
    cat: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
   
    shortDesc: {
      type: String,
      required: true,
    },
   
    shortTitle: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: false,
    },
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Reqtutor", ReqtutorSchema);
