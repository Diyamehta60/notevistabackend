const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  branch: {
    type: String,
  },
  semester: {
    type: String,
  },
  subject: {
    type: String,
  },
  downloadUrl: {
    type: String,
  },
});

module.exports = mongoose.model('notes', notesSchema);
