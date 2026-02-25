const {
  checkForValidArgument,
  validateFile,
  checkForValidTask,
  writeFile,
  backup,
  listTasks,
  checkTask,
  deleteTask,
  taskObjectGenerator
} = require("./tasks.js");


const express = require("express");
const app = express();
const port = 3301;
 app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world!");
});
app.get("/list/", (req, res) => {
  validateFile()
  const tasks = listTasks();
  return res.json(tasks);
});
app.put("/task/:id", (req, res) => {
  console.log(req.body)
  validateFile();
  checkTask(req.params.id, req.body.done)
  //res.send("update task\n");
  return res.json({"success": true})
});
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
