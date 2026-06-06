const STORAGE_KEY = "neon-hatch-desktop-v2";
const LEGACY_STORAGE_KEYS = ["neon-hatch-desktop-v1"];
const canvas = document.getElementById("desktopPetCanvas");
const ctx = canvas.getContext("2d");

const ui = {
  shell: document.getElementById("petShell"),
  dragHandle: document.getElementById("dragHandle"),
  topStatus: document.getElementById("topStatus"),
  speechBubble: document.getElementById("speechBubble"),
  petName: document.getElementById("petName"),
  petMood: document.getElementById("petMood"),
  hatchBtn: document.getElementById("hatchBtn"),
  feedBtn: document.getElementById("feedBtn"),
  playBtn: document.getElementById("playBtn"),
  exploreBtn: document.getElementById("exploreBtn"),
  petBtn: document.getElementById("petBtn"),
  danceBtn: document.getElementById("danceBtn"),
  sleepBtn: document.getElementById("sleepBtn"),
  cleanBtn: document.getElementById("cleanBtn"),
  moodButtons: Array.from(document.querySelectorAll("[data-mood]")),
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
    activity: "dance",
    durationMs: 2300,
    stats: { happiness: 12, bond: 5, energy: -4 },
    particle: "note",
    count: 8,
    x: 146,
    y: 72,
    color: "#82ff8f",
    message: "接住了你的开心，尾巴开始同步闪烁。",
  },
  sad: {
    action: "陪伴",
    activity: "comfort",
    durationMs: 2400,
    stats: { happiness: 9, bond: 12, energy: 2 },
    particle: "heart",
    count: 8,
    x: 122,
    y: 74,
    color: "#ff35d4",
    message: "贴近屏幕：难过不用马上变好，我陪你待一会儿。",
  },
  anxious: {
    action: "稳定",
    activity: "comfort",
    durationMs: 2300,
    stats: { happiness: 7, bond: 9, energy: 4 },
    particle: "spark",
    count: 6,
    x: 122,
    y: 84,
    color: "#61fff4",
    message: "启动稳定模式：先呼吸，再选最小的一步。",
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
  },
  angry: {
    action: "降温",
    activity: "hop",
    durationMs: 1900,
    stats: { happiness: 6, bond: 8, energy: -3 },
    particle: "spark",
    count: 7,
    x: 118,
    y: 128,
    color: "#ff35d4",
    message: "陪你把火气弹出去一点，然后再慢慢降温。",
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
  },
  lonely: {
    action: "贴贴",
    activity: "pet",
    durationMs: 2200,
    stats: { happiness: 10, bond: 14, energy: 1 },
    particle: "heart",
    count: 10,
    x: 120,
    y: 70,
    color: "#ff35d4",
    message: "靠近了一点：你不是一个人在这个桌面上。",
  },
  excited: {
    action: "兴奋",
    activity: "wiggle",
    durationMs: 2300,
    stats: { happiness: 11, bond: 7, energy: -5, coins: 2 },
    particle: "note",
    count: 9,
    x: 152,
    y: 70,
    color: "#82ff8f",
    message: "收到高能信号，顺手给你蹦出 2 C。",
  },
  calm: {
    action: "平静",
    activity: "stretch",
    durationMs: 2200,
    stats: { happiness: 6, bond: 7, energy: 5 },
    particle: "spark",
    count: 4,
    x: 120,
    y: 94,
    color: "#82ff8f",
    message: "把呼吸调成柔和频率，今天可以慢慢来。",
  },
  stressed: {
    action: "减压",
    activity: "comfort",
    durationMs: 2500,
    stats: { happiness: 8, bond: 10, energy: 3 },
    particle: "heart",
    count: 6,
    x: 126,
    y: 78,
    color: "#61fff4",
    message: "帮你把压力拆小：先处理眼前这一格。",
  },
};

function randomAutoDelay() {
  return 2400 + Math.random() * 4200;
}

function defaultState() {
  return {
    mode: "egg",
    hatchMs: 0,
    pet: null,
    message: "我还是一颗蛋。点一下孵化，让我住到桌面上。",
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
    nextAutoActionMs: randomAutoDelay(),
    animationMs: 0,
    lastAction: "待机",
  };
}

let state = loadState();
let lastFrame = performance.now();
let dragStart = null;
let particles = [];

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
      nextAutoActionMs: randomAutoDelay(),
    };
  } catch {
    return defaultState();
  }
}

