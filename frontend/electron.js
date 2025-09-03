const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (app.isPackaged) {
    // Producción → carga build de React
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  } else {
    // Desarrollo → carga el servidor React
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools(); // opcional
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
