module.exports.mongoURL = () => ({
  dev: {
    mongoURL:
      "mongodb+srv://agropais:Hsdh9pZVR2K4eD2@metagro360.glwvvib.mongodb.net/agripac?retryWrites=true&w=majority",
  },
  prod: {
    mongoURL:
      "mongodb+srv://agropais:Hsdh9pZVR2K4eD2@metagro360.glwvvib.mongodb.net/agropais?retryWrites=true&w=majority",
  },
});

module.exports.region = () => ({
  dev: {
    regionAws: "us-east-2",
  },
  prod: {
    regionAws: "us-east-1",
  },
});

module.exports.bucketName = () => ({
  dev: {
    bucketName: "files-gear-dev",
  },
  prod: {
    bucketName: "files-gear-prod",
  },
});

