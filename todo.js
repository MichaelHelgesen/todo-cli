"use strict"

const fs = require("fs");
const args = process.argv.slice(2);
const firstArg = args[0];
const secondArg = args[1];
let fileContent;

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
function validateFile(silent = false) {
  const file = fs.readFileSync("tasks.md", "utf8").trim("").split("\n");
  if(file.length === 1 && file[0] == "") {
    if (!silent) {console.log("Ingen oppgaver i dokumentet")};
    return false
  };
  fileContent = file;
  return true;
}

// Validate tasks
function checkForValidTask() {
  if (isNaN(secondArg)) {
    console.log("Må være et nummer.")
    return false;
  } 
  if (args.length > 2) {
    console.log("Angi kun ett tall uten mellomrom");
    return false;
  }
  if (secondArg < 1 || secondArg > fileContent.length) {
    console.log("Nummer utenfor rekkevidde.")
    return false;
  }
  return true;
}

// check for task status
function checkTaskStatus(status) {
  if (status === true && fileContent[secondArg - 1].indexOf(`${secondArg}. [x]`) === 0) {
      console.log("Allerede gjort");
      return false;
  } else if (status === false && fileContent[secondArg - 1].indexOf(`${secondArg}. [ ]`) === 0) {
      console.log("Oppgaven allerede uferdig");
      return false;
  } else {
    return true;
  };
};

// create a backup
function backup() {
  fs.copyFileSync("tasks.md", "tasks.md.bak");
}

// check and uncheck task
function checkTask(status) {
  //if (!validateTask(fileContent, status)) {return};
  console.log(`Marker oppgave ${secondArg} som ${status ? "ferdig" : "uferdig"}`)
  let editedFile = [];
  fileContent.forEach((task, index) => {
    if (Number(secondArg) === index + 1) {
      const changeIndex = task.indexOf("]")
      task = `${index + 1}. [${status ? "x" : " "}] ${task.slice(changeIndex + 2)}`
    }
  editedFile.push(task);
  });
  fs.writeFileSync("tasks.md", editedFile.join("\n") + "\n");
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
  fs.writeFileSync("tasks.md", editedFile.join("\n") + "\n")
}

switch(firstArg) {
  case "add":
    if ( !checkForValidArgument() ) { return };
    validateFile(true);
    backup();
    const task = args.slice(1).join(" ");
    const taskID = fileContent ? fileContent.length + 1 : 1;
    fs.appendFileSync("tasks.md", `${taskID}. [ ] ${task}\n`)
    console.log("La til oppgave", task);
    break;
  case "check":
    if ( !checkForValidArgument() ) { return };
    if ( !validateFile() ) { return };
    if ( !checkForValidTask() ) { return };
    if ( !checkTaskStatus(true) ) { return };
    backup();
    checkTask(true);
    break;
  case "uncheck":
    if ( !checkForValidArgument() ) { return };
    if ( !validateFile() ) { return };
    if ( !checkForValidTask() ) { return };
    if ( !checkTaskStatus(false) ) { return };
    backup();
    checkTask(false);
    break;
  case "del":
    if ( !checkForValidArgument() ) { return };
    if ( !validateFile() ) { return };
    if ( !checkForValidTask() ) { return };
    backup();
    deleteTask();
    break;
  case "list":
    if ( !validateFile() ) { return };
    console.log("Alle oppgaver:");
    console.log(fileContent.join("\n"));
    break;
  default:
    console.log("Ugyldig kommando");
};
