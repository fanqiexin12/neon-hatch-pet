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

const CHECK_IN_INTERVAL_MENU = [
  ["关闭", 0],
  ["10 分钟", 10 * 60 * 1000],
  ["20 分钟", 20 * 60 * 1000],
  ["30 分钟", 30 * 60 * 1000],
  ["1 小时", 60 * 60 * 1000],
];

const TODO_MORNING_TIME_MENU = ["07:30", "08:00", "08:30", "09:00", "09:30", "10:00"];
const TODO_EVENING_TIME_MENU = ["20:00", "21:00", "21:30", "22:00", "23:00"];
const TODO_REMINDER_INTERVAL_MENU = [
  ["关闭", 0],
  ["1 小时", 60 * 60 * 1000],
  ["2 小时", 2 * 60 * 60 * 1000],
  ["3 小时", 3 * 60 * 60 * 1000],
];

function createPetWindow() {
  const { workArea } = screen.getPrimaryDisplay();
  const width = 280;
  const height = 384;

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
  const checkIn = menuState.checkIn || {};
  const todo = menuState.todo || {};
  const memory = menuState.memory || {};
  const growth = menuState.growth || {};
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

  const checkInInterval = Number(checkIn.intervalMs ?? 20 * 60 * 1000);
  const checkInIntervalSubmenu = CHECK_IN_INTERVAL_MENU.map(([label, value]) => ({
    label,
    type: "radio",
    checked: checkInInterval === value,
    click: () => sendPetCommand(win, "checkInInterval", value),
  }));
  const pendingChoiceLabel = checkIn.pendingReminder?.choiceKey
    ? ({
        work: "工作",
        read: "看书",
        study: "学习",
        fun: "娱乐",
        rest: "休息",
        idle: "发呆",
      })[checkIn.pendingReminder.choiceKey] || checkIn.pendingReminder.choiceKey
    : "";

  const companionSubmenu = [
    {
      label: "问我现在在干嘛",
      enabled: hatched,
      click: () => sendPetCommand(win, "startCheckIn"),
    },
    {
      label: `主动询问间隔：${checkIn.intervalLabel || "20 分钟"}`,
      submenu: checkInIntervalSubmenu,
    },
    {
      label: checkIn.pendingReminder
        ? `待提醒：${pendingChoiceLabel}`
        : "待提醒：无",
      enabled: false,
    },
  ];

  const todoMorningSubmenu = TODO_MORNING_TIME_MENU.map((value) => ({
    label: value,
    type: "radio",
    checked: (todo.morningTime || "09:00") === value,
    click: () => sendPetCommand(win, "todoMorningTime", value),
  }));
  const todoEveningSubmenu = TODO_EVENING_TIME_MENU.map((value) => ({
    label: value,
    type: "radio",
    checked: (todo.eveningTime || "21:30") === value,
    click: () => sendPetCommand(win, "todoEveningTime", value),
  }));
  const todoReminderInterval = Number(todo.reminderIntervalMs ?? 2 * 60 * 60 * 1000);
  const todoReminderSubmenu = TODO_REMINDER_INTERVAL_MENU.map(([label, value]) => ({
    label,
    type: "radio",
    checked: todoReminderInterval === value,
    click: () => sendPetCommand(win, "todoReminderInterval", value),
  }));
  const todoProgress = todo.progress || { done: 0, total: 0, percent: 0 };
  const todoSubmenu = [
    {
      label: "打开今日 ToDo",
      enabled: hatched,
      click: () => sendPetCommand(win, "openTodoPanel"),
    },
    {
      label: "反馈当前进度",
      enabled: hatched,
      click: () => sendPetCommand(win, "reviewTodo"),
    },
    {
      label: "立即总结",
      enabled: hatched,
      click: () => sendPetCommand(win, "summarizeTodo"),
    },
    {
      label: `今日进度：${todoProgress.done || 0}/${todoProgress.total || 0} (${todoProgress.percent || 0}%)`,
      enabled: false,
    },
    { type: "separator" },
    { label: `早上询问：${todo.morningTime || "09:00"}`, submenu: todoMorningSubmenu },
    { label: `白天追问：${todo.reminderIntervalLabel || "2 小时"}`, submenu: todoReminderSubmenu },
    { label: `晚上总结：${todo.eveningTime || "21:30"}`, submenu: todoEveningSubmenu },
  ];

  const dailyTasks = memory.daily?.tasks || [];
  const dailySubmenu = [
    {
      label: `今日进度：${memory.daily?.summary || "0/3"}`,
      enabled: false,
    },
    ...dailyTasks.map((task) => ({
      label: `${task.done ? "✓" : "□"} ${task.label}`,
      enabled: false,
    })),
    { type: "separator" },
    {
      label: "刷新今日任务",
      enabled: hatched,
      click: () => sendPetCommand(win, "refreshDailyTasks"),
    },
  ];

  const growthSubmenu = [
    {
      label: `等级：Lv.${growth.level || 1} ${growth.title || "初识伙伴"}`,
      enabled: false,
    },
    {
      label: growth.nextLevelAt
        ? `下一阶段：亲密度 ${growth.nextLevelAt}%`
        : "已达到最高亲密阶段",
      enabled: false,
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
      { label: "挠痒", click: () => sendPetCommand(win, "tickle") },
      { label: "喂零食", click: () => sendPetCommand(win, "snack") },
      { label: "躲猫猫", click: () => sendPetCommand(win, "hide") },
      { label: "合影", click: () => sendPetCommand(win, "photo") },
      { label: "聊聊", click: () => sendPetCommand(win, "talk") },
      { label: "我的心情", submenu: moodSubmenu },
      { label: "关系设置", submenu: relationshipSubmenu },
      { label: "陪伴询问", submenu: companionSubmenu },
      { label: "今日 ToDo", submenu: todoSubmenu },
      { label: "日常任务", submenu: dailySubmenu },
      { label: `亲密成长：Lv.${growth.level || 1}`, submenu: growthSubmenu },
      { label: clockLabel, submenu: clockSubmenu },
      { label: `低状态提醒：${careThreshold}%`, submenu: careThresholdSubmenu },
      { type: "separator" },
      {
        label: `${petName} / ${ownerName} | 饱腹 ${stats.satiety ?? "-"} 快乐 ${stats.happiness ?? "-"} 能量 ${stats.energy ?? "-"} | 日常 ${memory.daily?.summary || "0/3"}`,
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
