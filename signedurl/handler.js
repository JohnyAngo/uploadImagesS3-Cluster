const AWS = require("aws-sdk");

const s3 = new AWS.S3({ signatureVersion: "v4" });

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Content-Type,User-Agent, Authorization, X-Requested-With, action",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
};

//wwww.xxxxx.xxxx/dominio/files/crop/field/{cod_field}/{cod_monitoring}/
//wwww.xxxxx.xxxx/dominio/files/crop/324safsfsdsdf/sdfsdf3243232/23432dwasdasd/
//wwww.xxxxx.xxxx/dominio/files/sub1/sub2/sub3/sub4/

const signedS3URL = async (event, context) => {
  const domain = event.queryStringParameters.domain;
  const pathSub1 = event.queryStringParameters.pathSub1;
  const pathSub2 = event.queryStringParameters.pathSub2;
  const pathSub3 = event.queryStringParameters.pathSub3;
  const pathSub4 = event.queryStringParameters.pathSub4;
  const filename = event.queryStringParameters.filename;

  let s3Key = `upload/files/${domain}`;

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
