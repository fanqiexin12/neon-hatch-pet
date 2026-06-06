const STORAGE_KEY = "neon-hatch-desktop-v2";
const LEGACY_STORAGE_KEYS = ["neon-hatch-desktop-v1"];
const canvas = document.getElementById("desktopPetCanvas");
const ctx = canvas.getContext("2d");

const ui = {
  shell: document.getElementById("petShell"),
  status: document.getElementById("desktopStatus"),
  nameEditor: document.getElementById("nameEditor"),
  nameEditorLabel: document.getElementById("nameEditorLabel"),
  nameEditorInput: document.getElementById("nameEditorInput"),
  nameEditorCancel: document.getElementById("nameEditorCancel"),
  activityPrompt: document.getElementById("activityPrompt"),
  activityPromptTitle: document.getElementById("activityPromptTitle"),
  activityPromptBody: document.getElementById("activityPromptBody"),
  activityPromptOptions: document.getElementById("activityPromptOptions"),
  activityPromptClose: document.getElementById("activityPromptClose"),
};

const PETS = [
  {
    id: "byte-cat",
    name: "字节猫",
    personality: "敏锐又傲娇",
    colors: ["#61fff4", "#132d44", "#ff35d4", "#ffe66a"],
    ears: "point",
    tail: "curl",
  },
  {
    id: "neon-pup",
    name: "霓虹犬",
    personality: "热情且守护欲强",
    colors: ["#ffe66a", "#2c194b", "#61fff4", "#ff6a7a"],
    ears: "flop",
    tail: "bolt",
  },
  {
    id: "glitch-fox",
    name: "故障狐",
    personality: "安静、聪明、会说冷静的话",
    colors: ["#ff35d4", "#190f2d", "#61fff4", "#82ff8f"],
    ears: "point",
    tail: "double",
  },
  {
    id: "volt-bun",
    name: "伏特兔",
    personality: "轻快、好奇、擅长鼓励",
    colors: ["#82ff8f", "#102717", "#ff35d4", "#ffe66a"],
    ears: "long",
    tail: "round",
  },
];

const EXPLORE_EVENTS = [
  "在屏幕边缘发现一枚发光缓存，信用点 +6。",
  "巡视了菜单栏下方的信号风，快乐 +8。",
  "从窗口阴影里拖回一颗数据糖，能量 +8。",
  "蹭了蹭你的桌面角落，羁绊 +7。",
];

const AUTO_ACTIONS = [
  {
    kind: "look",
    durationMs: 1700,
    action: "环顾",
    message: "左右扫描了一下桌面边缘。",
    particle: "spark",
    count: 3,
    x: 166,
    y: 76,
    color: "#61fff4",
  },
  {
    kind: "hop",
    durationMs: 1500,
    action: "小跳",
    message: "原地弹跳了一下，像刷新完心情缓存。",
    particle: "spark",
    count: 4,
    x: 120,
    y: 142,
    color: "#ffe66a",
  },
  {
    kind: "wave",
    durationMs: 1900,
    action: "挥手",
    message: "朝你挥了挥小爪子。",
    particle: "heart",
    count: 3,
    x: 82,
    y: 76,
    color: "#ff35d4",
  },
  {
    kind: "stretch",
    durationMs: 1800,
    action: "伸展",
    message: "伸了个懒腰，像素边缘舒展开了。",
    particle: "spark",
    count: 3,
    x: 120,
    y: 96,
    color: "#82ff8f",
  },
  {
    kind: "wiggle",
    durationMs: 1600,
    action: "摇摆",
    message: "尾巴同步了一个小小霓虹节拍。",
    particle: "note",
    count: 4,
    x: 152,
    y: 70,
    color: "#82ff8f",
  },
];

const MOOD_CHOICES = {
  happy: {
    action: "开心",
    activity: "celebrate",
    durationMs: 2300,
    stats: { happiness: 12, bond: 5, energy: -4 },
    particle: "note",
    count: 8,
    x: 146,
    y: 72,
    color: "#82ff8f",
    message: "接住了你的开心，尾巴开始同步闪烁。",
    messages: [
      "接住了你的开心，尾巴开始同步闪烁。今天这格缓存很亮。",
      "开心信号收到，我把它放进能量槽。我们可以庆祝三秒。",
      "你的开心让我也亮起来了，先把这一刻保存成高亮记录。",
    ],
  },
  sad: {
    action: "陪伴",
    activity: "comfortSad",
    durationMs: 2400,
    stats: { happiness: 9, bond: 12, energy: 2 },
    particle: "heart",
    count: 8,
    x: 122,
    y: 74,
    color: "#ff35d4",
    message: "贴近屏幕：难过不用马上变好，我陪你待一会儿。",
    messages: [
      "难过不用马上变好。我贴近一点，陪你把这阵信号慢慢放低。",
      "我把陪伴模式打开了。你可以先不解释，只要待在这里就好。",
      "收到低落心情。我会守在桌面边缘，先陪你过这一分钟。",
    ],
  },
  anxious: {
    action: "稳定",
    activity: "breathe",
    durationMs: 2300,
    stats: { happiness: 7, bond: 9, energy: 4 },
    particle: "spark",
    count: 6,
    x: 122,
    y: 84,
    color: "#61fff4",
    message: "启动稳定模式：先呼吸，再选最小的一步。",
    messages: [
      "稳定模式启动：先呼吸，再选最小的一步。不要一次处理整个世界。",
      "焦虑信号有点高。我帮你切成小块，先完成眼前这一格。",
      "我在这里同步慢速闪烁。先把注意力放回呼吸，再行动。",
    ],
  },
  tired: {
    action: "充电",
    activity: "sleep",
    durationMs: 3000,
    stats: { happiness: 4, bond: 5, energy: 16, satiety: -3 },
    particle: "sleep",
    count: 6,
    x: 158,
    y: 58,
    color: "#61fff4",
    message: "把你安排进低功耗模式：休息也是任务进度。",
    messages: [
      "低功耗模式已开启。休息不是掉队，是给系统续航。",
      "你看起来需要充电。我先安静一点，陪你把能量慢慢补回来。",
      "收到疲惫信号。今天可以少一点硬撑，多一点恢复。",
    ],
  },
  angry: {
    action: "降温",
    activity: "vent",
    durationMs: 1900,
    stats: { happiness: 6, bond: 8, energy: -3 },
    particle: "spark",
    count: 7,
    x: 118,
    y: 128,
    color: "#ff35d4",
    message: "陪你把火气弹出去一点，然后再慢慢降温。",
    messages: [
      "火气很真实，不用假装没事。先弹出去一点，再决定怎么回应。",
      "我陪你降温：先别急着输出，等情绪峰值过去再处理。",
      "检测到高温情绪。我把冷却风扇开大一点，先保护你。",
    ],
  },
  bored: {
    action: "找乐子",
    activity: "play",
    durationMs: 2200,
    stats: { happiness: 13, bond: 5, energy: -7 },
    particle: "spark",
    count: 7,
    x: 160,
    y: 96,
    color: "#ffe66a",
    message: "扔出一个霓虹光点：无聊缓存开始清理。",
    messages: [
      "无聊缓存开始清理。我扔一个小光点，你负责把注意力捡回来。",
      "我们给桌面加一点随机性。先玩一下，再回来做正事。",
      "收到无聊信号。我切换成找乐子模式，给你一点小刺激。",
    ],
  },
  lonely: {
    action: "贴贴",
    activity: "hug",
    durationMs: 2200,
    stats: { happiness: 10, bond: 14, energy: 1 },
    particle: "heart",
    count: 10,
    x: 120,
    y: 70,
    color: "#ff35d4",
    message: "靠近了一点：你不是一个人在这个桌面上。",
    messages: [
      "我靠近一点。你不是一个人在这个桌面上，我会在这里陪着。",
      "孤单信号收到。我把陪伴亮度调高一点，别急着把自己关起来。",
      "贴贴模式启动。就算只是安静地待着，也算我们在一起。",
    ],
  },
  excited: {
    action: "兴奋",
    activity: "sparkRush",
    durationMs: 2300,
    stats: { happiness: 11, bond: 7, energy: -5, coins: 2 },
    particle: "note",
    count: 9,
    x: 152,
    y: 70,
    color: "#82ff8f",
    message: "收到高能信号，顺手给你蹦出 2 C。",
    messages: [
      "高能信号爆表！我跟着跳一下，顺手给你蹦出 2 C。",
      "你的兴奋把我的像素都点亮了。记得把灵感先抓住。",
      "冲劲来了。我们先把这股能量存档，再挑一个方向推进。",
    ],
  },
  calm: {
    action: "平静",
    activity: "breathe",
    durationMs: 2200,
    stats: { happiness: 6, bond: 7, energy: 5 },
    particle: "spark",
    count: 4,
    x: 120,
    y: 94,
    color: "#82ff8f",
    message: "把呼吸调成柔和频率，今天可以慢慢来。",
    messages: [
      "平静信号很好。我把呼吸调成柔和频率，今天可以慢慢来。",
      "现在的节奏很适合整理思路。我陪你保持这个稳定频率。",
      "安静缓存已保存。我们不用急，稳稳地走下一步。",
    ],
  },
  stressed: {
    action: "减压",
    activity: "focus",
    durationMs: 2500,
    stats: { happiness: 8, bond: 10, energy: 3 },
    particle: "heart",
    count: 6,
    x: 126,
    y: 78,
    color: "#61fff4",
    message: "帮你把压力拆小：先处理眼前这一格。",
    messages: [
      "压力太大时，先别看全局。我帮你拆小：只处理眼前这一格。",
      "减压协议启动。把任务缩到能开始的大小，先做三分钟。",
      "我把压力条切成小段了。你不用一次扛完，先动一个按钮。",
    ],
  },
};

