const express = require("express");
const xss = require("xss");
const NotesService = require("./notes-service");

const notesRouter = express.Router();
const jsonParser = express.json();

notesRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    NotesService.getAllNotes(knexInstance)
      .then((notes) => {
        res.json(notes);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { note_name, note_content, folder_id } = req.body;
    const newNote = { note_name, note_content, folder_id };
    NotesService.insertNotes(req.app.get("db"), newNote)
      .then((note) => {
        res.status(201).location(`/notes/${note.id}`).json(note);
      })
      .catch(next);
  });

notesRouter
  .route("/:note_id")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    NotesService.getById(knexInstance, req.params.note_id)
      .then((note) => {
        if (!note) {
          return res.status(404).json({
            error: { message: `note doesn't exist` }
          });
        }
        //   .then((note) => {
        // res.json(note);
        res.json({
          id: note.id,
          note_name: xss(note.note_name), // sanitize title
          note_content: xss(note.note_content), // sanitize content
          modified_date: note.modified_date
        });
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    NotesService.deleteNote(req.app.get("db"), req.params.note_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = notesRouter;

// .get((req, res, next) => {
//     const knexInstance = req.app.get("db");
//     NotesService.getById(knexInstance, req.params.note_id)
//       .then((note) => {
//         if (!note) {
//           return res.status(404).json({
//             error: { message: `note doesn't exist` }
//           });
//         }
//         //   .then((note) => {
//         // res.json(note);
//         res.json({
//           id: note.id,
//           note_name: xss(note.note_name), // sanitize title
//           note_content: xss(note.note_content), // sanitize content
//           modified_date: note.modified_date
//         });
//       })
//       .catch(next);
//   })

// .all((req, res, next) => {
//     //   .get((req, res, next) => {
//     // const knexInstance = req.app.get("db");
//     NotesService.getById(req.app.get("db"), req.params.note_id)
//       .then((note) => {
//         if (!note) {
//           return res.status(404).json({
//             error: { message: `note doesn't exist` }
//           });
//         }
//         res.note = note; // save the article for the next middleware
//         next(); // don't forget to call next so the next middleware happens!
//       })

//       .catch(next);
//   })
//   .get((req, res, next) => {
//     res.json({
//       id: note.id,
//       note_name: xss(note.note_name), // sanitize title
//       note_content: xss(note.note_content), // sanitize content
//       modified_date: note.modified_date
//     });
//   })
