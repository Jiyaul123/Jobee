const multer = require("multer");
const path = require("path")


const uploadsFolderPath = path.resolve(__dirname, '../uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsFolderPath)
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + "_" + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    // Check if the file type is PDF or DOCX
    const allowedFileTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(null, false); // Reject the file
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})

module.exports = upload