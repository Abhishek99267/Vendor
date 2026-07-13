// ==========================================================
// Vercel serverless entry point
// ==========================================================
// Vercel looks for a handler in /api. We don't duplicate any
// app/route logic here — we just re-export the same Express
// app that server.js builds, so local (`node server.js`) and
// Vercel deployments run from one single source of truth.

module.exports = require("../server");
