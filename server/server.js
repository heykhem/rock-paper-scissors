require("dotenv").config();

const express = require("express");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);

app.use(express.json());

// ✅ Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Env config for frontend
app.get("/config", (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  });
});

// ✅ Only serve index.html on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
