import expressGql from "express-graphql";
// @ts-ignore
import { buildSchema } from "graphql";
import { firebaseApp } from "./firebase";

const schema = buildSchema(`
  type Scenario {
    action: String
    crop: Boolean
    cropTarget: String
    value: String
  }

  type Test {
    name: String
    url: String
    scenarios: [Scenario]
    blockImagesChecked: Boolean
    fullPageChecked: Boolean
    takeResultScreenshot: Boolean
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
      .then(val => Object.keys(val).map(key => val[key]))
};

export default (app: any) => {
  app.use(
    "/gql",
    expressGql({
      graphiql: true,
      rootValue: root,
      schema
    })
  );
};
