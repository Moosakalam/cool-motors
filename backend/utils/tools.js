const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
require("dotenv").config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

exports.deleteS3Images = async (images) => {
  if (!Array.isArray(images) || images.length === 0) return;

  try {
    await Promise.all(
      images.map(async (image) => {
        const key = image.split("amazonaws.com/")[1];
        const deleteParams = {
          Bucket: bucketName,
          Key: key,
        };
        await s3Client.send(new DeleteObjectCommand(deleteParams));
      })
    );

    // console.log("All images deleted successfully");
  } catch (error) {
    console.error("Error deleting images from S3:", error);
  }
};
