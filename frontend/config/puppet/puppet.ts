import { json } from "body-parser";
import { IRouter } from "express-serve-static-core";
import { readdir, unlinkSync } from "fs";
import { Browser, launch } from "puppeteer";
import blockImages from "../util/blockImages";
import freeze from "../util/freeze";
import commandManager from "./commands/commandManager";

const checkForExistingFile = async (fileName: string) => {
  readdir("./public", (error, files) => {
    files.forEach(file => {
      if (file.indexOf(`./public/${fileName}.jpg`) !== -1) {
        unlinkSync(file);
      }
    });
  });
};

let browser: Browser;

const init = async config => {
  browser = await launch({
    defaultViewport: {
      height: config.height || 768,
      width: config.width || 1360
    }
  });
};

const close = async () => {
  if (browser && browser.close) {
    await browser.close();
  }
};

const shoot = async config => {
  const page = await browser.newPage();
  const commands = commandManager(page);
  const evidence = [];

  if (config.blockImagesChecked) {
    await page.setRequestInterception(true);
    await blockImages(page);
  }

  await commands.NAVIGATE({ url: config.testUrl });

  await freeze(page);

  if (config.steps && config.steps.length) {
    for (const step of config.steps) {
      const action = step.action;
      const stepConfig = Object.assign({}, step, {
        testName: config.testName
      });

      const results = await commands[action](stepConfig);

      if (results && typeof results === "string") {
        evidence.push(results);
      }
    }
  }

  await checkForExistingFile(config.testName);

  if (config.takeResultScreenshot) {
    const result = await commands.SCREENSHOT(config);

    if (result && typeof result === "string") {
      evidence.push(result);
    }
  }

  return evidence;
};

const trySomething = async (res, tryThis, ifItfails) => {
  try {
    await tryThis();
  } catch (error) {
    ifItfails();
    res.status(500).json(`Something went wrong: ${error}`);
  }
};

export default (app: IRouter) => {
  app.post("/api/init", json(), async (req, res) => {
    trySomething(
      res,
      async () => {
        await init(req.body);
        res.json("Puppet ready");
      },
      () => {
        close();
      }
    );
  });

  app.get("/api/close", (req, res) => {
    close();
    res.json("Puppet closed");
  });

  app.post("/api/shoot", json(), async (req, res) => {
    trySomething(
      res,
      async () => {
        const evidence = await shoot(req.body);
        res.json(evidence);
      },
      () => {
        close();
      }
    );
  });

  app.get("/api/images", (req, res) => {
    readdir("./public", (error, files) => {
      const images = [];

      files.forEach(file => {
        if (/(.jpg)/.test(file)) {
          images.push(file);
        }
      });

      res.json(images);
    });
  });
};
