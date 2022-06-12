const express = require('express');
const multer = require('multer');
const cors = require('cors');
var path = require('path');

const app = express();

app.use(express.json());
app.use(cors());

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads")
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + "-" + Date.now() + ".jpg")
        }
    }),
    limits: {
        //fields: 5,
        fieldNameSize: 50, // TODO: Check if this size is enough
        fieldSize: 20000, //TODO: Check if this size is enough
        // TODO: Change this line after compression
        fileSize: 15000000, // 150 KB for a 1080x1080 JPG 90
    },
    fileFilter: function (_req, file, cb) {
        checkFileType(file, cb);
    }
}).single("user_file");

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

app.post("/upload", upload, (req, resp) => {
    resp.send(JSON.stringify({ "success": "File Uploaded" }));
});

app.listen(5000);