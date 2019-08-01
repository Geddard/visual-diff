const expressGql = require('express-graphql');
const { buildSchema } = require('graphql');
const firebase = require("firebase");
require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyCIVB0g51AzDFcgeOvx7dpQeKKPUqoDbSs",
  authDomain: "visual-diff.firebaseapp.com",
  databaseURL: "https://visual-diff.firebaseio.com",
  projectId: "visual-diff",
  storageBucket: "",
  messagingSenderId: "586736836008",
  appId: "1:586736836008:web:9f12fe0ae660eabf"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const schema = buildSchema(`
  type Step {
    action: String
    crop: Boolean
    cropToTarget: String
    value: String
  }

  type Scenario {
    name: String
    steps: [Step]
  }

  type Test {
    name: String
    scenarios: [Scenario]
  }

  type Query {
    tests: [Test]
  }
`);

const root = {
    tests: () =>
    firebaseApp
        .database()
        .ref("/tests")
        .once("value")
        .then(snap => snap.val())
  };


module.exports = (app) => {
    app.use("/gql", expressGql({
        schema: schema,
        rootValue: root,
        graphiql: true
    }));
}
