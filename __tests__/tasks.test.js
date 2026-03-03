const {
	taskObjectGenerator
} = require("../tasks.js");

test("legger til en oppgave i JSON-format", () => {
	expect(taskObjectGenerator("Ny oppgave")).toMatchObject({
		"status": 201,
		"message": "Task successfully added"
	})
})
