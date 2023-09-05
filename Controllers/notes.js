const stream = require("stream");
const path = require("path");
const { google } = require("googleapis");
const Notes = require("../Model/notes");
const fs = require("fs");

const KEYFILEPATH = path.join(__dirname, "key.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

async function findOrCreateFolder(parentFolderId, folderName, drive) {
  const query = `'${parentFolderId}' in parents and name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder'`;
  const response = await drive.files.list({
    q: query,
    fields: "files(id)",
  });

  if (response.data.files.length > 0) {
    return response.data.files[0].id;
  } else {
    const folderMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
    };

    const newFolder = await drive.files.create({
      resource: folderMetadata,
      fields: "id",
    });

    return newFolder.data.id;
  }
}
// controller to upload document
const uploadNotes = async (req, res) => {
  const { branchFolderName, semesterFolderName, subjectFolderName } = req.body;

  const branchFolderId = await findOrCreateFolder(
    "1yT9A5YYy4nzDOfO7Qzptn4L3EKjm0WAq",
    branchFolderName,
    drive
  );
  const semesterFolderId = await findOrCreateFolder(
    branchFolderId,
    semesterFolderName,
    drive
  );
  const subjectFolderId = await findOrCreateFolder(
    semesterFolderId,
    subjectFolderName,
    drive
  );

  const fileMetadata = {
    name: req.files.Files.name, // Use the provided file name
    parents: [subjectFolderId], // Replace with your folder ID
  };

  const media = {
    mimeType: req.files.Files.mimeType, // Use the provided MIME type
    body: fs.createReadStream(req.files.Files.tempFilePath), // Use the temporary file path
  };

  try {
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id,name,webContentLink",
    });

    let obj = {
      branch: branchFolderName,
      subject: subjectFolderName,
      semester: semesterFolderName,
      name: response.data.name,
      downloadUrl: response.data.webContentLink,
    };

    const savedData = await Notes.create(obj);
    res.status(200).json({ data: savedData, success: true });
  } catch (error) {
    res.status(200).json({
      message: `Your file was not uploaded, ${error}`,
      success: false,
    });
  }
};

const getNotesBySubject = async (req, res) => {
  const { branch, subject, semester } = req.body;
  console.log(branch, subject, semester);
  const data = await Notes.find({
    branch,
    subject,
    semester,
  });
  

  res.json(data);
};

module.exports = {
  uploadNotes,
  getNotesBySubject,
};