function saveState() {
  const snapshot = {
    mode: state.mode,
    hatchMs: state.hatchMs,
    pet: state.pet,
    message: state.message,
    stats: state.stats,
    activity: { kind: "idle", timeLeftMs: 0, durationMs: 0 },
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
  ui.speechBubble.classList.remove("pulse");
  requestAnimationFrame(() => ui.speechBubble.classList.add("pulse"));
  setTimeout(() => ui.speechBubble.classList.remove("pulse"), 220);
  renderDom();
  saveState();
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
  return state.pet?.name || "未孵化";
}

function resetToEgg(message = "已经回到初始蛋。再点一次孵化，会随机出生一只新宠物。") {
  state = defaultState();
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
  setActivity("happy", 2200);
  burst("spark", 8, 120, 70, "#ffe66a");
  say(`${pet.name} 入驻桌面：${pet.personality}。`, "已入驻");
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
  say(`${displayName()} 吃掉一块小小能量饼，顺手吐出 2 C。`, "喂食");
}

function playPet() {
  if (!requirePet("玩耍")) return;
  if (state.stats.energy < 10) {
    say(`${displayName()} 眨了眨眼：低电量，想先休息。`, "低电量");
    return;
  }
  state.stats.happiness = clamp(state.stats.happiness + 16);
  state.stats.bond = clamp(state.stats.bond + 5);
  state.stats.energy = clamp(state.stats.energy - 10);
  state.stats.satiety = clamp(state.stats.satiety - 5);
  state.stats.clean = clamp(state.stats.clean - 5);
  setActivity("play", 2200);
  burst("spark", 7, 160, 96, "#ff35d4");
  say(`${displayName()} 在桌面上追了一圈霓虹光点。`, "玩耍");
}

function explorePet() {
  if (!requirePet("探险")) return;
  if (state.stats.energy < 12) {
    say(`${displayName()} 探险前需要充点电。`, "低电量");
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
  say(`${displayName()} ${event}`, "探险");
}

function petPet() {
  if (!requirePet("摸摸")) return;
  state.stats.happiness = clamp(state.stats.happiness + 7);
  state.stats.bond = clamp(state.stats.bond + 9);
  setActivity("pet", 1700);
  burst("heart", 8, 122, 70, "#ff35d4");
  say(`${displayName()} 被摸摸以后，贴着桌面蹭了一下。`, "摸摸");
}

function dancePet() {
  if (!requirePet("跳舞")) return;
  if (state.stats.energy < 14) {
    say(`${displayName()} 想跳舞，但电量还不够。`, "低电量");
    return;
  }
  state.stats.energy = clamp(state.stats.energy - 14);
  state.stats.happiness = clamp(state.stats.happiness + 22);
  state.stats.bond = clamp(state.stats.bond + 6);
  state.stats.coins = clamp(state.stats.coins + 4, 0, 999);
  state.stats.clean = clamp(state.stats.clean - 4);
  setActivity("dance", 2800);
  burst("note", 10, 142, 72, "#82ff8f");
  say(`${displayName()} 播放一段赛博节拍，跳得像小小霓虹灯。`, "跳舞");
}

function sleepPet() {
  if (!requirePet("睡觉")) return;
  state.stats.energy = clamp(state.stats.energy + 28);
  state.stats.happiness = clamp(state.stats.happiness + 4);
  state.stats.satiety = clamp(state.stats.satiety - 4);
  setActivity("sleep", 3200);
  burst("sleep", 5, 158, 58, "#61fff4");
  say(`${displayName()} 进入桌面小睡，呼吸频率变得很稳。`, "睡觉");
}

function cleanPet() {
  if (!requirePet("清洁")) return;
  state.stats.clean = clamp(state.stats.clean + 30);
  state.stats.happiness = clamp(state.stats.happiness + 6);
  state.stats.bond = clamp(state.stats.bond + 3);
  setActivity("clean", 2100);
  burst("bubble", 10, 120, 110, "#61fff4");
  say(`${displayName()} 的像素边缘被擦得亮晶晶。`, "清洁");
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
  say(`${displayName()} ${mood.message}`, mood.action);
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
    state.stats.energy = clamp(state.stats.energy + seconds * 0.03);
    state.stats.clean = clamp(state.stats.clean - seconds * 0.012);
    if (state.activity.timeLeftMs > 0) {
      state.activity.timeLeftMs = Math.max(0, state.activity.timeLeftMs - dtMs);
      if (state.activity.timeLeftMs === 0) {
        state.activity.kind = "idle";
      }
    } else {
      state.nextAutoActionMs -= dtMs;
      if (state.nextAutoActionMs <= 0) {
        triggerAutoAction();
      }
    }
  }
}

function renderDom() {
  const hatched = state.mode === "hatched";
  ui.speechBubble.textContent = state.message;
  ui.petName.textContent = hatched ? `${displayName()} / ${state.stats.coins} C` : state.mode === "hatching" ? "孵化中" : "未孵化";
  ui.petMood.textContent = hatched ? `${state.lastAction} / 快乐 ${Math.round(state.stats.happiness)}` : state.lastAction;
  ui.hatchBtn.textContent = state.mode === "hatched" ? "重孵" : state.mode === "hatching" ? "孵化中" : "孵化";
  ui.hatchBtn.disabled = state.mode === "hatching";
  ui.feedBtn.disabled = !hatched;
  ui.playBtn.disabled = !hatched;
  ui.exploreBtn.disabled = !hatched;
  ui.petBtn.disabled = !hatched;
  ui.danceBtn.disabled = !hatched || state.stats.energy < 14;
  ui.sleepBtn.disabled = !hatched;
  ui.cleanBtn.disabled = !hatched;
  ui.moodButtons.forEach((button) => {
    button.disabled = !hatched;
  });
}

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let x = 0; x < canvas.width; x += 16) {
    px(x, 0, 1, canvas.height, "rgba(97,255,244,0.08)");
  }
  for (let y = 0; y < canvas.height; y += 16) {
    px(0, y, canvas.width, 1, "rgba(255,53,212,0.07)");
  }
}

