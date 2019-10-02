import { IRouter } from "express-serve-static-core";
import { readdir, unlinkSync } from "fs";
import { Browser, launch } from "puppeteer";
import blockImages from "../util/blockImages";
import freeze from "../util/freeze";
import commandManager from "./commands/commandManager";
import { ICommands } from "./commands/commandsConfig";

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

const init = async (config: any) => {
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

const shoot = async (config: any) => {
  const page = await browser.newPage();
  const commands = commandManager(page);
  const evidence = [];

  if (config.blockImagesChecked) {
    await page.setRequestInterception(true);
    await blockImages(page);
  }

  if (commands.NAVIGATE !== undefined) {
    await commands.NAVIGATE({ url: config.testUrl });
  }

  await freeze(page);

  if (config.steps && config.steps.length) {
    for (const step of config.steps) {
      const action: keyof ICommands = step.action;
      const stepConfig = Object.assign({}, step, {
        testName: config.testName
      });

      const commandConfig = commands[action];

      if (commandConfig !== undefined) {
        const results = await commandConfig(stepConfig);

        if (results && typeof results === "string") {
          evidence.push(results);
        }
      }
    }
  }

  await checkForExistingFile(config.testName);

  if (config.takeResultScreenshot && commands.SCREENSHOT !== undefined) {
    const result = await commands.SCREENSHOT(config);

    if (result && typeof result === "string") {
      evidence.push(result);
    }
  }

  return evidence;
};

const trySomething = async (res: any, tryThis: any, ifItfails: any) => {
  try {
    await tryThis();
  } catch (error) {
    ifItfails();
    res.status(500).json(`Something went wrong: ${error}`);
  }
};

export default (app: IRouter) => {
  app.post("/init", async (req, res) => {
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

  app.get("/close", (req, res) => {
    close();
    res.json("Puppet closed");
  });

  app.post("/shoot", async (req, res) => {
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
      const images: string[] = [];

      files.forEach(file => {
        if (/(.jpg)/.test(file)) {
          images.push(file);
        }
      });

      res.json(images);
    });
  });
};
