const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeFoldersArray } = require("./folders.fixtures");

// How would I use a test-driven approach in this assignment?

before("make knex instance", () => {
  db = knex({
    client: "pg",
    connection: process.env.TEST_DB_URL
  });

  app.set("db", db);
});

after("disconnect from db", () => db.destroy());

// before("clean the table", () => db("folders").truncate());

// afterEach("cleanup", () => db("folders").truncate());

describe.skip(`GET /folders`, () => {
  context("Given there are folders in the database", () => {
    const testFolders = makeFoldersArray();

    beforeEach("insert folders", () => {
      return db.into("folders").insert(testFolders);
    });

    it("responds with 200 and all of the folders", () => {
      return supertest(app).get("/folders").expect(200, testFolders);
    });
  });
});

describe.skip(`GET /folders/:folder_id`, () => {
  context("Given there are folders in the database", () => {
    const testFolders = makeFoldersArray();

    beforeEach("insert folders", () => {
      return db.into("folders").insert(testFolders);
    });

    it("responds with 200 and the specified folder", () => {
      const folderId = 2;
      const expectedFolder = testFolders[folderId - 1];
      return supertest(app)
        .get(`/folders/${folderId}`)
        .expect(200, expectedFolder);
    });
  });

  describe.only(`POST /folders`, () => {
    it(`creates an folder, responding with 201 and the new note`, function () {
      this.retries(3);
      const newFolder = {
        folder_name: "Test new folder"
      };
      return supertest(app)
        .post("/folders")
        .send(newFolder)
        .expect(201)
        .expect((res) => {
          expect(res.body.folder_name).to.eql(newFolder.folder_name);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/folders/${res.body.id}`);
        })
        .then((postRes) =>
          supertest(app).get(`/folders/${postRes.body.id}`).expect(postRes.body)
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
