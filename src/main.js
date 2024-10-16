const { app, BrowserWindow } = require('electron')
const path = require('node:path') 
const { ipcMain } = require('electron');
const { deleteATask } = require("./operation");

let mainWindow = null;
let taskWindow = null; 
let currentId = null;
let deleteWindow = null;

/**
 * Main window.
 */
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 515,
    // frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      sandbox:false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.setResizable(false)
  mainWindow.setMaximizable(false)
  mainWindow.loadFile('src/index.html') 
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('create-custom-buttons')
  })
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

/**
 * Window for creating a new task.
 */
function createATaskWindow () {
  taskWindow = new BrowserWindow({
    width: 400,
    height: 250, 
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    }
  });
  taskWindow.loadFile('src/createATaskWindow/indexCreateWindow.html');
  // taskWindow.webContents.openDevTools()
} 

// Open create window.
ipcMain.on('open-create-window', () => {
  if (taskWindow === null) {
    createATaskWindow();
    console.log("Open creation window.");
  } else {
    console.log("Creation window is already open.");
  }
}); 

// Add a new task.
ipcMain.on('add-new-task', () => { 
  mainWindow.webContents.send("display-new-task");
  console.log('New task successfully created.');
});  

// Close delete window. 
ipcMain.on('close-create-window', () => {
  taskWindow.destroy();
  taskWindow = null;
  console.log('Creation window closed.');
}); 

// Refresh main window. 
ipcMain.on("page-refresh", () => {
  mainWindow.webContents.reload();
});

// Obtain task id.
ipcMain.on("get-id", (event) => {
  event.returnValue = currentId;
});

/**
 * Window for deleting a task.
 */
function deleteATaskWindow() {
  deleteWindow = new BrowserWindow({
    width: 230,
    height: 170,
    // frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  deleteWindow.loadFile("src/deleteATaskWindow/indexDeleteWindow.html");
   deleteWindow.webContents.openDevTools();
}

// Open delete window.
ipcMain.on("open-delete-window", (event, arg) => {
  if (deleteWindow === null) {
    deleteATaskWindow();
    currentId = arg;
    console.log("Delete window open.");
    console.log(arg);
  } else {
    console.log("Delete window is already open.");
  }
});

// Delete a task.
ipcMain.on("delete-task", async (event, id) => {
  try {
    const deleteResult = await deleteATask(id);
    if (deleteResult.status === 204) {
      mainWindow.webContents.reload();
      if (deleteWindow) {
        deleteWindow.destroy();
        deleteWindow = null;
        console.log("Task deleted and delete window closed.");
      }
    } else {
      console.error("Task deletion was not successful:", deleteResult.error);
      // mainWindow.webContents.send("show-popup-delete-task", "Alert deletion failed.");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    // mainWindow.webContents.send("show-popup-delete-task", "Error when deleting alert.");
  }
});

// Close delete window.
ipcMain.on('close-delete-window', () => {
  if (deleteWindow) {
    deleteWindow.destroy();
    deleteWindow = null;
    console.log("Delete window closed.");
  }
});
