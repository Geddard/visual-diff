const pptr = require('puppeteer');
const bodyParser = require("body-parser");
const freeze = require('./util/freeze');
const blockImages = require('./util/blockImages');
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const checkForExistingFile = (fileName) => {
    fs.readdir('./public', (error, files) => {
        files.forEach(file => {
            if (file.indexOf(`./public/${fileName}.png`) !== -1) {
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
        blockImages(page);
    }

    await page.goto(`https://${config.imageUrl}`, { timeout: 99999 });

    freeze(page);

    if (config.hoverElClassName) {
        await page.hover(`.${config.hoverElClassName}`);
    }

    if (config.clickElClassName) {
        await page.click(`.${config.clickElClassName}`);
    }

    await checkForExistingFile(config.imageName);

    const screenshotConfig = {
        path: `./public/${config.imageName}.png`,
        fullPage: config.fullPageChecked
    };

    await page.screenshot(screenshotConfig);
    await browser.close();
};

const compare = (sourceUrl, compareUrl) => {
    const img1 = PNG.sync.read(fs.readFileSync(`./public/${sourceUrl}`));
    const img2 = PNG.sync.read(fs.readFileSync(`./public/${compareUrl}`));
    const {width, height} = img1;
    const diff = new PNG({width, height});

    pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.1});

    fs.writeFileSync(`./public/${sourceUrl.replace('.png', '')}-diff.png`, PNG.sync.write(diff));
}

module.exports = (app) => {
    app.post('/api/shoot', bodyParser.json(), async (req, res) => {
        await shoot(req.body);
        res.json("Done");
    });

    app.get('/api/images', (req, res) => {
        fs.readdir('./public', (error, files) => {
            const images = [];

            files.forEach(file => {
                if (/(.png)/.test(file)) {
                    images.push(file);
                }
            });

            res.json(images);
        });
    });

    app.post('/api/compare', bodyParser.json(), (req, res) => {
        compare(req.body.sourceUrl, req.body.compareUrl);
        res.json("Done");
    });
};
