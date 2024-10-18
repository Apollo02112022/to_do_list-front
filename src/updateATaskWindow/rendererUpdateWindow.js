const closeBtn = document.getElementById("closeBtn");
closeBtn.addEventListener("click", () => {
  apiTask.electron.ipcRenderer.send("close-update-window");
});

const idFromMain = apiTask.electron.ipcRenderer.sendSync("get-id");

