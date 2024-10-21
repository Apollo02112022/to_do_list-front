const { contextBridge, ipcRenderer } = require("electron");
const operation = require('./operation.js');
  
  contextBridge.exposeInMainWorld('apiTask', {
    electron: {
      ipcRenderer: {
        send: (channel, ...args) => {
          ipcRenderer.send(channel, ...args);
        }, 
        on: (channel, func) => {
          ipcRenderer.on(channel, (event, ...args) => func(...args));
        }, 
        sendSync: (channel, ...args) => ipcRenderer.sendSync(channel, ...args),
      }
    },
    createATask: (title, content) => operation.createATask(title, content),
    displayAllTasks: () => operation.displayAllTasks(),
    displayATask: (id) => operation.displayATask(id),
    updateATask: (id, title, content) => operation.updateATask(id, title, content),
    // deleteAllTasks: () => operation.deleteAllTasks,
    deleteATask: (id) => operation.deleteATask(id) 
  }); 
