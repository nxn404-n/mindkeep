import Note from "../Models/notesSchema.js";
import User from "../Models/userSchema.js";
import { AppError } from "../utils/AppError.js";

//Create New Note
export const createNote = async (req, res, next) => {
    const { title, content } = req.body;
    const { userId } = req.user;

    if (!content) {
      return next(new AppError("Content required", 400));
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
      status: "success",
      message: "Note created successfully",
      note: newNote
    })
}

//Get notes
export const getNotes = async (req, res, next) => {
    const { userId } = req.user;
    const notes = await Note.find({ "user": userId }).sort({ updatedAt: -1 });

    if (!notes || notes.length === 0) {
      return next(new AppError("No notes found for this user", 404));
    }
      
    res.status(200).json(notes);
}

//Update Note
export const updateNote = async (req, res, next) => {
    const noteId = req.params.id;
    const { title, content } = req.body;
    const { userId } = req.user;

    const note = await Note.findById(noteId);
    if (!note) {
      return next(new AppError("Note not found", 404));
    }
    // Check ownership
    if (note.user.toString() !== userId) {
      return next(new AppError("Unauthorized", 403));
    }

    // Update fields
    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) note.content = content.trim();
    await note.save();

    res.status(200).json({
      message: "Note updated successfully",
      note
    });
};

//Delete note
export const deleteNote = async (req, res, next) => {
    const noteId = req.params.id;
    const { userId } = req.user;

    // Find the note
    const note = await Note.findById(noteId);
    if (!note) {
      return next(new AppError("Note not found", 404));
    }
    // Check ownership
    if (note.user.toString() !== userId) {
      return next(new AppError("Unauthorized", 403));
    }

    await note.deleteOne();

    res.status(200).json({
      message: "Note deleted successfully"
    });
};