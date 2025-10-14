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

//Get notes
export const getNotes = async (req, res) => {
  try {
    const { userId } = req.user;

    const notes = await Note.find({ "_id": userId }).sort({ updatedAt: -1 });
    
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

    if (!title && !content) {
      return res.status(400).json({
        error: "At least one of title or content must be provided to update."
      });
    }

    const updatedFields = {};
    if (title !== undefined) updatedFields.title = title.trim();
    if (content !== undefined) updatedFields.content = content.trim();

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({
      message: "Note updated successfully",
      note: updatedNote
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

//Delete note
export const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    if (!noteId) {
      return res.status(400).json({
        error: "Id is missing"
      });
    }

    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) {
      return res.status(404).json({
        error: "Note not found"
      });
    }

    res.status(200).json({
      message: "Note deleted successfully"
    })
  } catch (error) {
     res.status(500).json({
      error: error.message
    });
  }
}