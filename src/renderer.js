const closeBtn = document.getElementById('icon');
closeBtn.addEventListener('click', () => {
  apiTask.electron.ipcRenderer.send('close-main-window');
}); 

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
          let deleteTimeout;
          // Template cloning.
          const clonedTemplate = template?.cloneNode(true); 
          // Template customization.
          const title = clonedTemplate?.querySelector('.title');
          title.textContent = item.title; 
          // Selection of toggle-switch status.
          const toggleSwitch = clonedTemplate?.querySelector('.switch-input');
          const toggleLabel = clonedTemplate?.querySelector('.switch-label');
          // Use item id for toggle switch and label.
          toggleSwitch.id = `switch-${item.id}`;
          toggleLabel.setAttribute('for', `switch-${item.id}`);
          // Application of initial state as a function of item.completed.
          if (item.completed) {
           toggleSwitch.checked = true; // If completed is true, the toggle is activated.
           toggleLabel.style.backgroundColor = 'green'; // Green background if activated.
          } else {
           toggleSwitch.checked = false; // If false, toggle is disabled.
           toggleLabel.style.backgroundColor = 'red'; // Red background if disabled.
          }
          //  Add an event listener to manage toggle-switch state changes.
          toggleSwitch.addEventListener('change', (event) => {
           if (event.target.checked) {
            toggleLabel.style.backgroundColor = 'green'; // When activated, green background.
            clonedTemplate.style.opacity = '0.5';
            readIcon.style.pointerEvents = 'none';
            updateIcon.style.pointerEvents = 'none';
            deleteIcon.style.pointerEvents = 'none';
            readIcon.style.cursor = 'not-allowed';
            updateIcon.style.cursor = 'not-allowed';
            deleteIcon.style.cursor = 'not-allowed'; 
            // Use a delay before deleting the task.
            deleteTimeout = setTimeout(() => {
                apiTask.deleteATask(item.id);
                apiTask.electron.ipcRenderer.send("page-refresh");
            }, 60000); // 60000 ms = 60 seconds delay before deletion.
           } else {
            toggleLabel.style.backgroundColor = 'red'; // When activated, red background. 
            clonedTemplate.style.opacity = '1';
            readIcon.style.pointerEvents = 'auto';
            updateIcon.style.pointerEvents = 'auto';
            deleteIcon.style.pointerEvents = 'auto';
            readIcon.style.cursor = 'pointer';
            updateIcon.style.cursor = 'pointer';
            deleteIcon.style.cursor = 'pointer'; 
            // Cancellation of setTimeout if the user presses the toggle-switch again before execution.
            clearTimeout(deleteTimeout);
           }
          });
          const content = clonedTemplate?.querySelector('.content');
          content.textContent = item.content; 
          const readIcon = clonedTemplate?.querySelector('.readIcon');
          readIcon.id = item.id;
          readIcon.addEventListener('click', () => {
          apiTask.electron.ipcRenderer.send('open-read-window', item.id);
          });
          const updateIcon = clonedTemplate.querySelector(".updateIcon");
          updateIcon.id = item.id;
          updateIcon.addEventListener("click", () => {
          apiTask.electron.ipcRenderer.send("open-update-window", item.id);
          });
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
      const rows = await apiTask.displayAllTasks(); 

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
