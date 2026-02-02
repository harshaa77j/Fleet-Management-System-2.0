exports.handle = (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    const parts = topic.split("/");
    const fleetId = parts[1];
    const vehicleId = parts[3];

    console.log("📥 Telemetry received:", {
      fleetId,
      vehicleId,
      data,
    });

    // Next step (later, when DB + service exists):
    // telemetryService.process({ fleetId, vehicleId, ...data });
  } catch (err) {
    console.error("❌ Telemetry parse error:", err.message);
  }
};
