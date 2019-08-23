const expressGql = require('express-graphql');
const { buildSchema } = require('graphql');

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
  // TODO: Implement
  tests: () => {}
};

module.exports = (app) => {
  app.use('/gql', expressGql({
    schema: schema,
    rootValue: root,
    graphiql: true
  }));
}
