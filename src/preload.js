const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openExcelFile: () => ipcRenderer.invoke('open-excel-file')
});
