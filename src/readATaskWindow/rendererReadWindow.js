const closeBtn = document.getElementById("closeBtn");
closeBtn.addEventListener("click", () => {
  apiTask.electron.ipcRenderer.send("close-read-window");
});

const idFromMain = apiTask.electron.ipcRenderer.sendSync("get-id");

async function readATask(id) {
    const readResult = await apiTask.displayATask(id);
    const title = document.getElementById("title");
    title.textContent = readResult.title;
    const content = document.getElementById("content");
    content.textContent = readResult.content;
    let arr = readResult.createdAt.split("-");
    let reversedStr = `${arr[2]}-${arr[1]}-${arr[0]}`;
    const date = document.getElementById("date");
    date.textContent = reversedStr;
  }
  
  readATask(idFromMain);
