const firebase = require("firebase");
const bodyParser = require("body-parser");
const fs = require("fs");
require("firebase/database");
require("firebase/storage");

// Workaround for firebase not having this installed, beacuse reasons.
global.XMLHttpRequest = require("xhr2");

const firebaseConfig = {
  apiKey: "AIzaSyCIVB0g51AzDFcgeOvx7dpQeKKPUqoDbSs",
  authDomain: "visual-diff.firebaseapp.com",
  databaseURL: "https://visual-diff.firebaseio.com",
  projectId: "visual-diff",
  storageBucket: "gs://visual-diff.appspot.com/",
  messagingSenderId: "586736836008",
  appId: "1:586736836008:web:9f12fe0ae660eabf"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const save = config => {
  firebaseApp
    .database()
    .ref("/tests")
    .push({
      name: config.testName,
      url: config.testUrl,
      scenarios: config.steps,
      fullPageChecked: config.fullPageChecked,
      blockImagesChecked: config.blockImagesChecked,
      takeResultScreenshot: config.takeResultScreenshot
    });
};

// TODO: figure out flow for uploading images
const upload = () => {
  const storageRef = firebase.storage().ref();
  const imageRef = storageRef.child("mountains.jpg");

  const jpegData = fs.readFileSync("./public/frontpage.jpg");

  imageRef
    .put(jpegData)
    .then(function(snapshot) {
      console.log("Uploaded an array!");
    })
    .catch(error => console.log("Error", error));
};

exports.firebaseApp = firebaseApp;
exports.setFirebaseEndpoint = app => {
  app.post("/save", bodyParser.json(), (req, res) => {
    save(req.body);
    res.json("Saved");
  });
};
