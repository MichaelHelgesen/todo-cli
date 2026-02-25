const {
  validateFile,
  listTasks,
  checkTask,
  deleteTask,
  taskObjectGenerator
} = require("./tasks.js");


const express = require("express");
const app = express();
const port = 3301;
app.use(express.json());
app.use(validateFile);

app.get("/list/", (req, res) => {
  const tasks = listTasks();
  return res.json(tasks);
});
app.put("/tasks/:id", (req, res) => {
  checkTask(req.params.id, req.body.done)
  return res.json({"success": true})
});
app.post("/add", (req, res) => {
  taskObjectGenerator(req.body.title);
  return res.json({"success": true})
});
app.delete("/tasks/:id", (req, res) => {
  deleteTask(req.params.id);
  return res.json({"success": true})
});
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
