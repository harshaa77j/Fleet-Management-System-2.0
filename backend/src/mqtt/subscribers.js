const client = require("./client");
const telemetryHandler = require("./handlers/telemetry.handler");

client.on("connect", () => {
  client.subscribe(process.env.EMQX_TELEMETRY_TOPIC, () => {
    console.log("📡 Subscribed to telemetry topics");
  });
});

client.on("message", (topic, message) => {
  telemetryHandler.handle(topic, message);
});
