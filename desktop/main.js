// const { app, BrowserWindow } = require("electron");
// const path = require("path");
// const { spawn } = require("child_process");

// let mainWindow;

// function startBackend() {
//   console.log("Starting backend (Docker)...");
//   return spawn(
//     "docker",
//     ["compose", "up"],
//     {
//       cwd: path.join(__dirname, "../backend"),
//       shell: true,
//       stdio: "inherit",
//     }
//   );
// }

// function startFrontend() {
//   console.log("Starting frontend (Vite)...");
//   return spawn(
//     "npm",
//     ["run", "dev"],
//     {
//       cwd: path.join(__dirname, "../frontend/managerLogin"),
//       shell: true,
//       stdio: "inherit",
//     }
//   );
// }

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js"),
//     },
//   });

//   mainWindow.loadURL("http://localhost:5173");
//   mainWindow.webContents.openDevTools();
// }

// app.whenReady().then(() => {
//   // Start backend & frontend
//   startBackend();
//   startFrontend();

//   // Wait for servers to be ready
//   setTimeout(createWindow, 6000);
// });

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") app.quit();
// });

const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:5173");
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
