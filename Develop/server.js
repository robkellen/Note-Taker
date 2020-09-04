const { v4: uuidv4 } = require("uuid");
const express = require("express");
const logger = require("morgan");
const fs = require("fs");
const path = require("path");

let app = express();
let PORT = 5050;

var notes = [];

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));

//   * GET `/notes` - Should return the `notes.html` file.
app.get("/notes", function (req, res) {
  res.sendFile(__dirname + "/public/notes.html");
});
// * The application should have a `db.json` file on the backend that will be used to store and retrieve notes using the `fs` module.

// * The following API routes should be created:

//   * GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", function (req, res) {
  fs.readFile(__dirname + "/db/db.json", "utf8", function(err, data){
    res.json(JSON.parse(data));
  })
});
//   * POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post("/api/notes", function (req, res) {
  const note = req.body;
  
  // notes.push(note);
  // res.json(note);

  console.log(note);
});

//   * DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.

//   * GET `*` - Should return the `index.html` file
app.get("*", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
