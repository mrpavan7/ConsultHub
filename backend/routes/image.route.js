import express from "express";
import multer from "multer";
import { PassThrough } from "stream";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Multer storage configuration (in-memory storage for temporary file handling)
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Uploaded file:", req.file);

    const uploadToCloudinary = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              reject(error);
            } else {
              console.log("Cloudinary Upload Success:", result);
              resolve(result);
            }
          }
        );

        // Convert buffer to readable stream and pipe to Cloudinary
        const bufferStream = new PassThrough();
        bufferStream.end(fileBuffer);
        bufferStream.pipe(stream);
      });
    };

    // Call the function to upload the image
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer);

    console.log("Cloudinary Result:", cloudinaryResult);

    return res
      .status(200)
      .json({ success: true, url: cloudinaryResult.secure_url });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({
      message: "Error uploading image to Cloudinary",
      error: error.message,
    });
  }
});
export default router;
