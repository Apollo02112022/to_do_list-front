const taskBtn = document.getElementById('taskBtn');
taskBtn.addEventListener('click', () => {
  apiTask.electron.ipcRenderer.send('open-create-window');
}); 

/**
 * Alert display from createTaskWindow.
 * @param {Array} data - Data to be displayed on the HTML page.
 * @return {void} This function does not return an explicit value.
 */
function displayDataOnHtmlPage(data) {
  console.log("data: ",data)
      const container = document.getElementById('data-container');
      const template = document.getElementById('display');
      // Emptying the container.
      container.innerHTML = '';
      const noTask = document.getElementById('noTask');
      if(data.length === 0 || null || undefined) {
          noTask.style.display = 'block';
          apiTask.electron.ipcRenderer.send('page-refresh');
          return;
      }
      else {
          noTask.style.display = 'none';
      }
      data.forEach(item => {
          // Template cloning.
          const clonedTemplate = template?.cloneNode(true); 
          // Template customization.
          const title = clonedTemplate?.querySelector('.title');
          title.textContent = item.title;
          const content = clonedTemplate?.querySelector('.content');
          content.textContent = item.content; 
        //   const readIcon = clonedTemplate?.querySelector('.readIcon');
        //   readIcon.id = item.id;
        //   readIcon.addEventListener('click', () => {
        //   apiTask.electron.ipcRenderer.send('open-read-window', item.id);
        //   });
        //   const updateIcon = clonedTemplate.querySelector(".updateIcon");
        //   updateIcon.id = item.id;
        //   updateIcon.addEventListener("click", () => {
        //   apiTask.electron.ipcRenderer.send("open-update-window", item.id);
        //   });
          const deleteIcon = clonedTemplate?.querySelector('.deleteIcon');
          deleteIcon.id = item.id;
          deleteIcon.addEventListener('click', () => {
              apiTask.electron.ipcRenderer.send('open-delete-window', item.id);
          });
          // Adding the cloned template to the data-container.
          container.appendChild(clonedTemplate); 
          // Displaying the cloned template.
          clonedTemplate.style.display = 'block'; 
      });
  }

// Display of each alert.
apiTask.electron.ipcRenderer.on('display-new-task', async () => { // Listen for a 'display-new-task' event from the main process.
  try {
      // 
      await new Promise(resolve => setTimeout(resolve, 500));
      // Call the asynchronous displayAllData() function to retrieve data.
      const rows = await apiTask.electron.displayAllTasks(); 
      console.log("rows:", rows);
       // Displaying data retrieved from the HTML page.
      displayDataOnHtmlPage(rows);

  } catch (error) { // Error handling in the event of data recovery failure.
      console.error('Error fetching data:', error);
  }
});

// Display all alerts.
async function displayAllData() {

  try {
      // Call the asynchronous displayAllTasks() function to retrieve data.
      const rows = await apiTask.electron.displayAllTasks(); 

      if (rows.length > 0) { // Check if the retrieved data is not empty.
          // Displaying data retrieved from the HTML page.
          displayDataOnHtmlPage(rows); 
      } else {
          console.log("Database is empty. No data to display.");
      }
  } catch (error) { // Error handling in the event of data recovery failure.
      console.error('Error fetching data:', error);
  }
}

displayAllData(); 
