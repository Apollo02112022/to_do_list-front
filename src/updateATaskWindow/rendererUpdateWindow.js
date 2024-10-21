const closeBtn = document.getElementById("closeBtn");
closeBtn.addEventListener("click", () => {
  apiTask.electron.ipcRenderer.send("close-update-window");
});

const idFromMain = apiTask.electron.ipcRenderer.sendSync("get-id");

async function readATask(id) {
  const readResult = await apiTask.displayATask(id);
  const title = document.getElementById("title");
  title.value = readResult.title;
  const content = document.getElementById("content");
  content.textContent = readResult.content;
  const date = document.getElementById("date");
  date.textContent = readResult.createdAt;
}

readATask(idFromMain); 

const confirmBtn = document.getElementById("confirmBtn");
confirmBtn.addEventListener("click", () => {
  let title = document.getElementById('title').value;
  let content = document.getElementById('content').value;  
  apiTask.updateATask(idFromMain, title, content);
  apiTask.electron.ipcRenderer.send("update-task");
  apiTask.electron.ipcRenderer.send("page-refresh");
}); 
