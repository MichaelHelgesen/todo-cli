const {
  validateFile,
  listTasks,
  checkTask,
  deleteTask,
  taskObjectGenerator,
  backup,
  writeFile
} = require("./tasks.js");
const { logger, stream } = require("./logger.js");
const morgan = require("morgan");


const express = require("express");
const app = express();
const port = 3301;
app.use(express.json());
app.use(morgan("combined", { stream: stream }));
app.use(validateFile);

app.get("/list/", (req, res) => {
  const tasks = listTasks();
  return res.json(tasks);
});
app.put("/tasks/:id", (req, res) => {
	if(!("done" in req.body)) {
		logger.warn(`Missing boolean in request for task ${req.params.id}`)
		return res.status(400).json({"status":400, "message": "Missing boolean in request"})
	}
	const result = checkTask(req.params.id, req.body.done)
	if (result.status == 404) {
		logger.warn(`Task with ID ${req.params.id} not found.`)
	} else {
		logger.info(`Task with ID ${req.params.id} changed status to ${req.body.done}`)
	}
  return res.status(result.status).json(result)
});
app.post("/add", (req, res) => {
	if (!req.body.title) {
		logger.warn("No title given");
		return res.status(400).json({"status": 400, "message": "No title given"})
	}
  //const result = taskObjectGenerator(req.body.title);
  backup();
  const newObject = taskObjectGenerator(req.body.title);
  const results = taskObjects.push(newObject);
  writefile();
	logger.info(`Added ${req.body.title}`);
  return res.status(201).json(newObject)
});
app.delete("/tasks/:id", (req, res) => {
	const result = deleteTask(req.params.id);
	if (result.status === 404) {
  		logger.warn(result.message);
	} else {
  		logger.info(result.message);
	} 
	return res.status(result.status).json(result)
});

app.use((err, req, res, next) => {
  logger.error("Invalid JSON", {error: err.message});
	return res.status(err.status).json({status: err.status, "message": err.message});
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
