const fs = require("fs");
const path = require("path");

const logsDir = path.join(__dirname, "..", "..", "logs");

function log(level, event, data = {}) {
  const now = new Date();

  const entry = {
    timestamp: now.toISOString(),
    level,
    event,
    ...data
  };

  const line = JSON.stringify(entry);

  console.log(line);

  try {
    fs.mkdirSync(logsDir, {
      recursive: true
    });

    const date = now.toISOString().slice(0, 10);
    const file = path.join(logsDir, `bot-${date}.log`);

    fs.appendFileSync(
      file,
      line + "\n",
      "utf8"
    );
  } catch (error) {
    const err = {
      timestamp: now.toISOString(),
      event: "log.write_failed",
      error: error.message
    };

    console.error(JSON.stringify(err));
  }
}

module.exports = log;