import bodyParser from "body-parser";
import express from "express";

import puppet from "./puppet/puppet";

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  if (process.env.NODE_ENV !== "production") {
    // tslint:disable-next-line:no-console
    console.log(`Listening on port ${port}`);
  }
});

puppet(app);
// pixelMatch(app);
// gql(app);
// firebase.setFirebaseEndpoint(app);
