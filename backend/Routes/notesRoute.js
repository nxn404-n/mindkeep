import express from "express";
import { createNote, deleteNote, getNotes, updateNote } from "../Controllers/notesController.js";
import { checkJwt } from "../Middlewares/checkJwt.js";

const router = express.Router();

router.post("/newnote", checkJwt, createNote);
router.get("/allnotes", checkJwt, getNotes);
router.put("/:id",checkJwt, updateNote);
router.delete("/:id",checkJwt, deleteNote);

export default router;