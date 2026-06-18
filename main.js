import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

import { scan } from './src/scanner/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('App starting...');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        backgroundColor: '#1e1e1e',
    });

    mainWindow.loadURL('http://localhost:5173');
}

ipcMain.handle('scan-for-mods-action', async (event, modsPath) => {
    console.log('Scanning for mods at', modsPath);
    const mods = await scan(modsPath);
    console.log('Scan completed.');
    return mods;
});

app.whenReady().then( () => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});