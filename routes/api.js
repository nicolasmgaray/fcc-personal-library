"use strict";

var expect = require("chai").expect;
const shortid = require("shortid");

let Library = [];

module.exports = function(app) {
  app
    .route("/api/books")
    .get(function(req, res) {
      res.json(
        Library.map(x => ({
          _id: x._id,
          title: x.title,
          commentcount: x.commentcount
        }))
      );
    })

    .post(function(req, res) {
      if (!req.body.title) return res.status(400).send("Title not specified");
      let newBook = {
        title: req.body.title,
        _id: shortid.generate(),
        commentcount: 0,
        comments: []
      };
      Library = [...Library, newBook];
      res.json(newBook);
    })

    .delete(function(req, res) {
      Library = [];
      res.send("complete delete successful");
    });

  app
    .route("/api/books/:id")
    .get(function(req, res) {
      var bookid = req.params.id;
      let book = Library.find(x => x._id == bookid);
      if (!book) res.status(400).send("ID not found");
      res.json(book);
    })

    .post(function(req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;

      let book = Library.find(x => x._id == bookid);
      if (!book) res.send("ID not found");

      book.comments = [...book.comments, comment];
      book.commentcount = book.comments.length;

      Library = [...Library.filter(x => x._id != bookid), book];

      return res.json(book);
    })

    .delete(function(req, res) {
      var bookid = req.params.id;
      let pre = Library.length;
      Library = Library.filter(x => x._id != bookid);
      if (pre == Library.length) return res.send("no book exists");
      res.send("complete delete successful");
    });
};
