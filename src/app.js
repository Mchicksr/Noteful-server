require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const notesRouter = require("./Notes/notes-router");
const foldersRouter = require("./Folders/folders-router");
// THEN eventually evoke this:
// app.use("/api/folders", foldersRouter);
//orrr this:
// app.use("/api/notes", notesRouter);

// const FoldersService = require("./Folders/folders-service");
// const NotesService = require("./Notes/notes-service");

const app = express();
// const jsonParser = express.json();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use("/api/notes", notesRouter);
app.use("/api/folders", foldersRouter);

// app.get("/folders", (req, res, next) => {
//   const knexInstance = req.app.get("db");
//   FoldersService.getAllFolders(knexInstance)
//     .then((folders) => {
//       res.json(folders);
//     })
//     .catch(next);
// });

// app.get("/folders/:folder_id", (req, res, next) => {
//   const knexInstance = req.app.get("db");
//   FoldersService.getById(knexInstance, req.params.folder_id)
//     .then((folder) => {
//       res.json(folder);
//     })
//     .catch(next);
// });

// app.get("/notes", (req, res, next) => {
//   const knexInstance = req.app.get("db");
//   NotesService.getAllNotes(knexInstance)
//     .then((notes) => {
//       res.json(notes);
//     })
//     .catch(next);
// });

// app.get("/notes/:note_id", (req, res, next) => {
//   const knexInstance = req.app.get("db");
//   NotesService.getById(knexInstance, req.params.note_id)
//     .then((note) => {
//       res.json(note);
//     })
//     .catch(next);
// });

// app.post("/folders", jsonParser, (req, res, next) => {
//   const { folder_name } = req.body;
//   const newFolder = { folder_name };
//   FoldersService.insertFolders(req.app.get("db"), newFolder)
//     .then((folder) => {
//       res.status(201).location(`/folders/${folder.id}`).json(folder);
//     })
//     .catch(next);
// });

// app.post("/notes", jsonParser, (req, res, next) => {
//   const { note_name, note_content } = req.body;
//   const newNote = { note_name, note_content };
//   NotesService.insertNotes(req.app.get("db"), newNote)
//     .then((note) => {
//       res.status(201).location(`/notes/${note.id}`).json(note);
//     })
//     .catch(next);
// });

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
