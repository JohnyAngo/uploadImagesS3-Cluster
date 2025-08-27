const AWS = require("aws-sdk");

const s3 = new AWS.S3({ signatureVersion: "v4" });

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Content-Type,User-Agent, Authorization, X-Requested-With, action",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
};

const deleteImageFromS3 = async (event, context) => {
  const domain = event.queryStringParameters.domain;
  const path = event.queryStringParameters.path;
  const pathSub2 = event.queryStringParameters.pathSub2;
  const pathSub3 = event.queryStringParameters.pathSub3;
  const pathSub4 = event.queryStringParameters.pathSub4;
  const filename = event.queryStringParameters.filename;

  // let s3Key = `upload/files/${domain}`;
  let s3Key = `upload`;

  if (path) {
    s3Key += `/${path}`;
    if (pathSub2) {
      s3Key += `/${pathSub2}`;
      if (pathSub3) {
        s3Key += `/${pathSub3}`;
        if (pathSub4) {
          s3Key += `/${pathSub4}`;
        }
      }
    }
  }
  s3Key += `/${filename}`;

  try {
    await s3
      .deleteObject({
        Key: s3Key,
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
