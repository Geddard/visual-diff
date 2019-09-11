const pptr = require('puppeteer');
const bodyParser = require("body-parser");
const freeze = require('./util/freeze');
const blockImages = require('./util/blockImages');
const fs = require('fs');

const checkForExistingFile = async (fileName) => {
    fs.readdir('./public', (error, files) => {
        files.forEach(file => {
            if (file.indexOf(`./public/${fileName}.jpg`) !== -1) {
                fs.unlinkSync(file);
            }
        });
    });
};

const navigate = async (page, url) => {
    await page.goto(`https://${url}`, { waituntil: "networkidle0" });
}

const shoot = async (config) => {
    const browser = await pptr.launch({
        defaultViewport: {
            width: config.width || 1360,
            height: config.height || 768
        }
    });
    const page = await browser.newPage();
    const evidence = [];

    if (config.blockImagesChecked) {
        await page.setRequestInterception(true);
        await blockImages(page);
    }

    await navigate(page, config.testUrl);

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
                await page.hover(value);
            } else if (action === "CLICK") {
                await page.click(value);
            } else if (action === "HOVER") {
                await page.hover(value);
            } else if (action === "WAIT") {
                if (parseInt(value)) {
                    await page.waitFor(parseInt(value));
                } else {
                    await page.waitFor(() => !!document.querySelector(value), value);
                }
            } else if (action === "ENTER_TEXT") {
                await page.type(step.textTarget, value);
            } else if (action === "NAVIGATE") {
                await navigate(page, value);
            } else if (action === "REPLACE") {
                await page.evaluate((step, value) => {
                    document.querySelector(step.replaceTarget).innerHTML = value;
                }, step, value);
            } else if (action === "REPLACE_ALL") {
                await page.evaluate((step, value) => {
                    document.querySelectorAll(step.replaceTargetAll).forEach((element) => {
                        element.innerHTML = value;
                    });
                }, step, value);
            } else if (action === "HIDE") {
                await page.evaluate((step) => {
                    const list = step.hideTargets.split(",");
                    console.log(list)
                    list.forEach((selector) => {
                        const trimmed = selector.trim();
                        console.log(trimmed)
                        document.querySelectorAll(trimmed).forEach((element) => {
                            element.style.visibility = "hidden";
                        });
                    })
                }, step);
            } else if (action === "SCREENSHOT") {
                const ssImageName = `${config.testName}${lastAction || "_ss"}.jpg`;
                const ssConfig = {
                    path: `./public/${ssImageName}`,
                    fullPage: config.fullPageChecked
                };

                if (step.crop && step.cropTarget) {
                    const element = await page.$(step.cropTarget);
                    await element.screenshot(ssConfig).then(() => {
                        evidence.push(ssImageName);
                    });
                } else {
                    await page.screenshot(ssConfig);
                    evidence.push(ssImageName);
                }

            }
        }
    }

    await checkForExistingFile(config.testName);


    if (config.takeResultScreenshot) {
        const finalSSName = `${config.testName}.jpg`;
        const screenshotConfig = {
            path: `./public/${finalSSName}`,
            fullPage: config.fullPageChecked
        };

        await page.screenshot(screenshotConfig);
        evidence.push(finalSSName);
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
