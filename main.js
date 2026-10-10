const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// Evita janela em branco em alguns PCs com problema de placa de video
app.disableHardwareAcceleration();

function mostrarErro(win, titulo, detalhe) {
  const html = '<body style="background:#0a0c10;color:#e6e6e6;font-family:sans-serif;padding:40px">' +
    '<h2 style="color:#ff6b6b">' + titulo + '</h2><pre style="white-space:pre-wrap;color:#ccc">' +
    String(detalhe).replace(/</g, '&lt;') + '</pre></body>';
  win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
}

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

  const arquivo = path.join(__dirname, 'index.html');
  if (!fs.existsSync(arquivo)) {
    mostrarErro(win, 'Arquivo do jogo nao encontrado', 'Esperado em:\n' + arquivo +
      '\n\nO index.html precisa estar no repositorio antes de gerar o .exe.');
  } else {
    const tamanho = fs.statSync(arquivo).size;
    if (tamanho < 1000) {
      mostrarErro(win, 'index.html parece vazio', 'Tamanho: ' + tamanho + ' bytes\n' + arquivo);
    } else {
      win.loadFile(arquivo);
    }
  }

  win.webContents.on('did-fail-load', (e, code, desc, url) => {
    if (url && url.startsWith('data:')) return;
    mostrarErro(win, 'Falha ao carregar o jogo', code + ' ' + desc + '\n' + url);
  });
  win.webContents.on('render-process-gone', (e, d) => mostrarErro(win, 'O jogo travou', JSON.stringify(d)));

  // F11 = tela cheia, Ctrl+Shift+I = ferramentas de desenvolvedor (debug)
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F11') win.setFullScreen(!win.isFullScreen());
    if (input.control && input.shift && input.key.toLowerCase() === 'i') win.webContents.toggleDevTools();
  });
}

app.whenReady().then(criarJanela);
app.on('window-all-closed', () => app.quit());
