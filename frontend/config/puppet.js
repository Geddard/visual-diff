const pptr = require("puppeteer");
const app = require('http').createServer();
const io = require('socket.io')(app);

app.listen(80);

const shoot = async (config, socket) => {
    const browser = await pptr.launch();
    const page = await browser.newPage();



    await page.goto(`https://${config.imageUrl}`);

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
