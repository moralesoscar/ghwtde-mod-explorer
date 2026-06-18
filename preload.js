import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electronAPI', {
    scanForMods: () => ipcRenderer.invoke('scan-for-mods-action')
})