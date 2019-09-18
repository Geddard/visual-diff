const pptr = require("puppeteer");
const bodyParser = require("body-parser");
const freeze = require("../util/freeze");
const blockImages = require("../util/blockImages");
const fs = require("fs");
const commandManager = require("./commands/commandManager");

const checkForExistingFile = async fileName => {
  fs.readdir("./public", (error, files) => {
    files.forEach(file => {
      if (file.indexOf(`./public/${fileName}.jpg`) !== -1) {
        fs.unlinkSync(file);
      }
    });
  });
};

let browser;

const init = async config => {
  browser = await pptr.launch({
    defaultViewport: {
      width: config.width || 1360,
      height: config.height || 768
    }
  });
};

const close = async config => {
  (await browser) && browser.close && browser.close();
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

module.exports = app => {
  app.post("/api/init", bodyParser.json(), async (req, res) => {
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

  app.post("/api/shoot", bodyParser.json(), async (req, res) => {
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
    fs.readdir("./public", (error, files) => {
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
