const { app, BrowserWindow, Menu, ipcMain, screen } = require("electron");
const path = require("node:path");

let petWindow;
let alwaysOnTop = true;

const CLOCK_INTERVAL_MENU = [
  ["关闭", 0],
  ["5 分钟", 5 * 60 * 1000],
  ["15 分钟", 15 * 60 * 1000],
  ["30 分钟", 30 * 60 * 1000],
  ["1 小时", 60 * 60 * 1000],
  ["2 小时", 2 * 60 * 60 * 1000],
];

const CLOCK_FORMAT_MENU = [
  ["24小时 HH:mm", "hm24"],
  ["带秒 HH:mm:ss", "hms24"],
  ["中文口语", "zh"],
  ["日期 + 时间", "dateTime"],
];

const CARE_THRESHOLD_MENU = [
  ["30%", 30],
  ["40%", 40],
  ["50%", 50],
  ["60%", 60],
  ["70%", 70],
];

const OWNER_CALL_INTERVAL_MENU = [
  ["关闭", 0],
  ["2 分钟", 2 * 60 * 1000],
  ["5 分钟", 5 * 60 * 1000],
  ["10 分钟", 10 * 60 * 1000],
  ["30 分钟", 30 * 60 * 1000],
];

function createPetWindow() {
  const { workArea } = screen.getPrimaryDisplay();
  const width = 280;
  const height = 260;

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

ipcMain.on("pet-window:context-menu", (_event, menuState = {}) => {
  const win = ensureWindow();
  if (!win) return;

  const menu = Menu.buildFromTemplate(buildPetMenu(win, menuState));
  menu.popup({ window: win });
});

function buildPetMenu(win, menuState) {
  const mode = menuState.mode || "egg";
  const hatched = mode === "hatched";
  const hatching = mode === "hatching";
  const petName = menuState.petName || (hatched ? "桌面宠物" : "未孵化");
  const speciesName = menuState.speciesName || petName;
  const identity = menuState.identity || {};
  const ownerName = identity.ownerName || "主人";
  const stats = menuState.stats || {};
  const clock = menuState.clock || {};
  const care = menuState.care || {};
  const ownerCall = menuState.ownerCall || {};
  const clickLabel = hatching ? "孵化中..." : hatched ? "摸摸宠物" : "孵化";
  const clickCommand = hatched ? "pet" : "hatch";

  const moodSubmenu = [
    ["开心", "happy"],
    ["伤心", "sad"],
    ["焦虑", "anxious"],
    ["累了", "tired"],
    ["生气", "angry"],
    ["无聊", "bored"],
    ["孤单", "lonely"],
    ["兴奋", "excited"],
    ["平静", "calm"],
    ["压力", "stressed"],
  ].map(([label, value]) => ({
    label,
    enabled: hatched,
    click: () => sendPetCommand(win, "mood", value),
  }));

  const clockIntervalSubmenu = CLOCK_INTERVAL_MENU.map(([label, value]) => ({
    label,
    type: "radio",
    checked: Number(clock.intervalMs || 0) === value,
    click: () => sendPetCommand(win, "clockInterval", value),
  }));

  const clockFormatSubmenu = CLOCK_FORMAT_MENU.map(([label, value]) => ({
    label,
    type: "radio",
    checked: (clock.format || "hm24") === value,
    click: () => sendPetCommand(win, "clockFormat", value),
  }));

  const clockLabel = clock.intervalMs > 0
    ? `报时：${clock.intervalLabel || "已开启"} / ${clock.formatLabel || "24小时 HH:mm"}`
    : `报时：关闭 / ${clock.formatLabel || "24小时 HH:mm"}`;

  const clockSubmenu = [
    { label: "立即报时", enabled: hatched, click: () => sendPetCommand(win, "announceTime") },
    { type: "separator" },
    { label: "报时间隔", submenu: clockIntervalSubmenu },
    { label: "报时格式", submenu: clockFormatSubmenu },
  ];

  const careThreshold = Number(care.alertThreshold || 50);
  const careThresholdSubmenu = CARE_THRESHOLD_MENU.map(([label, value]) => ({
    label,
    type: "radio",
    checked: careThreshold === value,
    click: () => sendPetCommand(win, "careThreshold", value),
  }));

  const ownerCallInterval = Number(ownerCall.intervalMs ?? 5 * 60 * 1000);
  const ownerCallIntervalSubmenu = OWNER_CALL_INTERVAL_MENU.map(([label, value]) => ({
    label,
    type: "radio",
    checked: ownerCallInterval === value,
    click: () => sendPetCommand(win, "ownerCallInterval", value),
  }));

  const relationshipSubmenu = [
    {
      label: hatched ? `宠物名字：${petName}` : "宠物名字：孵化后可设置",
      enabled: hatched,
      click: () => sendPetCommand(win, "promptPetName"),
    },
    {
      label: `主人称呼：${ownerName}`,
      click: () => sendPetCommand(win, "promptOwnerName"),
    },
    {
      label: hatched ? `品种：${speciesName}` : "品种：未孵化",
      enabled: false,
    },
    { type: "separator" },
    {
      label: "立即叫主人",
      enabled: hatched,
      click: () => sendPetCommand(win, "callOwner"),
    },
    {
      label: `呼唤间隔：${ownerCall.intervalLabel || "5 分钟"}`,
      submenu: ownerCallIntervalSubmenu,
    },
  ];

  const template = [
    {
      label: clickLabel,
      enabled: !hatching,
      click: () => sendPetCommand(win, clickCommand),
    },
  ];

  if (hatched) {
    template.push(
      { type: "separator" },
      { label: "喂食", click: () => sendPetCommand(win, "feed") },
      { label: "玩耍", click: () => sendPetCommand(win, "play") },
      { label: "探险", click: () => sendPetCommand(win, "explore") },
      { label: "跳舞", click: () => sendPetCommand(win, "dance") },
      { label: "睡觉", click: () => sendPetCommand(win, "sleep") },
      { label: "清洁", click: () => sendPetCommand(win, "clean") },
      { label: "我的心情", submenu: moodSubmenu },
      { label: "关系设置", submenu: relationshipSubmenu },
      { label: clockLabel, submenu: clockSubmenu },
      { label: `低状态提醒：${careThreshold}%`, submenu: careThresholdSubmenu },
      { type: "separator" },
      {
        label: `${petName} / ${ownerName} | 饱腹 ${stats.satiety ?? "-"} 快乐 ${stats.happiness ?? "-"} 能量 ${stats.energy ?? "-"}`,
        enabled: false,
      },
      { label: "重孵为蛋", click: () => sendPetCommand(win, "resetEgg") }
    );
  }

  if (!hatched) {
    template.push(
      { type: "separator" },
      {
        label: `主人称呼：${ownerName}`,
        submenu: [
        { label: `主人称呼：${ownerName}`, click: () => sendPetCommand(win, "promptOwnerName") },
        { label: "宠物名字：孵化后可设置", enabled: false },
        ],
      }
    );
  }

  template.push(
    { type: "separator" },
    { label: "提示：左键点击摸摸，拖动宠物移动", enabled: false },
    { type: "separator" },
    {
      label: alwaysOnTop ? "取消置顶" : "保持置顶",
      click: () => toggleAlwaysOnTop(win),
    },
    { label: "回到右下角", click: () => moveToCorner(win) },
    { type: "separator" },
    { label: "重新加载", click: () => win.reload() },
    { label: "退出宠物", click: () => app.quit() }
  );

  return template;
}

function sendPetCommand(win, command, value) {
  win.webContents.send("desktop-pet:command", { command, value });
}

function toggleAlwaysOnTop(win) {
  alwaysOnTop = !alwaysOnTop;
  win.setAlwaysOnTop(alwaysOnTop, "floating");
  win.webContents.send("pet-window:top-changed", alwaysOnTop);
}

function moveToCorner(win) {
  const { workArea } = screen.getPrimaryDisplay();
  const bounds = win.getBounds();
  win.setPosition(
    Math.max(workArea.x, workArea.x + workArea.width - bounds.width - 48),
    Math.max(workArea.y, workArea.y + workArea.height - bounds.height - 72)
  );
}
