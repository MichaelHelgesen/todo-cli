const winston = require("winston");
const fs = require("fs");
const folderName = "./logs";

fs.mkdirSync(folderName, { recursive: true });

const logger = winston.createLogger({
	level: "http",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	),
	defaultMeta: {service: "todo-app"},
	transports: [
		    //
    // - Write all logs with importance level of `error` or higher to `error.log`
    //   (i.e., error, fatal, but not other levels)
    //
    new winston.transports.File({ filename: `${folderName}/error.log`, level: 'error' }),
    //
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //   (i.e., fatal, error, warn, and info, but not trace)
    //
    new winston.transports.File({ filename: `${folderName}/combined.log` }),
	],
});



//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = {
	logger,
	stream: {
		write: (message) => logger.http(message)
	}
}
