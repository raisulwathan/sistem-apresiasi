import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './upload');
  },

  filename: (req, file, cb) => {
    const fileName = new Date().toString() + '-' + file.originalname;
    cb(null, fileName);
  },
});

export default upload = multer({ storage });
