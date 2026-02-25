"use strict"

const fs = require("fs");
const tasksFileName = "tasks.json";
let taskObjects;

// Validate file
function validateFile(req, res, next) {
  // create file if it doesnt exist
  if (!fs.existsSync(`./${tasksFileName}`)) {fs.writeFileSync(tasksFileName, "[]")};
  taskObjects = JSON.parse(fs.readFileSync(tasksFileName, "utf8"));
  next();
}

// write files
function writeFile() {
  fs.writeFileSync(tasksFileName, JSON.stringify(taskObjects, null, 2));
}

// create a backup
function backup() {
  fs.copyFileSync(tasksFileName, `${tasksFileName}.bak`);
}

// list tasks
function listTasks() { 
  return taskObjects;
}

// check or uncheck task
function checkTask(id, status) {
  backup();
  taskObjects = taskObjects.map(task => {
    if(task.id == id) {
      return {...task, "done": status}
    }
    return task;
  })
  writeFile();
}

// delete a task
function deleteTask(id) {
    backup();
    taskObjects = taskObjects.filter((obj) => obj.id != id);
    writeFile();
 }

function taskObjectGenerator(task) {
  backup();
  const object = {
    "createdDate": new Date().toISOString().split("T")[0],
    "done": false,
    "id": Date.now(),
    "task": task,
  }
  taskObjects.push(object);
  writeFile();
};

module.exports = {
  validateFile,
  listTasks,
  checkTask,
  deleteTask,
  taskObjectGenerator
}
