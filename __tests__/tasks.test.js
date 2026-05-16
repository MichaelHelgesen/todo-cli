const fs = require("fs");
jest.mock("fs");

const {
	taskObjectGenerator,
  getTaskObjects,
  setTaskObjects,
  validateFile,
  deleteTask
} = require("../tasks.js");

test("Legger til en oppgave i JSON-format", () => {
	expect(taskObjectGenerator("Ny oppgave")).toMatchObject({
    "createdDate": expect.any(String),
    "done": false,
		"id": expect.any(Number),
		"task": expect.any(String)
	});
});


describe("validatefile", () => {
  const req = {};
  const res = {};
  const next = jest.fn();
  beforeEach(() => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue('[{"id": 1, "task": "Test", "done": false, "createdDate": "2024-01-01"}]');
  });

  test("Vise en liste over alle oppgaver", () => {
    validateFile(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(getTaskObjects()[0]).toMatchObject({
      "createdDate": expect.any(String),
      "done": false,
      "id": expect.any(Number),
      "task": expect.any(String)
    })
  });
})

describe("testObject", () => {
  beforeEach(() => {
    const testObject = setTaskObjects([{"id": 1, "task": "Test", "done": false, "createdDate": "2024-01-01"}]);
  });

  test("Slette et objekt", () => {
    deleteTask(1);
	  expect(getTaskObjects()).toEqual([]);
  });
});

