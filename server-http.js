"use strict"
const http = require('node:http');
const fs = require("fs");
const tasksFileName = "tasks.json";

// Validate file
function validateFile() {
  // create file if it doesnt exist
  if (!fs.existsSync(`./${tasksFileName}`)) {
    fs.writeFileSync(tasksFileName, "[]")
  };
  return JSON.parse(fs.readFileSync(tasksFileName, "utf8"));
}

// create a backup
function backup() {
  fs.copyFileSync(tasksFileName, `${tasksFileName}.bak`);
}

// write files
function writeFile(taskObjects) {
  backup();
  fs.writeFileSync(tasksFileName, JSON.stringify(taskObjects, null, 2));
}

// check or uncheck task
function checkTask(id, status, taskObjects) {
  const checkForID = taskObjects.filter(obj => obj.id == id);
  if (checkForID.length) {
	    taskObjects = taskObjects.map(task => {
        if(task.id == id) {
          return {...task, "done": status};
        } else {
	        return task;    
        }
      });
    writeFile(taskObjects);
  };
}

// Create todo-object
function taskObjectGenerator(data, taskObjects) {
  const object = {
    "createdDate": new Date().toISOString().split("T")[0],
    "done": false,
    "id": Date.now(),
    "task": data,
  }
  taskObjects.push(object);
  writeFile(taskObjects);
};

// delete a task
function deleteTask(id, taskObjects) {
    const checkForID = taskObjects.filter(obj => obj.id === id);
    if (checkForID.length) {
      taskObjects = taskObjects.filter((obj) => obj.id != id);
      writeFile(taskObjects);
    }
 }

// Opprett en lokal server som skal motta data
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  if (req.method === "GET" && req.url === "/tasks") {
    const taskObjects = validateFile();
    res.end(JSON.stringify({
      data: taskObjects,
    }));
  } else if (req.method === "POST" && req.url === "/tasks") {
      let body = "";
      req.on("data", (chunk) => {
          body += chunk.toString();
      });
      req.on("end", () => {
        const data = JSON.parse(body);
        const taskObjects = validateFile();
        taskObjectGenerator(data.task, taskObjects);
          res.end(JSON.stringify({
            data: 'TODO-registered',
          }));
      });
  } else if (req.method === "PUT" && req.url.startsWith("/tasks/") && req.url.split("/").length === 3) {
      let body = "";
      req.on("data", (chunk) => {
          body += chunk.toString();
      });
      req.on("end", () => {
        const data = JSON.parse(body);
        const taskObjects = validateFile();
        checkTask(Number(req.url.split("/")[2]), data.status , taskObjects)
          res.end(JSON.stringify({
            data: 'Status change registered',
          }));
      });
  } else if (req.method === "DELETE" && req.url.startsWith("/tasks/") && req.url.split("/").length === 3) {
      const taskObjects = validateFile();
      deleteTask(Number(req.url.split("/")[2]), taskObjects);
      res.end(JSON.stringify({
        data: 'DELETING',
      }));
  } else {
    res.end(JSON.stringify({
      data: 'Hello World!',
    }));
  }
});


server.listen(8000);
