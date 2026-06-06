const STORAGE_KEY = "neon-hatch-state-v1";
const canvas = document.getElementById("petCanvas");
const ctx = canvas.getContext("2d");

const ui = {
  modeBadge: document.getElementById("modeBadge"),
  countdownText: document.getElementById("countdownText"),
  hatchSeconds: document.getElementById("hatchSeconds"),
  startHatchBtn: document.getElementById("startHatchBtn"),
  resetBtn: document.getElementById("resetBtn"),
  petNameInput: document.getElementById("petNameInput"),
  saveNameBtn: document.getElementById("saveNameBtn"),
  levelValue: document.getElementById("levelValue"),
  xpValue: document.getElementById("xpValue"),
  coinsValue: document.getElementById("coinsValue"),
  titleValue: document.getElementById("titleValue"),
  xpBar: document.getElementById("xpBar"),
  feedBtn: document.getElementById("feedBtn"),
  playBtn: document.getElementById("playBtn"),
  cleanBtn: document.getElementById("cleanBtn"),
  sleepBtn: document.getElementById("sleepBtn"),
  trainBtn: document.getElementById("trainBtn"),
  startSparkBtn: document.getElementById("startSparkBtn"),
  exploreBtn: document.getElementById("exploreBtn"),
  sparkInfo: document.getElementById("sparkInfo"),
  buyFoodBtn: document.getElementById("buyFoodBtn"),
  buyToyBtn: document.getElementById("buyToyBtn"),
  buyChipBtn: document.getElementById("buyChipBtn"),
  equipNoneBtn: document.getElementById("equipNoneBtn"),
  equipHaloBtn: document.getElementById("equipHaloBtn"),
  equipCrownBtn: document.getElementById("equipCrownBtn"),
  equipScarfBtn: document.getElementById("equipScarfBtn"),
  discoveryList: document.getElementById("discoveryList"),
  questList: document.getElementById("questList"),
  claimQuestBtn: document.getElementById("claimQuestBtn"),
  moodInput: document.getElementById("moodInput"),
  sendMoodBtn: document.getElementById("sendMoodBtn"),
  speechBubble: document.getElementById("speechBubble"),
  petIdentity: document.getElementById("petIdentity"),
  eventLog: document.getElementById("eventLog"),
  satietyBar: document.getElementById("satietyBar"),
  happinessBar: document.getElementById("happinessBar"),
  energyBar: document.getElementById("energyBar"),
  bondBar: document.getElementById("bondBar"),
  cleanlinessBar: document.getElementById("cleanlinessBar"),
  satietyValue: document.getElementById("satietyValue"),
  happinessValue: document.getElementById("happinessValue"),
  energyValue: document.getElementById("energyValue"),
  bondValue: document.getElementById("bondValue"),
  cleanlinessValue: document.getElementById("cleanlinessValue"),
};

const PETS = [
  {
    id: "byte-cat",
    name: "字节猫",
    personality: "敏锐又傲娇",
    colors: ["#61fff4", "#132d44", "#ff35d4", "#ffe66a"],
    ears: "point",
    tail: "curl",
    replyStyle: "我会把你的情绪存进发光缓存里，慢慢处理。",
  },
  {
    id: "neon-pup",
    name: "霓虹犬",
    personality: "热情且守护欲强",
    colors: ["#ffe66a", "#2c194b", "#61fff4", "#ff6a7a"],
    ears: "flop",
    tail: "bolt",
    replyStyle: "我在这里陪你，把今天拆成下一小步。",
  },
  {
    id: "glitch-fox",
    name: "故障狐",
    personality: "安静、聪明、会说冷静的话",
    colors: ["#ff35d4", "#190f2d", "#61fff4", "#82ff8f"],
    ears: "point",
    tail: "double",
    replyStyle: "情绪不是错误码，它只是提醒你需要被照顾。",
  },
  {
    id: "volt-bun",
    name: "伏特兔",
    personality: "轻快、好奇、擅长鼓励",
    colors: ["#82ff8f", "#102717", "#ff35d4", "#ffe66a"],
    ears: "long",
    tail: "round",
    replyStyle: "收到你的信号啦，我们先把呼吸调回稳定帧率。",
  },
];

const SHOP_ITEMS = {
  food: { cost: 8, xp: 4, coins: 1 },
  toy: { cost: 10, xp: 5, coins: 1 },
  chip: { cost: 12, xp: 6, coins: 1 },
};

const ACCESSORIES = {
  none: { label: "无装扮", cost: 0 },
  halo: { label: "星环", cost: 14 },
  crown: { label: "光冠", cost: 18 },
  scarf: { label: "量子围巾", cost: 16 },
};

const DISCOVERY_LABELS = {
  neonAlley: "霓虹小巷",
  dataGarden: "数据花园",
  moonKiosk: "月光售货亭",
  signalTower: "信号高塔",
};

const ADVENTURES = [
  {
    id: "neonAlley",
    label: "霓虹小巷",
    line: "在霓虹小巷捡到一枚闪烁信用片。",
    xp: 10,
    coins: 8,
    happiness: 6,
    bond: 3,
  },
  {
    id: "dataGarden",
    label: "数据花园",
    line: "在数据花园闻了闻发光植物，清洁度也被刷新。",
    xp: 12,
    coins: 5,
    cleanliness: 18,
    bond: 4,
    unlock: "halo",
  },
  {
    id: "moonKiosk",
    label: "月光售货亭",
    line: "帮月光售货亭校准屏幕，获得一条软软的量子围巾。",
    xp: 14,
    coins: 6,
    happiness: 8,
    unlock: "scarf",
  },
  {
    id: "signalTower",
    label: "信号高塔",
    line: "爬上信号高塔看了一眼城市网格，勇气和羁绊都亮起来。",
    xp: 18,
    coins: 10,
    bond: 9,
    unlock: "crown",
  },
];

const QUESTS = [
  { key: "feed", label: "喂食一次" },
  { key: "play", label: "玩耍一次" },
  { key: "mood", label: "发送心情信号" },
  { key: "train", label: "完成一次训练" },
  { key: "spark", label: "完成追光小游戏" },
  { key: "adventure", label: "外出探险一次" },
];

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
}

