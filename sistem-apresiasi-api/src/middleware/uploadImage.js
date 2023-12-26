import multer from "multer";
import path from "path";
import fs from "fs";

const createUploadsFolder = () => {
  const uploadsFolder = "./public/uploads";
  if (!fs.existsSync(uploadsFolder)) {
    fs.mkdirSync(uploadsFolder, { recursive: true });
  }
};

// Membuat direktori penyimpanan jika belum ada
createUploadsFolder();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${path.parse(file.originalname).name}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

export default upload;
