const ipcRenderer = require("electron").ipcRenderer;

const startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click", () => {
  $("body").fadeOut("fast", () => {
    window.location.href = "install.html";
  });
});

const quitBtn = document.getElementById("quitBtn");
quitBtn.addEventListener("click", () => {
  ipcRenderer.send("quitclick");
});
