const multer = require('multer');
const path = require('path');

// Set up storage options with multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');  // Ensure this directory exists
        console.log('Uploading to directory: uploads/'); // Log the upload directory
    },
    filename: function(req, file, cb) {
        // Generate a unique filename for each uploaded file
        const uniqueFilename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        console.log('Generating file path:', uniqueFilename); // Log the generated file path
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Configure multer to handle multiple files for beforeImages and afterImages
const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        console.log('Processing file upload:', file.originalname); // Log the uploaded filename
        // Optionally, add checks for file type or size here
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            // Reject files that do not match the pattern
            cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true); // Accept the file
    }
}).fields([
    { name: 'beforeImages', maxCount: 10 },  // Allow up to 10 images for beforeImages
    { name: 'afterImages', maxCount: 10 }    // Allow up to 10 images for afterImages
]);

module.exports = { upload, storage };
