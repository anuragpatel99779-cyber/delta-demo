
require("dotenv").config();

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary-v2");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const config = cloudinary.config();

console.log("Cloudinary config loaded:", {
    cloudName: Boolean(config.cloud_name),
    apiKey: Boolean(config.api_key),
    apiSecret: Boolean(config.api_secret),
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "wanderlust_DEV",
        allowed_formats: ["png", "jpg", "jpeg"],
    },
});

module.exports = { cloudinary, storage };
