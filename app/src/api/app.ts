import express from "express";

import { setFirebaseEndpoint } from "./firebase";
import gql from "./graphql";
import pixelMatch from "./pixelMatch";
import puppet from "./puppet/puppet";

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  if (process.env.NODE_ENV !== "production") {
    // tslint:disable-next-line:no-console
    console.log(`Listening on port ${port}`);
  }
});

puppet(app);
pixelMatch(app);
gql(app);
setFirebaseEndpoint(app);
