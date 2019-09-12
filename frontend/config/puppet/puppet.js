const pptr = require('puppeteer');
const bodyParser = require("body-parser");
const freeze = require('../util/freeze');
const blockImages = require('../util/blockImages');
const fs = require('fs');
const commandManager = require("./commandManager");

const checkForExistingFile = async (fileName) => {
    fs.readdir('./public', (error, files) => {
        files.forEach(file => {
            if (file.indexOf(`./public/${fileName}.jpg`) !== -1) {
                fs.unlinkSync(file);
            }
        });
    });
};

const shoot = async (config) => {
    const browser = await pptr.launch({
        defaultViewport: {
            width: config.width || 1360,
            height: config.height || 768
        }
    });
    const page = await browser.newPage();
    const commands = commandManager(page);
    const evidence = [];

    if (config.blockImagesChecked) {
        await page.setRequestInterception(true);
        await blockImages(page);
    }

    await commands.NAVIGATE({url: config.testUrl});

    await freeze(page);

    if (config.steps && config.steps.length) {
        let lastAction = "";

        for (const step of config.steps) {
            const action = step.action;
            const stepConfig = Object.assign({}, step, {
                testName: config.testName,
                lastAction
            });

            if (action !== "SCREENSHOT" && action !== "WAIT") {
                lastAction = `_${action.toLowerCase()}`
            }

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

    await browser.close();

    return evidence;
};

module.exports = (app) => {
    app.post('/api/shoot', bodyParser.json(), async (req, res) => {
        try {
            const evidence = await shoot(req.body);
            res.json(evidence);
        } catch (error) {
            res.status(500).json(`Something went wrong: ${error}`, )
        };
    });

    app.get('/api/images', (req, res) => {
        fs.readdir('./public', (error, files) => {
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
