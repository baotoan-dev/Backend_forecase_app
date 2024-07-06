import multer from "multer";
// import path from "path";

// Filter
const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = "Only image files are allowed!";
        return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
};

const pdfFilter = function (req, file, cb) {
    // Accept pdf only
    if (!file.originalname.match(/\.(pdf|PDF)$/)) {
        req.fileValidationError = "Only pdf files are allowed!";
        return cb(new Error("Only pdf files are allowed!"), false);
    }
    cb(null, true);
};

const storage = multer.memoryStorage();
const multerUploadImages = multer({
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 1024 * 1024 * 10,
        files: 5,
    },
}).array("images", 5);

const multerUploadPdf = multer({
    storage,
    fileFilter: pdfFilter,
    limits: {
        fileSize: 1024 * 1024 * 5,
        files: 1,
    },
}).single("pdf");



// Export
export { multerUploadImages, multerUploadPdf };
