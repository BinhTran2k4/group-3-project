
const multer = require('multer');


const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb({ message: 'Chỉ chấp nhận file ảnh!' }, false);
    }
};

const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter, 
    limits: { fileSize: 1024 * 1024 * 5 } 
});

module.exports = upload;