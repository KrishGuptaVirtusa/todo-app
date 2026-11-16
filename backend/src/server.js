const app = require("./app");
const config = require("./config/env");

const server = app.listen(config.port, () => {
  console.log("==================================================");
  console.log(" VIT Team 3 - To-Do App Backend Server");
  console.log(` Status: Running in [${config.nodeEnv}] mode`);
  console.log(` Port:   ${config.port}`);
  console.log(` URL:    http://localhost:${config.port}`);
  console.log(` Health: http://localhost:${config.port}/api/health`);
  console.log(` API:    http://localhost:${config.port}/api/todos`);
  console.log("==================================================");
});

// Graceful shutdown handling
function gracefulShutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down server gracefully...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });

  // Force shutdown if taking longer than 5 seconds
  setTimeout(() => {
    console.error("Could not close connections in time, forcefully shutting down.");
    process.exit(1);
  }, 5000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Unhandled process errors
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

module.exports = server;
