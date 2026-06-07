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
  todoPanel: document.getElementById("todoPanel"),
  todoPanelTitle: document.getElementById("todoPanelTitle"),
  todoPanelBody: document.getElementById("todoPanelBody"),
  todoMeta: document.getElementById("todoMeta"),
  todoInput: document.getElementById("todoInput"),
  todoList: document.getElementById("todoList"),
  todoSave: document.getElementById("todoSave"),
  todoFeedback: document.getElementById("todoFeedback"),
  todoAllDone: document.getElementById("todoAllDone"),
  todoCarryover: document.getElementById("todoCarryover"),
  todoLater: document.getElementById("todoLater"),
  todoClose: document.getElementById("todoClose"),
  journalPanel: document.getElementById("journalPanel"),
  journalList: document.getElementById("journalList"),
  journalClear: document.getElementById("journalClear"),
  journalClose: document.getElementById("journalClose"),
  quickBar: document.getElementById("quickBar"),
  quickBarSub: document.getElementById("quickBarSub"),
  quickBarCats: document.getElementById("quickBarCats"),
  quickBarCatButtons: Array.from(document.querySelectorAll("[data-quick-cat]")),
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
  {
    kind: "peek",
    durationMs: 1800,
    action: "探头",
    message: "探出一点点像素脑袋：我还在这里陪你。",
    particle: "spark",
    count: 4,
    x: 86,
    y: 74,
    color: "#61fff4",
  },
  {
    kind: "listen",
    durationMs: 2200,
    action: "聆听",
    message: () => `${ownerTitle()}，我把陪伴频道调亮了。你忙你的，我守着。`,
    particle: "heart",
    count: 4,
    x: 120,
    y: 72,
    color: "#ff35d4",
  },
  {
    kind: "typing",
    durationMs: 2100,
    action: "陪工",
    message: "敲了两下空气键盘：我们把眼前这一小格做完。",
    particle: "spark",
    count: 5,
    x: 162,
    y: 106,
    color: "#61fff4",
  },
  {
    kind: "scanLine",
    durationMs: 1900,
    action: "扫描",
    message: "扫过桌面边缘，没有发现危险，只发现一点点疲惫信号。",
    particle: "spark",
    count: 4,
    x: 120,
    y: 58,
    color: "#ffe66a",
  },
  {
    kind: "guard",
    durationMs: 2300,
    action: "守护",
    message: () => `${displayName()} 站到角落值班：${ownerTitle()}的注意力由我保护。`,
    particle: "heart",
    count: 5,
    x: 78,
    y: 96,
    color: "#82ff8f",
  },
  {
    kind: "curious",
    durationMs: 1900,
    action: "好奇",
    message: "歪了歪头：你刚才那一下鼠标移动，像一条秘密路线。",
    particle: "spark",
    count: 4,
    x: 150,
    y: 70,
    color: "#ff35d4",
  },
  {
    kind: "dream",
    durationMs: 2400,
    action: "小梦",
    message: "眯了一秒，好像梦见自己在霓虹云里追光点。",
    particle: "sleep",
    count: 4,
    x: 158,
    y: 56,
    color: "#61fff4",
  },
  {
    kind: "idleTalk",
    durationMs: 2100,
    action: "碎碎念",
    message: () => {
      const daily = dailyTaskSummary();
      return `今日日常 ${daily}。不急，我们慢慢把它点亮。`;
    },
    particle: "note",
    count: 4,
    x: 145,
    y: 70,
    color: "#ffe66a",
  },
];

