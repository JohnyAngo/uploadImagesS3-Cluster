// const AWS = require("aws-sdk")

// const s3 = new AWS.S3({ signatureVersion: 'v4' })

// const signedS3URL = async (event, context) => {
//     const filename = event.queryStringParameters.filename
//     const signedUrl = await s3.getSignedUrlPromise("putObject", {
//         Key: `upload/${filename}`,
//         Bucket: process.env.BUCKET,
//         Expires: 300,
//       });
//     return {
//         "statusCode": 200,
//         "body": JSON.stringify({ signedUrl })
//     }
// }

// module.exports = {
//     signedS3URL
// }

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
  const pathSub1 = event.queryStringParameters.pathSub1;
  const pathSub2 = event.queryStringParameters.pathSub2;
  const pathSub3 = event.queryStringParameters.pathSub3;
  const pathSub4 = event.queryStringParameters.pathSub4;
  const filename = event.queryStringParameters.filename;

  let s3Key = `upload`;

  if (pathSub1) {
    s3Key += `/${pathSub1}`;
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

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ signedUrl, s3Key }),
  };
};

module.exports = {
  signedS3URL,
};
