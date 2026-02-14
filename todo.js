"use strict"

const fs = require("fs");
const args = process.argv.slice(2);
const firstArg = args[0];
const secondArg = args[1];
let fileContent;

// Validate file
function validateFile() {
  const file = fs.readFileSync("tasks.md", "utf8").trim("").split("\n");
  if(file.length === 1 && file[0] == "") {
      console.log("Ingen oppgaver i dokumentet");
      return false
  };
  return file;
}

// Validate tasks
function validateTask(arr) {
  // Check if argument is a number
  if (isNaN(secondArg)) {
    console.log("Må være et nummer.")
    return false;
  } 
  // Check if argument is within range
  if (secondArg < 1 || secondArg > arr.length) {
    console.log("Nummer utenfor rekkevidde.")
    return false;
  }
  // Check if task is already done
  if (arr[secondArg - 1].indexOf("- [x]") === 0) {
      console.log("Allerede gjort")
      return false
  };
  return true;
}

// create a backup
function backup() {
  fs.copyFileSync("tasks.md", "tasks.md.bak");
}


switch(firstArg) {
  // Add to list
  case "add":
    backup();
    const task = args.slice(1).join(" ")
    fs.appendFileSync("tasks.md", `- [ ] ${task}\n`)
    console.log("La til oppgave", task);
    break;
  // List tasks
  case "list":
    fileContent = validateFile();
    if (!fileContent) {return};
    console.log("Alle oppgaver:");
    console.log(fileContent.join("\n"));
    break;
  // Check a task
  case "done":
    fileContent = validateFile();
    if (!fileContent) {return}
    if (args.length > 2) {
      console.log("Angi kun ett tall uten mellomrom");
      return;
    }
    if (!validateTask(fileContent)) {return};
    backup();
    console.log(`Marker oppgave ${secondArg} som ferdig`)
    let editedFile = [];
    fileContent.forEach((task, index) => {
      if (Number(secondArg) === index + 1) {
        const changeIndex = task.indexOf("]")
        task = `- [x] ${task.slice(changeIndex + 2)}`
      }
    editedFile.push(task);
    });
    fs.writeFileSync("tasks.md", editedFile.join("\n") + "\n")
    break;
  default:
    console.log("Ugyldig kommando");
}

