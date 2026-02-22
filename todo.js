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
  });
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
    console.log(`Ingen ${status ? "" : "fullførte "}oppgaver i listen`); 
    return false
  }
  if (status) {
    if (secondArg < 1 || secondArg > fileContentTasks.length) {
      console.log("Nummer utenfor rekkevidde.")
      return false;
    } 
  } else if (!status) {
      if (secondArg < fileContentTasks.length + 1 || secondArg > fileContentCompleted.length + fileContentTasks.length) {
        console.log("Nummer utenfor rekkevidde.")
        return false;
      }
  }
  return true;
}

// write files
function writeFiles() {
  fs.writeFileSync(tasksFileName, fileContentTasks.join("\n") + "\n");
  fs.writeFileSync(completedFileName, fileContentCompleted.join("\n") + "\n");
}

// create a backup
function backup(...files) {
  files.forEach((file) => fs.copyFileSync(file, `${file}.bak`));
}

// list tasks
function listTasks() {
  const readFileTasks = fs.readFileSync(tasksFileName, "utf8").trim("").split("\n");
  const readFileCompleted = fs.readFileSync(completedFileName, "utf8").trim("").split("\n");
  
  console.log("Oppgaver som venter:")
  readFileTasks.forEach((task, index) => {
    if(task == "") {
      console.log("0")
    } else {
      console.log(`${index + 1}. [ ] ${task}`);
  }
  });
  console.log("\nFullførte oppgaver:")
  readFileCompleted.forEach((task, index) => {
    if (task == "") {
      console.log("0");
    } else {
      console.log(`${index + (readFileTasks[0] == "" ? readFileTasks.length : readFileTasks.length + 1)}. [x] ${task}`);
    }
  });

}

// move task to opposite file
function moveTask(status) {
  backup(tasksFileName, completedFileName);
  let editedFile = [];

  (status ? fileContentTasks : fileContentCompleted).forEach((task, index) => {
    if ((status ? secondArg : (secondArg - fileContentTasks.length)) != index + 1) {
      editedFile.push(task);
    } else {
      (status ? fileContentCompleted : fileContentTasks).push(task);
    }
  }); 
  (status ? fileContentTasks = editedFile : fileContentCompleted = editedFile);
  console.log(`Marker oppgave ${secondArg} som ${status ? "ferdig" : "uferdig"}`);
  writeFiles();
  }

// delete a task
function deleteTask() {
  backup(tasksFileName, completedFileName);
  let newArray = [];
  if (isNaN(secondArg) || !Number.isInteger(Number(secondArg)) || secondArg.trim().length == 0 || args.length > 2) { 
    console.log("Angi et gyldig tall uten desimaler og mellomrom")
    return false;
  } else if (Number(secondArg) > 0 && Number(secondArg) <= fileContentTasks.length) {
    newArray.push(...(fileContentTasks.slice(0, secondArg - 1)));
    newArray.push(...(fileContentTasks.slice(secondArg)));
    fileContentTasks = newArray;
    writeFiles();
    console.log(`Sletter oppgave ${secondArg}`)
    return true;
  } else if (Number(secondArg) <=  fileContentTasks.length + fileContentCompleted.length) {
    newArray.push(...(fileContentCompleted.slice(0, (secondArg - fileContentTasks.length - 1))));
    newArray.push(...(fileContentCompleted.slice((secondArg - fileContentTasks.length))));
    fileContentCompleted = newArray;
    writeFiles();
    console.log(`Sletter oppgave ${secondArg}`)
    return true;
  } else {
    console.log("Nummer utenfor rekkevidde");
    return false;
  }
}

switch(firstArg) {
  case "add":
    if ( !checkForValidArgument() ) { return };
    validateFile(tasksFileName);
    backup(tasksFileName);
    const task = args.slice(1).join(" ");
    fs.appendFileSync(tasksFileName, `${task}\n`)
    console.log("La til oppgave", task);
    break;
  case "check":
    validateFile(tasksFileName, completedFileName)
    if ( !checkForValidTask(true) ) { return };
    moveTask(true);
    break;
  case "uncheck":
    validateFile(tasksFileName, completedFileName)
    if ( !checkForValidTask(false) ) { return };
    moveTask(false);
    break;
  case "del":
    validateFile(tasksFileName, completedFileName)
    deleteTask();
    break;
  case "list":
    validateFile(tasksFileName, completedFileName)
    listTasks();
    break;
  default:
    console.log("Ugyldig kommando");
};
