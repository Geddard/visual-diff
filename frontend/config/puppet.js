const pptr = require('puppeteer');
const app = require('http').createServer();
const io = require('socket.io')(app);
const freeze = require('./util/freeze');
const blockImages = require('./util/blockImages');
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

app.listen(80);

const shoot = async (config, socket) => {
    const browser = await pptr.launch({
        defaultViewport: {
            width: config.width || 1360,
            height: config.height || 768
        }
    });
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    blockImages(page);

    await page.goto(`https://${config.imageUrl}`, { timeout: 99999 });

    freeze(page);

    if (config.hoverElClassName) {
        await page.hover(config.hoverElClassName);
    }

    if (config.clickElClassName) {
        await page.click(config.clickElClassName);
    }

    await page.screenshot({path: `./public/${config.imageName}.png`});
    await browser.close();

    socket.emit('done');
};

io.on('connection', (socket) => {
    socket.on('shoot', (config) => {
        shoot(config, socket);
    });

    socket.on('getImages', () => {
        fs.readdir('./public', (error, files) => {
            const images = [];

            files.forEach(file => {
                if (/(.png)/.test(file)) {
                    images.push(file);
                }
            });

            socket.emit('imagesReady', images);
        });
    });

    socket.on('compare', (sourceUrl, compareUrl) => {
        const img1 = PNG.sync.read(fs.readFileSync(`./public/${sourceUrl}`));
        const img2 = PNG.sync.read(fs.readFileSync(`./public/${compareUrl}`));
        const {width, height} = img1;
        const diff = new PNG({width, height});

        pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.1});

        fs.writeFileSync(`./public/${sourceUrl.replace('.png', '')}-diff.png`, PNG.sync.write(diff));

        socket.emit('diffReady')
    });
});
