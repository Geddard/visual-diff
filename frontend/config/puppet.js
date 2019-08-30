const pptr = require('puppeteer');
const bodyParser = require("body-parser");
const freeze = require('./util/freeze');
const blockImages = require('./util/blockImages');
const fs = require('fs');

const checkForExistingFile = (fileName) => {
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

    if (config.blockImagesChecked) {
        await page.setRequestInterception(true);
        await blockImages(page);
    }

    await page.goto(`https://${config.testUrl}`, { timeout: 99999 });

    await freeze(page);

    if (config.steps && config.steps.length) {
        let lastAction = "";

        for (const step of config.steps) {
            const action = step.action;
            const value = step.value;

            if (action !== "SCREENSHOT" && action !== "WAIT") {
                lastAction = `_${action.toLowerCase()}`
            }

            if (action === "HOVER") {
                await page.hover(`.${value}`);
            } else if (action === "CLICK") {
                await page.click(`.${value}`);
            } else if (action === "HOVER") {
                await page.hover(`.${value}`);
            } else if (action === "WAIT") {
                await page.waitFor(parseInt(value));
            } else if (action === "SCREENSHOT") {
                const ssConfig = {
                    path: `./public/${config.testName}${lastAction}.jpg`,
                    fullPage: config.fullPageChecked
                };

                if (step.crop && step.cropTarget) {
                    const element = await page.$(`.${step.cropTarget}`);
                    const bBox = await element.boundingBox();

                    ssConfig.clip = {
                        x: bBox.x,
                        y: bBox.y,
                        width: bBox.width,
                        height: bBox.height
                    };
                }

                await page.screenshot(ssConfig);
            }
        }
    }

    await checkForExistingFile(config.testName);


    if (config.takeResultScreenshot) {
        const screenshotConfig = {
            path: `./public/${config.testName}.jpg`,
            fullPage: config.fullPageChecked
        };

        await page.screenshot(screenshotConfig);
    }

    await browser.close();
};

module.exports = (app) => {
    app.post('/api/shoot', bodyParser.json(), async (req, res) => {
        await shoot(req.body);
        res.json("Done");
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
