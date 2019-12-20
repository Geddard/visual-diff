import { json } from "body-parser";
import { Request, Response } from "express";
import { IRouter } from "express-serve-static-core";
import { readdir, unlinkSync } from "fs";
import { Browser, launch } from "puppeteer";
import { ROUTES } from "../routes/routes";
import blockImages from "../util/blockImages";
import freeze from "../util/freeze";
import { trySomething } from "../util/try";
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
    await commands.NAVIGATE({ value: config.testUrl });
  }

  await freeze(page);

  const steps = JSON.parse(config.steps);

  if (steps && steps.length) {
    for (const step of steps) {
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

const tryInit = async (req: Request, res: Response) => {
  const tryThis = async () => {
    await init(req.body);
    res.json("Puppet ready");
  };

  trySomething(res, tryThis, close);
};

const tryShoot = async (req: Request, res: Response) => {
  const tryThis = async () => {
    const evidence = await shoot(req.query);
    res.json(evidence);
  };

  trySomething(res, tryThis, close);
};

const tryClose = async (req: Request, res: Response) => {
  close();
  res.json("Puppet closed");
};

export default (app: IRouter) => {
  app.get(ROUTES.INIT, json(), tryInit);
  app.get(ROUTES.SHOOT, json(), tryShoot);
  app.get(ROUTES.CLOSE, tryClose);
};
