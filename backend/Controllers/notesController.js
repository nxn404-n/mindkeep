import Note from "../Models/notesSchema.js";
import User from "../Models/userSchema.js";

//Create New Note
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { userId } = req.user;

    if (!content) {
      return res.status(400).json({
        error: "Content required"
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

//Get notes
export const getNotes = async (req, res) => {
  try {
    const { userId } = req.user;

    const notes = await Note.find({ "user": userId }).sort({ updatedAt: -1 });
    
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

//Update Note
export const updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const { title, content } = req.body;
    const { userId } = req.user;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    // Check ownership
    if (note.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Update fields
    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) note.content = content.trim();
    await note.save();

    res.status(200).json({
      message: "Note updated successfully",
      note
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Delete note
export const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const { userId } = req.user;

    // Find the note
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    // Check ownership
    if (note.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await note.deleteOne();

    res.status(200).json({
      message: "Note deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};