const { contextBridge, ipcRenderer } = require('electron');

// Since we now have nodeIntegration enabled, we can also expose require directly
if (typeof window !== 'undefined') {
  window.electronAPI = {
    loadExcel: () => ipcRenderer.invoke('open-excel-file')
  };
  
  // Make require available for QR code generation
  window.require = require;
}
