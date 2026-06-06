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
  showContextMenu(menuState) {
    ipcRenderer.send("pet-window:context-menu", menuState);
  },
  onCommand(callback) {
    ipcRenderer.on("desktop-pet:command", (_event, payload) => callback(payload));
  },
  onTopChanged(callback) {
    ipcRenderer.on("pet-window:top-changed", (_event, value) => callback(value));
  },
});
