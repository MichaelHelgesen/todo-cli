const {
	taskObjectGenerator
} = require("../tasks.js");

test("Legger til en oppgave i JSON-format", () => {
	expect(taskObjectGenerator("Ny oppgave")).toMatchObject({
    "createdDate": expect.any(String),
    "done": false,
		"id": expect.any(Number),
		"task": expect.any(String)
	})
})
