var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  let lastId;

  beforeEach(done => {
    chai
      .request(server)
      .post("/api/books")
      .send({ title: "Test" })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "_id", "Book should contain _id");
        lastId = res.body._id;
        done();
      });
  });

  suite("Routing tests", function() {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        test("Test POST /api/books with title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "Test" })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.property(
                res.body,
                "commentcount",
                "Book should contain commentcount"
              );
              assert.property(res.body, "title", "Book should contain title");
              assert.property(res.body, "_id", "Book should contain _id");
              done();
            });
        });

        test("Test POST /api/books with no title given", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send()
            .end(function(err, res) {
              assert.equal(res.status, 400);
              assert.equal(res.text, "Title not specified");

              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", function(done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "commentcount",
              "Books in array should contain commentcount"
            );
            assert.property(
              res.body[0],
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body[0],
              "_id",
              "Books in array should contain _id"
            );
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      test("Test GET /api/books/[id] with id not in db", function(done) {
        chai
          .request(server)
          .get("/api/books/584")
          .end(function(err, res) {
            assert.equal(res.status, 400);        
            assert.equal(
              res.text,
              "ID not found"             
            );          
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function(done) {
        chai
          .request(server)
          .get("/api/books/"+lastId)
          .end(function(err, res) {
            assert.equal(res.status, 200);        
            assert.property(
              res.body,
              "commentcount",
              "Books in array should contain commentcount"
            );
            assert.property(
              res.body,
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body,
              "_id",
              "Books in array should contain _id"
            );
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        test("Test POST /api/books/[id] with comment", function(done) {
         chai
            .request(server)
            .post("/api/books/"+lastId)
            .send({  comment: "Test Comment" })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, lastId);
              assert.isArray(res.body.comments);
              assert.include(res.body.comments,"Test Comment")
              done();
            });
        });
      }
    );
  });
});
