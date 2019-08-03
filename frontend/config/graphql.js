const expressGql = require('express-graphql');
const { buildSchema } = require('graphql');
const firebase = require('./firebase');

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
    firebase.firebaseApp
    .database()
    .ref('/tests')
    .once('value')
    .then(snap => snap.val())
    .then(val => Object.keys(val).map(key => val[key]))
};

module.exports = (app) => {
  app.use('/gql', expressGql({
    schema: schema,
    rootValue: root,
    graphiql: true
  }));
}
