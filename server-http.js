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
    return true;
  };
  return false;
}

// Create todo-object
function taskObjectGenerator(data, taskObjects) {
  if (data && data.trim()) {
    const object = {
      "createdDate": new Date().toISOString().split("T")[0],
      "done": false,
      "id": Date.now(),
      "task": data,
    }
    taskObjects.push(object);
    writeFile(taskObjects);
    return true;
  }
  return false;
};

// delete a task
function deleteTask(id, taskObjects) {
  const checkForID = taskObjects.filter(obj => obj.id === id);
  if (checkForID.length) {
    taskObjects = taskObjects.filter((obj) => obj.id != id);
    writeFile(taskObjects);
    return true;
  }
  return false;
}

// Opprett en lokal server som skal motta data
const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/tasks") {
    const taskObjects = validateFile();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      data: taskObjects,
    }));
  } else if (req.method === "POST" && req.url === "/tasks") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        let resObj = {};
        let statusCode;
        const data = JSON.parse(body);
        const taskObjects = validateFile();
        if (typeof data.task === "string" && taskObjectGenerator(data.task, taskObjects)) {
          resObj.data = `Success. To-do ${data.task} created`;
          statusCode = 200;
        } else {
          resObj.data = `Error. Creation of to-do ${data.task} failed. Name, date or ID is missing.`
          statusCode = 400;
        }
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(resObj));
      } catch (error) {
        res.writeHead(error.name === "SyntaxError" ? 400 : 500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          "error": "Somethin went wrong."
        }));
      }
    });
  } else if (req.method === "PUT" && req.url.startsWith("/tasks/") && req.url.split("/").length === 3) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const taskObjects = validateFile();
        const taskID = Number(req.url.split("/")[2]);
        let resObj = {};
        let statusCode;
        if (typeof data.status === "boolean" && checkTask(Number(taskID), data.status , taskObjects)) {
          resObj.data = `Success. To-do with ID ${taskID} changed to ${data.status}`;
          statusCode = 200;
        } else {
          resObj.data = `Error. No to-do with ID ${taskID} found.`;
          statusCode = 404;
        }
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(resObj))
      } catch (error) {
        res.writeHead(error.name === "SyntaxError" ? 400 : 500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          "error": `Something went wrong.`
        }));
      }
    });
  } else if (req.method === "DELETE" && req.url.startsWith("/tasks/") && req.url.split("/").length === 3) {
    try {
      const taskObjects = validateFile();
      const taskID = Number(req.url.split("/")[2]);
      let resObj = {};
      let statusCode;
      if (deleteTask(Number(taskID), taskObjects)) {
        resObj.data = `Success. To-do with ID ${taskID} deleted`;
        statusCode = 200;
      } else {
        resObj.data = `Error. No to-do with ID ${taskID} found`;
        statusCode = 404;
      }
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(resObj))
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        "error": "Something went wrong."
      }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      data: 'Error. Page not found'
    }));
  }
});


server.listen(8000);
