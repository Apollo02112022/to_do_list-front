const createBtn = document.getElementById('createBtn');
createBtn.addEventListener('click', () => {
  apiTask.electron.ipcRenderer.send('add-new-task'); 
  let title = document.getElementById('title').value;
  let content = document.getElementById('content').value;  
  apiTask.createATask(title, content);
  apiTask.electron.ipcRenderer.send('close-create-window'); 
  apiTask.electron.ipcRenderer.send("page-refresh");
}); 

const cancelBtn = document.getElementById('cancelBtn');
cancelBtn.addEventListener('click', () => {
  apiTask.electron.ipcRenderer.send('close-create-window');
}); 
