const cancelBtn = document.getElementById('cancelBtn');
cancelBtn.addEventListener('click', (event) => {
  event.preventDefault();
  apiTask.electron.ipcRenderer.send('close-delete-window');
});

const idFromMain = apiTask.electron.ipcRenderer.sendSync('get-id');

const validateBtn = document.getElementById('validateBtn');
validateBtn.addEventListener('click', (event) => {
  event.preventDefault();
  apiTask.electron.ipcRenderer.send("delete-task", idFromMain);
});
