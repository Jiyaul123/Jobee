const cloudinary = require("cloudinary");
const fs = require("fs");


// cloudinary.v2.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API || "",
//     api_secret: process.env.CLOUDINARY_SECRET
// })

cloudinary.v2.config({
    cloud_name: "dleuhexoz",
    api_key: "758697814654969",
    api_secret: "dE6C6Bm4M5JBYK_KejtpzxXIJ-A"
})



exports.cloudinaryUpload = async (filePath) => {
    try {
        if (!filePath) {
            return null;
        }

        const response = await cloudinary.v2.uploader.upload(filePath, {
            resource_type: "auto"
        });

        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        fs.unlinkSync(filePath);
        throw error;
    }
};