const AWS = require("aws-sdk");

const s3 = new AWS.S3({ signatureVersion: "v4" });

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Content-Type,User-Agent, Authorization, X-Requested-With, action",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
};

const deleteImageFromS3 = async (event, context) => {
  const filename = event.queryStringParameters.filename;

  try {
    await s3
      .deleteObject({
        Key: `upload/${filename}`,
        Bucket: process.env.BUCKET,
      })
      .promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Image deleted successfully." }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to delete image." }),
    };
  }
};

module.exports = {
  deleteImageFromS3,
};