function createQuests(dateKey = getTodayKey()) {
  return {
    dateKey,
    feed: false,
    play: false,
    mood: false,
    train: false,
    spark: false,
    adventure: false,
    claimed: false,
  };
}

function createSparkGame() {
  return {
    active: false,
    score: 0,
    lastScore: 0,
    timeLeftMs: 0,
    durationMs: 12000,
    target: { x: 160, y: 92, r: 13 },
  };
}

const defaultState = () => ({
  mode: "egg",
  hatchDurationMs: 12000,
  hatchElapsedMs: 0,
  pet: null,
  petName: "",
  level: 1,
  xp: 0,
  coins: 0,
  quests: createQuests(),
  discoveries: [],
  unlockedAccessories: ["none"],
  equippedAccessory: "none",
  sparkGame: createSparkGame(),
  stats: {
    satiety: 0,
    happiness: 0,
    energy: 0,
    bond: 0,
    cleanliness: 0,
  },
  message: "蛋壳正在等待第一道启动信号。",
  log: ["系统上线：等待设定孵化时间。"],
  animationMs: 0,
  saveClockMs: 0,
});

let state = loadState();
let lastFrame = performance.now();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const merged = { ...defaultState(), ...parsed };
    merged.stats = { ...defaultState().stats, ...(parsed.stats || {}) };
    merged.quests = normalizeQuests(parsed.quests);
    merged.discoveries = normalizeDiscoveries(parsed.discoveries);
    merged.unlockedAccessories = normalizeAccessories(parsed.unlockedAccessories);
    merged.equippedAccessory = ACCESSORIES[parsed.equippedAccessory] && merged.unlockedAccessories.includes(parsed.equippedAccessory)
      ? parsed.equippedAccessory
      : "none";
    merged.sparkGame = normalizeSparkGame(parsed.sparkGame);
    merged.level = Math.max(1, Number(parsed.level) || 1);
    merged.xp = Math.max(0, Number(parsed.xp) || 0);
    merged.coins = Math.max(0, Number(parsed.coins) || 0);
    merged.petName = typeof parsed.petName === "string" ? parsed.petName.slice(0, 8) : "";
    merged.log = Array.isArray(parsed.log) && parsed.log.length ? parsed.log.slice(0, 8) : defaultState().log;
    return merged;
  } catch {
    return defaultState();
  }
}

function normalizeQuests(quests) {
  const today = getTodayKey();
  if (!quests || quests.dateKey !== today) return createQuests(today);
  return { ...createQuests(today), ...quests };
}

function normalizeDiscoveries(discoveries) {
  if (!Array.isArray(discoveries)) return [];
  return [...new Set(discoveries.filter((id) => DISCOVERY_LABELS[id]))].slice(0, 8);
}

function normalizeAccessories(unlockedAccessories) {
  const safe = Array.isArray(unlockedAccessories) ? unlockedAccessories : ["none"];
  const normalized = [...new Set(["none", ...safe.filter((id) => ACCESSORIES[id])])];
  return normalized;
}

function normalizeSparkGame(sparkGame) {
  const merged = { ...createSparkGame(), ...(sparkGame || {}) };
  merged.active = false;
  merged.score = Math.max(0, Number(merged.score) || 0);
  merged.lastScore = Math.max(0, Number(merged.lastScore) || 0);
  merged.timeLeftMs = 0;
  merged.durationMs = 12000;
  merged.target = normalizeTarget(merged.target);
  return merged;
}

function normalizeTarget(target) {
  if (!target) return createSparkGame().target;
  return {
    x: clamp(Number(target.x) || 160, 36, canvas.width - 36),
    y: clamp(Number(target.y) || 92, 42, canvas.height - 64),
    r: clamp(Number(target.r) || 13, 9, 18),
  };
}

