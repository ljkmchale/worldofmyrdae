const path = require('path');
const { app, BrowserWindow, shell } = require('electron');
const { startServer, stopServer } = require('../server');

let mainWindow = null;
let serverBaseUrl = null;

function createWindow(targetUrl) {
    const win = new BrowserWindow({
        width: 1600,
        height: 980,
        minWidth: 1200,
        minHeight: 760,
        backgroundColor: '#050508',
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.once('ready-to-show', () => {
        win.show();
    });

    win.webContents.setWindowOpenHandler(({ url }) => {
        if (serverBaseUrl && url.startsWith(serverBaseUrl)) {
            const child = createWindow(url);
            child.removeMenu?.();
            return { action: 'deny' };
        }

        shell.openExternal(url);
        return { action: 'deny' };
    });

    win.loadURL(targetUrl);
    return win;
}

async function bootstrap() {
    const dataRoot = path.join(app.getPath('userData'), 'world-data');
    const { port } = await startServer({
        port: 0,
        dataRoot,
        autoStartComfy: false
    });

    serverBaseUrl = `http://127.0.0.1:${port}`;
    mainWindow = createWindow(`${serverBaseUrl}/editor.html`);
}

app.whenReady().then(async () => {
    await bootstrap();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0 && serverBaseUrl) {
            mainWindow = createWindow(`${serverBaseUrl}/editor.html`);
        }
    });
}).catch((err) => {
    console.error('Failed to launch Electron app:', err);
    app.quit();
});

app.on('window-all-closed', async () => {
    await stopServer();

    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', async () => {
    await stopServer();
});
