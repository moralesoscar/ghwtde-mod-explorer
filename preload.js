const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    scanForMods: (modsPath) => ipcRenderer.invoke('scan-for-mods-action', modsPath)
})