function persistState() {
  const persisted = {
    mode: state.mode,
    hatchDurationMs: state.hatchDurationMs,
    hatchElapsedMs: state.hatchElapsedMs,
    pet: state.pet,
    petName: state.petName,
    level: state.level,
    xp: state.xp,
    coins: state.coins,
    quests: state.quests,
    discoveries: state.discoveries,
    unlockedAccessories: state.unlockedAccessories,
    equippedAccessory: state.equippedAccessory,
    sparkGame: { ...state.sparkGame, active: false, timeLeftMs: 0 },
    stats: state.stats,
    message: state.message,
    log: state.log.slice(0, 8),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function pickPet() {
  return PETS[Math.floor(Math.random() * PETS.length)];
}

function displayName() {
  if (!state.pet) return "未孵化";
  return state.petName.trim() || state.pet.name;
}

function currentTitle() {
  if (state.mode !== "hatched") return "--";
  if (state.sparkGame.active) return "追光猎手";
  if (state.level >= 5) return "赛博饲养员";
  if (state.discoveries.length >= 3) return "城市漫游者";
  if (state.stats.bond >= 72) return "同步搭档";
  if (state.stats.happiness >= 82) return "快乐电波";
  if (state.stats.energy < 28) return "省电模式";
  if (state.stats.cleanliness < 35) return "待清洁像素";
  return "新生信号";
}

function xpToNextLevel() {
  return 36 + state.level * 14;
}

function grantProgress(xpAmount = 0, coinAmount = 0) {
  const messages = [];
  state.xp += xpAmount;
  state.coins += coinAmount;

  while (state.xp >= xpToNextLevel()) {
    state.xp -= xpToNextLevel();
    state.level += 1;
    state.coins += 12;
    messages.push(`${displayName()} 升到 Lv.${state.level}，额外获得 12 C。`);
  }

  return messages;
}

function rewardText(xpAmount, coinAmount) {
  const parts = [];
  if (xpAmount) parts.push(`+${xpAmount} XP`);
  if (coinAmount) parts.push(`+${coinAmount} C`);
  return parts.length ? `（${parts.join(" / ")}）` : "";
}

function markQuest(key) {
  state.quests = normalizeQuests(state.quests);
  if (Object.prototype.hasOwnProperty.call(state.quests, key)) {
    state.quests[key] = true;
  }
}

function addDiscovery(id) {
  if (!DISCOVERY_LABELS[id]) return false;
  if (state.discoveries.includes(id)) return false;
  state.discoveries.push(id);
  state.discoveries = state.discoveries.slice(0, 8);
  return true;
}

function unlockAccessory(id) {
  if (!ACCESSORIES[id] || state.unlockedAccessories.includes(id)) return false;
  state.unlockedAccessories.push(id);
  return true;
}

function allQuestsDone() {
  state.quests = normalizeQuests(state.quests);
  return QUESTS.every((quest) => state.quests[quest.key]);
}

function addLog(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 8);
  state.message = message;
  pulseSpeech();
  renderDom();
  persistState();
}

function pulseSpeech() {
  ui.speechBubble.classList.remove("pulse");
  requestAnimationFrame(() => ui.speechBubble.classList.add("pulse"));
  window.setTimeout(() => ui.speechBubble.classList.remove("pulse"), 260);
}

function startHatching() {
  if (state.mode === "hatched") {
    addLog("宠物已经孵化完成，如需重来可以重置宠物舱。");
    return;
  }

  const seconds = clamp(Number(ui.hatchSeconds.value) || 12, 1, 3600);
  state.mode = "hatching";
  state.hatchDurationMs = seconds * 1000;
  state.hatchElapsedMs = 0;
  addLog(`孵化启动：生命舱将在 ${seconds} 秒后完成同步。`);
}

function finishHatching() {
  const pet = pickPet();
  state.mode = "hatched";
  state.hatchElapsedMs = state.hatchDurationMs;
  state.pet = pet;
  state.petName = "";
  state.level = 1;
  state.xp = 0;
  state.coins = 24;
  state.quests = createQuests();
  state.discoveries = [];
  state.unlockedAccessories = ["none"];
  state.equippedAccessory = "none";
  state.sparkGame = createSparkGame();
  state.stats = {
    satiety: 62,
    happiness: 66,
    energy: 72,
    bond: 18,
    cleanliness: 74,
  };
  addLog(`${pet.name} 破壳出现：${pet.personality}。获得初始信用点 24 C。`);
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  state = defaultState();
  ui.hatchSeconds.value = String(Math.round(state.hatchDurationMs / 1000));
  renderDom();
  renderCanvas();
}

function requireHatched(actionName) {
  if (state.mode !== "hatched") {
    addLog(`${actionName}需要先完成孵化。`);
    return false;
  }
  return true;
}

function savePetName() {
  if (!requireHatched("保存昵称")) return;
  const nextName = ui.petNameInput.value.trim().slice(0, 8);
  state.petName = nextName;
  addLog(nextName ? `${state.pet.name} 的舱内昵称更新为「${nextName}」。` : `${state.pet.name} 已恢复默认呼号。`);
}

function feedPet() {
  if (!requireHatched("喂食")) return;
  state.stats.satiety = clamp(state.stats.satiety + 18);
  state.stats.energy = clamp(state.stats.energy + 4);
  state.stats.happiness = clamp(state.stats.happiness + 5);
  state.stats.bond = clamp(state.stats.bond + 3);
  state.stats.cleanliness = clamp(state.stats.cleanliness - 2);
  markQuest("feed");
  const levelUps = grantProgress(5, 2);
  addLog(`${displayName()} 吃下了一块霓虹能量饼，饱腹值上升 ${rewardText(5, 2)}。${levelUps.join("")}`);
}

function playWithPet() {
  if (!requireHatched("玩耍")) return;
  if (state.stats.energy < 12) {
    state.stats.happiness = clamp(state.stats.happiness + 4);
    state.stats.bond = clamp(state.stats.bond + 2);
    const levelUps = grantProgress(2, 0);
    addLog(`${displayName()} 有点低电量，只轻轻回应了一下 ${rewardText(2, 0)}。${levelUps.join("")}`);
    return;
  }
  state.stats.happiness = clamp(state.stats.happiness + 18);
  state.stats.energy = clamp(state.stats.energy - 12);
  state.stats.satiety = clamp(state.stats.satiety - 6);
  state.stats.bond = clamp(state.stats.bond + 5);
  state.stats.cleanliness = clamp(state.stats.cleanliness - 5);
  markQuest("play");
  const levelUps = grantProgress(8, 3);
  addLog(`${displayName()} 和你玩了一轮像素追光，快乐值上升 ${rewardText(8, 3)}。${levelUps.join("")}`);
}

function cleanPet() {
  if (!requireHatched("清洁")) return;
  state.stats.cleanliness = clamp(state.stats.cleanliness + 30);
  state.stats.happiness = clamp(state.stats.happiness + 6);
  state.stats.bond = clamp(state.stats.bond + 3);
  const levelUps = grantProgress(5, 1);
  addLog(`${displayName()} 完成了纳米清洁，像素边缘重新发亮 ${rewardText(5, 1)}。${levelUps.join("")}`);
}

function letPetRest() {
  if (!requireHatched("休息")) return;
  state.stats.energy = clamp(state.stats.energy + 26);
  state.stats.happiness = clamp(state.stats.happiness + 3);
  state.stats.satiety = clamp(state.stats.satiety - 5);
  const levelUps = grantProgress(4, 1);
  addLog(`${displayName()} 进入短暂休眠，能量电池恢复 ${rewardText(4, 1)}。${levelUps.join("")}`);
}

function trainPet() {
  if (!requireHatched("训练")) return;
  if (state.stats.energy < 18 || state.stats.satiety < 12) {
    addLog(`${displayName()} 训练前需要更多能量和饱腹值。`);
    return;
  }
  state.stats.energy = clamp(state.stats.energy - 18);
  state.stats.satiety = clamp(state.stats.satiety - 10);
  state.stats.happiness = clamp(state.stats.happiness - 2);
  state.stats.bond = clamp(state.stats.bond + 7);
  state.stats.cleanliness = clamp(state.stats.cleanliness - 4);
  markQuest("train");
  const levelUps = grantProgress(16, 6);
  addLog(`${displayName()} 完成了一次同步训练，羁绊和经验提升 ${rewardText(16, 6)}。${levelUps.join("")}`);
}

function buyShopItem(kind) {
  if (!requireHatched("补给商店")) return;
  const item = SHOP_ITEMS[kind];
  if (!item || state.coins < item.cost) {
    addLog(`信用点不足，无法购买该补给。`);
    return;
  }

  state.coins -= item.cost;

  if (kind === "food") {
    state.stats.satiety = clamp(state.stats.satiety + 32);
    state.stats.energy = clamp(state.stats.energy + 8);
    state.stats.cleanliness = clamp(state.stats.cleanliness - 3);
    const levelUps = grantProgress(item.xp, item.coins);
    addLog(`${displayName()} 使用了强化能量饼，饱腹和能量大幅恢复 ${rewardText(item.xp, item.coins)}。${levelUps.join("")}`);
  }

  if (kind === "toy") {
    state.stats.happiness = clamp(state.stats.happiness + 28);
    state.stats.energy = clamp(state.stats.energy - 4);
    state.stats.bond = clamp(state.stats.bond + 4);
    const levelUps = grantProgress(item.xp, item.coins);
    addLog(`${displayName()} 追着激光玩具跑了一圈，快乐值冲高 ${rewardText(item.xp, item.coins)}。${levelUps.join("")}`);
  }

  if (kind === "chip") {
    state.stats.bond = clamp(state.stats.bond + 14);
    state.stats.happiness = clamp(state.stats.happiness + 6);
    const levelUps = grantProgress(item.xp, item.coins);
    addLog(`${displayName()} 装载了共情芯片，与你的同步率提升 ${rewardText(item.xp, item.coins)}。${levelUps.join("")}`);
  }
}

function claimQuestReward() {
  if (!requireHatched("每日任务")) return;
  state.quests = normalizeQuests(state.quests);
  if (state.quests.claimed) {
    addLog("今日任务奖励已经领取。");
    return;
  }
  if (!allQuestsDone()) {
    addLog("每日任务还没有全部完成。");
    return;
  }
  state.quests.claimed = true;
  state.stats.happiness = clamp(state.stats.happiness + 10);
  state.stats.bond = clamp(state.stats.bond + 8);
  const levelUps = grantProgress(20, 18);
  addLog(`每日任务完成：宠物舱发放奖励 ${rewardText(20, 18)}。${levelUps.join("")}`);
}

function randomSparkTarget() {
  return {
    x: Math.round(46 + Math.random() * (canvas.width - 92)),
    y: Math.round(48 + Math.random() * (canvas.height - 118)),
    r: 12,
  };
}

function startSparkGame() {
  if (!requireHatched("追光小游戏")) return;
  if (state.sparkGame.active) {
    addLog("追光小游戏已经开始：点击画布里的发光核心。");
    return;
  }
  if (state.stats.energy < 8) {
    addLog(`${displayName()} 能量不足，先休息一下再追光。`);
    return;
  }
  state.stats.energy = clamp(state.stats.energy - 8);
  state.stats.satiety = clamp(state.stats.satiety - 3);
  state.sparkGame = {
    ...createSparkGame(),
    active: true,
    timeLeftMs: createSparkGame().durationMs,
    target: randomSparkTarget(),
  };
  canvas.scrollIntoView({ block: "center", inline: "nearest" });
  addLog(`追光小游戏启动：12 秒内点击画布里的发光核心。`);
}

function finishSparkGame() {
  if (!state.sparkGame.active) return;
  const score = state.sparkGame.score;
  state.sparkGame.active = false;
  state.sparkGame.lastScore = score;
  state.sparkGame.timeLeftMs = 0;
  markQuest("spark");

  const xpReward = 8 + score * 5;
  const coinReward = 3 + score * 2;
  state.stats.happiness = clamp(state.stats.happiness + 8 + score * 3);
  state.stats.bond = clamp(state.stats.bond + 3 + score);
  const levelUps = grantProgress(xpReward, coinReward);
  addLog(`追光结束：命中 ${score} 次，${displayName()} 的反应速度提升 ${rewardText(xpReward, coinReward)}。${levelUps.join("")}`);
}

function handleCanvasClick(event) {
  if (!state.sparkGame.active) return;
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
  const target = state.sparkGame.target;
  const dx = x - target.x;
  const dy = y - target.y;
  const hit = Math.hypot(dx, dy) <= target.r + 6;

  if (!hit) {
    state.stats.happiness = clamp(state.stats.happiness - 1);
    return;
  }

  state.sparkGame.score += 1;
  state.stats.happiness = clamp(state.stats.happiness + 1);
  state.stats.bond = clamp(state.stats.bond + 0.5);
  state.sparkGame.target = randomSparkTarget();
  renderDom();
  drawCanvas();
}

function exploreCity() {
  if (!requireHatched("外出探险")) return;
  if (state.sparkGame.active) {
    addLog("追光小游戏进行中，探险稍后再出发。");
    return;
  }
  if (state.stats.energy < 14 || state.stats.satiety < 8) {
    addLog(`${displayName()} 探险前需要更多能量和饱腹值。`);
    return;
  }

  const event = ADVENTURES[Math.floor(Math.random() * ADVENTURES.length)];
  state.stats.energy = clamp(state.stats.energy - 14);
  state.stats.satiety = clamp(state.stats.satiety - 8);
  state.stats.cleanliness = clamp(state.stats.cleanliness - 7);
  state.stats.happiness = clamp(state.stats.happiness + (event.happiness || 0));
  state.stats.bond = clamp(state.stats.bond + (event.bond || 0));
  state.stats.cleanliness = clamp(state.stats.cleanliness + (event.cleanliness || 0));
  markQuest("adventure");

  const discovered = addDiscovery(event.id);
  const unlocked = event.unlock ? unlockAccessory(event.unlock) : false;
  const levelUps = grantProgress(event.xp, event.coins);
  const discoveryText = discovered ? `发现地点「${event.label}」。` : `再次访问「${event.label}」。`;
  const unlockText = unlocked ? `解锁装扮「${ACCESSORIES[event.unlock].label}」。` : "";
  addLog(`${displayName()} ${event.line}${discoveryText}${unlockText}${rewardText(event.xp, event.coins)}。${levelUps.join("")}`);
}

function useAccessory(id) {
  if (!requireHatched("装扮")) return;
  const accessory = ACCESSORIES[id];
  if (!accessory) return;
  if (!state.unlockedAccessories.includes(id)) {
    if (state.coins < accessory.cost) {
      addLog(`信用点不足，无法解锁「${accessory.label}」。`);
      return;
    }
    state.coins -= accessory.cost;
    unlockAccessory(id);
    const levelUps = grantProgress(4, 0);
    state.equippedAccessory = id;
    addLog(`解锁并装备「${accessory.label}」${rewardText(4, 0)}。${levelUps.join("")}`);
    return;
  }

  state.equippedAccessory = id;
  addLog(id === "none" ? `${displayName()} 卸下了所有装扮。` : `${displayName()} 装备了「${accessory.label}」。`);
}

function moodReply(text) {
  const normalized = text.trim();
  const lower = normalized.toLowerCase();
  const petLine = state.pet.replyStyle;

  if (/开心|高兴|快乐|兴奋|很好|爽|棒|happy|great/.test(lower)) {
    state.stats.happiness = clamp(state.stats.happiness + 8);
    state.stats.bond = clamp(state.stats.bond + 6);
    return `${displayName()} 接收到亮色心情：太好了，${petLine}`;
  }
  if (/累|困|疲惫|没力|burn|tired|exhausted/.test(lower)) {
    state.stats.energy = clamp(state.stats.energy + 7);
    state.stats.bond = clamp(state.stats.bond + 7);
    return `${displayName()} 把声音调低：你已经运行很久了，先允许自己省电。${petLine}`;
  }
  if (/难过|伤心|低落|委屈|sad|down/.test(lower)) {
    state.stats.happiness = clamp(state.stats.happiness + 6);
    state.stats.bond = clamp(state.stats.bond + 9);
    return `${displayName()} 靠近屏幕：难过不是失败，我会陪你等它过去。${petLine}`;
  }
  if (/焦虑|紧张|害怕|担心|慌|anxious|stress|worried/.test(lower)) {
    state.stats.energy = clamp(state.stats.energy + 4);
    state.stats.happiness = clamp(state.stats.happiness + 5);
    state.stats.bond = clamp(state.stats.bond + 8);
    return `${displayName()} 开启稳定模式：先做最小的一件事，剩下的稍后再扫描。${petLine}`;
  }

  state.stats.bond = clamp(state.stats.bond + 5);
  state.stats.happiness = clamp(state.stats.happiness + 3);
  return `${displayName()} 认真记录了你的心情：我不急着修复你，只想先听懂你。${petLine}`;
}

function sendMood() {
  if (!requireHatched("心情频道")) return;
  const text = ui.moodInput.value.trim();
  if (!text) {
    addLog("心情频道等待输入：告诉它一点真实信号就好。");
    return;
  }
  markQuest("mood");
  const levelUps = grantProgress(7, 2);
  const reply = moodReply(text);
  ui.moodInput.value = "";
  addLog(`${reply}${rewardText(7, 2)}。${levelUps.join("")}`);
}

function update(dtMs) {
  state.animationMs += dtMs;

  if (state.mode === "hatching") {
    state.hatchElapsedMs += dtMs;
    if (state.hatchElapsedMs >= state.hatchDurationMs) {
      finishHatching();
    }
  }

  if (state.mode === "hatched") {
    const dtSeconds = dtMs / 1000;
    state.stats.satiety = clamp(state.stats.satiety - dtSeconds * 0.035);
    state.stats.happiness = clamp(state.stats.happiness - dtSeconds * 0.025);
    state.stats.energy = clamp(state.stats.energy + dtSeconds * 0.04);
    state.stats.cleanliness = clamp(state.stats.cleanliness - dtSeconds * 0.018);
    if (state.stats.cleanliness < 25 || state.stats.satiety < 20) {
      state.stats.happiness = clamp(state.stats.happiness - dtSeconds * 0.035);
    }
    if (state.sparkGame.active) {
      state.sparkGame.timeLeftMs = Math.max(0, state.sparkGame.timeLeftMs - dtMs);
      if (state.sparkGame.timeLeftMs <= 0) {
        finishSparkGame();
      }
    }
  }

  state.saveClockMs += dtMs;
  if (state.saveClockMs > 1000) {
    state.saveClockMs = 0;
    persistState();
  }
}

function formatCountdown() {
  if (state.mode === "egg") return "设定孵化时间后开始。";
  if (state.sparkGame.active) return `追光同步中：剩余 ${Math.ceil(state.sparkGame.timeLeftMs / 1000)} 秒，命中 ${state.sparkGame.score} 次。`;
  if (state.mode === "hatched") return "孵化完成：照顾它，或者把你的心情发给它。";
  const remaining = Math.max(0, state.hatchDurationMs - state.hatchElapsedMs);
  const seconds = Math.ceil(remaining / 1000);
  const pct = Math.round((state.hatchElapsedMs / state.hatchDurationMs) * 100);
  return `孵化同步中：剩余 ${seconds} 秒 / ${pct}%`;
}

function renderDom() {
  state.quests = normalizeQuests(state.quests);
  const hatched = state.mode === "hatched";
  const hatching = state.mode === "hatching";
  ui.modeBadge.textContent = state.sparkGame.active ? "追光中" : hatched ? "已孵化" : hatching ? "孵化中" : "待机";
  ui.countdownText.textContent = formatCountdown();
  ui.startHatchBtn.disabled = hatched || hatching;
  ui.hatchSeconds.disabled = hatched || hatching;
  ui.petNameInput.disabled = !hatched;
  ui.saveNameBtn.disabled = !hatched;
  ui.feedBtn.disabled = !hatched || state.sparkGame.active;
  ui.playBtn.disabled = !hatched || state.sparkGame.active;
  ui.cleanBtn.disabled = !hatched || state.sparkGame.active;
  ui.sleepBtn.disabled = !hatched || state.sparkGame.active;
  ui.trainBtn.disabled = !hatched || state.sparkGame.active || state.stats.energy < 18 || state.stats.satiety < 12;
  ui.startSparkBtn.disabled = !hatched || state.sparkGame.active || state.stats.energy < 8;
  ui.exploreBtn.disabled = !hatched || state.sparkGame.active || state.stats.energy < 14 || state.stats.satiety < 8;
  ui.buyFoodBtn.disabled = !hatched || state.sparkGame.active || state.coins < SHOP_ITEMS.food.cost;
  ui.buyToyBtn.disabled = !hatched || state.sparkGame.active || state.coins < SHOP_ITEMS.toy.cost;
  ui.buyChipBtn.disabled = !hatched || state.sparkGame.active || state.coins < SHOP_ITEMS.chip.cost;
  ui.claimQuestBtn.disabled = !hatched || state.quests.claimed || !allQuestsDone();
  ui.moodInput.disabled = !hatched;
  ui.sendMoodBtn.disabled = !hatched || state.sparkGame.active;
  ui.petIdentity.textContent = state.pet ? `${displayName()} / ${state.pet.personality}` : "未孵化";
  ui.speechBubble.textContent = state.message;
  if (!hatched) {
    ui.petNameInput.value = "";
  } else if (document.activeElement !== ui.petNameInput) {
    ui.petNameInput.value = state.petName;
  }
  ui.levelValue.textContent = hatched ? `Lv.${state.level}` : "--";
  ui.xpValue.textContent = hatched ? `${Math.round(state.xp)}/${xpToNextLevel()}` : "--";
  ui.coinsValue.textContent = hatched ? `${Math.round(state.coins)} C` : "--";
  ui.titleValue.textContent = currentTitle();
  ui.xpBar.style.width = hatched ? `${clamp((state.xp / xpToNextLevel()) * 100)}%` : "0%";
  ui.sparkInfo.textContent = !hatched
    ? "孵化后可开启限时追光。"
    : state.sparkGame.active
      ? `追光中：${Math.ceil(state.sparkGame.timeLeftMs / 1000)} 秒 / ${state.sparkGame.score} 命中`
      : `上次追光命中 ${state.sparkGame.lastScore} 次。点击画布里的发光核心得分。`;

  const stats = ["satiety", "happiness", "energy", "bond", "cleanliness"];
  for (const stat of stats) {
    const value = Math.round(state.stats[stat]);
    ui[`${stat}Bar`].style.width = `${hatched ? value : 0}%`;
    ui[`${stat}Value`].textContent = hatched ? `${value}` : "--";
  }

  ui.questList.innerHTML = "";
  for (const quest of QUESTS) {
    const item = document.createElement("li");
    item.className = state.quests[quest.key] ? "done" : "";
    const label = document.createElement("span");
    label.textContent = quest.label;
    const status = document.createElement("strong");
    status.textContent = state.quests[quest.key] ? "完成" : "待完成";
    item.append(label, status);
    ui.questList.append(item);
  }

  ui.discoveryList.innerHTML = "";
  const discoveries = state.discoveries.length ? state.discoveries : [];
  if (!hatched || discoveries.length === 0) {
    const item = document.createElement("li");
    item.textContent = hatched ? "还没有发现记录，外出探险试试看。" : "孵化后可记录探险发现。";
    ui.discoveryList.append(item);
  } else {
    for (const id of discoveries) {
      const item = document.createElement("li");
      item.textContent = DISCOVERY_LABELS[id];
      ui.discoveryList.append(item);
    }
  }

  renderAccessoryButtons(hatched);

  ui.eventLog.innerHTML = "";
  for (const entry of state.log) {
    const item = document.createElement("li");
    item.textContent = entry;
    ui.eventLog.append(item);
  }
}

function renderAccessoryButtons(hatched) {
  const buttons = {
    none: ui.equipNoneBtn,
    halo: ui.equipHaloBtn,
    crown: ui.equipCrownBtn,
    scarf: ui.equipScarfBtn,
  };

  for (const [id, button] of Object.entries(buttons)) {
    const accessory = ACCESSORIES[id];
    const unlocked = state.unlockedAccessories.includes(id);
    const equipped = state.equippedAccessory === id;
    button.disabled = !hatched || state.sparkGame.active || (!unlocked && state.coins < accessory.cost);
    button.textContent = equipped
      ? `${accessory.label} / 已装备`
      : unlocked
        ? accessory.label
        : `${accessory.label} / ${accessory.cost} C`;
    button.classList.toggle("equipped", equipped);
  }
}

function px(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawPixelText(text, x, y, color = "#61fff4") {
  ctx.fillStyle = color;
  ctx.font = "8px Courier New, monospace";
  ctx.fillText(text, x, y);
}

function drawBackground() {
  ctx.fillStyle = "#050713";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let x = 0; x < canvas.width; x += 16) {
    px(x, 0, 1, canvas.height, "rgba(97,255,244,0.08)");
  }
  for (let y = 0; y < canvas.height; y += 16) {
    px(0, y, canvas.width, 1, "rgba(255,53,212,0.07)");
  }

  const scanOffset = Math.floor((state.animationMs / 60) % 16);
  for (let y = scanOffset; y < canvas.height; y += 16) {
    px(0, y, canvas.width, 1, "rgba(236,251,255,0.06)");
  }

  px(16, 24, 70, 1, "#61fff4");
  px(234, 24, 70, 1, "#ff35d4");
  px(24, 198, 272, 2, "rgba(97,255,244,0.18)");
  drawPixelText("CORE VISUAL: 0,0 TOP-LEFT", 16, 18, "#88a8b4");
}

function drawEgg(progress) {
  const bob = Math.sin(state.animationMs / 360) * 3;
  const glow = progress > 0 ? "#ff35d4" : "#61fff4";
  px(110, 166 + bob, 100, 10, "rgba(97,255,244,0.18)");
  px(122, 74 + bob, 76, 8, "#dff9ff");
  px(110, 82 + bob, 100, 20, "#c7e9f1");
  px(102, 102 + bob, 116, 36, "#9bcbd5");
  px(110, 138 + bob, 100, 24, "#70aebc");
  px(126, 162 + bob, 68, 10, "#4c8290");
  px(130, 90 + bob, 18, 10, "#ffffff");
  px(154, 118 + bob, 20, 12, "rgba(97,255,244,0.38)");
  px(114, 132 + bob, 12, 8, "rgba(255,53,212,0.32)");
  px(198, 112 + bob, 8, 20, "rgba(255,230,106,0.28)");
  px(96, 98 + bob, 6, 50, glow);
  px(218, 100 + bob, 6, 50, glow);

  if (progress > 0.12) {
    const crack = Math.min(1, progress);
    px(160, 84 + bob, 6, 16, "#09111e");
    px(154, 100 + bob, 6, 10 + 18 * crack, "#09111e");
    px(160, 118 + bob, 12, 6, "#09111e");
    px(172, 124 + bob, 6, 14 + 16 * crack, "#09111e");
    px(148, 128 + bob, 10, 5, "#61fff4");
  }

  const barWidth = Math.round(120 * progress);
  px(100, 188, 120, 8, "rgba(97,255,244,0.15)");
  px(100, 188, barWidth, 8, progress > 0.78 ? "#ff35d4" : "#61fff4");
  drawPixelText(progress > 0 ? `HATCH ${Math.round(progress * 100)}%` : "EGG IDLE", 124, 208, "#ffe66a");
}

function drawAccessory(x, y, accent, spark) {
  if (state.equippedAccessory === "halo") {
    const pulse = Math.sin(state.animationMs / 180) * 2;
    px(x - 34, y - 22 + pulse, 68, 4, "#ffe66a");
    px(x - 24, y - 26 + pulse, 48, 3, "#61fff4");
    px(x + 38, y - 18 + pulse, 6, 6, "#ffe66a");
    return;
  }

  if (state.equippedAccessory === "crown") {
    px(x - 26, y - 18, 52, 8, "#ffe66a");
    px(x - 20, y - 28, 10, 14, "#ffe66a");
    px(x - 4, y - 34, 8, 20, "#ff35d4");
    px(x + 12, y - 28, 10, 14, "#ffe66a");
    px(x - 2, y - 26, 4, 4, "#61fff4");
    return;
  }

  if (state.equippedAccessory === "scarf") {
    px(x - 38, y + 58, 76, 8, accent);
    px(x + 28, y + 66, 14, 18, accent);
    px(x + 32, y + 72, 8, 5, spark);
  }
}

function drawSparkGameOverlay() {
  if (!state.sparkGame.active) return;
  const target = state.sparkGame.target;
  const pulse = Math.sin(state.animationMs / 110) * 2;
  const radius = target.r + pulse;

  px(target.x - radius, target.y - 2, radius * 2, 4, "#ffe66a");
  px(target.x - 2, target.y - radius, 4, radius * 2, "#61fff4");
  px(target.x - 7, target.y - 7, 14, 14, "#ff35d4");
  px(target.x - 3, target.y - 3, 6, 6, "#ecfbff");
  px(18, 34, 100, 14, "rgba(5,10,20,0.78)");
  drawPixelText(`SPARK ${state.sparkGame.score}`, 22, 44, "#ffe66a");
  drawPixelText(`${Math.ceil(state.sparkGame.timeLeftMs / 1000)}S`, 94, 44, "#61fff4");
}

function drawPet() {
  const pet = state.pet || PETS[0];
  const [main, dark, accent, spark] = pet.colors;
  const bob = Math.sin(state.animationMs / 280) * 3;
  const blink = Math.floor(state.animationMs / 900) % 5 === 0;
  const x = 150;
  const y = 96 + bob;

  px(108, 172 + bob, 110, 9, "rgba(97,255,244,0.18)");

  if (pet.tail === "curl") {
    px(x + 44, y + 32, 18, 8, accent);
    px(x + 58, y + 24, 8, 16, accent);
    px(x + 50, y + 18, 14, 8, accent);
  } else if (pet.tail === "bolt") {
    px(x + 44, y + 32, 12, 8, accent);
    px(x + 54, y + 24, 10, 8, accent);
    px(x + 46, y + 18, 10, 8, accent);
  } else if (pet.tail === "double") {
    px(x + 42, y + 28, 18, 7, accent);
    px(x + 44, y + 40, 22, 7, spark);
  } else {
    px(x + 44, y + 36, 14, 14, accent);
  }

  px(x - 42, y + 34, 84, 46, main);
  px(x - 34, y + 44, 68, 34, dark);
  px(x - 48, y + 12, 96, 52, main);
  px(x - 38, y + 22, 76, 34, dark);

  if (pet.ears === "long") {
    px(x - 30, y - 28, 14, 42, main);
    px(x + 16, y - 28, 14, 42, main);
    px(x - 25, y - 22, 5, 26, accent);
    px(x + 21, y - 22, 5, 26, accent);
  } else if (pet.ears === "flop") {
    px(x - 46, y + 4, 22, 28, main);
    px(x + 24, y + 4, 22, 28, main);
    px(x - 42, y + 12, 10, 18, accent);
    px(x + 32, y + 12, 10, 18, accent);
  } else {
    px(x - 42, y - 10, 22, 24, main);
    px(x + 20, y - 10, 22, 24, main);
    px(x - 34, y - 2, 8, 10, accent);
    px(x + 26, y - 2, 8, 10, accent);
  }

  drawAccessory(x, y, accent, spark);

  px(x - 24, y + 34, 8, blink ? 3 : 8, "#ecfbff");
  px(x + 16, y + 34, 8, blink ? 3 : 8, "#ecfbff");
  px(x - 21, y + 36, 3, 3, "#02030a");
  px(x + 19, y + 36, 3, 3, "#02030a");
  px(x - 5, y + 46, 10, 5, accent);
  px(x - 18, y + 64, 12, 8, spark);
  px(x + 6, y + 64, 12, 8, spark);
  px(x - 34, y + 78, 16, 10, main);
  px(x + 18, y + 78, 16, 10, main);

  const moodColor = state.stats.happiness > 70 ? "#82ff8f" : state.stats.happiness > 38 ? "#ffe66a" : "#ff6a7a";
  px(76, 58, 32, 8, moodColor);
  px(82, 50, 20, 8, moodColor);
  if (state.stats.cleanliness < 35) {
    px(x - 56, y + 54, 5, 5, "rgba(136,168,180,0.68)");
    px(x + 48, y + 18, 4, 4, "rgba(136,168,180,0.68)");
    px(x + 56, y + 64, 6, 6, "rgba(136,168,180,0.55)");
  }
  drawPixelText(`LV ${state.level}`, 20, 214, "#82ff8f");
  drawPixelText(displayName().toUpperCase(), 116, 208, "#ffe66a");
  if (state.discoveries.length > 0) {
    drawPixelText(`DISC ${state.discoveries.length}`, 244, 214, "#61fff4");
  }
}

function drawCanvas() {
  drawBackground();
  if (state.mode === "hatched") {
    drawPet();
    drawSparkGameOverlay();
  } else {
    const progress = state.mode === "hatching" ? clamp(state.hatchElapsedMs / state.hatchDurationMs, 0, 1) : 0;
    drawEgg(progress);
  }
}

function tick(now) {
  const dtMs = Math.min(80, now - lastFrame);
  lastFrame = now;
  update(dtMs);
  renderDom();
  drawCanvas();
  requestAnimationFrame(tick);
}

function renderCanvas() {
  drawCanvas();
}

function renderGameToText() {
  const progress = state.mode === "hatching" ? clamp(state.hatchElapsedMs / state.hatchDurationMs, 0, 1) : state.mode === "hatched" ? 1 : 0;
  const payload = {
    coordinateSystem: "canvas 320x240, origin top-left, x right, y down",
    mode: state.mode,
    hatch: {
      durationMs: Math.round(state.hatchDurationMs),
      elapsedMs: Math.round(state.hatchElapsedMs),
      remainingMs: Math.max(0, Math.round(state.hatchDurationMs - state.hatchElapsedMs)),
      progress: Number(progress.toFixed(3)),
    },
    pet: state.pet ? { id: state.pet.id, name: state.pet.name, displayName: displayName(), personality: state.pet.personality } : null,
    progress: {
      level: state.level,
      xp: Math.round(state.xp),
      xpToNext: xpToNextLevel(),
      coins: Math.round(state.coins),
      quests: state.quests,
      title: currentTitle(),
      discoveries: state.discoveries.map((id) => ({ id, label: DISCOVERY_LABELS[id] })),
      equippedAccessory: state.equippedAccessory,
      unlockedAccessories: state.unlockedAccessories,
    },
    sparkGame: {
      active: state.sparkGame.active,
      score: state.sparkGame.score,
      lastScore: state.sparkGame.lastScore,
      timeLeftMs: Math.round(state.sparkGame.timeLeftMs),
      target: state.sparkGame.active ? state.sparkGame.target : null,
    },
    stats: {
      satiety: Math.round(state.stats.satiety),
      happiness: Math.round(state.stats.happiness),
      energy: Math.round(state.stats.energy),
      bond: Math.round(state.stats.bond),
      cleanliness: Math.round(state.stats.cleanliness),
    },
    controls: {
      hatch: state.mode === "egg",
      feed: state.mode === "hatched",
      play: state.mode === "hatched",
      clean: state.mode === "hatched",
      rest: state.mode === "hatched",
      train: state.mode === "hatched" && state.stats.energy >= 18 && state.stats.satiety >= 12,
      sparkGame: state.mode === "hatched" && !state.sparkGame.active && state.stats.energy >= 8,
      explore: state.mode === "hatched" && !state.sparkGame.active && state.stats.energy >= 14 && state.stats.satiety >= 8,
      shop: state.mode === "hatched",
      claimQuestReward: state.mode === "hatched" && allQuestsDone() && !state.quests.claimed,
      mood: state.mode === "hatched",
    },
    message: state.message,
    log: state.log.slice(0, 3),
  };
  return JSON.stringify(payload);
}

window.render_game_to_text = renderGameToText;
window.advanceTime = (ms) => {
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  const stepMs = ms / steps;
  for (let i = 0; i < steps; i += 1) {
    update(stepMs);
  }
  renderDom();
  drawCanvas();
};

ui.startHatchBtn.addEventListener("click", startHatching);
ui.resetBtn.addEventListener("click", resetState);
ui.saveNameBtn.addEventListener("click", savePetName);
ui.feedBtn.addEventListener("click", feedPet);
ui.playBtn.addEventListener("click", playWithPet);
ui.cleanBtn.addEventListener("click", cleanPet);
ui.sleepBtn.addEventListener("click", letPetRest);
ui.trainBtn.addEventListener("click", trainPet);
ui.startSparkBtn.addEventListener("click", startSparkGame);
ui.exploreBtn.addEventListener("click", exploreCity);
ui.buyFoodBtn.addEventListener("click", () => buyShopItem("food"));
ui.buyToyBtn.addEventListener("click", () => buyShopItem("toy"));
ui.buyChipBtn.addEventListener("click", () => buyShopItem("chip"));
ui.equipNoneBtn.addEventListener("click", () => useAccessory("none"));
ui.equipHaloBtn.addEventListener("click", () => useAccessory("halo"));
ui.equipCrownBtn.addEventListener("click", () => useAccessory("crown"));
ui.equipScarfBtn.addEventListener("click", () => useAccessory("scarf"));
ui.claimQuestBtn.addEventListener("click", claimQuestReward);
ui.sendMoodBtn.addEventListener("click", sendMood);
canvas.addEventListener("click", handleCanvasClick);
ui.petNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    savePetName();
  }
});
ui.moodInput.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    sendMood();
  }
});

ui.hatchSeconds.value = String(Math.round(state.hatchDurationMs / 1000));
renderDom();
drawCanvas();
requestAnimationFrame(tick);
