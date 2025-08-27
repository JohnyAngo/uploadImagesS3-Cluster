const AWS = require("aws-sdk");

const s3 = new AWS.S3({ signatureVersion: "v4" });

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Content-Type,User-Agent, Authorization, X-Requested-With, action",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
};

const signedS3URL = async (event, context) => {
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

  const signedUrl = await s3.getSignedUrlPromise("putObject", {
    Key: s3Key,
    Bucket: process.env.BUCKET,
    Expires: 300,
  });

  const url_save =
    "https://" +
    process.env.BUCKET +
    ".s3." +
    process.env.REGION_AWS +
    ".amazonaws.com/" +
    s3Key;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ signedUrl, url_save }),
  };
};

module.exports = {
  signedS3URL,
};
