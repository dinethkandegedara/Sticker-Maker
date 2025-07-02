const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  loadExcel: () => ipcRenderer.invoke('open-excel-file')
});
