const { v4: uuidv4 } = require("uuid");
const express = require("express");
const logger = require("morgan");
const fs = require("fs");
const path = require("path");

let app = express();
const PORT = process.env.PORT || 5050;


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))
app.use(logger("dev"));


//read the `db.json` file and return all saved notes
app.get("/api/notes", function (req, res) {
  fs.readFile(__dirname + "/db/db.json", "utf8", function (err, data) {
    res.json(JSON.parse(data));
  });
});
//receives a new note to save on the request body, adds it to the `db.json` file, and then returns the new note to the client.
app.post("/api/notes", function (req, res) {
  const note = req.body;
  //assign randomly generated UUID
  note.id = uuidv4();
  // read all notes
  fs.readFile(__dirname + "/db/db.json", "utf8", function (err, list) {
    if (err) throw err;
    const storedNotes = JSON.parse(list);
    //add new note
    storedNotes.push(note);
    //write new note to file
    const stringNote = JSON.stringify(storedNotes, null, 2);
    fs.writeFile(__dirname + "/db/db.json", stringNote, function () {
      res.json(note);
    });
  });
});

//Delete specific note identified by user
app.delete("/api/notes/:id", function (req, res) {
  //receive a query parameter containing the id of a note to delete.
  const { id } = req.params;
  fs.readFile(__dirname + "/db/db.json", "utf8", function (err, list) {
    if (err) console.log("ERROR");
    //read all notes
    let storedNotes = JSON.parse(list);
    // filter out selected note based on ID from user input req.params
    storedNotes = storedNotes.filter((storedNote) => storedNote.id !== id);
    //collect notes that were NOT deleted and stringify
    const unselectedNotes = JSON.stringify(storedNotes, null, 2);
    fs.writeFile(__dirname + "/db/db.json", unselectedNotes, function () {
      res.json(true);
    });
  });
});

//return the `notes.html` file.
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/notes.html"));
});
//returns the `index.html` file
app.get("*", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
