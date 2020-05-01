const ipcRenderer = require("electron").ipcRenderer;

const form = document.getElementById("installForm");
const details = document.getElementById("installDetails");

const installBtn = document.getElementById("installBtn");
installBtn.addEventListener("click", () => {
  ipcRenderer.send("startInstall");
  form.style.display = "none";
  details.style.display = "flex";
});

const cancelBtn = document.getElementById("cancelBtn");
cancelBtn.addEventListener("click", () => {
  $("body").fadeOut("fast", () => {
    window.location.href = "index.html";
  });
});

const finishBtn = document.getElementById("finishBtn");
finishBtn.addEventListener("click", () => {
  ipcRenderer.send("quitclick");
});

ipcRenderer.on("installComplete", (event, data) => {
  const { response, err } = data;
  if (err) {
    details.style.overflowY = "scroll";
    details.innerHTML = `<p style="width: 100%; height: 100%;">${err}</p>`;
  } else {
    details.innerHTML = `<p>Installation Complete</p>`;
  }
  installBtn.style.display = "none";
  cancelBtn.style.display = "none";
  finishBtn.style.display = "block";
});
