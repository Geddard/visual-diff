const { app, BrowserWindow } = require("electron");

function createWindow () {
  let window = new BrowserWindow({ width: 1024, height: 768 });
  window.loadURL("http://localhost:8080");
}

app.on("ready", createWindow);
