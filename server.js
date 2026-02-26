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
	if(!("done" in req.body)) {
		return res.status(400).json({"status":400, "message": "Missing boolean in request"})
	}
	const result = checkTask(req.params.id, req.body.done)
  return res.status(result.status).json(result)
});
app.post("/add", (req, res) => {
	if (!req.body.title) {
		return res.status(400).json({"status": 400, "message": "No title given"})
	}
  const result = taskObjectGenerator(req.body.title);
  return res.status(result.status).json(result)
});
app.delete("/tasks/:id", (req, res) => {
	const result = deleteTask(req.params.id);
	return res.status(result.status).json(result)
});
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
