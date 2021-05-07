const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");
const schema = require("./graphql/schemas");
const aws = require("aws-sdk");
const fs = require('fs');
const yargs = require('yargs');
const https = require('https');

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const argv = yargs
    .option('port', {
        alias: 'p',
        description: 'Specify the port to run the server on',
        type: 'number',
        demand: 'You must specify the port'
    })
    .help()
    .alias('help', 'h')
    .argv;

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY_ID, // aws access id here
  secretAccessKey: process.env.SECRET_ACCESS_KEY, // aws secret access key here
  region: 'us-east-2',
  useAccelerateEndpoint: true,
});

var whitelist = ['https://playruski.com', 'https://dev.playruski.com', 'https://www.playruski.com'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

const app = express();
app.use(express.static(__dirname + '/static', { dotfiles: 'allow' }));
if(argv.port === 443) {
  app.use(cors(corsOptions));
} else {
  app.use(cors());
}

mongoose.connect("mongodb://127.0.0.1:27017/ruski", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);
const connection = mongoose.connection;

connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

app.get("/", (req, res) => {
    res.send('cum');
});

// api endpoint for getting beer and yak totals from yack-beer-totals.json
app.get("/get_yack_beer_totals", (req, res) => {
    res.send(fs.readFileSync('./yack-beer-totals.json', 'utf8'));
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
        s3_access_url: `https://s3.us-east-2.amazonaws.com/playruski.com/${params.Key}`,
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
        s3_access_url: `https://s3.us-east-2.amazonaws.com/playruski.com/${params.Key}`,
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

if (argv.port === 443){
https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/server.playruski.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/server.playruski.com/fullchain.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/server.playruski.com/fullchain.pem')
    }, app)
    .listen(argv.port, () => {
        console.log(`API server running on port ${argv.port}`);
    });
} else {
app.listen(argv.port, () => {
  console.log(`API server running on port ${argv.port}`);
});
}
