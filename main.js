const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const path = require('path');

function criarJanela() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 650,
    backgroundColor: '#0a0c10',
    title: 'Simulacao Hack',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // F11 = tela cheia, Ctrl+Shift+I = ferramentas de desenvolvedor (debug)
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F11') win.setFullScreen(!win.isFullScreen());
    if (input.control && input.shift && input.key.toLowerCase() === 'i') win.webContents.toggleDevTools();
  });
}

app.whenReady().then(criarJanela);
app.on('window-all-closed', () => app.quit());
