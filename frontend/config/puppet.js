const pptr = require("puppeteer");
const app = require('http').createServer();
const io = require('socket.io')(app);
const freeze = require("./util/freeze");
const blockImages = require("./util/blockImages");

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

    socket.emit("done");
};

io.on('connection', (socket) => {
    socket.on("shoot", (config) => {
        shoot(config, socket);
    })
});
