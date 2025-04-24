// main.js
import { app, BrowserWindow } from 'electron';

function createWindow () {
  const win = new BrowserWindow({
    width: 1010,
    height: 750,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);