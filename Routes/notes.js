const express = require("express");
const {  uploadNotes, getNotesBySubject} = require("../Controllers/notes");
const router = express.Router();
const multer = require('multer');


router.route("/upload").post(uploadNotes);
router.route("/getNotes").post(getNotesBySubject);


module.exports = router;
