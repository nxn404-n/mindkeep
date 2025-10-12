import mongoose from "mongoose";

const noteSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100,
    default: "Untitled Note"
  },
  content: {
    type: String,
    required: true,
    trim: true
  } 
},
  {timestamps: true}
);

const Note = mongoose.model("Note", noteSchema);
export default Note;