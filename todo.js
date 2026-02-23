"use strict"

const fs = require("fs");
const args = process.argv.slice(2);
const firstArg = args[0];
const secondArg = args[1];
const tasksFileName = "tasks.json";
let taskObjects;


// Check for valid argument
function checkForValidArgument() {
  if (secondArg && secondArg.trim().length > 0) {
    return true;
  } else {
    console.log("Må angi et argument")
    return false;
  }
}

// Validate file
function validateFile() {
  // create file if it doesnt exist
  if (!fs.existsSync(`./${tasksFileName}`)) {fs.writeFileSync(tasksFileName, "[]")};
  taskObjects = JSON.parse(fs.readFileSync(tasksFileName, "utf8"));
}

// Validate tasks
function checkForValidTask() {
  const unfinishedTasks = taskObjects.filter(obj => !obj.done);
  const finishedTasks = taskObjects.filter(obj => obj.done);

  if (isNaN(secondArg) || !Number.isInteger(Number(secondArg)) || secondArg.trim().length == 0) {
    console.log("Må være et nummer uten desimaler")
    return false;
  } 
  if (args.length > 2) {
    console.log("Angi kun ett tall uten mellomrom");
    return false;
  }
    if (secondArg < 1 || secondArg > taskObjects.length) {
      console.log("Nummer utenfor rekkevidde.")
      return false;
  }
  return true;
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
  const unfinishedTasks = taskObjects.filter(obj => !obj.done);
  const finishedTasks = taskObjects.filter(obj => obj.done);

  console.log("Oppgaver som venter:")
  if (!unfinishedTasks.length) {
    console.log("0")
  } else {
    unfinishedTasks.forEach(({id, task}, index) => {
      console.log(`${index + 1}. [ ] ${task}`);
    })
  }
  console.log("\nOppgaver som er gjort:")
  if (!finishedTasks.length) {
    console.log("0")
  } else {
    finishedTasks.forEach(({id, task}, index) => {
      console.log(`${(index + 1) + unfinishedTasks.length}. [x] ${task}`);
    })
  }
}

// check or uncheck task
function checkTask(status) {
  const unfinishedTasks = taskObjects.filter(obj => !obj.done);
  const finishedTasks = taskObjects.filter(obj => obj.done);

  (status ? unfinishedTasks : finishedTasks).forEach((obj, index) => {
    if ((status ? secondArg : (secondArg - unfinishedTasks.length)) == index + 1) {
      obj.done = !obj.done;
    }  
  }); 
  console.log(`Marker oppgave ${secondArg} som ${status ? "ferdig" : "uferdig"}`);
  writeFile();
}

// delete a task
function deleteTask() {
  const unfinishedTasks = taskObjects.filter(obj => !obj.done);
  const finishedTasks = taskObjects.filter(obj => obj.done);
    taskObjects = [...unfinishedTasks, ...finishedTasks].filter((obj, index) => index + 1 != secondArg);
    writeFile();
    console.log(`Sletter oppgave ${secondArg}`)
    return true;
 }

function taskObjectGenerator(task) {
  const object = {
    "id": Date.now(),
    "task": task,
    "done": false
  }
  taskObjects.push(object);
  writeFile();
};

switch(firstArg) {
  case "add":
    if ( !checkForValidArgument() ) { return };
    validateFile();
    backup();
    const task = args.slice(1).join(" ");
    taskObjectGenerator(task)
    console.log("La til oppgave", task);
    break;
  case "check":
    validateFile()
    if ( !checkForValidTask() ) { return };
    backup();
    checkTask(true);
    break;
  case "uncheck":
    validateFile()
    if ( !checkForValidTask() ) { return };
    backup();
    checkTask(false);
    break;
  case "del":
    validateFile()
    if ( !checkForValidTask()) { return };
    backup();
    deleteTask();
    break;
  case "list":
    validateFile()
    listTasks();
    break;
  default:
    console.log("Ugyldig kommando");
};
