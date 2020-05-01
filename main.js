const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const Shell = require("node-powershell");

//initialize a shell instance
const ps = new Shell({
  executionPolicy: "Bypass",
  noProfile: true,
});

require("electron-reload")(__dirname, {
  electron: path.join(__dirname, "node_modules", ".bin", "electron"),
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 350,
    frame: false,
    backgroundColor: "#efefef",
    icon: path.join(__dirname, "media/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  // mainWindow.removeMenu();
  mainWindow.loadFile("views/index.html");

  // Main-Renderer Interaction
  ipcMain.on("quitclick", () => {
    app.quit();
  });

  ipcMain.on("startInstall", () => {
    const appPath = process.env.PORTABLE_EXECUTABLE_DIR;
    const pathCmdA =
      'for /f "usebackq tokens=2,*" %A in (`reg query HKCU\\Environment /v PATH`) do set my_user_path=%B';
    const pathCmdB = `setx PATH "${appPath};%my_user_path%"`;
    const pathCmd = `${pathCmdA} && ${pathCmdB}`;

    exec(pathCmd, (err) => {
      if (err) {
        mainWindow.webContents.send("installComplete", {
          response: null,
          err,
        });
      }
    });

    const psCommand = `Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iwr https://chocolatey.org/install.ps1 -UseBasicParsing | iex`;

    ps.addCommand(psCommand);
    ps.invoke()
      .then((response) => {
        console.log(response);

        mainWindow.webContents.send("installComplete", { response, err: null });
      })
      .catch((err) => {
        console.log(err);

        mainWindow.webContents.send("installComplete", {
          response: null,
          err,
        });
      });
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
