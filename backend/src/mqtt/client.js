const mqtt = require("mqtt");

const client = mqtt.connect({
  host: process.env.EMQX_HOST,
  port: process.env.EMQX_PORT,
  protocol: process.env.EMQX_PROTOCOL,
  username: process.env.EMQX_USERNAME,
  password: process.env.EMQX_PASSWORD,
  clientId: "backend-service",
  reconnectPeriod: 5000, // auto-reconnect every 5s
});

client.on("connect", () => {
  console.log("✅ Connected to EMQX Cloud");
});

client.on("reconnect", () => {
  console.log("🔄 Reconnecting to EMQX...");
});

client.on("error", (err) => {
  console.error("❌ MQTT connection error:", err.message);
});

module.exports = client;
