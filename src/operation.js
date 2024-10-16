const axios = require("axios");

// CREATE

function createATask(title, content) {
  return axios.post('http://localhost:8080/task', {
    title: title,
    content: content
  })
  .then((response) => {
    console.log('Task created successfully:', response.data);
  })
  .catch((error) => {
    console.error('Error creating task:', error.response ? error.response.data : error.message);
  });
}

// READ 

function displayAllTasks() {
  return axios.get('http://localhost:8080/task/all')
    .then(response => { 
      console.log('Tasks displayed successfully:', response.data);
      return response.data; 
    })
    .catch(error => {
      console.error('Error fetching tasks:', error.response ? error.response.data : error.message);
    });
}

function displayATask(id) {
  return axios.get(`http://localhost:8080/task/${id}`) 
    .then(response => { 
      console.log('Task displayed successfully:', response.data);
      return response.data; 
    })
    .catch(error => {
      console.error('Error fetching task:', error.response ? error.response.data : error.message);
    });
}

// UPDATE 

function updateATask(id, title, content) {
  const data = {};
  if (title !== undefined) data.title = title;
  if (content !== undefined) data.content = content;

  return axios.put(`http://localhost:8080/task/${id}`, data) 
    .then(response => {
      console.log('Task updated successfully:', response.data);
    })
    .catch(error => {
      console.error('Error updating task:', error.response ? error.response.data : error.message);
    });
}

// DELETE 

function deleteAllTasks() {
  return axios.delete("http://localhost:8080/task/all")
    .then(response => {
      console.log('Tasks deleted successfully, no content returned.'); 
      return response;
    })
    .catch(error => {
      console.error('Error deleting tasks:', error.response ? error.response.data : error.message);
    });
}

function deleteATask(id) {
  return axios.delete(`http://localhost:8080/task/${id}`)
    .then(response => {
      console.log('Task deleted successfully, no content returned.'); 
      return response; 
    })
    .catch(error => {
      console.error('Error deleting task:', error.response ? error.response.data : error.message); 
      throw error; 
    });
} 

module.exports = {
    createATask,
    displayAllTasks,
    displayATask,
    updateATask,
    deleteAllTasks,
    deleteATask 
}; 
