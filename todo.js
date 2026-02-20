"use strict"

const fs = require("fs");
const args = process.argv.slice(2);
const firstArg = args[0];
const secondArg = args[1];
const tasksFileName = "tasks.md";
const completedFileName = "completed.md";
let fileContentTasks;
let fileContentCompleted;

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
function validateFile(...files) {
  files.forEach((file) => {
    // create file if it doesnt exist
  if (!fs.existsSync(`./${file}`)) {fs.writeFileSync(file, "")};
  const readFile = fs.readFileSync(file, "utf8").trim("").split("\n");
  
  // avoid empty line on top of document
  if(readFile.length === 1 && readFile[0] == "") {readFile.length = 0};
  
  switch(file) {
    case tasksFileName:
      fileContentTasks = readFile;
      break;
    case completedFileName:
      fileContentCompleted = readFile;
      break;
  }
  })
}

// Validate tasks
function checkForValidTask(status) {
  if (isNaN(secondArg) || !Number.isInteger(Number(secondArg)) || secondArg.trim().length == 0) {
    console.log("Må være et nummer uten desimaler")
    return false;
  } 
  if (args.length > 2) {
    console.log("Angi kun ett tall uten mellomrom");
    return false;
  }
  if (!(status ? fileContentTasks.length : fileContentCompleted.length)) {
    console.log(`Ingen ${status ? "" : "fullførte "}oppgaver i listen`); return false
  }
  if (secondArg < 1 || secondArg > (status ? fileContentTasks.length : fileContentCompleted.length)) {
    console.log("Nummer utenfor rekkevidde.")
    return false;
  } 
   return true;
}

// create a backup
function backup(...files) {
  files.forEach((file) => fs.copyFileSync(file, `${file}.bak`));
}

// check and uncheck task
function checkTask(status) {
  const fileToCopyFrom = status ? fileContentTasks : fileContentCompleted;
  const fileToCopyTo = status ? fileContentCompleted : fileContentTasks;
  const fileName = status ? tasksFileName : completedFileName;
  let editedFile = [];

  // change status of task
  const slicedTask = fileToCopyFrom[secondArg - 1].slice(fileToCopyFrom[secondArg - 1].indexOf(". [") + 5 )
  const newTaskID = fileToCopyTo ? fileToCopyTo.length + 1 : 1;
  const newTaskStatus = `${newTaskID}. [${status ? "x" : " "}]`
   
  fileToCopyFrom.forEach((task, index) => {
    if (secondArg != index + 1) {
      task = `${index < secondArg ? index + 1 : index}${task.slice(task.indexOf("."))}`
      editedFile.push(task);
    } else {
      fileToCopyTo.push(newTaskStatus + slicedTask);
      fs.writeFileSync((status ? completedFileName : tasksFileName), fileToCopyTo.join("\n") + "\n");
    }
  });
  fs.writeFileSync(fileName, editedFile.join("\n") + "\n");
  console.log(`Marker oppgave ${secondArg} som ${status ? "ferdig" : "uferdig"}`)
}

// delete a task
function deleteTask() {
  console.log(`Sletter oppgave ${secondArg}`)
  let editedFile = [];
  fileContent.forEach((task, index) => {
    if (Number(secondArg) != index + 1) {
      const changeIndex = task.slice(task.indexOf(`. [`));
      task = `${index < secondArg ? index + 1 : index}${changeIndex}`
      editedFile.push(task);
    }
  });
  fs.writeFileSync(tasksFileName, editedFile.join("\n") + "\n")
}

switch(firstArg) {
  case "add":
    if ( !checkForValidArgument() ) { return };
    validateFile(tasksFileName);
    backup(tasksFileName);
    const task = args.slice(1).join(" ");
    const taskID = fileContentTasks ? fileContentTasks.length + 1 : 1;
    fs.appendFileSync(tasksFileName, `${taskID}. [ ] ${task}\n`)
    console.log("La til oppgave", task);
    break;
  case "check":
    validateFile(tasksFileName, completedFileName)
    if ( !checkForValidTask(true) ) { return };
    backup(tasksFileName, completedFileName);
    checkTask(true);
    break;
  case "uncheck":
    validateFile(tasksFileName, completedFileName)
    if ( !checkForValidTask(false) ) { return };
    backup(tasksFileName, completedFileName);
    checkTask(false);
    break;
  case "del":
    if ( !checkForValidArgument() ) { return };
    //if ( !validateFile() ) { return };
    if ( !checkForValidTask() ) { return };
    //backup();
    deleteTask();
    break;
  case "list":
    validateFile(tasksFileName, completedFileName)
    console.log("Alle oppgaver:");
    console.log(fileContentTasks.join("\n") + "\n");
    console.log("Alle fullførte oppgaver:");
    console.log(fileContentCompleted.join("\n"));
    break;
  default:
    console.log("Ugyldig kommando");
};
