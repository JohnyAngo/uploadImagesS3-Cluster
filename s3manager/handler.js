const AWS = require("aws-sdk");
const s3 = new AWS.S3({ signatureVersion: "v4" });
const { verify } = require("jsonwebtoken");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Content-Type,User-Agent, Authorization, X-Requested-With, action",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
};

const secretKey = "HKHVHJVKBKJKJBKBKHKBMKHB";

const authMiddleware = (handler) => {
  return async (event, context) => {
    try {
      const authHeader = event.headers.Authorization;
      if (!authHeader) {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: "Authorization header missing" }),
        };
      }
      const token = authHeader;
      if (!token) {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: "Token missing" }),
        };
      }

      const decoded = verify(token, secretKey);
      if (!decoded) {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: "Invalid Token" }),
        };
      }

      event.token = decoded;

      return await handler(event, context);
    } catch (error) {
      console.error("Authorization failed", error);
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized", error: error }),
      };
    }
  };
};

const listObjects = authMiddleware(async (event, context) => {
  const reqObj = JSON.parse(event.body);
  const params = {
    Bucket: process.env.BUCKET,
    Prefix: reqObj.path,
    Delimiter: "/",
  };
  try {
    const data = await s3.listObjectsV2(params).promise();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ data }),
    };
  } catch (err) {
    console.error("Error listing objects: ", err);
    throw err;
  }
});

module.exports = {
  listObjects,
};
