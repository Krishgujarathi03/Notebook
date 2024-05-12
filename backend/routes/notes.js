import express from "express";
import fetchUser from "../middleware/fetchUser.js";
import Notes from "../models/Notes.js";
const router = express.Router();

// Get all the notes using: GET "/api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.userId });
    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).send("There is something wrong");
  }
});

router.post("/addnote", fetchUser, async (req, res) => {
  try {
    // Data comimg from body(frontend)
    const { title, description, tag } = req.body;
    // Validation
    if (!title || !description || !tag) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Notes
    const notes = new Notes({ title, description, tag, user: req.userId });
    // Saving notes to database
    const savedNote = await notes.save();
    res.json({ savedNote, success: "Note added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("There is something wrong");
  }
});

// Update notes
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;
  const { id } = req.params;

  try {
    // find the note
    const note = await Notes.findById({ _id: id });

    if (!note) {
      return res.status(404).send("Note not found");
    }

    if (note.user.toString() !== req.userId) {
      return res.status(401).send("Not Allowed");
    }
    console.log(note);

    // Update Note
    const notes = await Notes.findByIdAndUpdate(
      { _id: id },
      {
        $set: { title, description, tag },
      },
      { new: true }
    );
    res.json({ notes, success: "Notes Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("There is something wrong");
  }
});

// Delete notes
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  const { id } = req.params;
  try {
    let note = await Notes.findById({ _id: id });

    if (!note) {
      return res.status(400).send("Note not found");
    }

    // Delete only if user owns this note
    if (note.user.toString() !== req.userId) {
      return res.status(401).send("Not Allowed");
    }

    // Delete
    note = await Notes.findByIdAndDelete({ _id: id });
    res.json({ note, success: "Note has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("There is something wrong");
  }
});

export default router;
