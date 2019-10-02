import firebase from "firebase";
import "firebase/database";
import "firebase/storage";
import fs from "fs";

// Workaround for firebase not having this installed, beacuse reasons.
// @ts-ignore
global.XMLHttpRequest = require("xhr2");

const firebaseConfig = {
  apiKey: "AIzaSyCIVB0g51AzDFcgeOvx7dpQeKKPUqoDbSs",
  appId: "1:586736836008:web:9f12fe0ae660eabf",
  authDomain: "visual-diff.firebaseapp.com",
  databaseURL: "https://visual-diff.firebaseio.com",
  messagingSenderId: "586736836008",
  projectId: "visual-diff",
  storageBucket: "gs://visual-diff.appspot.com/"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const save = (config: any) => {
  firebaseApp
    .database()
    .ref("/tests")
    .push({
      blockImagesChecked: config.blockImagesChecked,
      fullPageChecked: config.fullPageChecked,
      name: config.testName,
      scenarios: config.steps,
      takeResultScreenshot: config.takeResultScreenshot,
      url: config.testUrl
    });
};

// TODO: figure out flow for uploading images
const upload = () => {
  const storageRef = firebase.storage().ref();
  const imageRef = storageRef.child("mountains.jpg");

  const jpegData = fs.readFileSync("./public/frontpage.jpg");

  imageRef
    .put(jpegData)
    .then((snapshot: any) => {
      console.log("Uploaded an array!");
    })
    .catch((error: any) => console.log("Error", error));
};

export { firebaseApp };
export const setFirebaseEndpoint = (app: any) => {
  app.post("/save", (req: any, res: any) => {
    save(req.body);
    res.json("Saved");
  });
};