function drawPixelText(text, x, y, color = "#61fff4") {
  ctx.fillStyle = color;
  ctx.font = "8px Courier New, monospace";
  ctx.fillText(text, x, y);
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
  px(70, 172, 100, 7, "rgba(97,255,244,0.18)");
  px(70, 172, 100 * progress, 7, "#ff35d4");
}

function drawPet() {
  const pet = state.pet || PETS[0];
  const [main, dark, accent, spark] = pet.colors;
  const activity = state.activity.kind;
  const bob = getActivityBob(activity);
  const squish = activity === "pet"
    ? Math.sin(state.animationMs / 120) * 2
    : activity === "stretch"
      ? -Math.abs(Math.sin(state.animationMs / 150)) * 4
      : activity === "hop"
        ? Math.max(0, Math.sin(state.animationMs / 95)) * 3
        : 0;
  const blink = activity === "sleep" || Math.floor(state.animationMs / 900) % 5 === 0;
  const x = 120;
  const y = 82 + bob;
  const danceShift = activity === "dance" || activity === "wiggle" ? Math.sin(state.animationMs / 95) * 8 : 0;
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

  drawActivityProps(activity, petX, y, accent, spark);
  drawParticles();
  drawStatPips();
}

function getActivityBob(activity) {
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

function render() {
  drawBackground();
  if (state.mode === "hatched") drawPet();
  else drawEgg();
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
  dragStart = { x: event.screenX, y: event.screenY };
  ui.dragHandle.setPointerCapture(event.pointerId);
}

function moveDrag(event) {
  if (!dragStart) return;
  const delta = {
    x: event.screenX - dragStart.x,
    y: event.screenY - dragStart.y,
  };
  dragStart = { x: event.screenX, y: event.screenY };
  window.desktopPet?.moveBy(delta);
}

function endDrag(event) {
  dragStart = null;
  try {
    ui.dragHandle.releasePointerCapture(event.pointerId);
  } catch {
    // Pointer capture may already be released when the OS moves the window.
  }
}

window.render_desktop_pet_to_text = () => JSON.stringify({
  mode: state.mode,
  pet: state.pet ? { id: state.pet.id, name: state.pet.name, personality: state.pet.personality } : null,
  stats: Object.fromEntries(Object.entries(state.stats).map(([key, value]) => [key, Math.round(value)])),
  activity: {
    kind: state.activity.kind,
    timeLeftMs: Math.round(state.activity.timeLeftMs),
    nextAutoActionMs: Math.round(state.nextAutoActionMs),
  },
  particles: particles.length,
  message: state.message,
  lastAction: state.lastAction,
});

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

window.reset_desktop_pet_to_egg = () => {
  resetToEgg();
  return window.render_desktop_pet_to_text();
};

window.choose_desktop_pet_mood = (moodKey) => {
  respondMood(moodKey);
  return window.render_desktop_pet_to_text();
};

ui.hatchBtn.addEventListener("click", hatchPet);
ui.feedBtn.addEventListener("click", feedPet);
ui.playBtn.addEventListener("click", playPet);
ui.exploreBtn.addEventListener("click", explorePet);
ui.petBtn.addEventListener("click", petPet);
ui.danceBtn.addEventListener("click", dancePet);
ui.sleepBtn.addEventListener("click", sleepPet);
ui.cleanBtn.addEventListener("click", cleanPet);
ui.moodButtons.forEach((button) => {
  button.addEventListener("click", () => respondMood(button.dataset.mood));
});
canvas.addEventListener("click", petPet);
ui.dragHandle.addEventListener("pointerdown", beginDrag);
ui.dragHandle.addEventListener("pointermove", moveDrag);
ui.dragHandle.addEventListener("pointerup", endDrag);
ui.dragHandle.addEventListener("pointercancel", endDrag);
document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  window.desktopPet?.showContextMenu();
});
window.desktopPet?.onTopChanged((value) => {
  ui.topStatus.textContent = value ? "置顶" : "普通";
});

renderDom();
render();
requestAnimationFrame(tick);