const CLOCK_FORMATS = {
  hm24: {
    label: "24小时 HH:mm",
    format(date) {
      return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
    },
    visual(date) {
      return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
    },
  },
  hms24: {
    label: "带秒 HH:mm:ss",
    format(date) {
      return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
    },
    visual(date) {
      return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
    },
  },
  zh: {
    label: "中文口语",
    format(date) {
      return `现在是 ${date.getHours()} 点 ${pad2(date.getMinutes())} 分`;
    },
    visual(date) {
      return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
    },
  },
  dateTime: {
    label: "日期 + 时间",
    format(date) {
      return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
    },
    visual(date) {
      return `${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
    },
  },
};

const CLOCK_INTERVALS = [
  { label: "关闭", value: 0 },
  { label: "5 分钟", value: 5 * 60 * 1000 },
  { label: "15 分钟", value: 15 * 60 * 1000 },
  { label: "30 分钟", value: 30 * 60 * 1000 },
  { label: "1 小时", value: 60 * 60 * 1000 },
  { label: "2 小时", value: 2 * 60 * 60 * 1000 },
];

const CARE_THRESHOLDS = [30, 40, 50, 60, 70];

const STATUS_STATS = [
  { key: "satiety", label: "饱腹", color: "#ffe66a", action: "喂食" },
  { key: "happiness", label: "快乐", color: "#ff35d4", action: "玩耍" },
  { key: "energy", label: "能量", color: "#61fff4", action: "睡觉" },
];

const CARE_ALERTS = {
  satiety: {
    action: "喂食",
    activity: "alertHungry",
    color: "#ffe66a",
    message(value) {
      return `饱腹只有 ${Math.round(value)}%，我需要喂食。`;
    },
  },
  happiness: {
    action: "玩耍",
    activity: "alertPlay",
    color: "#ff35d4",
    message(value) {
      return `快乐只有 ${Math.round(value)}%，陪我玩一下吧。`;
    },
  },
  energy: {
    action: "睡觉",
    activity: "alertSleep",
    color: "#61fff4",
    message(value) {
      return `能量只有 ${Math.round(value)}%，我想睡一会儿。`;
    },
  },
};

const DEFAULT_OWNER_NAME = "主人";
const DEFAULT_OWNER_CALL_INTERVAL_MS = 5 * 60 * 1000;

const OWNER_CALL_INTERVALS = [
  { label: "关闭", value: 0 },
  { label: "2 分钟", value: 2 * 60 * 1000 },
  { label: "5 分钟", value: 5 * 60 * 1000 },
  { label: "10 分钟", value: 10 * 60 * 1000 },
  { label: "30 分钟", value: 30 * 60 * 1000 },
];

const OWNER_CALLS = [
  "{owner}，我在这里守着桌面。",
  "{owner}，记得喝水，我的小雷达刚刚闪了一下。",
  "{owner}，我刚才巡逻了一圈，一切正常。",
  "{owner}，要不要摸摸我一下？我的像素耳朵在线。",
  "{owner}，我有点想你，所以叫你一声。",
  "{owner}，工作别太久，我可以陪你休息三分钟。",
  "{owner}，今天也请把我放在桌面边缘。",
];

const DEFAULT_CHECK_IN_INTERVAL_MS = 20 * 60 * 1000;

const CHECK_IN_INTERVALS = [
  { label: "关闭", value: 0 },
  { label: "10 分钟", value: 10 * 60 * 1000 },
  { label: "20 分钟", value: 20 * 60 * 1000 },
  { label: "30 分钟", value: 30 * 60 * 1000 },
  { label: "1 小时", value: 60 * 60 * 1000 },
];

const DAY_PERIODS = [
  { key: "morning", label: "上午", start: 5, end: 10, greeting: "上午好", nudge: "这一段很适合进入稳定节奏。" },
  { key: "noon", label: "中午", start: 11, end: 13, greeting: "中午好", nudge: "别忘了吃饭和放松眼睛。" },
  { key: "afternoon", label: "下午", start: 14, end: 17, greeting: "下午好", nudge: "下午的能量要分配得聪明一点。" },
  { key: "evening", label: "晚上", start: 18, end: 22, greeting: "晚上好", nudge: "晚上适合收尾，也适合奖励自己。" },
  { key: "night", label: "夜里", start: 23, end: 4, greeting: "夜深了", nudge: "如果还在忙，记得把休息也放进计划。" },
];

const CHECK_IN_CHOICES = {
  work: {
    label: "工作",
    activity: "workBuddy",
    action: "陪工作",
    color: "#61fff4",
    particle: "spark",
    stats: { happiness: 4, bond: 5, energy: -3 },
    reminderMs: 25 * 60 * 1000,
    feedback(period) {
      return `${period.label}工作模式收到。我会在旁边帮你守节奏，先专注一小段。`;
    },
    reminder() {
      return "工作已经跑了一段时间，站起来伸展一下，眼睛也休息 20 秒。";
    },
  },
  read: {
    label: "看书",
    activity: "readBuddy",
    action: "陪看书",
    color: "#ffe66a",
    particle: "spark",
    stats: { happiness: 5, bond: 6, energy: -2 },
    reminderMs: 30 * 60 * 1000,
    feedback(period) {
      return `${period.label}看书很不错。我把翻页节拍调慢一点，陪你读进去。`;
    },
    reminder() {
      return "读了一会儿啦，抬头看看远处，再回来继续会更稳。";
    },
  },
  study: {
    label: "学习",
    activity: "studyBuddy",
    action: "陪学习",
    color: "#82ff8f",
    particle: "spark",
    stats: { happiness: 6, bond: 7, energy: -4 },
    reminderMs: 25 * 60 * 1000,
    feedback(period) {
      return `${period.label}学习模式开启。先抓一个小知识点，不用一次吞掉整章。`;
    },
    reminder() {
      return "学习计时到一格了。整理一下刚才的重点，再继续下一小段。";
    },
  },
  fun: {
    label: "娱乐",
    activity: "funBuddy",
    action: "陪放松",
    color: "#ff35d4",
    particle: "note",
    stats: { happiness: 11, bond: 4, energy: -2 },
    reminderMs: 20 * 60 * 1000,
    feedback(period) {
      return `${period.label}娱乐许可通过。放松也要认真享受，我给你点亮小灯。`;
    },
    reminder() {
      return "娱乐时间跑了一会儿，要不要喝口水，顺便看看还想继续多久？";
    },
  },
  rest: {
    label: "休息",
    activity: "restBuddy",
    action: "陪休息",
    color: "#61fff4",
    particle: "sleep",
    stats: { happiness: 4, bond: 6, energy: 9 },
    reminderMs: 12 * 60 * 1000,
    feedback(period) {
      return `${period.label}休息模式收到。你休息，我守着桌面边缘。`;
    },
    reminder() {
      return "休息也完成一小格了。慢慢回来，别一下子猛冲。";
    },
  },
  idle: {
    label: "发呆",
    activity: "idleBuddy",
    action: "陪发呆",
    color: "#ffe66a",
    particle: "heart",
    stats: { happiness: 5, bond: 8, energy: 2 },
    reminderMs: 10 * 60 * 1000,
    feedback(period) {
      return `${period.label}发呆也算重启缓存。我陪你安静待一会儿。`;
    },
    reminder() {
      return "发呆缓存刷新完一轮了。现在想继续放空，还是换个小动作？";
    },
  },
};

function pad2(value) {
  return String(value).padStart(2, "0");
}

function randomAutoDelay() {
  return 2400 + Math.random() * 4200;
}

function randomOwnerCallDelay(intervalMs = DEFAULT_OWNER_CALL_INTERVAL_MS) {
  const interval = Number(intervalMs);
  if (interval <= 0) return 0;
  return interval * (0.75 + Math.random() * 0.5);
}

function randomCheckInDelay(intervalMs = DEFAULT_CHECK_IN_INTERVAL_MS) {
  const interval = Number(intervalMs);
  if (interval <= 0) return 0;
  return interval * (0.7 + Math.random() * 0.6);
}

function getDayPeriod(date = new Date()) {
  const hour = date.getHours();
  return DAY_PERIODS.find((period) => {
    if (period.start <= period.end) return hour >= period.start && hour <= period.end;
    return hour >= period.start || hour <= period.end;
  }) || DAY_PERIODS[0];
}

function defaultState() {
  return {
    mode: "egg",
    hatchMs: 0,
    pet: null,
    message: "我还是一颗蛋。点击我，或者右键菜单孵化。",
    stats: {
      satiety: 60,
      happiness: 62,
      energy: 72,
      bond: 10,
      coins: 18,
      clean: 70,
    },
    activity: {
      kind: "idle",
      timeLeftMs: 0,
      durationMs: 0,
    },
    clock: {
      intervalMs: 0,
      format: "hm24",
      nextInMs: 0,
      lastText: "",
      lastVisual: "",
    },
    care: {
      alertThreshold: 50,
      alertCooldownMs: 0,
      lastAlert: "",
    },
    identity: {
      petName: "",
      ownerName: DEFAULT_OWNER_NAME,
    },
    ownerCall: {
      intervalMs: DEFAULT_OWNER_CALL_INTERVAL_MS,
      nextInMs: randomOwnerCallDelay(DEFAULT_OWNER_CALL_INTERVAL_MS),
      lastText: "",
    },
    checkIn: {
      intervalMs: DEFAULT_CHECK_IN_INTERVAL_MS,
      nextInMs: randomCheckInDelay(DEFAULT_CHECK_IN_INTERVAL_MS),
      promptTimeLeftMs: 0,
      promptPeriod: "",
      pendingReminder: null,
      lastChoice: "",
      lastText: "",
    },
    feedback: {
      title: "",
      text: "",
      timeLeftMs: 0,
      durationMs: 0,
      variant: "speech",
    },
    nextAutoActionMs: randomAutoDelay(),
    animationMs: 0,
    lastAction: "待机",
  };
}

let state = loadState();
let lastFrame = performance.now();
let dragStart = null;
let particles = [];
let hoverState = {
  over: false,
  stillMs: 0,
  show: false,
  x: 0,
  y: 0,
};
let nameEditorState = {
  kind: "",
};
let activityPromptState = {
  open: false,
  periodKey: "",
};
let mouseGestureState = {
  points: [],
  cooldownMs: 0,
  lastGesture: "",
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
      return defaultState();
    }
    const parsed = JSON.parse(raw);
    return {
      ...defaultState(),
      ...parsed,
      stats: { ...defaultState().stats, ...(parsed.stats || {}) },
      activity: { ...defaultState().activity, ...(parsed.activity || {}), kind: "idle", timeLeftMs: 0 },
      clock: normalizeClock(parsed.clock),
      care: normalizeCare(parsed.care),
      identity: normalizeIdentity(parsed.identity),
      ownerCall: normalizeOwnerCall(parsed.ownerCall),
      checkIn: normalizeCheckIn(parsed.checkIn),
      feedback: defaultState().feedback,
      nextAutoActionMs: randomAutoDelay(),
    };
  } catch {
    return defaultState();
  }
}

function normalizeClock(clock = {}) {
  const defaults = defaultState().clock;
  const format = CLOCK_FORMATS[clock.format] ? clock.format : defaults.format;
  const interval = CLOCK_INTERVALS.some((item) => item.value === Number(clock.intervalMs))
    ? Number(clock.intervalMs)
    : defaults.intervalMs;

  return {
    ...defaults,
    ...clock,
    format,
    intervalMs: interval,
    nextInMs: interval > 0 ? interval : 0,
    lastText: clock.lastText || "",
    lastVisual: clock.lastVisual || "",
  };
}

function normalizeCare(care = {}) {
  const defaults = defaultState().care;
  const threshold = Number(care.alertThreshold);
  return {
    ...defaults,
    ...care,
    alertThreshold: CARE_THRESHOLDS.includes(threshold) ? threshold : defaults.alertThreshold,
    alertCooldownMs: 0,
    lastAlert: care.lastAlert || "",
  };
}

function sanitizeName(value, fallback = "") {
  const normalized = String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12);
  return normalized || fallback;
}

function normalizeIdentity(identity = {}) {
  const defaults = defaultState().identity;
  return {
    petName: sanitizeName(identity.petName, defaults.petName),
    ownerName: sanitizeName(identity.ownerName, defaults.ownerName),
  };
}

function normalizeOwnerCall(ownerCall = {}) {
  const defaults = defaultState().ownerCall;
  const interval = OWNER_CALL_INTERVALS.some((item) => item.value === Number(ownerCall.intervalMs))
    ? Number(ownerCall.intervalMs)
    : defaults.intervalMs;

  return {
    ...defaults,
    ...ownerCall,
    intervalMs: interval,
    nextInMs: randomOwnerCallDelay(interval),
    lastText: ownerCall.lastText || "",
  };
}

function normalizeCheckIn(checkIn = {}) {
  const defaults = defaultState().checkIn;
  const interval = CHECK_IN_INTERVALS.some((item) => item.value === Number(checkIn.intervalMs))
    ? Number(checkIn.intervalMs)
    : defaults.intervalMs;

  return {
    ...defaults,
    ...checkIn,
    intervalMs: interval,
    nextInMs: randomCheckInDelay(interval),
    promptTimeLeftMs: 0,
    promptPeriod: "",
    pendingReminder: normalizeCheckInReminder(checkIn.pendingReminder),
    lastChoice: checkIn.lastChoice || "",
    lastText: checkIn.lastText || "",
  };
}

function normalizeCheckInReminder(reminder) {
  if (!reminder || !CHECK_IN_CHOICES[reminder.choiceKey]) return null;
  return {
    choiceKey: reminder.choiceKey,
    timeLeftMs: Math.max(0, Number(reminder.timeLeftMs) || 0),
    text: reminder.text || "",
  };
}

function saveState() {
  const snapshot = {
    mode: state.mode,
    hatchMs: state.hatchMs,
    pet: state.pet,
    message: state.message,
    stats: state.stats,
    activity: { kind: "idle", timeLeftMs: 0, durationMs: 0 },
    clock: {
      intervalMs: state.clock.intervalMs,
      format: state.clock.format,
      lastText: state.clock.lastText,
      lastVisual: state.clock.lastVisual,
    },
    care: {
      alertThreshold: state.care.alertThreshold,
      lastAlert: state.care.lastAlert,
    },
    identity: {
      petName: state.identity.petName,
      ownerName: state.identity.ownerName,
    },
    ownerCall: {
      intervalMs: state.ownerCall.intervalMs,
      lastText: state.ownerCall.lastText,
    },
    checkIn: {
      intervalMs: state.checkIn.intervalMs,
      pendingReminder: state.checkIn.pendingReminder,
      lastChoice: state.checkIn.lastChoice,
      lastText: state.checkIn.lastText,
    },
    lastAction: state.lastAction,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function px(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function say(message, action = state.lastAction) {
  state.message = message;
  state.lastAction = action;
  renderDom();
  saveState();
}

function ownerTitle() {
  return sanitizeName(state.identity?.ownerName, DEFAULT_OWNER_NAME);
}

function addressOwner(message) {
  return `${ownerTitle()}，${message}`;
}

function pickOne(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function showFeedback(text, title = "反馈", durationMs = 4600, variant = "speech") {
  state.feedback = {
    title,
    text,
    durationMs,
    timeLeftMs: durationMs,
    variant,
  };
}

function setActivity(kind, durationMs = 1800) {
  state.activity = {
    kind,
    durationMs,
    timeLeftMs: durationMs,
  };
  state.nextAutoActionMs = randomAutoDelay();
}

function addParticle(kind, x, y, color = "#ffe66a", lifeMs = 1200) {
  particles.push({
    kind,
    x,
    y,
    color,
    lifeMs,
    maxLifeMs: lifeMs,
    vx: (Math.random() - 0.5) * 0.04,
    vy: -0.035 - Math.random() * 0.035,
    phase: Math.random() * Math.PI * 2,
  });
  particles = particles.slice(-36);
}

function burst(kind, count, x, y, color) {
  for (let i = 0; i < count; i += 1) {
    addParticle(kind, x + (Math.random() - 0.5) * 34, y + (Math.random() - 0.5) * 18, color);
  }
}

function pickPet() {
  return PETS[Math.floor(Math.random() * PETS.length)];
}

function displayName() {
  return state.identity?.petName || state.pet?.name || "未孵化";
}

function speciesName() {
  return state.pet?.name || "未孵化";
}

function resetToEgg(message = "已经回到初始蛋。再点一次孵化，会随机出生一只新宠物。") {
  const previousIdentity = normalizeIdentity(state.identity);
  const previousOwnerCall = normalizeOwnerCall(state.ownerCall);
  const previousCheckIn = normalizeCheckIn(state.checkIn);
  state = defaultState();
  state.identity.ownerName = previousIdentity.ownerName;
  state.identity.petName = "";
  state.ownerCall.intervalMs = previousOwnerCall.intervalMs;
  state.ownerCall.nextInMs = randomOwnerCallDelay(previousOwnerCall.intervalMs);
  state.ownerCall.lastText = previousOwnerCall.lastText;
  state.checkIn.intervalMs = previousCheckIn.intervalMs;
  state.checkIn.nextInMs = randomCheckInDelay(previousCheckIn.intervalMs);
  state.checkIn.pendingReminder = null;
  state.checkIn.lastChoice = previousCheckIn.lastChoice;
  state.checkIn.lastText = previousCheckIn.lastText;
  state.message = message;
  state.lastAction = "等待孵化";
  particles = [];
  localStorage.removeItem(STORAGE_KEY);
  saveState();
  renderDom();
  render();
}

function hatchPet() {
  if (state.mode === "hatched") {
    resetToEgg();
    return;
  }
  state.mode = "hatching";
  state.hatchMs = 3600;
  state.pet = null;
  state.nextAutoActionMs = randomAutoDelay();
  say("孵化舱启动。别关窗口，我马上出来。", "孵化中");
}

function finishHatch() {
  const pet = pickPet();
  state.mode = "hatched";
  state.pet = pet;
  state.stats = {
    satiety: 64,
    happiness: 70,
    energy: 76,
    bond: 16,
    coins: 24,
    clean: 76,
  };
  state.nextAutoActionMs = randomAutoDelay();
  state.ownerCall.nextInMs = randomOwnerCallDelay(state.ownerCall.intervalMs);
  state.checkIn.nextInMs = randomCheckInDelay(state.checkIn.intervalMs);
  setActivity("happy", 2200);
  burst("spark", 8, 120, 70, "#ffe66a");
  say(`${pet.name} 入驻桌面：${pet.personality}。${ownerTitle()}，可以给我取个名字。`, "已入驻");
}

function requirePet(action) {
  if (state.mode !== "hatched") {
    say(`${action}要等孵化完成。`, "等待");
    return false;
  }
  return true;
}

function feedPet() {
  if (!requirePet("喂食")) return;
  state.stats.satiety = clamp(state.stats.satiety + 18);
  state.stats.energy = clamp(state.stats.energy + 4);
  state.stats.happiness = clamp(state.stats.happiness + 3);
  state.stats.coins = clamp(state.stats.coins + 2, 0, 999);
  state.stats.clean = clamp(state.stats.clean - 3);
  setActivity("eat", 1800);
  burst("food", 5, 92, 108, "#ffe66a");
  say(addressOwner(`${displayName()} 吃掉一块小小能量饼，顺手吐出 2 C。`), "喂食");
}

function playPet() {
  if (!requirePet("玩耍")) return;
  if (state.stats.energy < 10) {
    say(addressOwner(`${displayName()} 眨了眨眼：低电量，想先休息。`), "低电量");
    return;
  }
  state.stats.happiness = clamp(state.stats.happiness + 16);
  state.stats.bond = clamp(state.stats.bond + 5);
  state.stats.energy = clamp(state.stats.energy - 10);
  state.stats.satiety = clamp(state.stats.satiety - 5);
  state.stats.clean = clamp(state.stats.clean - 5);
  setActivity("play", 2200);
  burst("spark", 7, 160, 96, "#ff35d4");
  say(addressOwner(`${displayName()} 在桌面上追了一圈霓虹光点。`), "玩耍");
}

function explorePet() {
  if (!requirePet("探险")) return;
  if (state.stats.energy < 12) {
    say(addressOwner(`${displayName()} 探险前需要充点电。`), "低电量");
    return;
  }
  const event = EXPLORE_EVENTS[Math.floor(Math.random() * EXPLORE_EVENTS.length)];
  state.stats.energy = clamp(state.stats.energy - 12);
  state.stats.satiety = clamp(state.stats.satiety - 6);
  state.stats.happiness = clamp(state.stats.happiness + 8);
  state.stats.bond = clamp(state.stats.bond + 5);
  state.stats.coins = clamp(state.stats.coins + 6, 0, 999);
  state.stats.clean = clamp(state.stats.clean - 8);
  setActivity("explore", 2400);
  burst("spark", 6, 172, 72, "#61fff4");
  say(addressOwner(`${displayName()} ${event}`), "探险");
}

function petPet() {
  if (!requirePet("摸摸")) return;
  state.stats.happiness = clamp(state.stats.happiness + 7);
  state.stats.bond = clamp(state.stats.bond + 9);
  setActivity("pet", 1700);
  burst("heart", 8, 122, 70, "#ff35d4");
  say(addressOwner(`${displayName()} 被摸摸以后，贴着桌面蹭了一下。`), "摸摸");
}

function dancePet() {
  if (!requirePet("跳舞")) return;
  if (state.stats.energy < 14) {
    say(addressOwner(`${displayName()} 想跳舞，但电量还不够。`), "低电量");
    return;
  }
  state.stats.energy = clamp(state.stats.energy - 14);
  state.stats.happiness = clamp(state.stats.happiness + 22);
  state.stats.bond = clamp(state.stats.bond + 6);
  state.stats.coins = clamp(state.stats.coins + 4, 0, 999);
  state.stats.clean = clamp(state.stats.clean - 4);
  setActivity("dance", 2800);
  burst("note", 10, 142, 72, "#82ff8f");
  say(addressOwner(`${displayName()} 播放一段赛博节拍，跳得像小小霓虹灯。`), "跳舞");
}

function sleepPet() {
  if (!requirePet("睡觉")) return;
  state.stats.energy = clamp(state.stats.energy + 28);
  state.stats.happiness = clamp(state.stats.happiness + 4);
  state.stats.satiety = clamp(state.stats.satiety - 4);
  setActivity("sleep", 3200);
  burst("sleep", 5, 158, 58, "#61fff4");
  say(addressOwner(`${displayName()} 进入桌面小睡，呼吸频率变得很稳。`), "睡觉");
}

function cleanPet() {
  if (!requirePet("清洁")) return;
  state.stats.clean = clamp(state.stats.clean + 30);
  state.stats.happiness = clamp(state.stats.happiness + 6);
  state.stats.bond = clamp(state.stats.bond + 3);
  setActivity("clean", 2100);
  burst("bubble", 10, 120, 110, "#61fff4");
  say(addressOwner(`${displayName()} 的像素边缘被擦得亮晶晶。`), "清洁");
}

function setPetName(value) {
  if (!requirePet("命名")) return false;
  const name = sanitizeName(value);
  state.identity.petName = name;
  const message = name
    ? `${ownerTitle()}，我以后就叫 ${name} 啦。`
    : `${ownerTitle()}，我恢复默认名字 ${speciesName()} 啦。`;
  setActivity("wave", 1800);
  burst("heart", 6, 120, 72, "#ff35d4");
  showFeedback(message, "宠物命名", 4600, "name");
  say(message, "宠物命名");
  return true;
}

function setOwnerName(value) {
  state.identity.ownerName = sanitizeName(value, DEFAULT_OWNER_NAME);
  const message = `收到，我以后会叫你 ${ownerTitle()}。`;
  setActivity(state.mode === "hatched" ? "hug" : "idle", 1900);
  if (state.mode === "hatched") {
    burst("heart", 6, 120, 72, "#ff35d4");
  }
  showFeedback(message, "主人称呼", 4600, "name");
  say(state.mode === "hatched" ? `${displayName()} ${message}` : message, "主人称呼");
  return true;
}

function openNameEditor(kind) {
  if (!ui.nameEditor || !ui.nameEditorInput || !ui.nameEditorLabel) {
    say("名称输入面板没有加载成功。", "命名");
    return false;
  }
  if (kind === "pet" && !requirePet("命名")) return false;

  nameEditorState.kind = kind;
  hoverState.show = false;
  hoverState.stillMs = 0;
  const isPet = kind === "pet";
  ui.nameEditorLabel.textContent = isPet
    ? "给宠物取名（留空恢复默认）"
    : "设置主人称呼";
  ui.nameEditorInput.value = isPet ? state.identity.petName : ownerTitle();
  ui.nameEditor.classList.remove("is-hidden");
  ui.nameEditor.setAttribute("aria-hidden", "false");

  requestAnimationFrame(() => {
    ui.nameEditorInput.focus();
    ui.nameEditorInput.select();
  });
  return true;
}

function closeNameEditor() {
  nameEditorState.kind = "";
  if (!ui.nameEditor) return;
  ui.nameEditor.classList.add("is-hidden");
  ui.nameEditor.setAttribute("aria-hidden", "true");
}

function submitNameEditor() {
  const value = ui.nameEditorInput?.value ?? "";
  const kind = nameEditorState.kind;
  closeNameEditor();
  if (kind === "pet") return setPetName(value);
  if (kind === "owner") return setOwnerName(value);
  return false;
}

function promptPetName() {
  return openNameEditor("pet");
}

function promptOwnerName() {
  return openNameEditor("owner");
}

function applyStatChanges(changes) {
  Object.entries(changes).forEach(([key, delta]) => {
    const max = key === "coins" ? 999 : 100;
    state.stats[key] = clamp((state.stats[key] ?? 0) + delta, 0, max);
  });
}

function respondMood(moodKey) {
  if (!requirePet("心情回应")) return;
  const mood = MOOD_CHOICES[moodKey];
  if (!mood) {
    say("选一个心情按钮，我会马上回应你。", "等待选择");
    return;
  }

  applyStatChanges(mood.stats);
  setActivity(mood.activity, mood.durationMs);
  burst(mood.particle, mood.count, mood.x, mood.y, mood.color);
  const feedback = pickOne(mood.messages || [mood.message]);
  const addressed = addressOwner(feedback);
  showFeedback(addressed, mood.action, 5600, "mood");
  say(`${displayName()} ${addressed}`, mood.action);
}

function formatClock(date = new Date()) {
  const formatter = CLOCK_FORMATS[state.clock.format] || CLOCK_FORMATS.hm24;
  return {
    text: formatter.format(date),
    visual: formatter.visual(date),
    label: formatter.label,
  };
}

function clockIntervalLabel(intervalMs = state.clock.intervalMs) {
  return CLOCK_INTERVALS.find((item) => item.value === intervalMs)?.label || "自定义";
}

function ownerCallIntervalLabel(intervalMs = state.ownerCall.intervalMs) {
  return OWNER_CALL_INTERVALS.find((item) => item.value === intervalMs)?.label || "自定义";
}

function checkInIntervalLabel(intervalMs = state.checkIn.intervalMs) {
  return CHECK_IN_INTERVALS.find((item) => item.value === intervalMs)?.label || "自定义";
}

function getDayPeriodByKey(periodKey) {
  return DAY_PERIODS.find((period) => period.key === periodKey) || getDayPeriod();
}

function announceTime(reason = "manual", date = new Date()) {
  if (!requirePet("报时")) return false;
  const current = formatClock(date);
  state.clock.lastText = current.text;
  state.clock.lastVisual = current.visual;
  if (state.clock.intervalMs > 0) {
    state.clock.nextInMs = state.clock.intervalMs;
  }
  setActivity("time", 2600);
  burst("spark", 5, 126, 78, "#61fff4");
  const timeText = current.text.startsWith("现在") ? current.text : `现在是 ${current.text}`;
  const message = addressOwner(timeText);
  showFeedback(message, reason === "auto" ? "自动报时" : "报时", 3600, "time");
  say(`${displayName()} 报时：${message}`, reason === "auto" ? "自动报时" : "报时");
  return true;
}

function setClockInterval(intervalMs) {
  const nextInterval = Number(intervalMs);
  const supported = CLOCK_INTERVALS.some((item) => item.value === nextInterval);
  if (!supported) {
    say("这个报时间隔还不支持。", "报时设置");
    return false;
  }

  state.clock.intervalMs = nextInterval;
  state.clock.nextInMs = nextInterval > 0 ? nextInterval : 0;
  const message = nextInterval > 0
    ? `报时间隔已设为 ${clockIntervalLabel(nextInterval)}。`
    : "报时已关闭。";
  say(message, "报时设置");
  return true;
}

function setClockFormat(formatKey) {
  if (!CLOCK_FORMATS[formatKey]) {
    say("这个报时格式还不支持。", "报时设置");
    return false;
  }

  state.clock.format = formatKey;
  const sample = formatClock(new Date());
  say(`报时格式已切换为 ${sample.label}：${sample.text}`, "报时设置");
  return true;
}

function setCareAlertThreshold(threshold) {
  const nextThreshold = Number(threshold);
  if (!CARE_THRESHOLDS.includes(nextThreshold)) {
    say("这个提醒阈值还不支持。", "提醒设置");
    return false;
  }

  state.care.alertThreshold = nextThreshold;
  state.care.alertCooldownMs = 0;
  showFeedback(`提醒阈值已设为 ${nextThreshold}%。低于它我会主动提醒你。`, "提醒设置", 4200, "care");
  say(`提醒阈值已设为 ${nextThreshold}%。`, "提醒设置");
  return true;
}

function updateCareAlerts(dtMs) {
  if (state.mode !== "hatched") return;
  if (state.care.alertCooldownMs > 0) {
    state.care.alertCooldownMs = Math.max(0, state.care.alertCooldownMs - dtMs);
  }
  if (state.care.alertCooldownMs > 0 || state.activity.timeLeftMs > 0) return;

  const threshold = state.care.alertThreshold;
  const lowStats = STATUS_STATS
    .map((item) => ({ ...item, value: state.stats[item.key] }))
    .filter((item) => item.value <= threshold)
    .sort((left, right) => left.value - right.value);

  if (!lowStats.length) return;
  triggerCareAlert(lowStats[0]);
}

function triggerCareAlert(stat) {
  const alert = CARE_ALERTS[stat.key];
  if (!alert) return false;
  const message = addressOwner(alert.message(stat.value));
  state.care.lastAlert = stat.key;
  state.care.alertCooldownMs = 2 * 60 * 1000;
  setActivity(alert.activity, 3200);
  burst("spark", 5, 120, 72, alert.color);
  showFeedback(message, `需要${alert.action}`, 5600, "alert");
  say(`${displayName()} ${message}`, `提醒：${alert.action}`);
  return true;
}

function updateClock(dtMs) {
  if (state.mode !== "hatched" || state.clock.intervalMs <= 0) return;
  state.clock.nextInMs -= dtMs;
  if (state.clock.nextInMs > 0) return;

  if (state.activity.timeLeftMs > 0 && state.activity.kind !== "time") {
    state.clock.nextInMs = Math.min(1000, state.clock.intervalMs);
    return;
  }

  announceTime("auto");
}

function setOwnerCallInterval(intervalMs) {
  const nextInterval = Number(intervalMs);
  const supported = OWNER_CALL_INTERVALS.some((item) => item.value === nextInterval);
  if (!supported) {
    say("这个呼唤间隔还不支持。", "呼唤设置");
    return false;
  }

  state.ownerCall.intervalMs = nextInterval;
  state.ownerCall.nextInMs = randomOwnerCallDelay(nextInterval);
  const message = nextInterval > 0
    ? `我会大约每 ${ownerCallIntervalLabel(nextInterval)} 随机叫你一声，${ownerTitle()}。`
    : `${ownerTitle()}，我先不定期呼唤你。`;
  showFeedback(message, "呼唤设置", 4600, "call");
  say(`${displayName()} ${message}`, "呼唤设置");
  return true;
}

function formatOwnerCall(text) {
  return text
    .replaceAll("{owner}", ownerTitle())
    .replaceAll("{pet}", displayName());
}

function triggerOwnerCall(reason = "auto") {
  if (state.mode !== "hatched") return false;
  const message = formatOwnerCall(pickOne(OWNER_CALLS));
  state.ownerCall.lastText = message;
  state.ownerCall.nextInMs = randomOwnerCallDelay(state.ownerCall.intervalMs);
  setActivity("callOwner", 2600);
  state.nextAutoActionMs = Math.max(state.nextAutoActionMs, 9000);
  burst("heart", 7, 122, 70, "#ff35d4");
  showFeedback(message, reason === "manual" ? "叫主人" : "想主人", 5200, "call");
  say(`${displayName()} ${message}`, reason === "manual" ? "叫主人" : "呼唤主人");
  return true;
}

function updateOwnerCall(dtMs) {
  if (state.mode !== "hatched" || state.ownerCall.intervalMs <= 0) return;
  state.ownerCall.nextInMs -= dtMs;
  if (state.ownerCall.nextInMs > 0) return;

  if (state.activity.timeLeftMs > 0) {
    state.ownerCall.nextInMs = Math.min(1500, state.ownerCall.intervalMs);
    return;
  }

  triggerOwnerCall("auto");
}

function setCheckInInterval(intervalMs) {
  const nextInterval = Number(intervalMs);
  const supported = CHECK_IN_INTERVALS.some((item) => item.value === nextInterval);
  if (!supported) {
    say("这个主动询问间隔还不支持。", "询问设置");
    return false;
  }

  state.checkIn.intervalMs = nextInterval;
  state.checkIn.nextInMs = randomCheckInDelay(nextInterval);
  const message = nextInterval > 0
    ? `${ownerTitle()}，我会大约每 ${checkInIntervalLabel(nextInterval)} 问问你在做什么。`
    : `${ownerTitle()}，我先不主动问你在做什么。`;
  showFeedback(message, "询问设置", 4600, "check");
  say(`${displayName()} ${message}`, "询问设置");
  return true;
}

function openActivityPrompt(reason = "auto", periodKey = getDayPeriod().key) {
  if (!requirePet("主动询问")) return false;
  if (!ui.activityPrompt || !ui.activityPromptTitle || !ui.activityPromptBody || !ui.activityPromptOptions) {
    say("活动询问面板没有加载成功。", "主动询问");
    return false;
  }

  closeNameEditor();
  const period = getDayPeriodByKey(periodKey);
  activityPromptState.open = true;
  activityPromptState.periodKey = period.key;
  state.checkIn.promptTimeLeftMs = 22 * 1000;
  state.checkIn.promptPeriod = period.key;
  state.checkIn.nextInMs = randomCheckInDelay(state.checkIn.intervalMs);
  setActivity("askOwner", 2600);
  burst("spark", 5, 120, 72, "#ffe66a");

  ui.activityPromptTitle.textContent = `${period.greeting}，${ownerTitle()}在做什么？`;
  ui.activityPromptBody.textContent = `${period.nudge} 选一个，我陪你进入对应模式。`;
  ui.activityPromptOptions.innerHTML = "";
  Object.entries(CHECK_IN_CHOICES).forEach(([choiceKey, choice]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = choice.label;
    button.addEventListener("click", () => respondCheckIn(choiceKey));
    ui.activityPromptOptions.appendChild(button);
  });
  ui.activityPrompt.classList.remove("is-hidden");
  ui.activityPrompt.setAttribute("aria-hidden", "false");

  const message = `${period.greeting}，${ownerTitle()}，现在在干嘛？`;
  showFeedback(message, reason === "manual" ? "主动询问" : "小小巡问", 5200, "check");
  say(`${displayName()} ${message}`, reason === "manual" ? "主动询问" : "小小巡问");
  return true;
}

function closeActivityPrompt(reschedule = false) {
  activityPromptState.open = false;
  activityPromptState.periodKey = "";
  state.checkIn.promptTimeLeftMs = 0;
  state.checkIn.promptPeriod = "";
  if (reschedule) {
    state.checkIn.nextInMs = randomCheckInDelay(state.checkIn.intervalMs);
  }
  if (!ui.activityPrompt) return;
  ui.activityPrompt.classList.add("is-hidden");
  ui.activityPrompt.setAttribute("aria-hidden", "true");
  if (ui.activityPromptOptions) ui.activityPromptOptions.innerHTML = "";
}

function respondCheckIn(choiceKey) {
  if (!requirePet("主动询问")) return false;
  const choice = CHECK_IN_CHOICES[choiceKey];
  if (!choice) return false;

  const period = getDayPeriodByKey(state.checkIn.promptPeriod || getDayPeriod().key);
  closeActivityPrompt(false);
  applyStatChanges(choice.stats);
  setActivity(choice.activity, 3200);
  burst(choice.particle, 7, 122, 76, choice.color);
  const feedback = addressOwner(choice.feedback(period));
  const reminder = addressOwner(choice.reminder(period));
  state.checkIn.pendingReminder = {
    choiceKey,
    timeLeftMs: choice.reminderMs,
    text: reminder,
  };
  state.checkIn.lastChoice = choiceKey;
  state.checkIn.lastText = feedback;
  state.checkIn.nextInMs = randomCheckInDelay(state.checkIn.intervalMs);
  showFeedback(feedback, choice.action, 5600, "check");
  say(`${displayName()} ${feedback}`, choice.action);
  return true;
}

function updateCheckIn(dtMs) {
  if (state.mode !== "hatched") return;

  if (activityPromptState.open) {
    state.checkIn.promptTimeLeftMs = Math.max(0, state.checkIn.promptTimeLeftMs - dtMs);
    if (state.checkIn.promptTimeLeftMs <= 0) {
      closeActivityPrompt(true);
    }
    return;
  }

  if (state.checkIn.pendingReminder) {
    state.checkIn.pendingReminder.timeLeftMs = Math.max(0, state.checkIn.pendingReminder.timeLeftMs - dtMs);
    if (state.checkIn.pendingReminder.timeLeftMs <= 0) {
      if (state.activity.timeLeftMs > 0) {
        state.checkIn.pendingReminder.timeLeftMs = 1500;
      } else {
        triggerCheckInReminder();
      }
    }
  }

  if (state.checkIn.intervalMs <= 0 || nameEditorState.kind) return;
  state.checkIn.nextInMs -= dtMs;
  if (state.checkIn.nextInMs > 0) return;

  if (state.activity.timeLeftMs > 0) {
    state.checkIn.nextInMs = Math.min(2000, state.checkIn.intervalMs);
    return;
  }

  openActivityPrompt("auto");
}

function triggerCheckInReminder() {
  const reminder = state.checkIn.pendingReminder;
  if (!reminder) return false;
  const choice = CHECK_IN_CHOICES[reminder.choiceKey] || CHECK_IN_CHOICES.rest;
  const message = reminder.text || addressOwner(choice.reminder(getDayPeriod()));
  state.checkIn.pendingReminder = null;
  setActivity("breakReminder", 3300);
  burst("spark", 7, 120, 70, choice.color);
  showFeedback(message, "小提醒", 5600, "reminder");
  say(`${displayName()} ${message}`, "小提醒");
  return true;
}

function triggerAutoAction() {
  if (state.mode !== "hatched" || state.activity.timeLeftMs > 0) return false;

  const auto = AUTO_ACTIONS[Math.floor(Math.random() * AUTO_ACTIONS.length)];
  setActivity(auto.kind, auto.durationMs);
  state.message = `${displayName()} ${auto.message}`;
  state.lastAction = auto.action;
  if (auto.particle) {
    burst(auto.particle, auto.count, auto.x, auto.y, auto.color);
  }
  saveState();
  return true;
}

function update(dtMs) {
  state.animationMs += dtMs;
  if (mouseGestureState.cooldownMs > 0) {
    mouseGestureState.cooldownMs = Math.max(0, mouseGestureState.cooldownMs - dtMs);
  }
  if (state.feedback.timeLeftMs > 0) {
    state.feedback.timeLeftMs = Math.max(0, state.feedback.timeLeftMs - dtMs);
  }
  updateHoverState(dtMs);

  particles = particles
    .map((particle) => ({
      ...particle,
      lifeMs: particle.lifeMs - dtMs,
      x: particle.x + particle.vx * dtMs,
      y: particle.y + particle.vy * dtMs,
    }))
    .filter((particle) => particle.lifeMs > 0);

  if (state.mode === "hatching") {
    state.hatchMs -= dtMs;
    if (state.hatchMs <= 0) finishHatch();
  }

  if (state.mode === "hatched") {
    const seconds = dtMs / 1000;
    state.stats.satiety = clamp(state.stats.satiety - seconds * 0.025);
    state.stats.happiness = clamp(state.stats.happiness - seconds * 0.016);
    state.stats.energy = clamp(state.stats.energy - seconds * 0.012);
    state.stats.clean = clamp(state.stats.clean - seconds * 0.012);
    if (state.activity.timeLeftMs > 0) {
      state.activity.timeLeftMs = Math.max(0, state.activity.timeLeftMs - dtMs);
      if (state.activity.timeLeftMs === 0) {
        state.activity.kind = "idle";
      }
    }

    updateClock(dtMs);
    updateCareAlerts(dtMs);
    updateOwnerCall(dtMs);
    updateCheckIn(dtMs);

    if (state.activity.timeLeftMs <= 0) {
      state.nextAutoActionMs -= dtMs;
      if (state.nextAutoActionMs <= 0) {
        triggerAutoAction();
      }
    }
  }
}

function renderDom() {
  const status = state.mode === "hatched"
    ? `${displayName()} | 主人 ${ownerTitle()} | ${state.lastAction} | 饱腹 ${Math.round(state.stats.satiety)} 快乐 ${Math.round(state.stats.happiness)} 能量 ${Math.round(state.stats.energy)}`
    : state.mode === "hatching"
      ? `孵化中 | ${Math.max(0, Math.ceil(state.hatchMs / 1000))} 秒`
      : `未孵化 | 主人 ${ownerTitle()} | 点击或右键菜单孵化`;
  if (ui.status) {
    ui.status.textContent = `${status}。${state.message}`;
  }
  const clockStatus = state.clock.intervalMs > 0
    ? `报时：${clockIntervalLabel()} / ${CLOCK_FORMATS[state.clock.format]?.label || "24小时 HH:mm"}`
    : "报时：关闭";
  const careStatus = state.mode === "hatched"
    ? `低状态提醒阈值：${state.care.alertThreshold}%`
    : "低状态提醒：孵化后开启";
  const callStatus = state.ownerCall.intervalMs > 0
    ? `呼唤主人：约 ${ownerCallIntervalLabel()} 一次`
    : "呼唤主人：关闭";
  const checkInStatus = state.checkIn.intervalMs > 0
    ? `主动询问：约 ${checkInIntervalLabel()} 一次`
    : "主动询问：关闭";
  canvas.title = `${status}\n${state.message}\n${clockStatus}\n${careStatus}\n${callStatus}\n${checkInStatus}\n鼠标静止 3 秒显示详细状态；左键点击互动，拖动移动，右键打开菜单。`;
}

function updateHoverState(dtMs) {
  if (!hoverState.over || dragStart || state.mode !== "hatched") {
    hoverState.show = false;
    if (!hoverState.over) hoverState.stillMs = 0;
    return;
  }

  hoverState.stillMs += dtMs;
  hoverState.show = hoverState.stillMs >= 3000;
}

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPixelText(text, x, y, color = "#61fff4") {
  ctx.fillStyle = color;
  ctx.font = "8px Courier New, monospace";
  ctx.fillText(text, x, y);
}

function drawCenteredPixelText(text, centerX, y, color = "#61fff4", fontSize = 9) {
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px Courier New, monospace`;
  const width = ctx.measureText(text).width;
  ctx.fillText(text, centerX - width / 2, y);
}

function wrapText(text, maxChars = 17, maxLines = 3) {
  const chars = String(text).replace(/\s+/g, " ").trim().split("");
  const lines = [];
  let line = "";

  chars.forEach((char) => {
    if (line.length >= maxChars) {
      lines.push(line);
      line = "";
    }
    line += char;
  });

  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const clipped = lines.slice(0, maxLines);
    clipped[maxLines - 1] = `${clipped[maxLines - 1].slice(0, Math.max(0, maxChars - 1))}…`;
    return clipped;
  }
  return lines;
}

function drawPanel(x, y, w, h, border = "#61fff4", fill = "rgba(9,17,30,0.88)") {
  px(x + 3, y + 3, w, h, "rgba(0,0,0,0.22)");
  px(x, y, w, h, fill);
  px(x, y, w, 2, border);
  px(x, y + h - 2, w, 2, border);
  px(x, y, 2, h, border);
  px(x + w - 2, y, 2, h, border);
  px(x + 6, y + h, 10, 6, fill);
  px(x + 6, y + h, 10, 2, border);
}

function drawTextLine(text, x, y, color = "#ecfbff", size = 10, weight = "500") {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px "PingFang SC", "Microsoft YaHei", Arial, sans-serif`;
  ctx.fillText(text, x, y);
}

const CLOCK_GLYPHS = {
  "0": ["111", "101", "101", "101", "111"],
  "1": ["010", "110", "010", "010", "111"],
  "2": ["111", "001", "111", "100", "111"],
  "3": ["111", "001", "111", "001", "111"],
  "4": ["101", "101", "111", "001", "001"],
  "5": ["111", "100", "111", "001", "111"],
  "6": ["111", "100", "111", "101", "111"],
  "7": ["111", "001", "010", "010", "010"],
  "8": ["111", "101", "111", "101", "111"],
  "9": ["111", "101", "111", "001", "111"],
  ":": ["0", "1", "0", "1", "0"],
  "-": ["000", "000", "111", "000", "000"],
  " ": ["00", "00", "00", "00", "00"],
};

function drawClockDisplay(text, centerX, y, color = "#ffe66a") {
  const scale = 3;
  const gap = 2;
  const chars = String(text).split("");
  const widths = chars.map((char) => (CLOCK_GLYPHS[char]?.[0]?.length || 3) * scale);
  const totalWidth = widths.reduce((total, width) => total + width, 0) + Math.max(0, chars.length - 1) * gap;
  let x = centerX - totalWidth / 2;

  chars.forEach((char, index) => {
    const glyph = CLOCK_GLYPHS[char] || CLOCK_GLYPHS[" "];
    glyph.forEach((row, rowIndex) => {
      row.split("").forEach((cell, colIndex) => {
        if (cell === "1") {
          px(x + colIndex * scale, y + rowIndex * scale, scale, scale, color);
        }
      });
    });
    x += widths[index] + gap;
  });
}

function drawEgg() {
  const bob = Math.sin(state.animationMs / 360) * 3;
  const progress = state.mode === "hatching" ? 1 - clamp(state.hatchMs / 3600, 0, 1) : 0;
  px(78, 150 + bob, 84, 8, "rgba(97,255,244,0.16)");
  px(88, 66 + bob, 64, 8, "#dff9ff");
  px(78, 74 + bob, 84, 22, "#c7e9f1");
  px(70, 96 + bob, 100, 38, "#9bcbd5");
  px(82, 134 + bob, 76, 24, "#70aebc");
  px(96, 82 + bob, 18, 10, "#ffffff");
  px(116, 106 + bob, 18, 12, "rgba(97,255,244,0.38)");
  if (progress > 0.2) {
    px(120, 76 + bob, 5, 28 * progress, "#09111e");
    px(112, 104 + bob, 16, 5, "#09111e");
  }
}

function drawPet() {
  const pet = state.pet || PETS[0];
  const [main, dark, accent, spark] = pet.colors;
  const activity = state.activity.kind;
  const bob = getActivityBob(activity);
  const squish = getActivitySquish(activity);
  const blink = activity === "sleep" || activity === "comfortSad" || Math.floor(state.animationMs / 900) % 5 === 0;
  const x = 120;
  const y = 82 + bob;
  const danceShift = getActivityShift(activity);
  const eyeOffset = activity === "look" ? Math.round(Math.sin(state.animationMs / 160) * 3) : 0;
  const petX = x + danceShift;

  px(70 + danceShift * 0.4, 172 + bob, 100, 9, "rgba(97,255,244,0.18)");

  if (pet.tail === "curl") {
    px(petX + 36, y + 36, 18, 8, accent);
    px(petX + 50, y + 28, 8, 16, accent);
    px(petX + 42, y + 22, 14, 8, accent);
  } else if (pet.tail === "bolt") {
    px(petX + 38, y + 36, 12, 8, accent);
    px(petX + 48, y + 28, 10, 8, accent);
    px(petX + 40, y + 22, 10, 8, accent);
  } else if (pet.tail === "double") {
    px(petX + 36, y + 30, 18, 7, accent);
    px(petX + 38, y + 42, 22, 7, spark);
  } else {
    px(petX + 38, y + 40, 14, 14, accent);
  }

  px(petX - 40, y + 38 + squish, 80, 44 - squish, main);
  px(petX - 31, y + 48 + squish, 62, 30 - squish, dark);
  px(petX - 46, y + 16 + squish, 92, 52 - squish, main);
  px(petX - 36, y + 26 + squish, 72, 32 - squish, dark);

  if (pet.ears === "long") {
    px(petX - 28, y - 24 + squish, 14, 42 - squish, main);
    px(petX + 14, y - 24 + squish, 14, 42 - squish, main);
    px(petX - 23, y - 18, 5, 26, accent);
    px(petX + 19, y - 18, 5, 26, accent);
  } else if (pet.ears === "flop") {
    px(petX - 44, y + 8, 22, 28, main);
    px(petX + 22, y + 8, 22, 28, main);
  } else {
    px(petX - 40, y - 6, 22, 24, main);
    px(petX + 18, y - 6, 22, 24, main);
    px(petX - 32, y + 2, 8, 10, accent);
    px(petX + 24, y + 2, 8, 10, accent);
  }

  px(petX - 22 + eyeOffset, y + 38, 8, blink ? 3 : 8, "#ecfbff");
  px(petX + 14 + eyeOffset, y + 38, 8, blink ? 3 : 8, "#ecfbff");
  px(petX - 3, y + 50, 10, 5, activity === "sleep" ? "#82ff8f" : accent);
  px(petX - 18, y + 68, 12, 8, spark);
  px(petX + 6, y + 68, 12, 8, spark);
  px(petX - 32, y + 82, 16, 10, main);
  px(petX + 16, y + 82, 16, 10, main);

  if (activity === "time") {
    drawParticles();
    drawActivityProps(activity, petX, y, accent, spark);
  } else {
    drawActivityProps(activity, petX, y, accent, spark);
    drawParticles();
  }
}

function getActivityBob(activity) {
  if (activity === "celebrate") return -Math.abs(Math.sin(state.animationMs / 100)) * 12;
  if (activity === "sparkRush") return Math.sin(state.animationMs / 58) * 8;
  if (activity === "breathe") return Math.sin(state.animationMs / 560) * 3;
  if (activity === "comfortSad") return Math.sin(state.animationMs / 560) * 1.5 + 3;
  if (activity === "hug") return Math.sin(state.animationMs / 220) * 3;
  if (activity === "callOwner") return -Math.abs(Math.sin(state.animationMs / 150)) * 6;
  if (activity === "askOwner") return Math.sin(state.animationMs / 210) * 4;
  if (activity === "workBuddy" || activity === "studyBuddy" || activity === "readBuddy") return Math.sin(state.animationMs / 420) * 2;
  if (activity === "funBuddy") return Math.sin(state.animationMs / 95) * 7;
  if (activity === "restBuddy" || activity === "idleBuddy") return Math.sin(state.animationMs / 560) * 2;
  if (activity === "breakReminder") return Math.sin(state.animationMs / 130) * 5;
  if (activity === "mouseJump") return -Math.abs(Math.sin(state.animationMs / 110)) * 14;
  if (activity === "mouseDuck") return Math.abs(Math.sin(state.animationMs / 180)) * 4;
  if (activity === "mouseSlide" || activity === "mouseZigzag" || activity === "mouseCircle") return Math.sin(state.animationMs / 95) * 5;
  if (activity === "vent") return Math.sin(state.animationMs / 58) * 5;
  if (activity === "focus") return Math.sin(state.animationMs / 380) * 2;
  if (activity === "time") return -Math.abs(Math.sin(state.animationMs / 130)) * 7;
  if (activity === "alertHungry" || activity === "alertPlay" || activity === "alertSleep") {
    return Math.sin(state.animationMs / 110) * 5;
  }
  if (activity === "dance") return Math.sin(state.animationMs / 90) * 7;
  if (activity === "wiggle") return Math.sin(state.animationMs / 120) * 4;
  if (activity === "hop") return -Math.abs(Math.sin(state.animationMs / 120)) * 14;
  if (activity === "play") return Math.sin(state.animationMs / 130) * 6;
  if (activity === "explore") return Math.sin(state.animationMs / 160) * 5;
  if (activity === "sleep") return Math.sin(state.animationMs / 520) * 2;
  if (activity === "stretch") return Math.sin(state.animationMs / 320) * 2;
  if (activity === "look") return Math.sin(state.animationMs / 300) * 3;
  return Math.sin(state.animationMs / 260) * 4;
}

function getActivityShift(activity) {
  if (activity === "dance" || activity === "wiggle") return Math.sin(state.animationMs / 95) * 8;
  if (activity === "sparkRush") return Math.sin(state.animationMs / 48) * 7;
  if (activity === "vent") return Math.sin(state.animationMs / 42) * 5;
  if (activity === "time") return Math.sin(state.animationMs / 150) * 3;
  if (activity === "callOwner") return Math.sin(state.animationMs / 110) * 4;
  if (activity === "mouseSlide") return Math.sin(state.animationMs / 80) * 10;
  if (activity === "mouseZigzag") return Math.sin(state.animationMs / 48) * 8;
  if (activity === "mouseCircle") return Math.sin(state.animationMs / 70) * 6;
  if (activity === "funBuddy") return Math.sin(state.animationMs / 90) * 5;
  if (activity === "celebrate") return Math.sin(state.animationMs / 75) * 4;
  return 0;
}

function getActivitySquish(activity) {
  if (activity === "pet") return Math.sin(state.animationMs / 120) * 2;
  if (activity === "stretch") return -Math.abs(Math.sin(state.animationMs / 150)) * 4;
  if (activity === "hop") return Math.max(0, Math.sin(state.animationMs / 95)) * 3;
  if (activity === "breathe") return Math.sin(state.animationMs / 420) * 2;
  if (activity === "comfortSad") return 2;
  if (activity === "hug") return Math.sin(state.animationMs / 180) * 1.5;
  if (activity === "callOwner") return Math.sin(state.animationMs / 160) * 1.5;
  if (activity === "restBuddy" || activity === "idleBuddy" || activity === "mouseDuck") return 2;
  if (activity === "breakReminder") return Math.sin(state.animationMs / 120) * 2;
  if (activity === "alertHungry" || activity === "alertPlay" || activity === "alertSleep") {
    return Math.sin(state.animationMs / 120) * 2;
  }
  return 0;
}

function drawActivityProps(activity, x, y, accent, spark) {
  if (activity === "eat") {
    px(x - 66, y + 50, 14, 12, "#ffe66a");
    px(x - 62, y + 46, 8, 4, "#ff35d4");
    drawPixelText("YUM", x - 72, y + 42, "#ffe66a");
  }
  if (activity === "play") {
    const laserX = 42 + Math.sin(state.animationMs / 100) * 20;
    const laserY = 56 + Math.cos(state.animationMs / 130) * 12;
    px(laserX, laserY, 10, 10, "#ff35d4");
    px(laserX + 3, laserY + 3, 4, 4, "#ecfbff");
    px(laserX + 10, laserY + 4, x - laserX - 42, 2, "rgba(255,53,212,0.55)");
  }
  if (activity === "explore") {
    px(x + 56, y + 18, 16, 12, "#61fff4");
    px(x + 72, y + 22, 8, 8, "#ffe66a");
    drawPixelText("SCAN", x + 50, y + 12, "#61fff4");
  }
  if (activity === "sleep") {
    drawPixelText("Z", x + 48, y + 8, "#61fff4");
    drawPixelText("Z", x + 60, y - 8, "#82ff8f");
    drawPixelText("Z", x + 72, y - 24, "#ffe66a");
  }
  if (activity === "clean") {
    px(x - 64, y + 20, 18, 24, "#61fff4");
    px(x - 60, y + 16, 10, 5, "#ecfbff");
    drawPixelText("WASH", x - 76, y + 10, "#61fff4");
  }
  if (activity === "comfort") {
    px(x - 52, y + 14, 12, 12, accent);
    px(x + 42, y + 14, 12, 12, accent);
  }
  if (activity === "celebrate") {
    drawPixelText("YAY", x - 14, y - 33, "#ffe66a");
    drawPixelText("♪", x - 66, y + 8, spark);
    drawPixelText("♪", x + 60, y + 12, "#82ff8f");
    px(x - 58, y + 34, 18, 8, accent);
    px(x + 40, y + 34, 18, 8, accent);
  }
  if (activity === "comfortSad") {
    px(x - 58, y + 22, 18, 10, accent);
    px(x + 40, y + 22, 18, 10, accent);
    drawTextLine("陪你", x - 12, y - 24, "#ffb8ec", 10, "700");
    px(x - 6, y - 16, 5, 5, "#ff35d4");
    px(x + 1, y - 16, 5, 5, "#ff35d4");
    px(x - 3, y - 11, 7, 6, "#ff35d4");
  }
  if (activity === "breathe") {
    const width = 28 + Math.sin(state.animationMs / 420) * 10;
    px(x - 82, y + 40, width, 2, "rgba(97,255,244,0.72)");
    px(x + 54, y + 40, width, 2, "rgba(97,255,244,0.72)");
    drawPixelText("IN", x - 82, y + 30, "#61fff4");
    drawPixelText("OUT", x + 56, y + 30, "#61fff4");
  }
  if (activity === "vent") {
    drawPixelText("COOL", x - 18, y - 32, "#61fff4");
    px(x - 72, y + 22, 18, 4, "#ff35d4");
    px(x - 66, y + 31, 14, 4, "#ffe66a");
    px(x + 56, y + 22, 18, 4, "#ff35d4");
    px(x + 54, y + 31, 14, 4, "#ffe66a");
  }
  if (activity === "hug") {
    px(x - 58, y + 32, 22, 9, accent);
    px(x + 36, y + 32, 22, 9, accent);
    px(x - 4, y - 24, 6, 6, "#ff35d4");
    px(x + 3, y - 24, 6, 6, "#ff35d4");
    px(x - 1, y - 18, 8, 8, "#ff35d4");
    drawTextLine("贴贴", x - 13, y - 31, "#ffb8ec", 10, "700");
  }
  if (activity === "callOwner") {
    const waveY = Math.sin(state.animationMs / 90) * 6;
    px(x - 58, y + 28 + waveY, 20, 8, accent);
    px(x - 70, y + 20 + waveY, 12, 8, spark);
    px(x - 4, y - 28, 6, 6, "#ff35d4");
    px(x + 3, y - 28, 6, 6, "#ff35d4");
    px(x - 1, y - 22, 8, 8, "#ff35d4");
    drawTextLine(ownerTitle(), x - 22, y - 34, "#ffb8ec", 10, "800");
  }
  if (activity === "askOwner") {
    const pulse = Math.sin(state.animationMs / 160) > 0;
    drawPixelText("?", x - 4, y - 38, pulse ? "#ffe66a" : "#61fff4");
    drawPixelText("NOW?", x - 18, y - 26, "#ffe66a");
    px(x - 62, y + 30, 18, 8, accent);
  }
  if (activity === "workBuddy") {
    drawPixelText("FOCUS", x - 22, y - 34, "#61fff4");
    px(x + 50, y + 24, 24, 16, "#132d44");
    px(x + 54, y + 28, 16, 8, "#61fff4");
    px(x + 46, y + 44, 32, 4, "#ff35d4");
  }
  if (activity === "readBuddy") {
    drawPixelText("READ", x - 14, y - 34, "#ffe66a");
    px(x - 76, y + 42, 22, 18, "#ffe66a");
    px(x - 65, y + 42, 2, 18, "#132d44");
    px(x - 73, y + 47, 6, 2, "#132d44");
    px(x - 61, y + 47, 6, 2, "#132d44");
  }
  if (activity === "studyBuddy") {
    drawPixelText("LEARN", x - 18, y - 34, "#82ff8f");
    px(x + 54, y + 24, 22, 24, "#82ff8f");
    px(x + 58, y + 29, 14, 2, "#132d44");
    px(x + 58, y + 36, 14, 2, "#132d44");
  }
  if (activity === "funBuddy") {
    drawPixelText("FUN", x - 10, y - 34, "#ff35d4");
    px(x - 72, y + 28, 22, 14, "#ff35d4");
    px(x - 68, y + 32, 4, 4, "#ecfbff");
    px(x - 56, y + 32, 4, 4, "#ffe66a");
    drawPixelText("♪", x + 58, y + 12, "#82ff8f");
  }
  if (activity === "restBuddy" || activity === "idleBuddy") {
    drawPixelText(activity === "restBuddy" ? "REST" : "IDLE", x - 14, y - 34, "#61fff4");
    drawPixelText("Z", x + 52, y + 8, "#61fff4");
    px(x - 60, y + 34, 18, 8, accent);
  }
  if (activity === "breakReminder") {
    drawPixelText("BREAK", x - 18, y - 34, "#ffe66a");
    px(x - 72, y + 28, 16, 16, "#ffe66a");
    px(x - 68, y + 32, 8, 8, "#132d44");
    px(x + 56, y + 24, 12, 26, "#61fff4");
  }
  if (activity === "mouseSlide") {
    drawPixelText("SWIPE", x - 18, y - 34, "#61fff4");
    px(x - 82, y + 42, 26, 3, "#61fff4");
    px(x + 56, y + 42, 26, 3, "#61fff4");
  }
  if (activity === "mouseJump") {
    drawPixelText("UP!", x - 10, y - 34, "#ffe66a");
    px(x - 44, y + 104, 18, 4, "rgba(255,230,106,0.35)");
    px(x + 26, y + 104, 18, 4, "rgba(255,230,106,0.35)");
  }
  if (activity === "mouseDuck") {
    drawPixelText("LOW", x - 10, y - 34, "#82ff8f");
    px(x - 70, y + 92, 28, 4, "rgba(130,255,143,0.36)");
    px(x + 42, y + 92, 28, 4, "rgba(130,255,143,0.36)");
  }
  if (activity === "mouseZigzag") {
    drawPixelText("ZIG", x - 10, y - 34, "#ff35d4");
    px(x - 76, y + 20, 18, 3, "#ff35d4");
    px(x - 62, y + 27, 18, 3, "#ffe66a");
    px(x + 52, y + 20, 18, 3, "#ff35d4");
    px(x + 44, y + 27, 18, 3, "#ffe66a");
  }
  if (activity === "mouseCircle") {
    drawPixelText("LOOP", x - 14, y - 34, "#82ff8f");
    px(x - 72, y + 22, 28, 4, "#82ff8f");
    px(x - 72, y + 22, 4, 24, "#82ff8f");
    px(x - 48, y + 22, 4, 24, "#82ff8f");
    px(x - 72, y + 42, 28, 4, "#82ff8f");
  }
  if (activity === "sparkRush") {
    drawPixelText("BOOST", x - 18, y - 34, "#82ff8f");
    px(x - 78, y + 46, 20, 4, "#82ff8f");
    px(x + 58, y + 50, 20, 4, "#61fff4");
    drawPixelText("♪", x + 62, y + 10, "#82ff8f");
    drawPixelText("♪", x - 68, y + 14, spark);
  }
  if (activity === "focus") {
    const scanY = y + 6 + Math.sin(state.animationMs / 170) * 32;
    drawPixelText("STEP", x - 18, y - 32, "#61fff4");
    px(x - 48, scanY, 96, 2, "rgba(97,255,244,0.66)");
  }
  if (activity === "dance") {
    drawPixelText("♪", x - 62, y + 12, spark);
    drawPixelText("♪", x + 58, y + 6, "#82ff8f");
    drawPixelText("BEAT", x - 20, y - 34, "#ffe66a");
  }
  if (activity === "look") {
    const scanX = x + 48 + Math.sin(state.animationMs / 120) * 18;
    px(scanX, y + 22, 2, 36, "rgba(97,255,244,0.68)");
    drawPixelText("SCAN", x + 48, y + 12, "#61fff4");
  }
  if (activity === "hop") {
    drawPixelText("HOP", x - 12, y - 28, "#ffe66a");
    px(x - 46, y + 104, 18, 4, "rgba(255,230,106,0.35)");
    px(x + 26, y + 104, 18, 4, "rgba(255,230,106,0.35)");
  }
  if (activity === "wave") {
    const waveY = Math.sin(state.animationMs / 90) * 6;
    px(x - 58, y + 30 + waveY, 18, 8, accent);
    px(x - 70, y + 22 + waveY, 12, 8, spark);
    drawPixelText("HI", x - 76, y + 12, "#ff35d4");
  }
  if (activity === "stretch") {
    px(x - 58, y + 58, 18, 7, accent);
    px(x + 40, y + 58, 18, 7, accent);
    drawPixelText("STRETCH", x - 32, y - 30, "#82ff8f");
  }
  if (activity === "wiggle") {
    drawPixelText("♪", x + 60, y + 8, "#82ff8f");
    drawPixelText("♪", x - 66, y + 20, spark);
  }
  if (activity === "time") {
    const clockText = state.clock.lastVisual || formatClock().visual;
    drawPixelText("TICK", x - 12, y - 62, "#61fff4");
    drawClockDisplay(clockText, 121, y - 39, "#09111e");
    drawClockDisplay(clockText, 120, y - 41, "#ffe66a");
    const tick = Math.sin(state.animationMs / 120) > 0 ? "#61fff4" : "#ff35d4";
    px(x - 66, y + 18, 10, 10, tick);
    px(x + 56, y + 18, 10, 10, tick);
  }
  if (activity === "alertHungry") {
    drawPixelText("FEED", x - 16, y - 34, "#ffe66a");
    px(x - 68, y + 48, 18, 12, "#ffe66a");
    px(x - 62, y + 44, 8, 4, "#ff35d4");
  }
  if (activity === "alertPlay") {
    drawPixelText("PLAY", x - 14, y - 34, "#ff35d4");
    px(x + 58, y + 20, 10, 10, "#ff35d4");
    px(x + 61, y + 23, 4, 4, "#ecfbff");
  }
  if (activity === "alertSleep") {
    drawPixelText("REST", x - 14, y - 34, "#61fff4");
    drawPixelText("Z", x + 54, y + 8, "#61fff4");
    drawPixelText("Z", x + 66, y - 8, "#82ff8f");
  }
}

function drawParticles() {
  for (const particle of particles) {
    const age = 1 - particle.lifeMs / particle.maxLifeMs;
    const x = particle.x + Math.sin(state.animationMs / 120 + particle.phase) * 3;
    const y = particle.y - age * 8;
    if (particle.kind === "heart") {
      px(x - 3, y, 3, 3, particle.color);
      px(x + 1, y, 3, 3, particle.color);
      px(x - 1, y + 3, 5, 4, particle.color);
      px(x, y + 7, 3, 3, particle.color);
    } else if (particle.kind === "note") {
      drawPixelText("♪", x, y, particle.color);
    } else if (particle.kind === "sleep") {
      drawPixelText("Z", x, y, particle.color);
    } else if (particle.kind === "bubble") {
      px(x, y, 6, 6, "rgba(97,255,244,0.68)");
      px(x + 2, y + 2, 2, 2, "#ecfbff");
    } else if (particle.kind === "food") {
      px(x, y, 7, 7, particle.color);
      px(x + 2, y + 2, 3, 3, "#ff35d4");
    } else {
      px(x - 2, y, 8, 2, particle.color);
      px(x + 1, y - 3, 2, 8, particle.color);
    }
  }
}

function drawStatPips() {
  const stats = [
    ["H", state.stats.happiness, "#ff35d4"],
    ["E", state.stats.energy, "#61fff4"],
    ["B", state.stats.bond, "#ffe66a"],
    ["C", state.stats.clean, "#82ff8f"],
  ];
  stats.forEach(([, value, color], index) => {
    px(16, 22 + index * 11, 44, 5, "rgba(236,251,255,0.12)");
    px(16, 22 + index * 11, 44 * (value / 100), 5, color);
  });
}

function drawFeedbackBubble() {
  if (!state.feedback.text || state.feedback.timeLeftMs <= 0) return;
  const colors = {
    mood: "#ff35d4",
    alert: "#ffe66a",
    time: "#61fff4",
    care: "#82ff8f",
    call: "#ffb8ec",
    name: "#82ff8f",
    check: "#ffe66a",
    reminder: "#ffe66a",
    mouse: "#61fff4",
    speech: "#61fff4",
  };
  const border = colors[state.feedback.variant] || colors.speech;
  const lines = wrapText(state.feedback.text, 18, 3);
  const width = 206;
  const height = 28 + lines.length * 14;
  const x = 17;
  const y = hoverState.show ? 92 : 10;
  const progress = clamp(state.feedback.timeLeftMs / Math.max(1, state.feedback.durationMs), 0, 1);

  drawPanel(x, y, width, height, border);
  drawTextLine(state.feedback.title, x + 9, y + 14, border, 10, "800");
  lines.forEach((line, index) => {
    drawTextLine(line, x + 9, y + 29 + index * 14, "#ecfbff", 10, "500");
  });
  px(x + 8, y + height - 7, (width - 16) * progress, 2, border);
}

function drawHoverStatus() {
  if (!hoverState.show || state.mode !== "hatched") return;
  const x = 25;
  const y = 8;
  const width = 190;
  const height = 78;

  drawPanel(x, y, width, height, "#61fff4", "rgba(9,17,30,0.92)");
  drawTextLine(`${displayName()} 详细状态`, x + 10, y + 15, "#61fff4", 10, "800");
  STATUS_STATS.forEach((stat, index) => {
    const value = clamp(state.stats[stat.key] ?? 0);
    const rowY = y + 28 + index * 15;
    drawTextLine(`${stat.label} ${Math.round(value)}%`, x + 10, rowY + 5, "#ecfbff", 9, "600");
    px(x + 74, rowY, 96, 7, "rgba(236,251,255,0.16)");
    px(x + 74, rowY, 96 * (value / 100), 7, stat.color);
    if (value <= state.care.alertThreshold) {
      px(x + 174, rowY, 6, 7, "#ffe66a");
    }
  });
  drawTextLine(`低于 ${state.care.alertThreshold}% 会提醒`, x + 10, y + 72, "#ffe66a", 9, "600");
}

function render() {
  drawBackground();
  if (state.mode === "hatched") {
    drawPet();
    drawHoverStatus();
    drawFeedbackBubble();
  } else {
    drawEgg();
  }
}

function tick(now) {
  const dtMs = Math.min(80, now - lastFrame);
  lastFrame = now;
  update(dtMs);
  renderDom();
  render();
  requestAnimationFrame(tick);
}

function beginDrag(event) {
  if (event.button !== 0) return;
  hoverState.show = false;
  hoverState.stillMs = 0;
  dragStart = {
    x: event.screenX,
    y: event.screenY,
    totalX: 0,
    totalY: 0,
    dragging: false,
  };
  canvas.setPointerCapture(event.pointerId);
}

function moveDrag(event) {
  updateHoverPointer(event);
  if (!dragStart) {
    recordMouseGesture(event);
  }
  
  if (!dragStart) return;
  const delta = {
    x: event.screenX - dragStart.x,
    y: event.screenY - dragStart.y,
  };
  dragStart.totalX += delta.x;
  dragStart.totalY += delta.y;
  dragStart.x = event.screenX;
  dragStart.y = event.screenY;
  dragStart.dragging = dragStart.dragging || Math.abs(dragStart.totalX) + Math.abs(dragStart.totalY) > 5;
  if (dragStart.dragging) {
    window.desktopPet?.moveBy(delta);
  }
}

function endDrag(event) {
  const shouldClick = dragStart && !dragStart.dragging;
  dragStart = null;
  hoverState.stillMs = 0;
  hoverState.show = false;
  try {
    canvas.releasePointerCapture(event.pointerId);
  } catch {
    // Pointer capture may already be released when the OS moves the window.
  }
  if (shouldClick) handlePetClick();
}

function beginHover(event) {
  hoverState.over = true;
  hoverState.stillMs = 0;
  hoverState.show = false;
  hoverState.x = event.offsetX;
  hoverState.y = event.offsetY;
}

function endHover() {
  hoverState.over = false;
  hoverState.stillMs = 0;
  hoverState.show = false;
}

function updateHoverPointer(event) {
  if (!hoverState.over) return;
  const moved = Math.abs(event.offsetX - hoverState.x) + Math.abs(event.offsetY - hoverState.y) > 2;
  if (!moved) return;

  hoverState.x = event.offsetX;
  hoverState.y = event.offsetY;
  hoverState.stillMs = 0;
  hoverState.show = false;
}

function recordMouseGesture(event) {
  if (state.mode !== "hatched" || dragStart || nameEditorState.kind || activityPromptState.open) return;
  if (mouseGestureState.cooldownMs > 0) return;

  const now = performance.now();
  mouseGestureState.points.push({ x: event.offsetX, y: event.offsetY, t: now });
  mouseGestureState.points = mouseGestureState.points.filter((point) => now - point.t <= 900).slice(-18);
  const gesture = classifyMouseGesture(mouseGestureState.points);
  if (!gesture) return;

  triggerMouseGesture(gesture);
  mouseGestureState.points = [];
  mouseGestureState.cooldownMs = 2200;
}

function classifyMouseGesture(points) {
  if (points.length < 5) return "";
  const first = points[0];
  const last = points[points.length - 1];
  const dx = last.x - first.x;
  const dy = last.y - first.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));
  const width = maxX - minX;
  const height = maxY - minY;
  let pathLength = 0;
  let xTurns = 0;
  let previousXSign = 0;

  for (let index = 1; index < points.length; index += 1) {
    const stepX = points[index].x - points[index - 1].x;
    const stepY = points[index].y - points[index - 1].y;
    pathLength += Math.hypot(stepX, stepY);
    const xSign = Math.sign(stepX);
    if (xSign && previousXSign && xSign !== previousXSign) xTurns += 1;
    if (xSign) previousXSign = xSign;
  }

  const directDistance = Math.hypot(dx, dy);
  if (pathLength < 70) return "";
  if (pathLength > 155 && directDistance < 46 && width > 34 && height > 28) return "circle";
  if (xTurns >= 3 && width > 50) return "zigzag";
  if (absDx > 64 && absDx > absDy * 1.35) return dx > 0 ? "right" : "left";
  if (absDy > 56 && absDy > absDx * 1.25) return dy < 0 ? "up" : "down";
  return "";
}

function triggerMouseGesture(kind) {
  if (state.mode !== "hatched") return false;
  const gesture = {
    left: {
      activity: "mouseSlide",
      title: "左滑",
      text: `${ownerTitle()}，你往左划了一道光，我也跟着滑过去。`,
      color: "#61fff4",
    },
    right: {
      activity: "mouseSlide",
      title: "右滑",
      text: `${ownerTitle()}，右滑信号收到，我的小尾巴追上来了。`,
      color: "#61fff4",
    },
    up: {
      activity: "mouseJump",
      title: "上滑",
      text: `${ownerTitle()}，你往上一划，我也跳一下给你看。`,
      color: "#ffe66a",
    },
    down: {
      activity: "mouseDuck",
      title: "下滑",
      text: `${ownerTitle()}，下滑收到，我趴低一点，像素伏地。`,
      color: "#82ff8f",
    },
    zigzag: {
      activity: "mouseZigzag",
      title: "折线",
      text: `${ownerTitle()}，这条折线像小闪电，我被你晃醒了。`,
      color: "#ff35d4",
    },
    circle: {
      activity: "mouseCircle",
      title: "绕圈",
      text: `${ownerTitle()}，你画了个圈，我差点开始转圈巡航。`,
      color: "#82ff8f",
    },
  }[kind];
  if (!gesture) return false;

  mouseGestureState.lastGesture = kind;
  setActivity(gesture.activity, 2100);
  burst("spark", 5, 120, 78, gesture.color);
  showFeedback(gesture.text, gesture.title, 3800, "mouse");
  say(`${displayName()} ${gesture.text}`, gesture.title);
  return true;
}

function handlePetClick() {
  if (state.mode === "egg") {
    hatchPet();
    return;
  }
  if (state.mode === "hatching") {
    say("孵化舱正在发光，马上就出来。", "孵化中");
    return;
  }
  petPet();
}

function getPublicState() {
  return {
    mode: state.mode,
    pet: state.pet
      ? { id: state.pet.id, name: displayName(), speciesName: speciesName(), personality: state.pet.personality }
      : null,
    identity: {
      petName: state.identity.petName,
      ownerName: ownerTitle(),
    },
    stats: Object.fromEntries(Object.entries(state.stats).map(([key, value]) => [key, Math.round(value)])),
    activity: {
      kind: state.activity.kind,
      timeLeftMs: Math.round(state.activity.timeLeftMs),
      nextAutoActionMs: Math.round(state.nextAutoActionMs),
    },
    particles: particles.length,
    message: state.message,
    lastAction: state.lastAction,
    clock: {
      intervalMs: state.clock.intervalMs,
      intervalLabel: clockIntervalLabel(),
      format: state.clock.format,
      formatLabel: CLOCK_FORMATS[state.clock.format]?.label || CLOCK_FORMATS.hm24.label,
      nextInMs: Math.max(0, Math.round(state.clock.nextInMs)),
      lastText: state.clock.lastText,
      lastVisual: state.clock.lastVisual,
    },
    care: {
      alertThreshold: state.care.alertThreshold,
      alertCooldownMs: Math.max(0, Math.round(state.care.alertCooldownMs)),
      lastAlert: state.care.lastAlert,
    },
    ownerCall: {
      intervalMs: state.ownerCall.intervalMs,
      intervalLabel: ownerCallIntervalLabel(),
      nextInMs: Math.max(0, Math.round(state.ownerCall.nextInMs)),
      lastText: state.ownerCall.lastText,
    },
    checkIn: {
      intervalMs: state.checkIn.intervalMs,
      intervalLabel: checkInIntervalLabel(),
      nextInMs: Math.max(0, Math.round(state.checkIn.nextInMs)),
      promptOpen: activityPromptState.open,
      promptPeriod: state.checkIn.promptPeriod,
      pendingReminder: state.checkIn.pendingReminder
        ? {
            choiceKey: state.checkIn.pendingReminder.choiceKey,
            timeLeftMs: Math.round(state.checkIn.pendingReminder.timeLeftMs),
            text: state.checkIn.pendingReminder.text,
          }
        : null,
      lastChoice: state.checkIn.lastChoice,
      lastText: state.checkIn.lastText,
    },
    mouseGesture: {
      lastGesture: mouseGestureState.lastGesture,
      cooldownMs: Math.round(mouseGestureState.cooldownMs),
    },
    feedback: {
      title: state.feedback.title,
      text: state.feedback.text,
      timeLeftMs: Math.round(state.feedback.timeLeftMs),
      variant: state.feedback.variant,
    },
    hover: {
      show: hoverState.show,
      stillMs: Math.round(hoverState.stillMs),
    },
  };
}

function getMenuState() {
  const publicState = getPublicState();
  return {
    mode: publicState.mode,
    petName: publicState.pet?.name || "未孵化",
    speciesName: publicState.pet?.speciesName || "未孵化",
    identity: publicState.identity,
    lastAction: publicState.lastAction,
    stats: publicState.stats,
    clock: publicState.clock,
    care: publicState.care,
    ownerCall: publicState.ownerCall,
    checkIn: publicState.checkIn,
  };
}

function runDesktopCommand(command, value) {
  const handlers = {
    hatch: hatchPet,
    resetEgg: resetToEgg,
    feed: feedPet,
    play: playPet,
    explore: explorePet,
    pet: petPet,
    dance: dancePet,
    sleep: sleepPet,
    clean: cleanPet,
    announceTime: () => announceTime("manual"),
    promptPetName,
    promptOwnerName,
    callOwner: () => triggerOwnerCall("manual"),
    startCheckIn: () => openActivityPrompt("manual"),
  };

  if (command === "mood") {
    respondMood(value);
  } else if (command === "clockInterval") {
    setClockInterval(value);
  } else if (command === "clockFormat") {
    setClockFormat(value);
  } else if (command === "careThreshold") {
    setCareAlertThreshold(value);
  } else if (command === "setPetName") {
    setPetName(value);
  } else if (command === "setOwnerName") {
    setOwnerName(value);
  } else if (command === "ownerCallInterval") {
    setOwnerCallInterval(value);
  } else if (command === "checkInInterval") {
    setCheckInInterval(value);
  } else if (command === "checkInChoice") {
    respondCheckIn(value);
  } else if (command === "mouseGesture") {
    triggerMouseGesture(value);
  } else if (handlers[command]) {
    handlers[command]();
  } else {
    say("这个菜单指令我还没学会。", "未知指令");
  }

  renderDom();
  render();
  return getPublicState();
}

window.render_desktop_pet_to_text = () => JSON.stringify(getPublicState());

window.advanceTime = (ms) => {
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  for (let i = 0; i < steps; i += 1) update(ms / steps);
  renderDom();
  render();
};

window.force_desktop_pet_auto_action = () => {
  state.activity.timeLeftMs = 0;
  const ok = triggerAutoAction();
  renderDom();
  render();
  return JSON.stringify({
    ok,
    mode: state.mode,
    activity: state.activity.kind,
    lastAction: state.lastAction,
    message: state.message,
  });
};

window.force_desktop_pet_owner_call = () => {
  state.activity.timeLeftMs = 0;
  const ok = triggerOwnerCall("auto");
  renderDom();
  render();
  return JSON.stringify({
    ok,
    mode: state.mode,
    activity: state.activity.kind,
    lastAction: state.lastAction,
    message: state.message,
    ownerCall: getPublicState().ownerCall,
    feedback: getPublicState().feedback,
  });
};

window.force_desktop_pet_check_in = (periodKey = getDayPeriod().key) => {
  state.activity.timeLeftMs = 0;
  closeActivityPrompt(false);
  const ok = openActivityPrompt("manual", periodKey);
  renderDom();
  render();
  return JSON.stringify({
    ok,
    mode: state.mode,
    activity: state.activity.kind,
    lastAction: state.lastAction,
    message: state.message,
    checkIn: getPublicState().checkIn,
    feedback: getPublicState().feedback,
  });
};

window.choose_desktop_pet_check_in = (choiceKey) => {
  return JSON.stringify(runDesktopCommand("checkInChoice", choiceKey));
};

window.force_desktop_pet_check_in_reminder = () => {
  state.activity.timeLeftMs = 0;
  if (state.checkIn.pendingReminder) {
    state.checkIn.pendingReminder.timeLeftMs = 0;
  }
  const ok = triggerCheckInReminder();
  renderDom();
  render();
  return JSON.stringify({
    ok,
    mode: state.mode,
    activity: state.activity.kind,
    lastAction: state.lastAction,
    message: state.message,
    checkIn: getPublicState().checkIn,
    feedback: getPublicState().feedback,
  });
};

window.force_desktop_pet_mouse_gesture = (kind) => {
  const ok = triggerMouseGesture(kind);
  renderDom();
  render();
  return JSON.stringify({
    ok,
    mode: state.mode,
    activity: state.activity.kind,
    lastAction: state.lastAction,
    message: state.message,
    mouseGesture: getPublicState().mouseGesture,
    feedback: getPublicState().feedback,
  });
};

window.reset_desktop_pet_to_egg = () => {
  resetToEgg();
  return window.render_desktop_pet_to_text();
};

window.choose_desktop_pet_mood = (moodKey) => {
  return JSON.stringify(runDesktopCommand("mood", moodKey));
};

window.set_desktop_pet_stats = (stats = {}) => {
  Object.entries(stats).forEach(([key, value]) => {
    if (!(key in state.stats)) return;
    const max = key === "coins" ? 999 : 100;
    state.stats[key] = clamp(Number(value), 0, max);
  });
  state.care.alertCooldownMs = 0;
  renderDom();
  render();
  return JSON.stringify(getPublicState());
};

window.force_desktop_pet_care_check = () => {
  state.activity.timeLeftMs = 0;
  state.care.alertCooldownMs = 0;
  updateCareAlerts(0);
  renderDom();
  render();
  return JSON.stringify(getPublicState());
};

window.force_desktop_pet_hover_status = () => {
  hoverState.over = true;
  hoverState.stillMs = 3000;
  hoverState.show = state.mode === "hatched";
  renderDom();
  render();
  return JSON.stringify(getPublicState());
};

window.get_desktop_pet_menu_state = () => JSON.stringify(getMenuState());
window.run_desktop_pet_command = (command, value) => JSON.stringify(runDesktopCommand(command, value));

ui.nameEditor?.addEventListener("submit", (event) => {
  event.preventDefault();
  submitNameEditor();
});
ui.nameEditor?.addEventListener("pointerdown", (event) => {
  event.stopPropagation();
});
ui.nameEditorCancel?.addEventListener("click", () => {
  closeNameEditor();
});
ui.nameEditorInput?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeNameEditor();
  }
});
ui.activityPrompt?.addEventListener("pointerdown", (event) => {
  event.stopPropagation();
});
ui.activityPromptClose?.addEventListener("click", () => {
  closeActivityPrompt(true);
  showFeedback(`${ownerTitle()}，那我稍后再来问你。`, "稍后再问", 3600, "check");
  say(`${displayName()} ${ownerTitle()}，那我稍后再来问你。`, "稍后再问");
});

canvas.addEventListener("pointerdown", beginDrag);
canvas.addEventListener("pointerenter", beginHover);
canvas.addEventListener("pointermove", moveDrag);
canvas.addEventListener("pointerup", endDrag);
canvas.addEventListener("pointerleave", endHover);
canvas.addEventListener("pointercancel", (event) => {
  dragStart = null;
  endHover();
  try {
    canvas.releasePointerCapture(event.pointerId);
  } catch {
    // Pointer capture may already be released.
  }
});
document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  window.desktopPet?.showContextMenu(getMenuState());
});
window.desktopPet?.onCommand((payload) => runDesktopCommand(payload.command, payload.value));

renderDom();
render();
requestAnimationFrame(tick);
