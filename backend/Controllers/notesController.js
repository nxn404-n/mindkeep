import Note from "../Models/notesSchema";
import User from "../Models/userSchema";

//Create New Note
export const createNote = async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    if (!content || !userId) {
      return res.status(400).json({
        error: "Content or userId are required"
      });
    }

    const newNote = await Note.create({
      title,
      content,
      user: userId
    });

    await User.findByIdAndUpdate(userId, {
      $push: { notes: newNote._id }
    });

    res.status(201).json({
      message: "Note created successfully"
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}