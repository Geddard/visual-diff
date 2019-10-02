import expressGql from "express-graphql";
// @ts-ignore
import { buildSchema } from "graphql";
import { firebaseApp } from "./firebase";
import { ROUTES } from "./routes/routes";

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
      .ref(ROUTES.TESTS)
      .once("value")
      .then(snap => snap.val())
      .then(val => Object.keys(val).map(key => val[key]))
};

export default (app: any) => {
  app.use(
    ROUTES.GQL,
    expressGql({
      graphiql: true,
      rootValue: root,
      schema
    })
  );
};
