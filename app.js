const { app, BrowserWindow } = require('electron');
require('dotenv').config();
require('./server');
// electron app settings
function createWindow() {
  const win = new BrowserWindow({
    width: 1500,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
    }
  });
  win.setMenu(null);
  win.loadURL('http://localhost:' + process.env.SERVER_PORT);
}
// when app is ready
app.whenReady().then(createWindow);
// on app close exit command
app.on('window-all-closed', () => { process.exit(0); });