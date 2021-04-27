const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");
const schema = require("./graphql/schemas");
const aws = require("aws-sdk");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY_ID, // aws access id here
  secretAccessKey: process.env.SECRET_ACCESS_KEY, // aws secret access key here
  region: 'us-east-2',
  useAccelerateEndpoint: true,
});

const app = express();
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/ruski", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);
const connection = mongoose.connection;

connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

// api endpoint for getting presigned url to upload user profile pictures to s3 bucket
app.get("/get_presigned_url_jpeg/:user_id", (req, res) => {
  const params = {
    Bucket: "playruski.com",
    Key: `profiles/${req.params.user_id}.jpeg`,
    Expires: 3600,
    ContentType: "image/jpeg",
  };
  s3.getSignedUrl("putObject", params, function (err, url) {
    if (err) {
      res.json({
        success: false,
        message: "Pre-Signed URL error",
      });
    } else {
      res.json({
        success: true,
        message: "AWS SDK S3 Pre-signed urls generated successfully.",
        presigned_url: url,
        cdn_access_url: `https://d26n5v24zcmg6e.cloudfront.net/${params.Key}.jpeg`,
      });
    }
  });
});

app.get("/get_presigned_url_png/:user_id", (req, res) => {
  const params = {
    Bucket: "playruski.com",
    Key: `profiles/${req.params.user_id}.png`,
    Expires: 3600,
    ContentType: "image/png",
  };
  s3.getSignedUrl("putObject", params, function (err, url) {
    if (err) {
      res.json({
        success: false,
        message: "Pre-Signed URL error",
      });
    } else {
      res.json({
        success: true,
        message: "AWS SDK S3 Pre-signed urls generated successfully.",
        presigned_url: url,
        cdn_access_url: `https://d26n5v24zcmg6e.cloudfront.net/${params.Key}.png`,
      });
    }
  });
});


app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("Running a GraphQL API server at http://localhost:4000/graphql");
});
