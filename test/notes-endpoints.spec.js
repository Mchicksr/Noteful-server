const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeNotesArray } = require("./notes.fixtures");

// context('Given there are articles in the database', () => {
//    const testArticles = makeNotesArray()

// How would I use a test-driven approach in this assignment?
//update all the places where the word "api" should be

before("make knex instance", () => {
  db = knex({
    client: "pg",
    connection: process.env.TEST_DB_URL
  });

  app.set("db", db);
});

after("disconnect from db", () => db.destroy());

before("clean the table", () => db("notes").truncate());

afterEach("cleanup", () => db("notes").truncate());

describe(`GET /api/notes`, () => {
  context("Given there are notes in the database", () => {
    // const testNotes = makeNotesArray();
    const testNotes = [
      {
        id: 1,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 1
      },
      {
        id: 2,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 1
      },
      {
        id: 3,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 1
      },
      {
        id: 4,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 2
      },
      {
        id: 5,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 2
      },
      {
        id: 6,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 2
      },
      {
        id: 7,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 3
      },
      {
        id: 8,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 3
      },
      {
        id: 9,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 3
      },
      {
        id: 10,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 4
      },
      {
        id: 11,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 4
      },
      {
        id: 12,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 5
      }
    ];

    beforeEach("insert notes", () => {
      return db.into("notes").insert(testNotes);
    });

    it("responds with 200 and all of the notes", () => {
      return supertest(app).get("/notes").expect(200, testNotes);
    });
  });
});

describe(`GET /api/notes/:note_id`, () => {
  context("Given there are notes in the database", () => {
    // const testNotes = makeNotesArray();
    const testNotes = [
      {
        id: 1,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 1
      },
      {
        id: 2,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 1
      },
      {
        id: 3,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 1
      },
      {
        id: 4,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 2
      },
      {
        id: 5,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 2
      },
      {
        id: 6,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 2
      },
      {
        id: 7,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 3
      },
      {
        id: 8,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 3
      },
      {
        id: 9,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 3
      },
      {
        id: 10,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 4
      },
      {
        id: 11,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 4
      },
      {
        id: 12,
        note_name: "noteName1",
        note_content:
          "some content about something spectacular would go here 1",
        folder_id: 5
      }
    ];
    beforeEach("insert notes", () => {
      return db.into("notes").insert(testNotes);
    });

    it("responds with 200 and the specified note", () => {
      const noteId = 2;
      const expectedNote = testNotes[noteId - 1];
      return supertest(app)
        .get(`/api/notes/${noteId}`)
        .expect(200, expectedNote);
    });
  });

  describe.only(`POST /api/notes`, () => {
    it(`creates an note, responding with 201 and the new note`, function () {
      this.retries(3);
      const newNote = {
        note_name: "Test new note",
        note_content: "Test new note content..."
      };
      return supertest(app)
        .post("/api/notes")
        .send(newNote)
        .expect(201)
        .expect((res) => {
          expect(res.body.note_name).to.eql(newNote.note_name);
          expect(res.body.note_content).to.eql(newNote.note_content);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/notes/${res.body.id}`);
          const expected = new Date().toLocaleString();
          const actual = new Date(res.body.modified_date).toLocaleString();
          expect(actual).to.eql(expected);
        })
        .then((postRes) =>
          supertest(app)
            .get(`/api/notes/${postRes.body.id}`)
            .expect(postRes.body)
        );
    });
  });
});

// describe.only("Folders Endpoints", function () {
//   let db;

//   before("make knex instance", () => {
//     db = knex({
//       client: "pg",
//       connection: process.env.TEST_DB_URL
//     });

//     app.set("db", db);
//   });

//   after("disconnect from db", () => db.destroy());

//   // How would I use a test-driven approach in this assignment?
//   //   before("clean the table", () => db("folders").truncate());

//   //   afterEach("cleanup", () => db("folders").truncate());

// //   context("Given there are folders in the database", () => {
// //     const testFolders = makeFoldersArray();
// //     beforeEach("insert folders", () => {
// //       return db.into("folders").insert(testFolders);
// //     });

// //     it("GET /folders responds with 200 and all of the folders", () => {
// //       return supertest(app).get("/folders").expect(200, testFolders);
// //     });

// //     it("GET /folders/:folder_id responds with 200 and the specified folder", () => {
// //       const folderId = 2;
// //       const expectedFolder = testFolder[folderId - 1];
// //       return supertest(app)
// //         .get(`/folders/${folderId}`)
// //         .expect(200, expectedFolder);
// //     });
// //   });
// });
