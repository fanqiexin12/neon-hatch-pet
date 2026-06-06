const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desktopPet", {
  moveBy(delta) {
    return ipcRenderer.invoke("pet-window:move-by", delta);
  },
  toggleAlwaysOnTop() {
    return ipcRenderer.invoke("pet-window:toggle-top");
  },
  resetPosition() {
    return ipcRenderer.invoke("pet-window:reset-position");
  },
  showContextMenu() {
    ipcRenderer.send("pet-window:context-menu");
  },
  onTopChanged(callback) {
    ipcRenderer.on("pet-window:top-changed", (_event, value) => callback(value));
  },
});

