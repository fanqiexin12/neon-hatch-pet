const { app, BrowserWindow, Menu, ipcMain, screen } = require("electron");
const path = require("node:path");

let petWindow;
let alwaysOnTop = true;

function createPetWindow() {
  const { workArea } = screen.getPrimaryDisplay();
  const width = 360;
  const height = 660;

  petWindow = new BrowserWindow({
    width,
    height,
    x: Math.max(workArea.x, workArea.x + workArea.width - width - 48),
    y: Math.max(workArea.y, workArea.y + workArea.height - height - 72),
    transparent: true,
    frame: false,
    resizable: false,
    movable: true,
    hasShadow: false,
    alwaysOnTop,
    skipTaskbar: true,
    backgroundColor: "#00000000",
    title: "Neon Hatch Pet",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  petWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  petWindow.setAlwaysOnTop(alwaysOnTop, "floating");
  petWindow.loadFile("desktop.html");
}

function ensureWindow() {
  if (petWindow && !petWindow.isDestroyed()) return petWindow;
  return null;
}

app.whenReady().then(() => {
  if (process.platform === "darwin" && app.dock) {
    app.dock.hide();
  }

  createPetWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createPetWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("pet-window:move-by", (_event, delta) => {
  const win = ensureWindow();
  if (!win) return;
  const [x, y] = win.getPosition();
  win.setPosition(Math.round(x + delta.x), Math.round(y + delta.y));
});

ipcMain.handle("pet-window:toggle-top", () => {
  const win = ensureWindow();
  if (!win) return alwaysOnTop;
  alwaysOnTop = !alwaysOnTop;
  win.setAlwaysOnTop(alwaysOnTop, "floating");
  return alwaysOnTop;
});

ipcMain.handle("pet-window:reset-position", () => {
  const win = ensureWindow();
  if (!win) return;
  const { workArea } = screen.getPrimaryDisplay();
  const bounds = win.getBounds();
  win.setPosition(
    Math.max(workArea.x, workArea.x + workArea.width - bounds.width - 48),
    Math.max(workArea.y, workArea.y + workArea.height - bounds.height - 72)
  );
});

ipcMain.on("pet-window:context-menu", () => {
  const win = ensureWindow();
  if (!win) return;

  const menu = Menu.buildFromTemplate([
    {
      label: alwaysOnTop ? "取消置顶" : "保持置顶",
      click: () => {
        alwaysOnTop = !alwaysOnTop;
        win.setAlwaysOnTop(alwaysOnTop, "floating");
        win.webContents.send("pet-window:top-changed", alwaysOnTop);
      },
    },
    {
      label: "回到右下角",
      click: () => {
        const { workArea } = screen.getPrimaryDisplay();
        const bounds = win.getBounds();
        win.setPosition(
          Math.max(workArea.x, workArea.x + workArea.width - bounds.width - 48),
          Math.max(workArea.y, workArea.y + workArea.height - bounds.height - 72)
        );
      },
    },
    { type: "separator" },
    { label: "重新加载", click: () => win.reload() },
    { label: "退出宠物", click: () => app.quit() },
  ]);

  menu.popup({ window: win });
});