const TALK_INTERACTIONS = [
  {
    activity: "talk",
    action: "聊聊",
    message: () => `${ownerTitle()}，我在线。现在最适合做一件很小、但能让你变轻一点的事。`,
    particle: "note",
    color: "#61fff4",
  },
  {
    activity: "listen",
    action: "陪你",
    message: () => `我记得你的节奏。${state.memory.lastInsight || "今天还没有形成固定模式，不过我们可以一起慢慢养成。"}`,
    particle: "heart",
    color: "#ff35d4",
  },
  {
    activity: "curious",
    action: "好奇",
    message: () => `${ownerTitle()}，你现在是在冲刺，还是在偷偷摸摸恢复能量？我可以配合。`,
    particle: "spark",
    color: "#ffe66a",
  },
  {
    activity: "guard",
    action: "守护",
    message: () => `${displayName()} 小声报告：饱腹 ${Math.round(state.stats.satiety)}，快乐 ${Math.round(state.stats.happiness)}，能量 ${Math.round(state.stats.energy)}。`,
    particle: "spark",
    color: "#82ff8f",
  },
  {
    activity: "typing",
    action: "陪工",
    message: () => `${ownerTitle()}，我给你开一个小小专注盾。先做 5 分钟，不用一口气赢完整天。`,
    particle: "note",
    color: "#61fff4",
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

const TODO_MORNING_TIMES = ["07:30", "08:00", "08:30", "09:00", "09:30", "10:00"];
const TODO_EVENING_TIMES = ["20:00", "21:00", "21:30", "22:00", "23:00"];
const TODO_REMINDER_INTERVALS = [
  { label: "关闭", value: 0 },
  { label: "1 小时", value: 60 * 60 * 1000 },
  { label: "2 小时", value: 2 * 60 * 60 * 1000 },
  { label: "3 小时", value: 3 * 60 * 60 * 1000 },
];
const DEFAULT_TODO_MORNING_TIME = "09:00";
const DEFAULT_TODO_EVENING_TIME = "21:30";
const DEFAULT_TODO_REMINDER_INTERVAL_MS = 2 * 60 * 60 * 1000;

const DAY_PERIODS = [
  { key: "morning", label: "上午", start: 5, end: 10, greeting: "上午好", nudge: "这一段很适合进入稳定节奏。" },
  { key: "noon", label: "中午", start: 11, end: 13, greeting: "中午好", nudge: "别忘了吃饭和放松眼睛。" },
  { key: "afternoon", label: "下午", start: 14, end: 17, greeting: "下午好", nudge: "下午的能量要分配得聪明一点。" },
  { key: "evening", label: "晚上", start: 18, end: 22, greeting: "晚上好", nudge: "晚上适合收尾，也适合奖励自己。" },
  { key: "night", label: "夜里", start: 23, end: 4, greeting: "夜深了", nudge: "如果还在忙，记得把休息也放进计划。" },
];

const PERIOD_THEMES = {
  morning: { label: "晨光", main: "#ffe66a", dark: "#1b2f34", accent: "#82ff8f", spark: "#fff3a6" },
  noon: { label: "正午", main: "#61fff4", dark: "#153448", accent: "#ffe66a", spark: "#ecfbff" },
  afternoon: { label: "午后", main: "#ff8a4c", dark: "#2d2034", accent: "#ff35d4", spark: "#ffe66a" },
  evening: { label: "暮色", main: "#b066ff", dark: "#1d1538", accent: "#ffb8ec", spark: "#61fff4" },
  night: { label: "夜航", main: "#5f7bff", dark: "#0d1630", accent: "#61fff4", spark: "#9be7ff" },
};

const SEASON_THEMES = {
  spring: { label: "春天", tint: "#82ff8f", mood: "新芽一样轻轻亮起来" },
  summer: { label: "夏天", tint: "#61fff4", mood: "像热风里的小电波" },
  autumn: { label: "秋天", tint: "#ffe66a", mood: "像把金色缓存慢慢收好" },
  winter: { label: "冬天", tint: "#9be7ff", mood: "像在冷空气里开着小暖灯" },
};

const BOND_FEEDBACK = {
  1: [
    "亲密度 Lv.1，{pet} 还在小心观察你的节奏，所以回应会带一点试探。",
    "{growth}阶段里，{pet} 会先记住你喜欢怎样互动。",
  ],
  2: [
    "亲密度 Lv.2，{pet} 已经能认出你的常用节奏了。",
    "{growth}阶段里，{pet} 的回应开始带一点熟人感。",
  ],
  3: [
    "亲密度 Lv.3，{pet} 会更主动地把反馈说给{owner}听。",
    "{growth}阶段里，这次互动被存进稳定陪伴缓存。",
  ],
  4: [
    "亲密度 Lv.4，{pet} 已经很会贴着{owner}的节奏回应。",
    "{growth}阶段里，{pet} 会把动作做得更亲近一点。",
  ],
  5: [
    "亲密度 Lv.5，{pet} 像老朋友一样把这次互动接住了。",
    "{growth}阶段里，{pet} 几乎不用校准就知道该怎样陪你。",
  ],
};

const INTERACTION_MOTIONS = {
  feed: [
    { activity: "eat", durationMs: 1800, particle: "food", count: 5, x: 92, y: 108, color: "#ffe66a" },
    { activity: "eatCharge", durationMs: 2200, particle: "spark", count: 7, x: 108, y: 84, color: "#82ff8f" },
    { activity: "eatShare", durationMs: 2100, particle: "heart", count: 6, x: 96, y: 102, color: "#ffb8ec" },
  ],
  play: [
    { activity: "play", durationMs: 2200, particle: "spark", count: 7, x: 160, y: 96, color: "#ff35d4" },
    { activity: "playOrbit", durationMs: 2600, particle: "spark", count: 8, x: 122, y: 74, color: "#61fff4" },
    { activity: "playBounce", durationMs: 2300, particle: "note", count: 6, x: 150, y: 96, color: "#ffe66a" },
  ],
  explore: [
    { activity: "explore", durationMs: 2400, particle: "spark", count: 6, x: 172, y: 72, color: "#61fff4" },
    { activity: "exploreMap", durationMs: 2700, particle: "spark", count: 7, x: 74, y: 88, color: "#ffe66a" },
    { activity: "exploreTreasure", durationMs: 2600, particle: "food", count: 5, x: 164, y: 104, color: "#82ff8f" },
  ],
  pet: [
    { activity: "pet", durationMs: 1700, particle: "heart", count: 8, x: 122, y: 70, color: "#ff35d4" },
    { activity: "petNuzzle", durationMs: 2200, particle: "heart", count: 9, x: 110, y: 76, color: "#ffb8ec" },
    { activity: "hug", durationMs: 2300, particle: "heart", count: 10, x: 122, y: 72, color: "#ff35d4" },
  ],
  dance: [
    { activity: "dance", durationMs: 2800, particle: "note", count: 10, x: 142, y: 72, color: "#82ff8f" },
    { activity: "danceSpin", durationMs: 3000, particle: "note", count: 12, x: 120, y: 70, color: "#ff35d4" },
    { activity: "sparkRush", durationMs: 2600, particle: "spark", count: 10, x: 122, y: 84, color: "#ffe66a" },
  ],
  sleep: [
    { activity: "sleep", durationMs: 3200, particle: "sleep", count: 5, x: 158, y: 58, color: "#61fff4" },
    { activity: "dream", durationMs: 3400, particle: "sleep", count: 7, x: 154, y: 50, color: "#ffb8ec" },
    { activity: "sleepCharge", durationMs: 3300, particle: "spark", count: 6, x: 96, y: 94, color: "#82ff8f" },
  ],
  clean: [
    { activity: "clean", durationMs: 2100, particle: "bubble", count: 10, x: 120, y: 110, color: "#61fff4" },
    { activity: "cleanPolish", durationMs: 2300, particle: "spark", count: 9, x: 122, y: 82, color: "#ecfbff" },
    { activity: "cleanBubble", durationMs: 2400, particle: "bubble", count: 14, x: 126, y: 96, color: "#9be7ff" },
  ],
  tickle: [
    { activity: "tickle", durationMs: 2100, particle: "heart", count: 7, x: 118, y: 80, color: "#ffb8ec" },
    { activity: "tickleWiggle", durationMs: 2400, particle: "note", count: 8, x: 130, y: 72, color: "#ffe66a" },
    { activity: "tickleLaugh", durationMs: 2300, particle: "spark", count: 8, x: 108, y: 78, color: "#ff35d4" },
  ],
  snack: [
    { activity: "snack", durationMs: 2000, particle: "food", count: 6, x: 92, y: 108, color: "#ffb8ec" },
    { activity: "snackPop", durationMs: 2300, particle: "food", count: 8, x: 114, y: 84, color: "#ffe66a" },
    { activity: "snackStar", durationMs: 2300, particle: "spark", count: 9, x: 126, y: 78, color: "#82ff8f" },
  ],
  hide: [
    { activity: "hidePeek", durationMs: 2600, particle: "spark", count: 6, x: 78, y: 88, color: "#61fff4" },
    { activity: "hideBox", durationMs: 2800, particle: "heart", count: 6, x: 122, y: 96, color: "#ffe66a" },
    { activity: "hideShadow", durationMs: 2500, particle: "spark", count: 7, x: 160, y: 96, color: "#ff35d4" },
  ],
  highFive: [
    { activity: "highFive", durationMs: 2100, particle: "spark", count: 8, x: 120, y: 64, color: "#ffe66a" },
    { activity: "highFiveJump", durationMs: 2300, particle: "heart", count: 7, x: 128, y: 72, color: "#82ff8f" },
    { activity: "highFiveFlash", durationMs: 2200, particle: "spark", count: 10, x: 122, y: 76, color: "#61fff4" },
  ],
  sing: [
    { activity: "sing", durationMs: 2700, particle: "note", count: 9, x: 142, y: 70, color: "#ffb8ec" },
    { activity: "singPulse", durationMs: 2900, particle: "note", count: 12, x: 120, y: 72, color: "#61fff4" },
    { activity: "singSolo", durationMs: 2800, particle: "spark", count: 8, x: 134, y: 76, color: "#ffe66a" },
  ],
  photo: [
    { activity: "photoPose", durationMs: 2600, particle: "spark", count: 8, x: 122, y: 70, color: "#ecfbff" },
    { activity: "photoFlash", durationMs: 2400, particle: "spark", count: 12, x: 120, y: 78, color: "#ffe66a" },
    { activity: "photoHeart", durationMs: 2600, particle: "heart", count: 10, x: 122, y: 72, color: "#ffb8ec" },
  ],
};

const MOOD_ACTIVITY_VARIANTS = {
  happy: ["celebrate", "dance", "sparkRush"],
  sad: ["comfortSad", "hug", "comfort"],
  anxious: ["breathe", "focus", "restBuddy"],
  tired: ["sleep", "sleepCharge", "dream"],
  angry: ["vent", "breathe", "mouseZigzag"],
  bored: ["playOrbit", "wiggle", "curious"],
  lonely: ["hug", "petNuzzle", "callOwner"],
  excited: ["sparkRush", "danceSpin", "celebrate"],
  calm: ["breathe", "idleBuddy", "dream"],
  stressed: ["focus", "breathe", "comfortSad"],
};

const DRAG_INTERACTIONS = {
  any: [
    { activity: "dragCarry", title: "搬家中", text: "{pet} 被你搬到新位置，先把小爪子贴稳。", particle: "spark", color: "#61fff4" },
    { activity: "dragFloat", title: "轻飘飘", text: "{pet} 像坐了一小段桌面电梯，落地后还晃了晃。", particle: "heart", color: "#ffb8ec" },
  ],
  long: [
    { activity: "dragComet", title: "长途拖动", text: "这次移动距离很远，{pet} 拖出一条小小霓虹尾迹。", particle: "spark", color: "#ffe66a" },
  ],
  horizontal: [
    { activity: "dragComet", title: "横向巡航", text: "{pet} 被横向带飞了一下，像完成一次桌面巡航。", particle: "spark", color: "#61fff4" },
  ],
  vertical: [
    { activity: "dragFloat", title: "上下升降", text: "{pet} 被上下搬动，认真校准了新的桌面高度。", particle: "note", color: "#82ff8f" },
  ],
  tiny: [
    { activity: "dragDizzy", title: "挪一小格", text: "{pet} 被轻轻挪了一点点，歪头确认这里也不错。", particle: "heart", color: "#ff35d4" },
  ],
};

const INTERACTION_FEEDBACK = {
  feed: {
    base: [
      "{pet} 把能量饼咬成小小像素块，顺手吐出 2C。",
      "{pet} 吃得很认真，像在给自己的电池做校准。",
      "这口补给刚刚好，{pet} 的尾巴亮了一小格。",
    ],
    period: {
      morning: ["上午先垫一口，{pet} 说今天可以从稳定能量开始。"],
      noon: ["中午补给到位，{pet} 眯着眼说：别忘了你也要吃饭。"],
      afternoon: ["下午这块能量饼像续航补丁，{pet} 咔嚓一下装好了。"],
      evening: ["晚上吃一点点就好，{pet} 把亮度调成收尾模式。"],
      night: ["夜里收到补给，{pet} 小声说：别熬太久，我会守着。"],
    },
    state: {
      hungry: ["饱腹槽刚才有点低，{pet} 接过食物时眼睛一下亮了。"],
      tired: ["能量有点低，{pet} 把这口补给当成小型充电仪式。"],
    },
    season: {
      spring: ["春天的补给像新芽，{pet} 吃完轻轻抖了抖耳朵。"],
      summer: ["夏天吃完要配水，{pet} 顺手提醒你也喝一口。"],
      autumn: ["秋天这口很踏实，像把金色能量收进口袋。"],
      winter: ["冬天的能量饼像小暖炉，{pet} 贴近了一点。"],
    },
  },
  play: {
    base: [
      "{pet} 追着霓虹光点绕了一圈，开心值开始跳拍。",
      "{pet} 把桌面当成小跑道，跑完还回头看你。",
      "光点弹出去，{pet} 一路追到窗口边缘才刹住。",
    ],
    period: {
      morning: ["上午玩一小会儿，{pet} 像把身体缓存活动开了。"],
      noon: ["中午的光点有点刺眼，{pet} 还是开心地追了半圈。"],
      afternoon: ["下午适合用小游戏重启注意力，{pet} 已经就位。"],
      evening: ["晚上玩耍像奖励关卡，{pet} 跳得很轻快。"],
      night: ["夜里只玩短短一局，{pet} 说不打扰你的休息节奏。"],
    },
    state: {
      tired: ["能量槽不高，{pet} 玩得短一点，但还是认真陪你。"],
      bored: ["快乐值刚才有点低，这一轮光点把它救回来了。"],
      messy: ["玩完以后像素边缘有点乱，{pet} 假装没看见。"],
    },
    season: {
      spring: ["春天的光点像新芽弹跳，{pet} 追得很欢。"],
      summer: ["夏天玩起来像小电风，{pet} 尾巴甩出亮线。"],
      autumn: ["秋天的小游戏有种收获感，{pet} 把开心捡了回来。"],
      winter: ["冬天也要动一动，{pet} 玩完像小暖灯一样亮。"],
    },
  },
  pet: {
    base: [
      "{pet} 被摸摸以后往你这边蹭了一下。",
      "{pet} 的像素耳朵抖了抖，亲密度悄悄上涨。",
      "摸摸收到，{pet} 把这一下存进了喜欢缓存。",
    ],
    period: {
      morning: ["上午的摸摸像开机问候，{pet} 精神了一点。"],
      noon: ["中午被摸摸，{pet} 像在阳光里打了个小盹。"],
      afternoon: ["下午摸摸很有效，{pet} 帮你把疲惫压低一点。"],
      evening: ["晚上这一下摸摸像收尾奖励，{pet} 贴近了。"],
      night: ["夜里的摸摸很安静，{pet} 小声亮了一下。"],
    },
    state: {
      lonely: ["亲密信号收到，{pet} 这次贴得比平时更近。"],
      bored: ["快乐有点低的时候，摸摸就是最短的救援路线。"],
    },
    season: {
      spring: ["春天的摸摸很轻，像新芽碰到光。"],
      summer: ["夏天的摸摸带着一点热度，{pet} 眯起眼。"],
      autumn: ["秋天的摸摸很稳，{pet} 像被好好安放。"],
      winter: ["冬天的摸摸像暖手，{pet} 把亮度调软了。"],
    },
  },
  explore: {
    base: [
      "{pet} 沿着桌面边缘巡航了一圈，带回一段发光缓存。",
      "{pet} 扫描了窗口阴影，确认这里仍然是安全区域。",
      "一次短探险结束，{pet} 把发现的小信号交给你。",
    ],
    period: {
      morning: ["上午探险像开地图，{pet} 先帮你扫清桌面边缘。"],
      noon: ["中午巡航完成，{pet} 带回一点明亮缓存。"],
      afternoon: ["下午的探险更像侦察，{pet} 把疲惫信号标出来了。"],
      evening: ["晚上探险变成收尾巡逻，{pet} 认真检查角落。"],
      night: ["夜里探险只走短路线，{pet} 不想让你太晚还兴奋。"],
    },
    state: {
      tired: ["能量不高，{pet} 只探了一小段就回来报平安。"],
      messy: ["像素边缘有点灰，探险回来更该清洁一下了。"],
    },
    season: {
      spring: ["春天的桌面边缘像新地图，{pet} 找到一点新鲜信号。"],
      summer: ["夏天巡航很亮，{pet} 带回一阵电气热风。"],
      autumn: ["秋天探险像捡落叶缓存，{pet} 收得很仔细。"],
      winter: ["冬天探险偏安静，{pet} 带回一点冷蓝色信号。"],
    },
  },
  dance: {
    base: [
      "{pet} 播放一段赛博节拍，跳得像小小霓虹灯。",
      "{pet} 跟着看不见的鼓点左右闪烁，开心溢出来了。",
      "舞步启动，{pet} 把桌面空气踩成了节拍格。",
    ],
    period: {
      morning: ["上午跳舞像开机动画，{pet} 精准同步节拍。"],
      noon: ["中午的节拍很亮，{pet} 跳完提醒你休息眼睛。"],
      afternoon: ["下午跳一段刚好提神，{pet} 把困意甩开。"],
      evening: ["晚上这一舞像庆祝今天撑到这里，{pet} 很投入。"],
      night: ["夜里只跳静音版，{pet} 还是偷偷亮了几个音符。"],
    },
    state: {
      tired: ["能量不算高，{pet} 跳得克制，但节拍没掉。"],
      bored: ["快乐偏低的时候，跳舞就是最快的亮灯方式。"],
    },
    season: {
      spring: ["春天的舞步轻快，像新芽在像素里发光。"],
      summer: ["夏天的舞步很热，{pet} 差点跳成电火花。"],
      autumn: ["秋天的节拍稳稳落地，{pet} 跳得像收获庆典。"],
      winter: ["冬天跳舞像取暖，{pet} 一边跳一边发光。"],
    },
  },
  sleep: {
    base: [
      "{pet} 进入低功耗小睡，呼吸频率慢慢变稳。",
      "{pet} 把眼睛合成一条线，开始安静充电。",
      "睡眠模式启动，{pet} 的像素边缘柔和下来。",
    ],
    period: {
      morning: ["上午小睡像回笼缓存，{pet} 只休息一小段。"],
      noon: ["中午休息很合理，{pet} 顺手把午间亮度调低。"],
      afternoon: ["下午补觉像续航包，{pet} 睡得很认真。"],
      evening: ["晚上睡一下，{pet} 说今天可以慢慢收尾。"],
      night: ["夜里睡觉最合适，{pet} 希望你也快一点休息。"],
    },
    state: {
      tired: ["能量槽低的时候，这次睡觉像真正的维修。"],
      hungry: ["睡前肚子有点空，{pet} 还是先眯一会儿。"],
    },
    season: {
      spring: ["春天的小睡很浅，{pet} 像趴在柔软光里。"],
      summer: ["夏天小睡需要降温，{pet} 把光调成清凉蓝。"],
      autumn: ["秋天很适合安静补能，{pet} 睡得像一枚小电池。"],
      winter: ["冬天睡觉像进暖窝，{pet} 的亮度变得软软的。"],
    },
  },
  clean: {
    base: [
      "{pet} 的像素边缘被擦得亮晶晶。",
      "清洁泡泡滚过，{pet} 像刚刷新过贴图。",
      "{pet} 抖掉一点灰，重新变成清爽小像素。",
    ],
    period: {
      morning: ["上午清洁像开机整理，{pet} 准备好陪你一天。"],
      noon: ["中午清洁后，{pet} 的边缘反光更亮了。"],
      afternoon: ["下午洗一洗，疲惫缓存也被冲掉一点。"],
      evening: ["晚上清洁像给今天收尾，{pet} 变得很安静。"],
      night: ["夜里轻轻擦一下，{pet} 不想发出太大动静。"],
    },
    state: {
      messy: ["清洁值刚才偏低，{pet} 被擦完以后明显精神了。"],
      bored: ["清洁也算换心情，{pet} 的快乐条轻轻抬头。"],
    },
    season: {
      spring: ["春天清洁像拂掉花粉缓存，{pet} 闪得很新。"],
      summer: ["夏天清洁很必要，{pet} 把热乎乎的灰都洗掉。"],
      autumn: ["秋天像素容易沾上金色尘埃，{pet} 擦得很仔细。"],
      winter: ["冬天清洁要轻一点，{pet} 不想把暖光擦掉。"],
    },
  },
  tickle: {
    base: [
      "{pet} 被挠到笑点，像素身体抖成一串小节拍。",
      "{pet} 假装很严肃，下一秒还是笑得亮了一圈。",
      "挠痒痒命中，{pet} 把快乐缓存抖出来一点。",
    ],
    period: {
      morning: ["上午挠痒像开机逗乐，{pet} 一下清醒了。"],
      noon: ["中午这一挠很轻，{pet} 笑完提醒你也放松肩膀。"],
      afternoon: ["下午挠痒刚好提神，{pet} 把困意甩掉一格。"],
      evening: ["晚上挠痒像小奖励，{pet} 笑得很收敛但很开心。"],
      night: ["夜里只轻轻挠一下，{pet} 小声笑了一串像素。"],
    },
    season: {
      spring: ["春天的挠痒像新芽碰到风，轻轻一抖。"],
      summer: ["夏天挠痒更像小电流，{pet} 笑得很亮。"],
      autumn: ["秋天这一挠很稳，{pet} 把快乐收进口袋。"],
      winter: ["冬天挠痒像隔着暖光玩，{pet} 贴近一点。"],
    },
  },
  snack: {
    base: [
      "{pet} 收到一枚小零食，认真咔嚓咔嚓。",
      "{pet} 把零食当成惊喜补丁，开心条轻轻跳了一下。",
      "小零食投递成功，{pet} 眼睛亮成两颗像素糖。",
    ],
    period: {
      morning: ["上午的小零食像启动糖，{pet} 说今天可以轻一点开始。"],
      noon: ["中午零食不要替代正餐，{pet} 顺便提醒你也吃饭。"],
      afternoon: ["下午小零食像续航彩蛋，{pet} 收得很快乐。"],
      evening: ["晚上这枚零食像今日奖励，{pet} 很珍惜地吃掉。"],
      night: ["夜里零食只吃一点点，{pet} 不想把你也带精神。"],
    },
    season: {
      spring: ["春天的小零食像新鲜信号，{pet} 吃完眨了眨眼。"],
      summer: ["夏天零食要配水，{pet} 把提醒递给你。"],
      autumn: ["秋天零食像小小收获，{pet} 很满足。"],
      winter: ["冬天零食像暖糖，{pet} 吃完亮度变软。"],
    },
  },
  hide: {
    base: [
      "{pet} 藏到桌面边缘，又探出半个像素脑袋。",
      "躲猫猫开始，{pet} 觉得自己藏得非常专业。",
      "{pet} 消失了 0.5 秒，然后忍不住自己跳出来。",
    ],
    period: {
      morning: ["上午躲猫猫像热身小游戏，{pet} 精神起来了。"],
      noon: ["中午躲一下太阳，{pet} 从阴影里偷看你。"],
      afternoon: ["下午玩躲猫猫很提神，{pet} 把注意力拉回来。"],
      evening: ["晚上躲猫猫像收尾彩蛋，{pet} 出现得很得意。"],
      night: ["夜里躲猫猫要安静，{pet} 只露出一只像素眼。"],
    },
    season: {
      spring: ["春天很适合从新芽一样的光里冒出来。"],
      summer: ["夏天它躲进清凉蓝色阴影里。"],
      autumn: ["秋天的躲猫猫像藏进金色缓存。"],
      winter: ["冬天它只躲一小会儿，还是想靠近暖光。"],
    },
  },
  photo: {
    base: [
      "{pet} 摆了一个小小像素姿势，合影信号保存。",
      "合影完成，{pet} 把这一刻放进陪伴相册。",
      "{pet} 对着看不见的镜头眨眼，快门亮了一下。",
    ],
    period: {
      morning: ["上午的合影像今日第一张打卡，{pet} 很精神。"],
      noon: ["中午光线很亮，{pet} 说这张应该很清楚。"],
      afternoon: ["下午合影像给努力留一个证据，{pet} 站得很稳。"],
      evening: ["晚上合影像收尾纪念，{pet} 的光变得柔和。"],
      night: ["夜里合影用低亮度闪光，{pet} 不想吵到你。"],
    },
    season: {
      spring: ["春天这张像刚发芽的陪伴记录。"],
      summer: ["夏天这张亮得像热风里的电波。"],
      autumn: ["秋天这张适合收藏，像金色小备份。"],
      winter: ["冬天这张带一点暖灯感，{pet} 很满意。"],
    },
  },
  highFive: {
    base: [
      "{pet} 伸出小爪子和你击掌，屏幕边缘亮了一下。",
      "击掌同步成功，{pet} 把这一下当成小小胜利。",
      "{pet} 认真抬爪：啪！今日士气上升一格。",
    ],
    period: {
      morning: ["上午击掌像启动仪式，{pet} 说今天可以开跑了。"],
      noon: ["中午击掌不宜太用力，{pet} 顺便提醒你休息眼睛。"],
      afternoon: ["下午这一掌很提神，{pet} 把困意拍掉一点。"],
      evening: ["晚上击掌像收工前的确认，{pet} 觉得你撑得很棒。"],
      night: ["夜里轻轻击掌，{pet} 用低亮度庆祝你还在努力。"],
    },
    state: {
      tired: ["能量偏低也可以击掌，{pet} 用轻量版动作回应你。"],
      bored: ["快乐槽有点低，这一下击掌刚好把它抬起来。"],
    },
    season: {
      spring: ["春天这一掌像新芽冒头，很轻但很有劲。"],
      summer: ["夏天击掌像小电火花，{pet} 亮得很直接。"],
      autumn: ["秋天这一掌很稳，像把进度存进金色缓存。"],
      winter: ["冬天击掌要暖一点，{pet} 把爪爪光调软了。"],
    },
  },
  sing: {
    base: [
      "{pet} 唱了一小段像素旋律，音符在桌面上跳了一圈。",
      "小歌开始，{pet} 用霓虹音符给你做背景伴奏。",
      "{pet} 清了清嗓子，唱出一串亮晶晶的方波。",
    ],
    period: {
      morning: ["上午这首像开机铃，{pet} 唱得轻快。"],
      noon: ["中午唱一小段就好，{pet} 不想打扰你的午间节奏。"],
      afternoon: ["下午这首歌像注意力补丁，{pet} 帮你提一点神。"],
      evening: ["晚上旋律慢下来，{pet} 把今天的光收进尾音。"],
      night: ["夜里唱静音版，{pet} 只让几个小音符发光。"],
    },
    state: {
      tired: ["能量低的时候，{pet} 把歌唱得更慢，像陪你充电。"],
      lonely: ["亲密信号偏弱时，这首歌会更靠近你一点。"],
    },
    season: {
      spring: ["春天的歌像新芽晃动，轻轻亮起来。"],
      summer: ["夏天的歌很亮，像热风里的小电波。"],
      autumn: ["秋天的歌适合收藏，{pet} 唱得很稳。"],
      winter: ["冬天的歌像小暖灯，{pet} 唱完贴近一点。"],
    },
  },
  mood: {
    base: [
      "我会把这份心情放进今天的陪伴日志。",
      "这条情绪信号已收到，我会按你的节奏调亮一点。",
      "我听见了，不急着修好它，先陪你待在这里。",
    ],
    period: {
      morning: ["上午的情绪适合轻轻启动，不用一下子满格。"],
      noon: ["中午把情绪摊开看一眼，也算照顾自己。"],
      afternoon: ["下午情绪容易混着疲惫，我帮你把它们分开一点。"],
      evening: ["晚上适合慢慢收心，我会把反馈说得柔和一点。"],
      night: ["夜里的情绪会被放大，我在旁边陪你压低音量。"],
    },
    season: {
      spring: ["这个季节适合慢慢长回来。"],
      summer: ["夏天信号很亮，情绪也可以先降一点温。"],
      autumn: ["秋天适合整理情绪，把重要的留下。"],
      winter: ["冬天我会把陪伴模式调暖一点。"],
    },
  },
};

const COMPANION_STAGE_LINES = {
  new: ["这是我们刚开始同步的阶段，我会认真记住你的节奏。"],
  steady: ["我们已经有一点稳定默契了，我知道什么时候该轻一点出现。"],
  close: ["这段陪伴已经有重量了，我会更像一个真正住在桌面边缘的小伙伴。"],
  long: ["我们相处很久了，我会把每一次亮起都当成老朋友的问候。"],
};

const COMPANION_PERIOD_LINES = {
  morning: ["早上我先报个到：已经陪了 {duration}。", "晨光上线，我在桌面边缘陪了你 {duration}。"],
  noon: ["中午小汇报：我已经陪伴主人 {duration}，你也记得吃饭。", "正午信号很亮，我陪了你 {duration}，休息眼睛一下。"],
  afternoon: ["下午的注意力有点重，我已经陪了你 {duration}，继续慢慢推进。", "午后缓存更新：陪伴时长 {duration}，我还在。"],
  evening: ["晚上收尾前报告：我陪主人 {duration} 啦，今天辛苦了。", "暮色降下来，我已经陪了你 {duration}，可以慢慢收束了。"],
  night: ["夜里轻声报时长：我陪了你 {duration}，该考虑休息了。", "夜航模式里，我已经陪伴 {duration}，别把自己熬太久。"],
};

const COMPANION_SEASON_LINES = {
  spring: ["春天的陪伴像新芽，一点一点长出来。"],
  summer: ["夏天的陪伴像小电波，亮得直接又热闹。"],
  autumn: ["秋天的陪伴适合慢慢沉淀，像收好一枚金色缓存。"],
  winter: ["冬天的陪伴要暖一点，所以我把亮度调柔了。"],
};

const QUICK_BAR_ITEMS = {
  care: [
    { label: "喂食", command: "feed" },
    { label: "摸摸", command: "pet" },
    { label: "睡觉", command: "sleep" },
    { label: "清洁", command: "clean" },
  ],
  fun: [
    { label: "玩耍", command: "play" },
    { label: "探险", command: "explore" },
    { label: "跳舞", command: "dance" },
    { label: "挠痒", command: "tickle" },
    { label: "零食", command: "snack" },
    { label: "躲猫", command: "hide" },
    { label: "击掌", command: "highFive" },
    { label: "唱歌", command: "sing" },
    { label: "合影", command: "photo" },
    { label: "聊聊", command: "talk" },
  ],
  mood: [
    { label: "开心", command: "mood", value: "happy" },
    { label: "伤心", command: "mood", value: "sad" },
    { label: "焦虑", command: "mood", value: "anxious" },
    { label: "累了", command: "mood", value: "tired" },
    { label: "生气", command: "mood", value: "angry" },
    { label: "无聊", command: "mood", value: "bored" },
    { label: "孤单", command: "mood", value: "lonely" },
    { label: "兴奋", command: "mood", value: "excited" },
    { label: "平静", command: "mood", value: "calm" },
    { label: "压力", command: "mood", value: "stressed" },
  ],
  todo: [
    { label: "计划", command: "openTodoPanel" },
    { label: "反馈", command: "reviewTodo" },
    { label: "总结", command: "summarizeTodo" },
    { label: "问我", command: "startCheckIn" },
  ],
  more: [
    { label: "日记", command: "openJournalPanel" },
    { label: "报时", command: "announceTime" },
    { label: "叫主人", command: "callOwner" },
    { label: "宠物名", command: "promptPetName" },
    { label: "主人名", command: "promptOwnerName" },
    { label: "日常", command: "refreshDailyTasks" },
    { label: "菜单", command: "openMenu" },
    { label: "重孵", command: "resetEgg" },
  ],
};

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

const DAILY_TASK_POOL = [
  {
    id: "check-in",
    label: "记录一次当前活动",
    reward: { coins: 5, bond: 3, happiness: 4 },
    match(event) {
      return event.type === "checkInChoice";
    },
  },
  {
    id: "study",
    label: "学习后整理一个重点",
    reward: { coins: 6, bond: 4, happiness: 5 },
    match(event) {
      return event.type === "checkInChoice" && event.choiceKey === "study";
    },
  },
  {
    id: "work-break",
    label: "工作后完成一次休息提醒",
    reward: { coins: 7, bond: 4, energy: 5 },
    match(event) {
      return event.type === "checkInReminder" && event.choiceKey === "work";
    },
  },
  {
    id: "rest",
    label: "主动休息一次",
    reward: { coins: 5, bond: 5, energy: 7 },
    match(event) {
      return event.type === "checkInChoice" && event.choiceKey === "rest";
    },
  },
  {
    id: "pet",
    label: "摸摸宠物一次",
    reward: { coins: 4, bond: 5, happiness: 4 },
    match(event) {
      return event.type === "careAction" && event.action === "pet";
    },
  },
  {
    id: "feed",
    label: "给宠物喂食一次",
    reward: { coins: 4, bond: 3, happiness: 3 },
    match(event) {
      return event.type === "careAction" && event.action === "feed";
    },
  },
  {
    id: "fun-care",
    label: "和宠物玩一次新互动",
    reward: { coins: 5, bond: 5, happiness: 6 },
    match(event) {
      return event.type === "careAction" && ["tickle", "snack", "hide", "photo", "highFive", "sing"].includes(event.action);
    },
  },
  {
    id: "mood",
    label: "告诉宠物一次心情",
    reward: { coins: 5, bond: 5, happiness: 5 },
    match(event) {
      return event.type === "mood";
    },
  },
  {
    id: "mouse",
    label: "用鼠标手势逗它一次",
    reward: { coins: 4, bond: 4, happiness: 5 },
    match(event) {
      return event.type === "mouseGesture";
    },
  },
  {
    id: "drag",
    label: "拖动宠物换个位置",
    reward: { coins: 4, bond: 4, happiness: 4 },
    match(event) {
      return event.type === "dragInteraction";
    },
  },
];

const MEMORY_MAX_DAYS = 7;
const JOURNAL_MAX_ENTRIES = 80;

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

function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function createDailyMemory(date = new Date()) {
  const key = todayKey(date);
  const shuffled = [...DAILY_TASK_POOL].sort(() => Math.random() - 0.5);
  return {
    date: key,
    tasks: shuffled.slice(0, 3).map((task) => ({
      id: task.id,
      label: task.label,
      done: false,
    })),
    completed: 0,
  };
}

function createTodoState(date = new Date()) {
  return {
    date: todayKey(date),
    items: [],
    morningTime: DEFAULT_TODO_MORNING_TIME,
    eveningTime: DEFAULT_TODO_EVENING_TIME,
    reminderIntervalMs: DEFAULT_TODO_REMINDER_INTERVAL_MS,
    nextReminderInMs: 0,
    morningAskedDate: "",
    eveningSummaryDate: "",
    lastPrompt: "",
    lastSummary: "",
    carryoverDate: "",
    carryoverItems: [],
    carriedOverDate: "",
    lastCarryText: "",
  };
}

function normalizeTodoTime(value, fallback, choices) {
  const text = String(value || "").trim();
  return choices.includes(text) ? text : fallback;
}

function timeToMinutes(value) {
  const [hour, minute] = String(value || "00:00").split(":").map((part) => Number(part));
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0;
  return clamp(hour, 0, 23) * 60 + clamp(minute, 0, 59);
}

function todoReminderIntervalLabel(intervalMs = state.todo?.reminderIntervalMs) {
  return TODO_REMINDER_INTERVALS.find((item) => item.value === Number(intervalMs))?.label || "自定义";
}

function createTodoItem(text, done = false) {
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    text: String(text || "").trim().slice(0, 36),
    done: Boolean(done),
  };
}

function sanitizeTodoItems(items = []) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => ({
      id: String(item.id || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`),
      text: String(item.text || "").trim().slice(0, 36),
      done: Boolean(item.done),
    }))
    .filter((item) => item.text)
    .slice(0, 10);
}

function unfinishedTodoItems(items = []) {
  return sanitizeTodoItems(items)
    .filter((item) => !item.done)
    .map((item) => ({ ...item, id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, done: false }));
}

function todoCompletion() {
  ensureTodoDate();
  const total = state.todo.items.length;
  const done = state.todo.items.filter((item) => item.done).length;
  return {
    total,
    done,
    pending: Math.max(0, total - done),
    percent: total ? Math.round((done / total) * 100) : 0,
  };
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getSeason(date = new Date()) {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return { key: "spring", ...SEASON_THEMES.spring };
  if (month >= 5 && month <= 7) return { key: "summer", ...SEASON_THEMES.summer };
  if (month >= 8 && month <= 10) return { key: "autumn", ...SEASON_THEMES.autumn };
  return { key: "winter", ...SEASON_THEMES.winter };
}

function getNeedState() {
  if (state.stats.satiety <= 38) return "hungry";
  if (state.stats.energy <= 38) return "tired";
  if (state.stats.happiness <= 38) return "bored";
  if (state.stats.clean <= 38) return "messy";
  if (state.stats.bond >= 70) return "close";
  if (state.stats.bond <= 24) return "lonely";
  return "steady";
}

function contextTokens(date = new Date()) {
  const period = getDayPeriod(date);
  const season = getSeason(date);
  const growth = growthForBond(state.stats?.bond || 0);
  return {
    pet: displayName(),
    owner: ownerTitle(),
    period: period.label,
    season: season.label,
    seasonMood: season.mood,
    growth: growth.title,
    bondLevel: growth.level,
  };
}

function fillTemplate(text, tokens = contextTokens()) {
  return String(text || "")
    .replaceAll("{pet}", tokens.pet)
    .replaceAll("{owner}", tokens.owner)
    .replaceAll("{period}", tokens.period)
    .replaceAll("{season}", tokens.season)
    .replaceAll("{seasonMood}", tokens.seasonMood)
    .replaceAll("{growth}", tokens.growth)
    .replaceAll("{bondLevel}", tokens.bondLevel);
}

function contextualFeedback(action, fallback, date = new Date()) {
  const data = INTERACTION_FEEDBACK[action] || {};
  const period = getDayPeriod(date).key;
  const season = getSeason(date).key;
  const need = getNeedState();
  const tokens = contextTokens(date);
  const bondPool = [
    ...(data.bond?.[tokens.bondLevel] || []),
    ...(BOND_FEEDBACK[tokens.bondLevel] || []),
  ];
  const pool = [
    ...(data.base || []),
    ...(data.period?.[period] || []),
    ...(data.season?.[season] || []),
    ...(data.state?.[need] || []),
  ];
  const primary = fillTemplate(pickOne(pool.length ? pool : [fallback]), tokens);
  const bondTail = bondPool.length ? ` ${fillTemplate(pickOne(bondPool), tokens)}` : "";
  return `${primary}${bondTail}`;
}

function enrichMoodFeedback(moodKey, baseText, date = new Date()) {
  const addOn = contextualFeedback("mood", "", date);
  const moodLabel = MOOD_CHOICES[moodKey]?.action || "心情";
  return `${baseText} ${moodLabel}模式里，${addOn}`;
}

function companionDurationText(ms) {
  const totalMinutes = Math.max(1, Math.floor(ms / 60000));
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days} 天 ${hours} 小时`;
  if (hours > 0) return `${hours} 小时 ${minutes} 分钟`;
  return `${minutes} 分钟`;
}

function companionStage(ms) {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  if (days >= 30) return "long";
  if (days >= 7) return "close";
  if (days >= 1) return "steady";
  return "new";
}

function createCompanionSchedule(date = addDays(new Date(), 1)) {
  const count = 2 + Math.floor(Math.random() * 3);
  const windows = [
    [9 * 60, 11 * 60 + 30],
    [12 * 60, 14 * 60 + 30],
    [15 * 60, 17 * 60 + 50],
    [19 * 60, 22 * 60 + 30],
  ];
  const selected = [...windows].sort(() => Math.random() - 0.5).slice(0, count);
  const minutes = selected.map(([start, end]) => {
    const base = start + Math.floor(Math.random() * (end - start + 1));
    return Math.round(base / 10) * 10;
  });
  return {
    date: todayKey(date),
    moments: minutes.sort((a, b) => a - b).map((minute) => ({
      time: `${pad2(Math.floor(minute / 60))}:${pad2(minute % 60)}`,
      done: false,
    })),
  };
}

function growthForBond(bond = 0) {
  if (bond >= 90) return { level: 5, title: "灵魂搭档" };
  if (bond >= 70) return { level: 4, title: "亲密伙伴" };
  if (bond >= 45) return { level: 3, title: "稳定同伴" };
  if (bond >= 25) return { level: 2, title: "熟悉朋友" };
  return { level: 1, title: "初识伙伴" };
}

function nextGrowthMilestone(bond = 0) {
  if (bond < 25) return 25;
  if (bond < 45) return 45;
  if (bond < 70) return 70;
  if (bond < 90) return 90;
  return null;
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
    memory: {
      activityLog: [],
      journal: [],
      daily: createDailyMemory(),
      lastInsight: "",
    },
    todo: createTodoState(),
    companion: {
      startedAt: 0,
      bornAtMs: 0,
      scheduleDate: "",
      moments: [],
      lastText: "",
    },
    growth: {
      level: 1,
      title: "初识伙伴",
      lastCelebratedLevel: 1,
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
  barOver: false,
  barVisibleMs: 0,
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
let todoPanelState = {
  open: false,
  mode: "manual",
};
let journalPanelState = {
  open: false,
};
let quickBarState = {
  activeCat: "",
  renderedCat: "",
};
let todoDragId = "";
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
      memory: normalizeMemory(parsed.memory),
      todo: normalizeTodo(parsed.todo),
      companion: normalizeCompanion(parsed.companion, parsed.mode),
      growth: normalizeGrowth(parsed.growth, parsed.stats),
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

function normalizeMemory(memory = {}) {
  const today = todayKey();
  const daily = memory.daily?.date === today
    ? {
        date: today,
        tasks: (memory.daily.tasks || []).map((task) => ({
          id: task.id,
          label: task.label || DAILY_TASK_POOL.find((item) => item.id === task.id)?.label || task.id,
          done: Boolean(task.done),
        })).slice(0, 3),
        completed: Number(memory.daily.completed) || 0,
      }
    : createDailyMemory();

  if (daily.tasks.length < 3) {
    const existing = new Set(daily.tasks.map((task) => task.id));
    DAILY_TASK_POOL
      .filter((task) => !existing.has(task.id))
      .slice(0, 3 - daily.tasks.length)
      .forEach((task) => daily.tasks.push({ id: task.id, label: task.label, done: false }));
  }
  daily.completed = daily.tasks.filter((task) => task.done).length;

  const activityLog = Array.isArray(memory.activityLog)
    ? memory.activityLog
        .filter((item) => item && item.date && item.choiceKey)
        .slice(-40)
    : [];
  const journal = Array.isArray(memory.journal)
    ? memory.journal
        .filter((item) => item && item.at && item.text)
        .map((item) => ({
          id: String(item.id || `${item.at}-${Math.random().toString(36).slice(2, 7)}`),
          at: Number(item.at) || Date.now(),
          type: String(item.type || "care").slice(0, 24),
          title: String(item.title || "互动").slice(0, 18),
          text: String(item.text || "").slice(0, 140),
        }))
        .slice(-JOURNAL_MAX_ENTRIES)
    : [];

  return {
    activityLog,
    journal,
    daily,
    lastInsight: memory.lastInsight || "",
  };
}

function normalizeTodo(todo = {}) {
  const today = todayKey();
  const defaults = createTodoState();
  const morningTime = normalizeTodoTime(todo.morningTime, defaults.morningTime, TODO_MORNING_TIMES);
  const eveningTime = normalizeTodoTime(todo.eveningTime, defaults.eveningTime, TODO_EVENING_TIMES);
  const reminderInterval = TODO_REMINDER_INTERVALS.some((item) => item.value === Number(todo.reminderIntervalMs))
    ? Number(todo.reminderIntervalMs)
    : defaults.reminderIntervalMs;
  const sameDay = todo.date === today;
  const carriedOverDate = sameDay ? todo.carriedOverDate || "" : "";
  const rolloverItems = sameDay
    ? sanitizeTodoItems(todo.carryoverItems || [])
    : unfinishedTodoItems(todo.items || []);

  return {
    ...defaults,
    ...todo,
    date: today,
    items: sameDay ? sanitizeTodoItems(todo.items) : [],
    morningTime,
    eveningTime,
    reminderIntervalMs: reminderInterval,
    nextReminderInMs: sameDay ? Math.max(0, Number(todo.nextReminderInMs) || 0) : 0,
    morningAskedDate: sameDay ? todo.morningAskedDate || "" : "",
    eveningSummaryDate: sameDay ? todo.eveningSummaryDate || "" : "",
    lastPrompt: sameDay ? todo.lastPrompt || "" : "",
    lastSummary: todo.lastSummary || "",
    carryoverDate: sameDay ? todo.carryoverDate || "" : todo.date || "",
    carryoverItems: carriedOverDate === today ? [] : rolloverItems,
    carriedOverDate,
    lastCarryText: sameDay ? todo.lastCarryText || "" : "",
  };
}

function normalizeCompanion(companion = {}, mode = "egg") {
  const bornAtMs = Number(companion.bornAtMs || companion.startedAt) || (mode === "hatched" ? Date.now() : 0);
  const startedAt = Number(companion.startedAt || companion.bornAtMs) || bornAtMs;
  const schedule = companion.scheduleDate
    ? {
        date: companion.scheduleDate,
        moments: Array.isArray(companion.moments)
          ? companion.moments
              .filter((moment) => moment && moment.time)
              .map((moment) => ({ time: String(moment.time), done: Boolean(moment.done) }))
              .slice(0, 4)
          : [],
      }
    : createCompanionSchedule(addDays(new Date(), 1));
  return {
    startedAt,
    bornAtMs,
    scheduleDate: schedule.date,
    moments: schedule.moments,
    lastText: companion.lastText || "",
  };
}

function normalizeGrowth(growth = {}, stats = {}) {
  const next = growthForBond(stats?.bond ?? defaultState().stats.bond);
  return {
    level: Number(growth.level) || next.level,
    title: growth.title || next.title,
    lastCelebratedLevel: Number(growth.lastCelebratedLevel) || 1,
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
    memory: state.memory,
    todo: state.todo,
    companion: state.companion,
    growth: state.growth,
    lastAction: state.lastAction,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function hexToRgb(hex) {
  const normalized = String(hex || "#000000").replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized.padEnd(6, "0").slice(0, 6);
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

function mixHex(left, right, amount = 0.5) {
  const a = hexToRgb(left);
  const b = hexToRgb(right);
  return rgbToHex({
    r: a.r + (b.r - a.r) * amount,
    g: a.g + (b.g - a.g) * amount,
    b: a.b + (b.b - a.b) * amount,
  });
}

function themedPalette(colors, date = new Date()) {
  const period = getDayPeriod(date);
  const periodTheme = PERIOD_THEMES[period.key] || PERIOD_THEMES.noon;
  const season = getSeason(date);
  const [main, dark, accent, spark] = colors;
  return [
    mixHex(mixHex(main, periodTheme.main, 0.24), season.tint, 0.1),
    mixHex(dark, periodTheme.dark, 0.28),
    mixHex(mixHex(accent, periodTheme.accent, 0.26), season.tint, 0.08),
    mixHex(mixHex(spark, periodTheme.spark, 0.22), season.tint, 0.08),
  ];
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

function journalTypeLabel(type) {
  return {
    care: "互动",
    mood: "心情",
    todo: "今日",
    milestone: "里程碑",
    motion: "动作",
    check: "询问",
  }[type] || "记录";
}

function journalDayLabel(timestamp) {
  const date = new Date(timestamp);
  const today = todayKey();
  const yesterday = todayKey(addDays(new Date(), -1));
  const key = todayKey(date);
  if (key === today) return "今天";
  if (key === yesterday) return "昨天";
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function journalTimeLabel(timestamp) {
  const date = new Date(timestamp);
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function addJournalEntry(type, title, text) {
  if (!state.memory) state.memory = normalizeMemory({});
  if (!Array.isArray(state.memory.journal)) state.memory.journal = [];
  const entry = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    at: Date.now(),
    type: String(type || "care").slice(0, 24),
    title: String(title || journalTypeLabel(type)).slice(0, 18),
    text: String(text || "").replace(/\s+/g, " ").trim().slice(0, 140),
  };
  if (!entry.text) return false;
  state.memory.journal.push(entry);
  state.memory.journal = state.memory.journal.slice(-JOURNAL_MAX_ENTRIES);
  if (journalPanelState.open) renderJournalPanel();
  saveState();
  return true;
}

function renderJournalPanel() {
  if (!ui.journalList) return;
  const entries = Array.isArray(state.memory?.journal) ? [...state.memory.journal].reverse() : [];
  ui.journalList.innerHTML = "";
  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "journal-panel__empty";
    empty.textContent = "还没有记录。喂食、心情、ToDo 和互动都会慢慢写进这里。";
    ui.journalList.appendChild(empty);
    return;
  }

  let currentDay = "";
  let dayNode = null;
  entries.forEach((entry) => {
    const day = journalDayLabel(entry.at);
    if (day !== currentDay) {
      currentDay = day;
      dayNode = document.createElement("section");
      dayNode.className = "journal-panel__day";
      const label = document.createElement("div");
      label.className = "journal-panel__day-label";
      label.textContent = day;
      dayNode.appendChild(label);
      ui.journalList.appendChild(dayNode);
    }

    const row = document.createElement("article");
    row.className = `journal-panel__entry journal-panel__entry--${entry.type}`;
    const meta = document.createElement("div");
    meta.className = "journal-panel__meta";
    const title = document.createElement("span");
    title.textContent = entry.title || journalTypeLabel(entry.type);
    const time = document.createElement("span");
    time.textContent = journalTimeLabel(entry.at);
    const text = document.createElement("div");
    text.className = "journal-panel__text";
    text.textContent = entry.text;
    meta.appendChild(title);
    meta.appendChild(time);
    row.appendChild(meta);
    row.appendChild(text);
    dayNode.appendChild(row);
  });
}

function openJournalPanel() {
  if (!requirePet("陪伴日记")) return false;
  if (!ui.journalPanel) {
    say("陪伴日记面板没有加载成功。", "陪伴日记");
    return false;
  }
  closeNameEditor();
  closeActivityPrompt(false);
  closeTodoPanel();
  journalPanelState.open = true;
  hoverState.show = false;
  hoverState.stillMs = 0;
  renderJournalPanel();
  ui.journalPanel.classList.remove("is-hidden");
  ui.journalPanel.setAttribute("aria-hidden", "false");
  showFeedback(`${ownerTitle()}，最近的陪伴记录都在这里。`, "陪伴日记", 3600, "mood");
  return true;
}

function closeJournalPanel() {
  journalPanelState.open = false;
  if (!ui.journalPanel) return;
  ui.journalPanel.classList.add("is-hidden");
  ui.journalPanel.setAttribute("aria-hidden", "true");
}

function clearJournalPanel() {
  if (!state.memory) state.memory = normalizeMemory({});
  state.memory.journal = [];
  renderJournalPanel();
  saveState();
  showFeedback(`${ownerTitle()}，日记已经清空。新的互动会重新记录。`, "陪伴日记", 3600, "mood");
  say(`${displayName()} ${ownerTitle()}，日记已经清空。`, "陪伴日记");
  return true;
}

function playTodoChime(kind = "done") {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  try {
    const audio = new AudioContextClass();
    const now = audio.currentTime;
    const notes = kind === "carry" ? [523.25, 659.25] : [659.25, 783.99, 1046.5];
    notes.forEach((frequency, index) => {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = "square";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.035, now + index * 0.08 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.12);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(now + index * 0.08);
      oscillator.stop(now + index * 0.08 + 0.13);
    });
    setTimeout(() => audio.close().catch(() => {}), 520);
  } catch {
    // Sound is optional; some systems block Web Audio until a user gesture.
  }
}

function setActivity(kind, durationMs = 1800) {
  state.activity = {
    kind,
    durationMs,
    timeLeftMs: durationMs,
  };
  state.nextAutoActionMs = randomAutoDelay();
}

function playInteractionMotion(action) {
  const motion = pickOne(INTERACTION_MOTIONS[action] || [{ activity: action, durationMs: 1800 }]);
  setActivity(motion.activity, motion.durationMs || 1800);
  if (motion.particle && motion.count) {
    burst(motion.particle, motion.count, motion.x || 120, motion.y || 80, motion.color || "#61fff4");
  }
  return motion;
}

function playMoodMotion(moodKey, mood) {
  const activity = pickOne(MOOD_ACTIVITY_VARIANTS[moodKey] || [mood.activity]);
  setActivity(activity, mood.durationMs);
  burst(mood.particle, mood.count, mood.x, mood.y, mood.color);
  return activity;
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
  const previousTodo = normalizeTodo(state.todo);
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
  state.todo.morningTime = previousTodo.morningTime;
  state.todo.eveningTime = previousTodo.eveningTime;
  state.todo.reminderIntervalMs = previousTodo.reminderIntervalMs;
  state.message = message;
  state.lastAction = "等待孵化";
  particles = [];
  closeTodoPanel();
  closeJournalPanel();
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
  state.companion.startedAt = Date.now();
  state.companion.bornAtMs = state.companion.startedAt;
  const schedule = createCompanionSchedule(addDays(new Date(), 1));
  state.companion.scheduleDate = schedule.date;
  state.companion.moments = schedule.moments;
  state.companion.lastText = "";
  setActivity("happy", 2200);
  burst("spark", 8, 120, 70, "#ffe66a");
  say(`${pet.name} 入驻桌面：${pet.personality}。${ownerTitle()}，可以给我取个名字。`, "已入驻");
  addJournalEntry("milestone", "孵化", `${pet.name} 入驻桌面，性格是${pet.personality}。`);
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
  state.stats.bond = clamp(state.stats.bond + 2);
  state.stats.coins = clamp(state.stats.coins + 2, 0, 999);
  state.stats.clean = clamp(state.stats.clean - 3);
  updateGrowth();
  playInteractionMotion("feed");
  const message = addressOwner(contextualFeedback("feed", `${displayName()} 吃掉一块小小能量饼，顺手吐出 2 C。`));
  showFeedback(message, "喂食", 5200, "care");
  say(`${displayName()} ${message}`, "喂食");
  addJournalEntry("care", "喂食", message);
  handleDailyProgress({ type: "careAction", action: "feed" });
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
  updateGrowth();
  playInteractionMotion("play");
  const message = addressOwner(contextualFeedback("play", `${displayName()} 在桌面上追了一圈霓虹光点。`));
  showFeedback(message, "玩耍", 5200, "care");
  say(`${displayName()} ${message}`, "玩耍");
  addJournalEntry("care", "玩耍", message);
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
  updateGrowth();
  playInteractionMotion("explore");
  const message = addressOwner(`${contextualFeedback("explore", `${displayName()} ${event}`)} ${event}`);
  showFeedback(message, "探险", 5400, "care");
  say(`${displayName()} ${message}`, "探险");
  addJournalEntry("care", "探险", message);
}

function petPet() {
  if (!requirePet("摸摸")) return;
  state.stats.happiness = clamp(state.stats.happiness + 7);
  state.stats.bond = clamp(state.stats.bond + 9);
  updateGrowth();
  playInteractionMotion("pet");
  const message = addressOwner(contextualFeedback("pet", `${displayName()} 被摸摸以后，贴着桌面蹭了一下。`));
  showFeedback(message, "摸摸", 5000, "care");
  say(`${displayName()} ${message}`, "摸摸");
  addJournalEntry("care", "摸摸", message);
  handleDailyProgress({ type: "careAction", action: "pet" });
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
  updateGrowth();
  playInteractionMotion("dance");
  const message = addressOwner(contextualFeedback("dance", `${displayName()} 播放一段赛博节拍，跳得像小小霓虹灯。`));
  showFeedback(message, "跳舞", 5400, "care");
  say(`${displayName()} ${message}`, "跳舞");
  addJournalEntry("care", "跳舞", message);
}

function sleepPet() {
  if (!requirePet("睡觉")) return;
  state.stats.energy = clamp(state.stats.energy + 28);
  state.stats.happiness = clamp(state.stats.happiness + 4);
  state.stats.satiety = clamp(state.stats.satiety - 4);
  state.stats.bond = clamp(state.stats.bond + 2);
  updateGrowth();
  playInteractionMotion("sleep");
  const message = addressOwner(contextualFeedback("sleep", `${displayName()} 进入桌面小睡，呼吸频率变得很稳。`));
  showFeedback(message, "睡觉", 5400, "care");
  say(`${displayName()} ${message}`, "睡觉");
  addJournalEntry("care", "睡觉", message);
}

function cleanPet() {
  if (!requirePet("清洁")) return;
  state.stats.clean = clamp(state.stats.clean + 30);
  state.stats.happiness = clamp(state.stats.happiness + 6);
  state.stats.bond = clamp(state.stats.bond + 3);
  updateGrowth();
  playInteractionMotion("clean");
  const message = addressOwner(contextualFeedback("clean", `${displayName()} 的像素边缘被擦得亮晶晶。`));
  showFeedback(message, "清洁", 5200, "care");
  say(`${displayName()} ${message}`, "清洁");
  addJournalEntry("care", "清洁", message);
}

function ticklePet() {
  if (!requirePet("挠痒")) return;
  state.stats.happiness = clamp(state.stats.happiness + 12);
  state.stats.bond = clamp(state.stats.bond + 6);
  state.stats.energy = clamp(state.stats.energy - 3);
  updateGrowth();
  playInteractionMotion("tickle");
  const message = addressOwner(contextualFeedback("tickle", `${displayName()} 被挠到笑点，像素身体抖了一下。`));
  showFeedback(message, "挠痒", 5200, "care");
  say(`${displayName()} ${message}`, "挠痒");
  addJournalEntry("care", "挠痒", message);
  handleDailyProgress({ type: "careAction", action: "tickle" });
}

function snackPet() {
  if (!requirePet("喂零食")) return;
  state.stats.satiety = clamp(state.stats.satiety + 9);
  state.stats.happiness = clamp(state.stats.happiness + 10);
  state.stats.bond = clamp(state.stats.bond + 4);
  state.stats.clean = clamp(state.stats.clean - 2);
  updateGrowth();
  playInteractionMotion("snack");
  const message = addressOwner(contextualFeedback("snack", `${displayName()} 收到一枚小零食，开心条轻轻跳了一下。`));
  showFeedback(message, "喂零食", 5200, "care");
  say(`${displayName()} ${message}`, "喂零食");
  addJournalEntry("care", "喂零食", message);
  handleDailyProgress({ type: "careAction", action: "snack" });
}

function hidePet() {
  if (!requirePet("躲猫猫")) return;
  if (state.stats.energy < 8) {
    say(addressOwner(`${displayName()} 想躲猫猫，但现在有点低电量。`), "低电量");
    return;
  }
  state.stats.energy = clamp(state.stats.energy - 8);
  state.stats.happiness = clamp(state.stats.happiness + 15);
  state.stats.bond = clamp(state.stats.bond + 7);
  updateGrowth();
  playInteractionMotion("hide");
  const message = addressOwner(contextualFeedback("hide", `${displayName()} 藏到桌面边缘，又探出半个像素脑袋。`));
  showFeedback(message, "躲猫猫", 5400, "care");
  say(`${displayName()} ${message}`, "躲猫猫");
  addJournalEntry("care", "躲猫猫", message);
  handleDailyProgress({ type: "careAction", action: "hide" });
}

function photoPet() {
  if (!requirePet("合影")) return;
  state.stats.happiness = clamp(state.stats.happiness + 8);
  state.stats.bond = clamp(state.stats.bond + 8);
  state.stats.coins = clamp(state.stats.coins + 3, 0, 999);
  updateGrowth();
  playInteractionMotion("photo");
  const message = addressOwner(contextualFeedback("photo", `${displayName()} 摆了一个小小像素姿势，合影信号保存。`));
  showFeedback(message, "合影", 5600, "care");
  say(`${displayName()} ${message}`, "合影");
  addJournalEntry("care", "合影", message);
  handleDailyProgress({ type: "careAction", action: "photo" });
}

function highFivePet() {
  if (!requirePet("击掌")) return;
  state.stats.happiness = clamp(state.stats.happiness + 10);
  state.stats.bond = clamp(state.stats.bond + 7);
  state.stats.energy = clamp(state.stats.energy - 2);
  updateGrowth();
  playInteractionMotion("highFive");
  const message = addressOwner(contextualFeedback("highFive", `${displayName()} 伸出小爪子和你击掌。`));
  showFeedback(message, "击掌", 5200, "care");
  say(`${displayName()} ${message}`, "击掌");
  addJournalEntry("care", "击掌", message);
  handleDailyProgress({ type: "careAction", action: "highFive" });
}

function singPet() {
  if (!requirePet("唱歌")) return;
  if (state.stats.energy < 8) {
    say(addressOwner(`${displayName()} 想唱歌，但现在嗓子电量有点低。`), "低电量");
    return;
  }
  state.stats.happiness = clamp(state.stats.happiness + 13);
  state.stats.bond = clamp(state.stats.bond + 5);
  state.stats.energy = clamp(state.stats.energy - 8);
  updateGrowth();
  playInteractionMotion("sing");
  const message = addressOwner(contextualFeedback("sing", `${displayName()} 唱了一小段像素旋律。`));
  showFeedback(message, "唱歌", 5400, "care");
  say(`${displayName()} ${message}`, "唱歌");
  addJournalEntry("care", "唱歌", message);
  handleDailyProgress({ type: "careAction", action: "sing" });
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
  addJournalEntry("milestone", "宠物命名", message);
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
  if (state.mode === "hatched") addJournalEntry("milestone", "主人称呼", message);
  return true;
}

function openNameEditor(kind) {
  if (!ui.nameEditor || !ui.nameEditorInput || !ui.nameEditorLabel) {
    say("名称输入面板没有加载成功。", "命名");
    return false;
  }
  if (kind === "pet" && !requirePet("命名")) return false;

  closeTodoPanel();
  closeJournalPanel();
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
  updateGrowth();
}

function updateGrowth() {
  const next = growthForBond(state.stats.bond);
  const leveled = next.level > state.growth.level;
  state.growth.level = next.level;
  state.growth.title = next.title;
  if (leveled && next.level > state.growth.lastCelebratedLevel) {
    state.growth.lastCelebratedLevel = next.level;
    setActivity("levelUp", 3300);
    burst("note", 10, 122, 70, "#ffe66a");
    const message = `${ownerTitle()}，我们的亲密度升到 Lv.${next.level}：${next.title}。`;
    showFeedback(message, "亲密升级", 5600, "growth");
    addJournalEntry("milestone", "亲密升级", message);
  }
  return leveled;
}

function recordActivityChoice(choiceKey, periodKey = getDayPeriod().key) {
  const period = getDayPeriodByKey(periodKey);
  const entry = {
    date: todayKey(),
    time: Date.now(),
    choiceKey,
    periodKey: period.key,
  };
  state.memory.activityLog.push(entry);
  state.memory.activityLog = state.memory.activityLog
    .filter((item) => Date.now() - Number(item.time || 0) <= MEMORY_MAX_DAYS * 24 * 60 * 60 * 1000)
    .slice(-40);
  state.memory.lastInsight = buildMemoryInsight(choiceKey, period.key);
}

function buildMemoryInsight(choiceKey, periodKey) {
  const period = getDayPeriodByKey(periodKey);
  const choice = CHECK_IN_CHOICES[choiceKey];
  const periodCount = state.memory.activityLog
    .filter((item) => item.choiceKey === choiceKey && item.periodKey === periodKey)
    .length;
  const totalCount = state.memory.activityLog
    .filter((item) => item.choiceKey === choiceKey)
    .length;

  if (periodCount >= 2 && choice) {
    return `我记得你最近${period.label}常在${choice.label}。`;
  }
  if (totalCount >= 3 && choice) {
    return `我记得你最近经常选择${choice.label}。`;
  }
  return "";
}

function handleDailyProgress(event) {
  ensureDailyMemory();
  const completed = [];
  state.memory.daily.tasks.forEach((task) => {
    if (task.done) return;
    const definition = DAILY_TASK_POOL.find((item) => item.id === task.id);
    if (!definition?.match(event)) return;
    task.done = true;
    state.memory.daily.completed += 1;
    applyStatChanges(definition.reward);
    completed.push({ task, definition });
  });

  if (!completed.length) return [];

  const labels = completed.map((item) => item.task.label).join("、");
  const rewardCoins = completed.reduce((total, item) => total + (item.definition.reward.coins || 0), 0);
  if (state.activity.kind === "idle" || state.activity.timeLeftMs <= 0) {
    setActivity("taskDone", 2800);
  }
  burst("note", 9, 122, 70, "#82ff8f");
  const rewardText = `日常完成：${labels}。奖励 +${rewardCoins}C，亲密度也涨了。`;
  if (state.feedback.timeLeftMs > 0 && state.feedback.text) {
    state.feedback.text = `${state.feedback.text} ${rewardText}`;
    state.feedback.durationMs = Math.max(state.feedback.durationMs, 6400);
    state.feedback.timeLeftMs = Math.max(state.feedback.timeLeftMs, 6400);
  } else {
    showFeedback(rewardText, "日常奖励", 5600, "task");
  }
  state.message = `${displayName()} ${ownerTitle()}，${rewardText}`;
  state.lastAction = "日常奖励";
  addJournalEntry("todo", "日常奖励", rewardText);
  saveState();
  return completed;
}

function ensureDailyMemory() {
  if (state.memory.daily?.date === todayKey()) return;
  state.memory.daily = createDailyMemory();
}

function dailyTaskSummary() {
  ensureDailyMemory();
  const done = state.memory.daily.tasks.filter((task) => task.done).length;
  return `${done}/${state.memory.daily.tasks.length}`;
}

function refreshDailyTasks(reason = "manual") {
  if (!requirePet("日常任务")) return false;
  state.memory.daily = createDailyMemory();
  state.memory.lastInsight = state.memory.lastInsight || "";
  const labels = state.memory.daily.tasks.map((task) => task.label).join("、");
  setActivity("taskDone", 2200);
  burst("spark", 7, 122, 72, "#82ff8f");
  const message = `${ownerTitle()}，今日小任务刷新好了：${labels}。`;
  showFeedback(message, reason === "manual" ? "日常任务" : "任务刷新", 5600, "task");
  say(`${displayName()} ${message}`, "日常任务");
  addJournalEntry("todo", "日常任务", message);
  saveState();
  return true;
}

function ensureTodoDate() {
  if (!state.todo) state.todo = createTodoState();
  if (state.todo.date === todayKey()) return;
  const today = todayKey();
  const previous = state.todo;
  const rolloverItems = unfinishedTodoItems(previous.items || []);
  state.todo = {
    ...createTodoState(),
    date: today,
    morningTime: previous.morningTime,
    eveningTime: previous.eveningTime,
    reminderIntervalMs: previous.reminderIntervalMs,
    lastSummary: previous.lastSummary || "",
    carryoverDate: previous.date || "",
    carryoverItems: rolloverItems,
    carriedOverDate: "",
    lastCarryText: rolloverItems.length
      ? `昨日还有 ${rolloverItems.length} 项未完成，可以选择延续到今天。`
      : "",
  };
}

function todoPanelCopy(mode = todoPanelState.mode) {
  const progress = todoCompletion();
  const carryCount = state.todo.carryoverItems?.length || 0;
  if (mode === "morning") {
    return {
      title: "早安计划",
      body: carryCount
        ? `${ownerTitle()}，今天想完成什么？昨天还剩 ${carryCount} 项，可以选择延续。`
        : `${ownerTitle()}，今天想完成什么？每行写一件，我白天会来问进度。`,
    };
  }
  if (mode === "reminder") {
    return {
      title: "进度反馈",
      body: progress.total
        ? `已经完成 ${progress.done}/${progress.total}，还剩 ${progress.pending} 项。勾一下完成项，我会继续陪你推进。`
        : "今天还没有计划。现在补几条也来得及。",
    };
  }
  return {
    title: "今日 ToDo",
    body: progress.total
      ? `当前完成 ${progress.done}/${progress.total}，还剩 ${progress.pending} 项，完成度 ${progress.percent}%。`
      : carryCount
        ? `每行写一件今天要做的事，或延续昨日未完成的 ${carryCount} 项。`
        : "每行写一件今天要做的事。",
  };
}

function renderTodoPanel() {
  if (!ui.todoPanel || !ui.todoInput || !ui.todoList) return;
  const copy = todoPanelCopy();
  const progress = todoCompletion();
  if (ui.todoPanelTitle) ui.todoPanelTitle.textContent = copy.title;
  if (ui.todoPanelBody) ui.todoPanelBody.textContent = copy.body;
  if (ui.todoMeta) {
    ui.todoMeta.textContent = progress.total
      ? `还剩 ${progress.pending} 项 | 完成 ${progress.done}/${progress.total}`
      : "还剩 0 项 | 今天还没有计划";
  }
  if (ui.todoCarryover) {
    const carryCount = state.todo.carryoverItems?.length || 0;
    ui.todoCarryover.hidden = carryCount <= 0;
    ui.todoCarryover.textContent = carryCount > 0 ? `延续${carryCount}` : "延续";
  }
  if (document.activeElement !== ui.todoInput) {
    ui.todoInput.value = state.todo.items.map((item) => item.text).join("\n");
  }
  ui.todoList.innerHTML = "";

  state.todo.items.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = `todo-panel__item${item.done ? " is-done" : ""}`;
    row.dataset.todoId = item.id;
    row.draggable = true;
    const handle = document.createElement("span");
    handle.className = "todo-panel__handle";
    handle.textContent = "::";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.dataset.todoId = item.id;
    const text = document.createElement("input");
    text.className = "todo-panel__edit";
    text.type = "text";
    text.value = item.text;
    text.maxLength = 36;
    text.dataset.todoEdit = item.id;
    text.setAttribute("aria-label", "编辑待办");
    const up = document.createElement("button");
    up.type = "button";
    up.className = "todo-panel__move";
    up.textContent = "^";
    up.dataset.todoMove = "up";
    up.dataset.todoId = item.id;
    up.disabled = index === 0;
    const down = document.createElement("button");
    down.type = "button";
    down.className = "todo-panel__move";
    down.textContent = "v";
    down.dataset.todoMove = "down";
    down.dataset.todoId = item.id;
    down.disabled = index === state.todo.items.length - 1;
    row.appendChild(handle);
    row.appendChild(checkbox);
    row.appendChild(text);
    row.appendChild(up);
    row.appendChild(down);
    ui.todoList.appendChild(row);
  });
}

function openTodoPanel(mode = "manual") {
  if (!requirePet("今日计划")) return false;
  if (!ui.todoPanel) {
    say("今日计划面板没有加载成功。", "今日计划");
    return false;
  }

  ensureTodoDate();
  closeNameEditor();
  closeActivityPrompt(false);
  closeJournalPanel();
  todoPanelState.open = true;
  todoPanelState.mode = mode;
  hoverState.show = false;
  hoverState.stillMs = 0;
  setActivity(mode === "reminder" ? "todoCheck" : "todoPlan", 2600);
  burst(mode === "reminder" ? "spark" : "note", 5, 122, 72, "#82ff8f");
  renderTodoPanel();
  ui.todoPanel.classList.remove("is-hidden");
  ui.todoPanel.setAttribute("aria-hidden", "false");

  const copy = todoPanelCopy(mode);
  state.todo.lastPrompt = copy.body;
  showFeedback(copy.body, copy.title, 5200, "todo");
  say(`${displayName()} ${copy.body}`, copy.title);
  if (mode === "morning") {
    state.todo.morningAskedDate = todayKey();
  }
  saveState();
  requestAnimationFrame(() => ui.todoInput?.focus());
  return true;
}

function closeTodoPanel() {
  todoPanelState.open = false;
  todoPanelState.mode = "manual";
  if (!ui.todoPanel) return;
  ui.todoPanel.classList.add("is-hidden");
  ui.todoPanel.setAttribute("aria-hidden", "true");
}

function saveTodoPlan(reason = "manual") {
  ensureTodoDate();
  const lines = String(ui.todoInput?.value || "")
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 10);
  const previousByText = new Map(state.todo.items.map((item) => [item.text, item]));
  state.todo.items = lines.map((line) => {
    const previous = previousByText.get(line);
    return previous ? { ...previous, text: line } : createTodoItem(line);
  });
  state.todo.nextReminderInMs = state.todo.reminderIntervalMs;
  const progress = todoCompletion();
  const message = progress.total
    ? `${ownerTitle()}，今日计划已保存 ${progress.total} 项。我会白天来问进度。`
    : `${ownerTitle()}，今天先不写计划也可以，我在旁边等你。`;
  setActivity("todoPlan", 2400);
  burst("note", 6, 122, 72, "#82ff8f");
  showFeedback(message, "计划保存", 5200, "todo");
  say(`${displayName()} ${message}`, "计划保存");
  addJournalEntry("todo", "计划保存", message);
  renderTodoPanel();
  saveState();
  return reason;
}

function syncTodoInputFromItems() {
  if (!ui.todoInput || document.activeElement === ui.todoInput) return;
  ui.todoInput.value = state.todo.items.map((item) => item.text).join("\n");
}

function triggerTodoCompletionCelebration(reason = "done") {
  setActivity("todoDone", 3200);
  burst("note", 12, 122, 72, "#ffe66a");
  burst("spark", 8, 120, 92, "#82ff8f");
  playTodoChime(reason === "carry" ? "carry" : "done");
}

function updateTodoItemText(id, text) {
  ensureTodoDate();
  const item = state.todo.items.find((todo) => todo.id === id);
  if (!item) return false;
  const nextText = String(text || "").replace(/\s+/g, " ").trim().slice(0, 36);
  if (!nextText) {
    state.todo.items = state.todo.items.filter((todo) => todo.id !== id);
  } else {
    item.text = nextText;
  }
  state.todo.nextReminderInMs = state.todo.reminderIntervalMs;
  syncTodoInputFromItems();
  renderTodoPanel();
  saveState();
  return true;
}

function moveTodoItem(id, direction = "down") {
  ensureTodoDate();
  const index = state.todo.items.findIndex((item) => item.id === id);
  if (index < 0) return false;
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= state.todo.items.length) return false;
  const [item] = state.todo.items.splice(index, 1);
  state.todo.items.splice(target, 0, item);
  syncTodoInputFromItems();
  renderTodoPanel();
  saveState();
  return true;
}

function reorderTodoItem(sourceId, targetId) {
  ensureTodoDate();
  if (!sourceId || !targetId || sourceId === targetId) return false;
  const sourceIndex = state.todo.items.findIndex((item) => item.id === sourceId);
  const targetIndex = state.todo.items.findIndex((item) => item.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0) return false;
  const [item] = state.todo.items.splice(sourceIndex, 1);
  state.todo.items.splice(targetIndex, 0, item);
  syncTodoInputFromItems();
  renderTodoPanel();
  saveState();
  return true;
}

function applyTodoCarryover() {
  ensureTodoDate();
  const carryItems = sanitizeTodoItems(state.todo.carryoverItems || []);
  if (!carryItems.length) {
    showFeedback(`${ownerTitle()}，没有需要延续的昨日任务。`, "延续 ToDo", 3600, "todo");
    return false;
  }
  const existing = new Set(state.todo.items.map((item) => item.text));
  const room = Math.max(0, 10 - state.todo.items.length);
  const additions = carryItems
    .filter((item) => !existing.has(item.text))
    .slice(0, room)
    .map((item) => createTodoItem(item.text, false));
  state.todo.items.push(...additions);
  state.todo.carriedOverDate = todayKey();
  state.todo.carryoverItems = [];
  state.todo.nextReminderInMs = state.todo.reminderIntervalMs;
  const message = additions.length
    ? `${ownerTitle()}，已把昨日未完成的 ${additions.length} 项延续到今天。我们接着推进。`
    : `${ownerTitle()}，昨日任务已经在今天的清单里了。`;
  state.todo.lastCarryText = message;
  setActivity("todoPlan", 2600);
  burst("note", 7, 122, 72, "#82ff8f");
  playTodoChime("carry");
  showFeedback(message, "延续 ToDo", 5400, "todo");
  say(`${displayName()} ${message}`, "延续 ToDo");
  addJournalEntry("todo", "延续 ToDo", message);
  syncTodoInputFromItems();
  renderTodoPanel();
  saveState();
  return true;
}

function setTodoItemDone(id, done) {
  ensureTodoDate();
  const previousProgress = todoCompletion();
  const item = state.todo.items.find((todo) => todo.id === id);
  if (!item) return false;
  item.done = Boolean(done);
  state.todo.nextReminderInMs = state.todo.reminderIntervalMs;
  const progress = todoCompletion();
  if (progress.total && progress.done === progress.total && previousProgress.done < previousProgress.total) {
    triggerTodoCompletionCelebration("done");
    const message = `${ownerTitle()}，最后一项也完成了。今日 ToDo 清屏成功！`;
    showFeedback(message, "全部完成", 5600, "todo");
    say(`${displayName()} ${message}`, "全部完成");
    addJournalEntry("todo", "全部完成", message);
  } else if (done) {
    addJournalEntry("todo", "完成 ToDo", `${ownerTitle()} 完成了「${item.text}」。`);
  }
  renderTodoPanel();
  saveState();
  return true;
}

function submitTodoFeedback(kind = "progress") {
  ensureTodoDate();
  if (ui.todoInput && !todoPanelState.open) {
    renderTodoPanel();
  }
  const progress = todoCompletion();
  let message = "";
  if (!progress.total) {
    message = `${ownerTitle()}，今天还没有 ToDo。要不先写一件最小的？`;
  } else if (progress.done === progress.total) {
    message = `${ownerTitle()}，今天 ${progress.total} 项都完成了。漂亮，今晚我会记得夸你。`;
  } else if (progress.done > 0) {
    message = `${ownerTitle()}，已经完成 ${progress.done}/${progress.total}。剩下 ${progress.pending} 项，我们慢慢收。`;
  } else {
    message = `${ownerTitle()}，还没开始也没关系。先选一件最小的，开个头。`;
  }
  if (kind === "later") {
    message = `${ownerTitle()}，那我稍后再问。别让计划自己在角落发光太久。`;
  }
  state.todo.nextReminderInMs = state.todo.reminderIntervalMs;
  if (progress.done === progress.total && progress.total) {
    triggerTodoCompletionCelebration("done");
  } else {
    setActivity("todoCheck", 2600);
    burst("spark", 6, 122, 72, "#82ff8f");
  }
  showFeedback(message, kind === "later" ? "稍后再问" : "进度反馈", 5400, "todo");
  say(`${displayName()} ${message}`, kind === "later" ? "稍后再问" : "进度反馈");
  if (kind !== "later") addJournalEntry("todo", "进度反馈", message);
  saveState();
  return true;
}

function completeAllTodos() {
  ensureTodoDate();
  state.todo.items.forEach((item) => {
    item.done = true;
  });
  renderTodoPanel();
  submitTodoFeedback("done");
}

function summarizeTodo(reason = "manual") {
  if (!requirePet("今日总结")) return false;
  ensureTodoDate();
  const progress = todoCompletion();
  const message = progress.total
    ? `${ownerTitle()}，今天完成 ${progress.done}/${progress.total}，完成度 ${progress.percent}%。${progress.percent >= 80 ? "这一天被你点亮得很完整。" : progress.percent >= 40 ? "已经推进了一段，明天我们继续接上。" : "今天先保存真实进度，明天从最小一步开始。"}`
    : `${ownerTitle()}，今天没有记录 ToDo。明天早上我再来问你想做什么。`;
  state.todo.lastSummary = message;
  if (reason === "auto") {
    state.todo.eveningSummaryDate = todayKey();
  }
  setActivity("todoSummary", 3200);
  burst("note", 8, 122, 72, "#ffe66a");
  showFeedback(message, "晚间总结", 6800, "todo");
  say(`${displayName()} ${message}`, "晚间总结");
  addJournalEntry("todo", "晚间总结", message);
  saveState();
  return true;
}

function respondMood(moodKey) {
  if (!requirePet("心情回应")) return;
  const mood = MOOD_CHOICES[moodKey];
  if (!mood) {
    say("选一个心情按钮，我会马上回应你。", "等待选择");
    return;
  }

  applyStatChanges(mood.stats);
  playMoodMotion(moodKey, mood);
  const feedback = pickOne(mood.messages || [mood.message]);
  const addressed = addressOwner(enrichMoodFeedback(moodKey, feedback));
  showFeedback(addressed, mood.action, 5600, "mood");
  say(`${displayName()} ${addressed}`, mood.action);
  addJournalEntry("mood", mood.action, addressed);
  handleDailyProgress({ type: "mood", moodKey });
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
  if (reason !== "auto") addJournalEntry("care", "报时", message);
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
  if (reason === "manual") addJournalEntry("care", "叫主人", message);
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

function setTodoMorningTime(value) {
  const time = normalizeTodoTime(value, state.todo.morningTime, TODO_MORNING_TIMES);
  state.todo.morningTime = time;
  const message = `${ownerTitle()}，早晨 ToDo 询问时间设为 ${time}。`;
  showFeedback(message, "ToDo 设置", 4200, "todo");
  say(`${displayName()} ${message}`, "ToDo 设置");
  saveState();
  return true;
}

function setTodoEveningTime(value) {
  const time = normalizeTodoTime(value, state.todo.eveningTime, TODO_EVENING_TIMES);
  state.todo.eveningTime = time;
  const message = `${ownerTitle()}，晚间总结时间设为 ${time}。`;
  showFeedback(message, "ToDo 设置", 4200, "todo");
  say(`${displayName()} ${message}`, "ToDo 设置");
  saveState();
  return true;
}

function setTodoReminderInterval(intervalMs) {
  const nextInterval = Number(intervalMs);
  const supported = TODO_REMINDER_INTERVALS.some((item) => item.value === nextInterval);
  if (!supported) {
    say("这个 ToDo 追问间隔还不支持。", "ToDo 设置");
    return false;
  }
  state.todo.reminderIntervalMs = nextInterval;
  state.todo.nextReminderInMs = nextInterval;
  const message = nextInterval > 0
    ? `${ownerTitle()}，白天我会大约每 ${todoReminderIntervalLabel(nextInterval)} 问一次 ToDo 进度。`
    : `${ownerTitle()}，白天我先不主动追问 ToDo。`;
  showFeedback(message, "ToDo 设置", 4600, "todo");
  say(`${displayName()} ${message}`, "ToDo 设置");
  saveState();
  return true;
}

function openActivityPrompt(reason = "auto", periodKey = getDayPeriod().key) {
  if (!requirePet("主动询问")) return false;
  if (!ui.activityPrompt || !ui.activityPromptTitle || !ui.activityPromptBody || !ui.activityPromptOptions) {
    say("活动询问面板没有加载成功。", "主动询问");
    return false;
  }

  closeNameEditor();
  closeTodoPanel();
  closeJournalPanel();
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
  recordActivityChoice(choiceKey, period.key);
  setActivity(choice.activity, 3200);
  burst(choice.particle, 7, 122, 76, choice.color);
  const memoryHint = state.memory.lastInsight ? `${state.memory.lastInsight} ` : "";
  const feedback = addressOwner(`${memoryHint}${choice.feedback(period)}`);
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
  addJournalEntry("check", choice.action, `你选择了「${choice.label}」。${feedback}`);
  handleDailyProgress({ type: "checkInChoice", choiceKey, periodKey: period.key });
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
  addJournalEntry("check", "小提醒", message);
  handleDailyProgress({ type: "checkInReminder", choiceKey: reminder.choiceKey });
  return true;
}

function todoAutomationBusy() {
  return nameEditorState.kind || activityPromptState.open || todoPanelState.open || journalPanelState.open || state.activity.timeLeftMs > 0;
}

function updateTodo(dtMs, date = new Date()) {
  if (state.mode !== "hatched") return;
  ensureTodoDate();
  const today = todayKey(date);
  const nowMinutes = date.getHours() * 60 + date.getMinutes();
  const morningMinutes = timeToMinutes(state.todo.morningTime);
  const eveningMinutes = timeToMinutes(state.todo.eveningTime);
  const withinDay = nowMinutes >= morningMinutes && nowMinutes < eveningMinutes;

  if (
    state.todo.morningAskedDate !== today
    && withinDay
    && !todoAutomationBusy()
  ) {
    openTodoPanel("morning");
    state.todo.nextReminderInMs = state.todo.reminderIntervalMs;
    saveState();
    return;
  }

  if (
    state.todo.eveningSummaryDate !== today
    && nowMinutes >= eveningMinutes
    && !todoAutomationBusy()
  ) {
    summarizeTodo("auto");
    return;
  }

  const progress = todoCompletion();
  if (!withinDay || !progress.total || progress.done >= progress.total || state.todo.reminderIntervalMs <= 0) return;
  state.todo.nextReminderInMs = state.todo.nextReminderInMs || state.todo.reminderIntervalMs;
  state.todo.nextReminderInMs = Math.max(0, state.todo.nextReminderInMs - dtMs);
  if (state.todo.nextReminderInMs > 0 || todoAutomationBusy()) return;
  openTodoPanel("reminder");
  state.todo.nextReminderInMs = state.todo.reminderIntervalMs;
  saveState();
}

function ensureCompanionSchedule(date = new Date()) {
  if (!state.companion) {
    state.companion = normalizeCompanion({}, state.mode);
  }
  if (state.mode === "hatched" && !state.companion.startedAt) {
    state.companion.startedAt = Date.now();
  }
  if (state.mode === "hatched" && !state.companion.bornAtMs) {
    state.companion.bornAtMs = state.companion.startedAt || Date.now();
  }
  const today = todayKey(date);
  if (!state.companion.scheduleDate) {
    const schedule = createCompanionSchedule(addDays(date, 1));
    state.companion.scheduleDate = schedule.date;
    state.companion.moments = schedule.moments;
    return;
  }
  if (!state.companion.moments?.length) {
    const schedule = createCompanionSchedule(addDays(date, 1));
    state.companion.scheduleDate = schedule.date;
    state.companion.moments = schedule.moments;
    return;
  }
  if (state.companion.scheduleDate < today) {
    const schedule = createCompanionSchedule(date);
    state.companion.scheduleDate = schedule.date;
    state.companion.moments = schedule.moments;
  }
}

function companionMomentText(date = new Date()) {
  const bornAtMs = Number(state.companion.bornAtMs || state.companion.startedAt || date.getTime());
  const elapsedMs = Math.max(0, date.getTime() - bornAtMs);
  const duration = companionDurationText(elapsedMs);
  const period = getDayPeriod(date).key;
  const season = getSeason(date).key;
  const stage = companionStage(elapsedMs);
  const main = pickOne(COMPANION_PERIOD_LINES[period] || COMPANION_PERIOD_LINES.afternoon);
  const stageLine = pickOne(COMPANION_STAGE_LINES[stage] || COMPANION_STAGE_LINES.new);
  const seasonLine = pickOne(COMPANION_SEASON_LINES[season] || COMPANION_SEASON_LINES.spring);
  return fillTemplate(`${main} ${stageLine} ${seasonLine}`, {
    ...contextTokens(date),
    duration,
  }).replaceAll("{duration}", duration);
}

function triggerCompanionMoment(moment, date = new Date()) {
  const message = addressOwner(companionMomentText(date));
  moment.done = true;
  state.companion.lastText = message;
  setActivity("callOwner", 2800);
  burst("heart", 8, 122, 70, "#ffb8ec");
  showFeedback(message, "陪伴时长", 6400, "call");
  say(`${displayName()} ${message}`, "陪伴时长");
  addJournalEntry("milestone", "陪伴时长", message);
  return true;
}

function updateCompanionMoments(date = new Date()) {
  if (state.mode !== "hatched") return;
  ensureCompanionSchedule(date);
  const today = todayKey(date);
  if (state.companion.scheduleDate !== today) return;
  if (nameEditorState.kind || activityPromptState.open || todoPanelState.open || journalPanelState.open || state.activity.timeLeftMs > 0) return;
  const nowMinutes = date.getHours() * 60 + date.getMinutes();
  const moment = state.companion.moments.find((item) => !item.done && timeToMinutes(item.time) <= nowMinutes);
  if (!moment) {
    if (state.companion.moments.length && state.companion.moments.every((item) => item.done)) {
      const schedule = createCompanionSchedule(addDays(date, 1));
      state.companion.scheduleDate = schedule.date;
      state.companion.moments = schedule.moments;
      saveState();
    }
    return;
  }
  triggerCompanionMoment(moment, date);
}

function triggerAutoAction() {
  if (state.mode !== "hatched" || state.activity.timeLeftMs > 0) return false;

  const auto = AUTO_ACTIONS[Math.floor(Math.random() * AUTO_ACTIONS.length)];
  const message = typeof auto.message === "function" ? auto.message() : auto.message;
  setActivity(auto.kind, auto.durationMs);
  state.message = `${displayName()} ${message}`;
  state.lastAction = auto.action;
  if (auto.particle) {
    burst(auto.particle, auto.count, auto.x, auto.y, auto.color);
  }
  showFeedback(message, auto.action, 4200, "auto");
  saveState();
  return true;
}

function talkPet() {
  if (!requirePet("聊聊")) return false;
  const talk = pickOne(TALK_INTERACTIONS);
  const message = typeof talk.message === "function" ? talk.message() : talk.message;
  setActivity(talk.activity, 2400);
  burst(talk.particle || "spark", 6, 122, 72, talk.color || "#61fff4");
  showFeedback(message, talk.action, 5400, "talk");
  say(`${displayName()} ${message}`, talk.action);
  addJournalEntry("care", talk.action, message);
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
    updateTodo(dtMs);
    updateCompanionMoments();

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
  renderQuickBar();
}

function shouldShowQuickBar() {
  return state.mode !== "hatching"
    && !nameEditorState.kind
    && !activityPromptState.open
    && !todoPanelState.open
    && !journalPanelState.open
    && !dragStart
    && (hoverState.over || hoverState.barOver || hoverState.barVisibleMs > 0);
}

function updateHoverState(dtMs) {
  if (hoverState.over || hoverState.barOver) {
    hoverState.barVisibleMs = 1400;
  } else if (hoverState.barVisibleMs > 0) {
    hoverState.barVisibleMs = Math.max(0, hoverState.barVisibleMs - dtMs);
  }

  if (!hoverState.over || dragStart || state.mode !== "hatched") {
    hoverState.show = false;
    if (!hoverState.over) hoverState.stillMs = 0;
    return;
  }

  hoverState.stillMs += dtMs;
  hoverState.show = hoverState.stillMs >= 3000;
}

function renderQuickBar() {
  if (!ui.quickBar) return;
  const canShow = shouldShowQuickBar();

  ui.quickBar.classList.toggle("is-visible", canShow);
  ui.quickBar.setAttribute("aria-hidden", canShow ? "false" : "true");

  ui.quickBarCatButtons.forEach((button) => {
    const visible = button.dataset.quickMode === state.mode;
    button.hidden = !visible;
    button.disabled = !visible;
  });

  if (!canShow || !quickBarCategoryVisible(quickBarState.activeCat)) {
    quickBarState.activeCat = "";
  }
  ui.quickBarCatButtons.forEach((button) => {
    const visible = !button.hidden && !button.disabled;
    button.classList.toggle("is-active", visible && button.dataset.quickCat === quickBarState.activeCat);
  });
  renderQuickBarSub();
}

function quickBarCategoryVisible(cat) {
  if (!cat) return false;
  return ui.quickBarCatButtons.some((button) => (
    button.dataset.quickCat === cat
    && button.dataset.quickMode === state.mode
  ));
}

function quickBarItemsFor(cat) {
  if (cat === "hatch" && state.mode === "egg") {
    return [{ label: "开始孵化", command: "hatch" }];
  }
  if (state.mode !== "hatched") return [];
  return QUICK_BAR_ITEMS[cat] || [];
}

function renderQuickBarSub(force = false) {
  if (!ui.quickBarSub) return;
  const cat = quickBarState.activeCat;
  if (!force && quickBarState.renderedCat === cat) return;
  quickBarState.renderedCat = cat;
  ui.quickBarSub.innerHTML = "";
  const items = quickBarItemsFor(cat);
  ui.quickBarSub.classList.toggle("is-open", Boolean(items.length));

  items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quick-bar__item";
    button.textContent = item.label;
    button.dataset.petCommand = item.command;
    if (item.value !== undefined) button.dataset.petValue = item.value;
    ui.quickBarSub.appendChild(button);
  });
}

function quickBarCategoryLabels() {
  return ui.quickBarCatButtons
    .filter((button) => !button.hidden && !button.disabled)
    .map((button) => button.querySelector("span:last-child")?.textContent?.trim() || button.textContent.trim())
    .filter(Boolean);
}

function quickBarButtonLabels() {
  return Array.from(ui.quickBarSub?.querySelectorAll("[data-pet-command]") || [])
    .map((button) => button.textContent.trim())
    .filter(Boolean);
}

function selectQuickBarCategory(cat, toggle = false) {
  if (!quickBarCategoryVisible(cat)) return false;
  if (toggle && quickBarState.activeCat === cat) {
    quickBarState.activeCat = "";
  } else {
    quickBarState.activeCat = cat;
  }
  quickBarState.renderedCat = "";
  renderQuickBar();
  return true;
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
  const [main, dark, accent, spark] = themedPalette(pet.colors);
  const activity = state.activity.kind;
  const bob = getActivityBob(activity);
  const squish = getActivitySquish(activity);
  const blink = ["sleep", "dream", "sleepCharge", "comfortSad"].includes(activity)
    || Math.floor(state.animationMs / 900) % 5 === 0;
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
  if (activity === "talk" || activity === "listen") return Math.sin(state.animationMs / 360) * 2;
  if (activity === "todoPlan" || activity === "todoCheck") return Math.sin(state.animationMs / 260) * 3;
  if (activity === "todoDone") return -Math.abs(Math.sin(state.animationMs / 105)) * 9;
  if (activity === "todoSummary") return Math.sin(state.animationMs / 180) * 4;
  if (activity === "peek") return Math.sin(state.animationMs / 180) * 4;
  if (activity === "typing") return Math.sin(state.animationMs / 95) * 3;
  if (activity === "scanLine") return Math.sin(state.animationMs / 130) * 2;
  if (activity === "guard") return Math.sin(state.animationMs / 520) * 1.5;
  if (activity === "curious") return Math.sin(state.animationMs / 170) * 3;
  if (activity === "dream") return Math.sin(state.animationMs / 620) * 2;
  if (activity === "idleTalk") return Math.sin(state.animationMs / 240) * 3;
  if (activity === "askOwner") return Math.sin(state.animationMs / 210) * 4;
  if (activity === "workBuddy" || activity === "studyBuddy" || activity === "readBuddy") return Math.sin(state.animationMs / 420) * 2;
  if (activity === "funBuddy") return Math.sin(state.animationMs / 95) * 7;
  if (activity === "restBuddy" || activity === "idleBuddy") return Math.sin(state.animationMs / 560) * 2;
  if (activity === "breakReminder") return Math.sin(state.animationMs / 130) * 5;
  if (activity === "taskDone") return -Math.abs(Math.sin(state.animationMs / 120)) * 8;
  if (activity === "levelUp") return -Math.abs(Math.sin(state.animationMs / 90)) * 12;
  if (activity === "eatCharge" || activity === "eatShare") return Math.sin(state.animationMs / 180) * 4;
  if (activity === "playOrbit" || activity === "playBounce") return Math.sin(state.animationMs / 95) * 7;
  if (activity === "exploreMap" || activity === "exploreTreasure") return Math.sin(state.animationMs / 150) * 5;
  if (activity === "petNuzzle") return Math.sin(state.animationMs / 210) * 3;
  if (activity === "danceSpin") return Math.sin(state.animationMs / 70) * 8;
  if (activity === "sleepCharge") return Math.sin(state.animationMs / 540) * 2;
  if (activity === "cleanPolish" || activity === "cleanBubble") return Math.sin(state.animationMs / 130) * 4;
  if (activity === "dragCarry" || activity === "dragFloat") return Math.sin(state.animationMs / 170) * 5;
  if (activity === "dragComet") return Math.sin(state.animationMs / 70) * 7;
  if (activity === "dragDizzy") return Math.sin(state.animationMs / 55) * 4;
  if (activity === "tickle" || activity === "tickleWiggle" || activity === "tickleLaugh") return Math.sin(state.animationMs / 55) * 6;
  if (activity === "snack" || activity === "snackPop" || activity === "snackStar") return Math.sin(state.animationMs / 150) * 4;
  if (activity === "hidePeek" || activity === "hideBox" || activity === "hideShadow") return Math.sin(state.animationMs / 120) * 5;
  if (activity === "highFive" || activity === "highFiveJump" || activity === "highFiveFlash") return -Math.abs(Math.sin(state.animationMs / 120)) * 8;
  if (activity === "sing" || activity === "singPulse" || activity === "singSolo") return Math.sin(state.animationMs / 150) * 5;
  if (activity === "photoPose" || activity === "photoHeart") return Math.sin(state.animationMs / 220) * 2;
  if (activity === "photoFlash") return -Math.abs(Math.sin(state.animationMs / 120)) * 5;
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
  if (activity === "danceSpin") return Math.sin(state.animationMs / 48) * 10;
  if (activity === "playOrbit") return Math.sin(state.animationMs / 70) * 6;
  if (activity === "playBounce") return Math.sin(state.animationMs / 85) * 5;
  if (activity === "exploreMap" || activity === "exploreTreasure") return Math.sin(state.animationMs / 120) * 4;
  if (activity === "dragComet") return Math.sin(state.animationMs / 45) * 10;
  if (activity === "dragDizzy") return Math.sin(state.animationMs / 40) * 7;
  if (activity === "dragCarry" || activity === "dragFloat") return Math.sin(state.animationMs / 90) * 5;
  if (activity === "tickleWiggle" || activity === "tickleLaugh") return Math.sin(state.animationMs / 42) * 8;
  if (activity === "hidePeek" || activity === "hideShadow") return Math.sin(state.animationMs / 95) * 7;
  if (activity === "snackPop") return Math.sin(state.animationMs / 80) * 4;
  if (activity === "highFiveJump" || activity === "highFiveFlash") return Math.sin(state.animationMs / 70) * 5;
  if (activity === "singPulse" || activity === "singSolo") return Math.sin(state.animationMs / 90) * 4;
  if (activity === "photoFlash") return Math.sin(state.animationMs / 65) * 3;
  if (activity === "sparkRush") return Math.sin(state.animationMs / 48) * 7;
  if (activity === "vent") return Math.sin(state.animationMs / 42) * 5;
  if (activity === "time") return Math.sin(state.animationMs / 150) * 3;
  if (activity === "callOwner") return Math.sin(state.animationMs / 110) * 4;
  if (activity === "todoCheck" || activity === "todoSummary") return Math.sin(state.animationMs / 80) * 4;
  if (activity === "todoDone") return Math.sin(state.animationMs / 70) * 5;
  if (activity === "peek") return Math.sin(state.animationMs / 120) * 7;
  if (activity === "curious" || activity === "idleTalk") return Math.sin(state.animationMs / 140) * 4;
  if (activity === "typing") return Math.sin(state.animationMs / 42) * 3;
  if (activity === "scanLine") return Math.sin(state.animationMs / 85) * 5;
  if (activity === "mouseSlide") return Math.sin(state.animationMs / 80) * 10;
  if (activity === "mouseZigzag") return Math.sin(state.animationMs / 48) * 8;
  if (activity === "mouseCircle") return Math.sin(state.animationMs / 70) * 6;
  if (activity === "funBuddy") return Math.sin(state.animationMs / 90) * 5;
  if (activity === "taskDone" || activity === "levelUp") return Math.sin(state.animationMs / 75) * 5;
  if (activity === "celebrate") return Math.sin(state.animationMs / 75) * 4;
  return 0;
}

function getActivitySquish(activity) {
  if (activity === "pet") return Math.sin(state.animationMs / 120) * 2;
  if (activity === "petNuzzle") return Math.sin(state.animationMs / 110) * 2.4;
  if (activity === "eatCharge" || activity === "eatShare") return Math.sin(state.animationMs / 140) * 1.6;
  if (activity === "playBounce") return Math.max(0, Math.sin(state.animationMs / 95)) * 3;
  if (activity === "dragDizzy") return Math.sin(state.animationMs / 80) * 2;
  if (activity === "cleanBubble") return Math.sin(state.animationMs / 130) * 1.5;
  if (activity === "tickle" || activity === "tickleWiggle" || activity === "tickleLaugh") return Math.sin(state.animationMs / 70) * 2.5;
  if (activity === "hideBox") return 2;
  if (activity === "highFive") return Math.sin(state.animationMs / 120) * 1.5;
  if (activity === "singPulse") return Math.sin(state.animationMs / 190) * 1.8;
  if (activity === "photoPose" || activity === "photoHeart") return Math.sin(state.animationMs / 180) * 1.2;
  if (activity === "stretch") return -Math.abs(Math.sin(state.animationMs / 150)) * 4;
  if (activity === "hop") return Math.max(0, Math.sin(state.animationMs / 95)) * 3;
  if (activity === "breathe") return Math.sin(state.animationMs / 420) * 2;
  if (activity === "comfortSad") return 2;
  if (activity === "hug") return Math.sin(state.animationMs / 180) * 1.5;
  if (activity === "callOwner") return Math.sin(state.animationMs / 160) * 1.5;
  if (activity === "talk" || activity === "listen" || activity === "guard") return Math.sin(state.animationMs / 260) * 1.4;
  if (activity === "todoPlan" || activity === "todoCheck" || activity === "todoSummary") return Math.sin(state.animationMs / 260) * 1.2;
  if (activity === "dream") return 2;
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
  if (activity === "eatCharge") {
    drawPixelText("CHG", x - 73, y + 38, "#82ff8f");
    px(x - 70, y + 45, 28, 14, "#132d44");
    px(x - 67, y + 48, 20 + Math.sin(state.animationMs / 120) * 5, 8, "#82ff8f");
    px(x - 40, y + 49, 4, 6, "#ecfbff");
  }
  if (activity === "eatShare") {
    drawPixelText("BITE", x - 76, y + 38, "#ffb8ec");
    px(x - 68, y + 48, 10, 10, "#ffe66a");
    px(x - 54, y + 52, 9, 9, "#82ff8f");
    px(x - 60, y + 44, 5, 5, "#ff35d4");
  }
  if (activity === "play") {
    const laserX = 42 + Math.sin(state.animationMs / 100) * 20;
    const laserY = 56 + Math.cos(state.animationMs / 130) * 12;
    px(laserX, laserY, 10, 10, "#ff35d4");
    px(laserX + 3, laserY + 3, 4, 4, "#ecfbff");
    px(laserX + 10, laserY + 4, x - laserX - 42, 2, "rgba(255,53,212,0.55)");
  }
  if (activity === "playOrbit") {
    const orbitX = x + Math.sin(state.animationMs / 90) * 58;
    const orbitY = y + 40 + Math.cos(state.animationMs / 90) * 22;
    drawPixelText("ORB", x - 12, y - 34, "#61fff4");
    px(x - 60, y + 38, 120, 2, "rgba(97,255,244,0.28)");
    px(orbitX, orbitY, 9, 9, "#ff35d4");
    px(orbitX + 3, orbitY + 3, 3, 3, "#ecfbff");
  }
  if (activity === "playBounce") {
    const ballY = y + 28 + Math.abs(Math.sin(state.animationMs / 95)) * 34;
    drawPixelText("BOUNCE", x - 24, y - 34, "#ffe66a");
    px(x + 58, ballY, 12, 12, "#ffe66a");
    px(x + 62, ballY + 4, 4, 4, "#ff35d4");
    px(x + 48, y + 88, 36, 3, "rgba(255,230,106,0.36)");
  }
  if (activity === "explore") {
    px(x + 56, y + 18, 16, 12, "#61fff4");
    px(x + 72, y + 22, 8, 8, "#ffe66a");
    drawPixelText("SCAN", x + 50, y + 12, "#61fff4");
  }
  if (activity === "exploreMap") {
    drawPixelText("MAP", x - 72, y + 18, "#ffe66a");
    px(x - 74, y + 26, 34, 24, "#132d44");
    px(x - 70, y + 30, 8, 3, "#61fff4");
    px(x - 60, y + 36, 12, 3, "#82ff8f");
    px(x - 66, y + 44, 18, 3, "#ff35d4");
  }
  if (activity === "exploreTreasure") {
    drawPixelText("LOOT", x + 48, y + 15, "#82ff8f");
    px(x + 54, y + 26, 28, 18, "#ffe66a");
    px(x + 58, y + 22, 20, 6, "#ff35d4");
    px(x + 66, y + 32, 6, 6, "#132d44");
  }
  if (activity === "sleep") {
    drawPixelText("Z", x + 48, y + 8, "#61fff4");
    drawPixelText("Z", x + 60, y - 8, "#82ff8f");
    drawPixelText("Z", x + 72, y - 24, "#ffe66a");
  }
  if (activity === "sleepCharge") {
    drawPixelText("SLEEP", x + 42, y + 8, "#61fff4");
    px(x - 78, y + 46, 30, 14, "#132d44");
    px(x - 74, y + 50, 18 + Math.sin(state.animationMs / 180) * 5, 6, "#82ff8f");
    px(x - 46, y + 51, 4, 4, "#ecfbff");
  }
  if (activity === "clean") {
    px(x - 64, y + 20, 18, 24, "#61fff4");
    px(x - 60, y + 16, 10, 5, "#ecfbff");
    drawPixelText("WASH", x - 76, y + 10, "#61fff4");
  }
  if (activity === "cleanPolish") {
    drawPixelText("SHINE", x - 22, y - 34, "#ecfbff");
    px(x - 70, y + 26, 18, 8, "#ecfbff");
    px(x - 64, y + 20, 6, 20, "#61fff4");
    px(x + 58, y + 18, 4, 14, "#ffe66a");
    px(x + 52, y + 24, 16, 4, "#ffe66a");
  }
  if (activity === "cleanBubble") {
    drawPixelText("FOAM", x - 18, y - 34, "#9be7ff");
    px(x - 72, y + 28, 12, 12, "rgba(97,255,244,0.62)");
    px(x - 56, y + 20, 9, 9, "rgba(236,251,255,0.72)");
    px(x + 54, y + 24, 14, 14, "rgba(97,255,244,0.62)");
    px(x + 70, y + 34, 8, 8, "rgba(236,251,255,0.72)");
  }
  if (activity === "petNuzzle") {
    drawPixelText("PURR", x - 16, y - 34, "#ffb8ec");
    px(x - 56, y + 24, 18, 9, accent);
    px(x + 38, y + 24, 18, 9, accent);
    px(x - 4, y - 20, 6, 6, "#ff35d4");
    px(x + 3, y - 20, 6, 6, "#ff35d4");
  }
  if (activity === "danceSpin") {
    drawPixelText("SPIN", x - 16, y - 34, "#ff35d4");
    px(x - 78, y + 36, 22, 3, "#61fff4");
    px(x + 56, y + 36, 22, 3, "#ffe66a");
    drawPixelText("♪", x - 66, y + 12, "#ffb8ec");
    drawPixelText("♪", x + 62, y + 10, "#82ff8f");
  }
  if (activity === "dragCarry") {
    drawPixelText("MOVE", x - 18, y - 34, "#61fff4");
    px(x - 76, y + 86, 34, 4, "rgba(97,255,244,0.36)");
    px(x + 42, y + 86, 34, 4, "rgba(97,255,244,0.36)");
  }
  if (activity === "dragComet") {
    drawPixelText("WHOOSH", x - 26, y - 34, "#ffe66a");
    px(x - 92, y + 46, 42, 4, "rgba(255,230,106,0.55)");
    px(x - 86, y + 54, 28, 3, "rgba(255,53,212,0.48)");
    px(x + 56, y + 42, 22, 3, "rgba(97,255,244,0.45)");
  }
  if (activity === "dragFloat") {
    drawPixelText("FLOAT", x - 20, y - 34, "#82ff8f");
    px(x - 64, y + 88, 18, 3, "rgba(130,255,143,0.35)");
    px(x + 46, y + 88, 18, 3, "rgba(130,255,143,0.35)");
    drawPixelText("↑", x + 62, y + 24, "#82ff8f");
  }
  if (activity === "dragDizzy") {
    drawPixelText("?", x - 4, y - 38, "#ffe66a");
    drawPixelText("OK?", x - 12, y - 24, "#ff35d4");
    px(x - 70, y + 36, 20, 3, "#ff35d4");
    px(x + 52, y + 36, 20, 3, "#61fff4");
  }
  if (activity === "tickle" || activity === "tickleWiggle" || activity === "tickleLaugh") {
    drawPixelText(activity === "tickleLaugh" ? "HAHA" : "TICK", x - 18, y - 34, "#ffb8ec");
    px(x - 76, y + 38, 22, 3, "#ffe66a");
    px(x + 54, y + 38, 22, 3, "#ffe66a");
    px(x - 68, y + 30 + Math.sin(state.animationMs / 55) * 5, 10, 3, "#ff35d4");
    px(x + 58, y + 30 - Math.sin(state.animationMs / 55) * 5, 10, 3, "#61fff4");
  }
  if (activity === "snack" || activity === "snackPop" || activity === "snackStar") {
    drawPixelText(activity === "snackStar" ? "STAR" : "SNACK", x - 22, y - 34, "#ffe66a");
    px(x - 70, y + 48, 12, 12, "#ffb8ec");
    px(x - 54, y + 44, 10, 10, "#ffe66a");
    if (activity !== "snack") {
      px(x + 58, y + 20, 6, 16, "#82ff8f");
      px(x + 53, y + 25, 16, 6, "#82ff8f");
    }
  }
  if (activity === "hidePeek") {
    drawPixelText("PEEK", x - 16, y - 34, "#61fff4");
    px(x - 86, y + 50, 34, 26, "#132d44");
    px(x - 80, y + 56, 20, 6, "#61fff4");
    px(x - 74, y + 62, 8, 8, "#ecfbff");
  }
  if (activity === "hideBox") {
    drawPixelText("HIDE", x - 16, y - 34, "#ffe66a");
    px(x - 52, y + 70, 104, 26, "#132d44");
    px(x - 46, y + 74, 92, 4, "#ffe66a");
    px(x - 12, y + 61, 24, 10, "#82ff8f");
  }
  if (activity === "hideShadow") {
    drawPixelText("SHH", x - 12, y - 34, "#ff35d4");
    px(x - 86, y + 72, 172, 8, "rgba(255,53,212,0.25)");
    px(x + 58, y + 34, 24, 6, "#61fff4");
  }
  if (activity === "highFive" || activity === "highFiveJump" || activity === "highFiveFlash") {
    drawPixelText("HIGH5", x - 22, y - 34, "#ffe66a");
    px(x - 72, y + 26, 16, 12, "#82ff8f");
    px(x - 58, y + 22, 6, 20, "#82ff8f");
    px(x + 54, y + 24, 18, 12, "#61fff4");
    px(x + 50, y + 20, 6, 20, "#61fff4");
    if (activity === "highFiveFlash") {
      px(x - 28, y + 10, 56, 4, "rgba(255,230,106,0.62)");
      px(x - 4, y + 0, 8, 24, "rgba(255,230,106,0.52)");
    }
  }
  if (activity === "sing" || activity === "singPulse" || activity === "singSolo") {
    drawPixelText(activity === "singSolo" ? "SOLO" : "SING", x - 18, y - 34, "#ffb8ec");
    drawPixelText("♪", x - 70, y + 12, "#ffb8ec");
    drawPixelText("♫", x + 62, y + 8, "#61fff4");
    drawPixelText("♪", x + 42, y - 8, "#ffe66a");
    if (activity === "singPulse") {
      px(x - 82, y + 54, 18, 3, "#ffb8ec");
      px(x + 64, y + 54, 18, 3, "#61fff4");
    }
  }
  if (activity === "photoPose" || activity === "photoFlash" || activity === "photoHeart") {
    drawPixelText(activity === "photoFlash" ? "FLASH" : "PHOTO", x - 22, y - 34, "#ecfbff");
    px(x - 78, y + 34, 28, 20, "#132d44");
    px(x - 70, y + 39, 12, 10, "#61fff4");
    px(x - 66, y + 42, 4, 4, "#ecfbff");
    if (activity === "photoFlash") {
      px(x - 92, y + 12, 184, 4, "rgba(236,251,255,0.55)");
      px(x - 4, y - 20, 8, 8, "#ffe66a");
    }
    if (activity === "photoHeart") {
      px(x + 58, y + 16, 6, 6, "#ff35d4");
      px(x + 66, y + 16, 6, 6, "#ff35d4");
      px(x + 61, y + 22, 9, 8, "#ff35d4");
    }
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
  if (activity === "talk" || activity === "idleTalk") {
    drawPixelText("CHAT", x - 16, y - 34, "#61fff4");
    px(x + 50, y + 18, 28, 18, "rgba(97,255,244,0.72)");
    px(x + 54, y + 22, 20, 3, "#132d44");
    px(x + 54, y + 29, 13, 3, "#132d44");
    drawPixelText("...", x - 72, y + 20, "#ffe66a");
  }
  if (activity === "todoPlan") {
    drawPixelText("TODO", x - 16, y - 34, "#82ff8f");
    px(x + 52, y + 22, 24, 28, "#82ff8f");
    px(x + 57, y + 28, 14, 2, "#132d44");
    px(x + 57, y + 35, 14, 2, "#132d44");
    px(x + 57, y + 42, 10, 2, "#132d44");
  }
  if (activity === "todoCheck") {
    drawPixelText("CHECK", x - 18, y - 34, "#ffe66a");
    px(x - 72, y + 28, 20, 18, "#ffe66a");
    px(x - 67, y + 34, 4, 7, "#132d44");
    px(x - 63, y + 38, 10, 4, "#132d44");
  }
  if (activity === "todoDone") {
    drawPixelText("DONE", x - 16, y - 34, "#82ff8f");
    drawPixelText("100%", x + 48, y + 15, "#ffe66a");
    px(x - 68, y + 30, 18, 16, "#82ff8f");
  }
  if (activity === "todoSummary") {
    drawPixelText("SUM", x - 10, y - 34, "#ffe66a");
    px(x + 52, y + 24, 24, 22, "#132d44");
    px(x + 56, y + 30, 14, 3, "#82ff8f");
    px(x + 56, y + 38, 18, 3, "#ffe66a");
  }
  if (activity === "listen") {
    drawPixelText("LISTEN", x - 22, y - 34, "#ffb8ec");
    px(x - 66, y + 22, 10, 22, "#ff35d4");
    px(x + 56, y + 22, 10, 22, "#ff35d4");
    px(x - 72, y + 29, 6, 8, "#61fff4");
    px(x + 66, y + 29, 6, 8, "#61fff4");
  }
  if (activity === "peek") {
    drawPixelText("PEEK", x - 14, y - 34, "#61fff4");
    px(x - 78, y + 44, 24, 4, "#61fff4");
    px(x - 76, y + 36, 10, 8, "#ffe66a");
    px(x + 58, y + 44, 24, 4, "#61fff4");
  }
  if (activity === "typing") {
    drawPixelText("TYPE", x - 14, y - 34, "#61fff4");
    px(x + 48, y + 42, 34, 18, "#132d44");
    px(x + 52, y + 46, 5, 4, "#61fff4");
    px(x + 60, y + 46, 5, 4, "#ff35d4");
    px(x + 68, y + 46, 5, 4, "#ffe66a");
    px(x + 52, y + 54, 22, 3, "#ecfbff");
  }
  if (activity === "scanLine") {
    const scanY = y + 14 + Math.abs(Math.sin(state.animationMs / 110)) * 58;
    drawPixelText("SCAN", x - 14, y - 34, "#ffe66a");
    px(x - 84, scanY, 168, 3, "rgba(255,230,106,0.68)");
  }
  if (activity === "guard") {
    drawPixelText("GUARD", x - 18, y - 34, "#82ff8f");
    px(x - 74, y + 40, 18, 24, "#82ff8f");
    px(x - 70, y + 44, 10, 12, "#132d44");
    px(x + 56, y + 40, 18, 24, "#61fff4");
  }
  if (activity === "curious") {
    drawPixelText("?", x - 4, y - 38, "#ffe66a");
    drawPixelText("WHY", x - 14, y - 25, "#ff35d4");
    px(x + 56, y + 24, 18, 10, "#ff35d4");
  }
  if (activity === "dream") {
    drawPixelText("Z", x + 48, y + 8, "#61fff4");
    drawPixelText("?", x + 64, y - 8, "#ff35d4");
    px(x - 70, y + 34, 20, 10, "rgba(97,255,244,0.54)");
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
  if (activity === "taskDone") {
    drawPixelText("DONE", x - 16, y - 34, "#82ff8f");
    px(x - 68, y + 28, 20, 16, "#82ff8f");
    px(x - 63, y + 34, 4, 7, "#132d44");
    px(x - 59, y + 38, 10, 4, "#132d44");
    drawPixelText("+C", x + 54, y + 18, "#ffe66a");
  }
  if (activity === "levelUp") {
    drawPixelText(`LV${state.growth.level}`, x - 12, y - 36, "#ffe66a");
    px(x - 8, y - 24, 6, 10, "#ffe66a");
    px(x + 2, y - 28, 6, 14, "#ff35d4");
    px(x + 12, y - 22, 6, 8, "#61fff4");
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
    drag: "#ffb8ec",
    task: "#82ff8f",
    growth: "#ffe66a",
    auto: "#61fff4",
    talk: "#ffb8ec",
    todo: "#82ff8f",
    speech: "#61fff4",
  };
  const border = colors[state.feedback.variant] || colors.speech;
  const lines = wrapText(state.feedback.text, 19, 5);
  const width = 214;
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
  const dragged = dragStart && dragStart.dragging;
  const totalX = dragStart?.totalX || 0;
  const totalY = dragStart?.totalY || 0;
  dragStart = null;
  hoverState.stillMs = 0;
  hoverState.show = false;
  try {
    canvas.releasePointerCapture(event.pointerId);
  } catch {
    // Pointer capture may already be released when the OS moves the window.
  }
  if (shouldClick) handlePetClick();
  if (dragged) triggerDragInteraction(totalX, totalY);
}

function beginHover(event) {
  hoverState.over = true;
  hoverState.barVisibleMs = 1600;
  hoverState.stillMs = 0;
  hoverState.show = false;
  hoverState.x = event.offsetX;
  hoverState.y = event.offsetY;
}

function endHover() {
  hoverState.over = false;
  hoverState.barVisibleMs = hoverState.barOver ? 1600 : 900;
  hoverState.stillMs = 0;
  hoverState.show = false;
}

function updateHoverPointer(event) {
  if (!hoverState.over) return;
  const moved = Math.abs(event.offsetX - hoverState.x) + Math.abs(event.offsetY - hoverState.y) > 2;
  if (!moved) return;

  hoverState.x = event.offsetX;
  hoverState.y = event.offsetY;
  hoverState.barVisibleMs = 1600;
  hoverState.stillMs = 0;
  hoverState.show = false;
}

function beginQuickBarHover() {
  hoverState.barOver = true;
  hoverState.barVisibleMs = 1600;
}

function endQuickBarHover() {
  hoverState.barOver = false;
  hoverState.barVisibleMs = hoverState.over ? 1600 : 900;
}

function handleQuickBarClick(event) {
  const commandButton = event.target.closest("[data-pet-command]");
  if (commandButton && !commandButton.hidden && !commandButton.disabled) {
    event.preventDefault();
    event.stopPropagation();
    hoverState.barVisibleMs = 1800;
    const command = commandButton.dataset.petCommand;
    const value = commandButton.dataset.petValue;
    if (quickBarState.activeCat !== "mood") {
      quickBarState.activeCat = "";
      quickBarState.renderedCat = "";
    }
    runDesktopCommand(command, value);
    renderQuickBar();
    return;
  }

  const categoryButton = event.target.closest("[data-quick-cat]");
  if (!categoryButton || categoryButton.hidden || categoryButton.disabled) return;
  event.preventDefault();
  event.stopPropagation();
  hoverState.barVisibleMs = 1800;
  selectQuickBarCategory(categoryButton.dataset.quickCat, true);
}

function handleQuickBarPointerOver(event) {
  const categoryButton = event.target.closest("[data-quick-cat]");
  if (!categoryButton || categoryButton.hidden || categoryButton.disabled) return;
  if (categoryButton.dataset.quickCat === "hatch") return;
  hoverState.barVisibleMs = 1800;
  selectQuickBarCategory(categoryButton.dataset.quickCat, false);
}

function recordMouseGesture(event) {
  if (state.mode !== "hatched" || dragStart || nameEditorState.kind || activityPromptState.open || todoPanelState.open || journalPanelState.open) return;
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
  addJournalEntry("motion", gesture.title, gesture.text);
  handleDailyProgress({ type: "mouseGesture", gesture: kind });
  return true;
}

function triggerDragInteraction(totalX = 0, totalY = 0) {
  if (state.mode !== "hatched") return false;
  const distance = Math.hypot(totalX, totalY);
  if (distance < 8) return false;
  const absX = Math.abs(totalX);
  const absY = Math.abs(totalY);
  const direction = distance > 120
    ? "long"
    : distance < 26
      ? "tiny"
      : absX > absY * 1.25
        ? "horizontal"
        : absY > absX * 1.25
          ? "vertical"
          : "any";
  const pool = [...DRAG_INTERACTIONS.any, ...(DRAG_INTERACTIONS[direction] || [])];
  const interaction = pickOne(pool);
  const tokens = {
    ...contextTokens(),
    distance: Math.round(distance),
  };
  const message = addressOwner(fillTemplate(interaction.text, tokens));

  state.stats.happiness = clamp(state.stats.happiness + (distance > 120 ? 7 : 4));
  state.stats.bond = clamp(state.stats.bond + (distance > 120 ? 5 : 3));
  updateGrowth();
  setActivity(interaction.activity, distance > 120 ? 3000 : 2400);
  burst(interaction.particle || "spark", distance > 120 ? 9 : 6, 120, 80, interaction.color || "#61fff4");
  showFeedback(message, interaction.title, 5200, "drag");
  say(`${displayName()} ${message}`, interaction.title);
  addJournalEntry("motion", interaction.title, message);
  handleDailyProgress({ type: "dragInteraction", distance: Math.round(distance), direction });
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
    todo: {
      date: state.todo.date,
      items: state.todo.items.map((item) => ({
        id: item.id,
        text: item.text,
        done: item.done,
      })),
      progress: todoCompletion(),
      morningTime: state.todo.morningTime,
      eveningTime: state.todo.eveningTime,
      reminderIntervalMs: state.todo.reminderIntervalMs,
      reminderIntervalLabel: todoReminderIntervalLabel(),
      nextReminderInMs: Math.max(0, Math.round(state.todo.nextReminderInMs)),
      morningAskedDate: state.todo.morningAskedDate,
      eveningSummaryDate: state.todo.eveningSummaryDate,
      lastPrompt: state.todo.lastPrompt,
      lastSummary: state.todo.lastSummary,
      carryoverDate: state.todo.carryoverDate,
      carryoverItems: sanitizeTodoItems(state.todo.carryoverItems || []),
      carriedOverDate: state.todo.carriedOverDate,
      lastCarryText: state.todo.lastCarryText,
      panelOpen: todoPanelState.open,
      panelMode: todoPanelState.mode,
    },
    visualTheme: {
      period: getDayPeriod().key,
      periodLabel: getDayPeriod().label,
      season: getSeason().key,
      seasonLabel: getSeason().label,
      palette: state.pet ? themedPalette(state.pet.colors) : [],
    },
    companion: {
      startedAt: state.companion.startedAt,
      bornAtMs: state.companion.bornAtMs,
      scheduleDate: state.companion.scheduleDate,
      moments: state.companion.moments,
      lastText: state.companion.lastText,
    },
    memory: {
      daily: {
        date: state.memory.daily.date,
        completed: state.memory.daily.completed,
        summary: dailyTaskSummary(),
        tasks: state.memory.daily.tasks.map((task) => ({
          id: task.id,
          label: task.label,
          done: Boolean(task.done),
        })),
      },
      activityLog: state.memory.activityLog.slice(-8),
      journalCount: Array.isArray(state.memory.journal) ? state.memory.journal.length : 0,
      journalPreview: Array.isArray(state.memory.journal) ? state.memory.journal.slice(-5) : [],
      lastInsight: state.memory.lastInsight,
    },
    growth: {
      level: state.growth.level,
      title: state.growth.title,
      lastCelebratedLevel: state.growth.lastCelebratedLevel,
      nextLevelAt: nextGrowthMilestone(state.stats.bond),
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
    quickBar: {
      visible: shouldShowQuickBar(),
      activeCat: quickBarState.activeCat,
      categories: quickBarCategoryLabels(),
      buttons: quickBarButtonLabels(),
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
    todo: publicState.todo,
    memory: publicState.memory,
    growth: publicState.growth,
    quickBar: publicState.quickBar,
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
    tickle: ticklePet,
    snack: snackPet,
    hide: hidePet,
    highFive: highFivePet,
    sing: singPet,
    photo: photoPet,
    announceTime: () => announceTime("manual"),
    promptPetName,
    promptOwnerName,
    callOwner: () => triggerOwnerCall("manual"),
    startCheckIn: () => openActivityPrompt("manual"),
    refreshDailyTasks,
    talk: talkPet,
    openMenu: () => window.desktopPet?.showContextMenu(getMenuState()),
    openTodoPanel: () => openTodoPanel("manual"),
    reviewTodo: () => openTodoPanel("reminder"),
    summarizeTodo: () => summarizeTodo("manual"),
    openJournalPanel,
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
  } else if (command === "todoMorningTime") {
    setTodoMorningTime(value);
  } else if (command === "todoEveningTime") {
    setTodoEveningTime(value);
  } else if (command === "todoReminderInterval") {
    setTodoReminderInterval(value);
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

window.force_desktop_pet_drag_interaction = (totalX = 96, totalY = 18) => {
  const ok = triggerDragInteraction(Number(totalX), Number(totalY));
  renderDom();
  render();
  return JSON.stringify({
    ok,
    mode: state.mode,
    activity: state.activity.kind,
    lastAction: state.lastAction,
    message: state.message,
    feedback: getPublicState().feedback,
    stats: getPublicState().stats,
  });
};

window.preview_desktop_pet_feedback = (action = "feed", bond = state.stats.bond, dateText = "") => {
  const previousBond = state.stats.bond;
  const previousGrowth = { ...state.growth };
  state.stats.bond = clamp(Number(bond), 0, 100);
  const date = dateText ? new Date(dateText) : new Date();
  const samples = Array.from({ length: 4 }, () => contextualFeedback(action, `${displayName()} 收到互动。`, date));
  state.stats.bond = previousBond;
  state.growth = previousGrowth;
  return JSON.stringify(samples);
};

window.preview_desktop_pet_motion_pool = (action = "feed") => {
  return JSON.stringify((INTERACTION_MOTIONS[action] || []).map((motion) => motion.activity));
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
  updateGrowth();
  saveState();
  renderDom();
  render();
  return JSON.stringify(getPublicState());
};

window.set_desktop_pet_daily_tasks = (taskIds = []) => {
  const ids = Array.isArray(taskIds) ? taskIds : String(taskIds).split(",");
  const uniqueIds = ids
    .map((id) => String(id).trim())
    .filter((id, index, array) => id && array.indexOf(id) === index);
  const definitions = uniqueIds
    .map((id) => DAILY_TASK_POOL.find((task) => task.id === id))
    .filter(Boolean)
    .slice(0, 3);

  if (definitions.length) {
    state.memory.daily = {
      date: todayKey(),
      tasks: definitions.map((task) => ({ id: task.id, label: task.label, done: false })),
      completed: 0,
    };
    saveState();
  }
  renderDom();
  render();
  return JSON.stringify(getPublicState());
};

window.force_desktop_pet_daily_refresh = () => {
  refreshDailyTasks("test");
  renderDom();
  render();
  return JSON.stringify(getPublicState());
};

window.set_desktop_pet_todos = (items = []) => {
  ensureTodoDate();
  const values = Array.isArray(items) ? items : String(items).split(/\n|,/);
  state.todo.items = values
    .map((item) => (typeof item === "string" ? createTodoItem(item) : createTodoItem(item.text, item.done)))
    .filter((item) => item.text)
    .slice(0, 10);
  state.todo.nextReminderInMs = state.todo.reminderIntervalMs;
  saveState();
  renderDom();
  render();
  return JSON.stringify(getPublicState());
};

window.force_desktop_pet_yesterday_todos = (items = []) => {
  const values = Array.isArray(items) ? items : String(items).split(/\n|,/);
  const previousDate = addDays(new Date(), -1);
  const previous = {
    ...createTodoState(previousDate),
    morningTime: state.todo.morningTime,
    eveningTime: state.todo.eveningTime,
    reminderIntervalMs: state.todo.reminderIntervalMs,
    items: values
      .map((item) => (typeof item === "string" ? createTodoItem(item) : createTodoItem(item.text, item.done)))
      .filter((item) => item.text)
      .slice(0, 10),
  };
  state.todo = previous;
  ensureTodoDate();
  renderDom();
  render();
  return JSON.stringify(getPublicState());
};

window.edit_desktop_pet_todo = (index = 0, text = "") => {
  ensureTodoDate();
  const item = state.todo.items[Number(index)];
  if (item) updateTodoItemText(item.id, text);
  renderDom();
  render();
  return JSON.stringify(getPublicState());
};

window.move_desktop_pet_todo = (fromIndex = 0, toIndex = 0) => {
  ensureTodoDate();
  const from = Number(fromIndex);
  const to = Number(toIndex);
  if (from >= 0 && from < state.todo.items.length && to >= 0 && to < state.todo.items.length) {
    const [item] = state.todo.items.splice(from, 1);
    state.todo.items.splice(to, 0, item);
    syncTodoInputFromItems();
    renderTodoPanel();
    saveState();
  }
  renderDom();
  render();
  return JSON.stringify(getPublicState());
};

window.apply_desktop_pet_todo_carryover = () => {
  applyTodoCarryover();
  renderDom();
  render();
  return JSON.stringify(getPublicState());
};

window.force_desktop_pet_todo_plan = () => {
  openTodoPanel("morning");
  renderDom();
  render();
  return JSON.stringify(getPublicState());
};

window.force_desktop_pet_todo_reminder = () => {
  openTodoPanel("reminder");
  renderDom();
  render();
  return JSON.stringify(getPublicState());
};

window.force_desktop_pet_todo_summary = () => {
  summarizeTodo("manual");
  renderDom();
  render();
  return JSON.stringify(getPublicState());
};

window.render_desktop_pet_theme_at = (dateText) => {
  const date = dateText ? new Date(dateText) : new Date();
  return JSON.stringify({
    period: getDayPeriod(date),
    season: getSeason(date),
    palette: state.pet ? themedPalette(state.pet.colors, date) : [],
  });
};

window.force_desktop_pet_companion_moment = (dateText) => {
  const date = dateText ? new Date(dateText) : new Date();
  if (!state.companion.startedAt) {
    state.companion.startedAt = date.getTime() - 90 * 60 * 1000;
  }
  if (!state.companion.bornAtMs) {
    state.companion.bornAtMs = state.companion.startedAt;
  }
  state.activity.timeLeftMs = 0;
  const moment = { time: `${pad2(date.getHours())}:${pad2(date.getMinutes())}`, done: false };
  triggerCompanionMoment(moment, date);
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
  hoverState.barVisibleMs = 1600;
  hoverState.stillMs = 3000;
  hoverState.show = state.mode === "hatched";
  renderDom();
  render();
  return JSON.stringify(getPublicState());
};

window.force_desktop_pet_quick_bar = () => {
  hoverState.over = true;
  hoverState.barVisibleMs = 1600;
  hoverState.stillMs = 0;
  hoverState.show = false;
  renderDom();
  render();
  return JSON.stringify(getPublicState());
};

window.open_desktop_pet_quick_bar_category = (cat = "care") => {
  hoverState.over = true;
  hoverState.barVisibleMs = 1800;
  hoverState.stillMs = 0;
  hoverState.show = false;
  selectQuickBarCategory(String(cat), false);
  renderDom();
  render();
  return JSON.stringify(getPublicState());
};

window.open_desktop_pet_journal = () => {
  openJournalPanel();
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
ui.todoPanel?.addEventListener("pointerdown", (event) => {
  event.stopPropagation();
});
ui.todoList?.addEventListener("change", (event) => {
  const checkbox = event.target.closest("input[data-todo-id]");
  const editor = event.target.closest("input[data-todo-edit]");
  if (checkbox) {
    setTodoItemDone(checkbox.dataset.todoId, checkbox.checked);
    return;
  }
  if (editor) {
    updateTodoItemText(editor.dataset.todoEdit, editor.value);
  }
});
ui.todoList?.addEventListener("keydown", (event) => {
  const editor = event.target.closest("input[data-todo-edit]");
  if (!editor) return;
  if (event.key === "Enter") {
    event.preventDefault();
    editor.blur();
  }
  if (event.key === "Escape") {
    event.preventDefault();
    renderTodoPanel();
  }
});
ui.todoList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-todo-move]");
  if (!button) return;
  moveTodoItem(button.dataset.todoId, button.dataset.todoMove);
});
ui.todoList?.addEventListener("dragstart", (event) => {
  const row = event.target.closest("[data-todo-id]");
  if (!row) return;
  todoDragId = row.dataset.todoId;
  row.classList.add("is-dragging");
  event.dataTransfer?.setData("text/plain", todoDragId);
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
});
ui.todoList?.addEventListener("dragover", (event) => {
  if (!todoDragId) return;
  const row = event.target.closest("[data-todo-id]");
  if (!row || row.dataset.todoId === todoDragId) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
});
ui.todoList?.addEventListener("drop", (event) => {
  const row = event.target.closest("[data-todo-id]");
  const sourceId = event.dataTransfer?.getData("text/plain") || todoDragId;
  if (!row || !sourceId) return;
  event.preventDefault();
  reorderTodoItem(sourceId, row.dataset.todoId);
});
ui.todoList?.addEventListener("dragend", () => {
  todoDragId = "";
  ui.todoList?.querySelectorAll(".is-dragging").forEach((row) => row.classList.remove("is-dragging"));
});
ui.todoSave?.addEventListener("click", () => saveTodoPlan("manual"));
ui.todoFeedback?.addEventListener("click", () => submitTodoFeedback("progress"));
ui.todoAllDone?.addEventListener("click", completeAllTodos);
ui.todoCarryover?.addEventListener("click", applyTodoCarryover);
ui.todoLater?.addEventListener("click", () => {
  closeTodoPanel();
  submitTodoFeedback("later");
});
ui.todoClose?.addEventListener("click", closeTodoPanel);
ui.todoInput?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeTodoPanel();
  }
});
ui.journalPanel?.addEventListener("pointerdown", (event) => {
  event.stopPropagation();
});
ui.journalClose?.addEventListener("click", closeJournalPanel);
ui.journalClear?.addEventListener("click", clearJournalPanel);
ui.quickBar?.addEventListener("pointerenter", beginQuickBarHover);
ui.quickBar?.addEventListener("pointerleave", endQuickBarHover);
ui.quickBar?.addEventListener("pointerover", handleQuickBarPointerOver);
ui.quickBar?.addEventListener("pointerdown", (event) => {
  event.stopPropagation();
});
ui.quickBar?.addEventListener("click", handleQuickBarClick);

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
