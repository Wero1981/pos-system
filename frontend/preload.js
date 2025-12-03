const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Aquí puedes añadir funciones que necesites exponer desde main a renderer
  platform: process.platform,
  // Ejemplo: 
  // openDialog: () => ipcRenderer.invoke('dialog:openFile'),
});

// Suprimir warnings específicos de DevTools
window.addEventListener('DOMContentLoaded', () => {
  console.warn = (function(originalWarn) {
    return function(message) {
      if (typeof message === 'string' && 
          (message.includes('Autofill.enable') || 
           message.includes('Autofill.setAddresses'))) {
        return; // No mostrar estos warnings específicos
      }
      originalWarn.apply(console, arguments);
    };
  })(console.warn);
});