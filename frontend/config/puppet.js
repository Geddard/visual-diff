const pptr = require("puppeteer");
const app = require('http').createServer();
const io = require('socket.io')(app);

app.listen(80);

const shoot = async (imageName, imageUrl, socket) => {
    const browser = await pptr.launch();
    const page = await browser.newPage();
    await page.goto(`https://${imageUrl}`);
    await page.screenshot({path: `./public/${imageName}.png`});

    await browser.close();
    socket.emit("done");
};

io.on('connection', (socket) => {
    socket.on("shoot", (config) => {
        shoot(config.imageName, config.imageUrl, socket);
    })
});
