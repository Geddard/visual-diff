import { json } from "body-parser";
import express from "express";
import { readdir } from "fs";
import { setFirebaseEndpoint } from "./firebase";
import gql from "./graphql";
import pixelMatch from "./pixelMatch";
import puppet from "./puppet/puppet";
import { ROUTES } from "./routes/routes";

const app = express();
const port = process.env.PORT || 3003;

app.listen(port, () => {
  if (process.env.NODE_ENV !== "production") {
    // tslint:disable-next-line:no-console
    console.log(`Listening on port ${port}`);
  }
});

// TODO: Move to it's own config file, or figure out what to do with this.
app.get(ROUTES.IMAGES, json(), (req, res) => {
  readdir("./public", (error, files) => {
    const images: string[] = [];

    files.forEach(file => {
      if (/(.jpg)/.test(file)) {
        images.push(file);
      }
    });

    res.json(images);
  });
});

puppet(app);
pixelMatch(app);
gql(app);
setFirebaseEndpoint(app);
