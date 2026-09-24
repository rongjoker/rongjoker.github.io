import {
  WIDTH, HEIGHT, SPEEDS, cellsFor, shapeFor,
  newGame, applyAction, validSavedGame,
} from './engine.js';

const STORAGE_KEY = 'rongjoker-tetris-v1';
const boardElement = document.getElementById('board');
const nextElement = document.getElementById('next');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayNote = document.getElementById('overlay-note');
const statusElement = document.getElementById('status');
const startButton = document.getElementById('start');
const soundButton = document.getElementById('sound');

function readSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

const saved = readSaved();
let game = validSavedGame(saved.game) ? saved.game : newGame();
if (!validSavedGame(saved.game)) game.phase = 'ready';
if (game.phase === 'playing') game.phase = 'paused';
let best = Number.isInteger(saved.best) && saved.best >= 0 ? saved.best : 0;
let soundOn = saved.soundOn !== false;
let timer = null;
let audioContext = null;

const boardCells = Array.from({ length: WIDTH * HEIGHT }, () => {
  const cell = document.createElement('span');
  cell.className = 'cell';
  boardElement.append(cell);
  return cell;
});
const nextCells = Array.from({ length: 16 }, () => {
  const cell = document.createElement('span');
  cell.className = 'preview-cell';
  nextElement.append(cell);
  return cell;
});

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ game, best, soundOn }));
  } catch {
    // Storage may be unavailable in private browsing. The game still runs.
  }
}

function render() {
  const active = new Set(game.phase === 'over' ? [] :
    cellsFor(game.current).filter(([, y]) => y >= 0).map(([x, y]) => y * WIDTH + x));
  boardCells.forEach((cell, index) => {
    cell.className = `cell${game.board[Math.floor(index / WIDTH)][index % WIDTH] ? ' fixed' : ''}${active.has(index) ? ' active' : ''}`;
  });

  const shape = shapeFor(game.next);
  const offset = Math.floor((4 - shape.length) / 2);
  nextCells.forEach((cell, index) => {
    const x = index % 4 - offset;
    const y = Math.floor(index / 4) - offset;
    cell.className = `preview-cell${shape[y]?.[x] ? ' filled' : ''}`;
  });

  document.getElementById('best').textContent = best.toLocaleString();
  document.getElementById('score').textContent = game.score.toLocaleString();
  document.getElementById('lines').textContent = String(game.lines);
  document.getElementById('level').textContent = String(game.level);
  soundButton.textContent = soundOn ? '声音：开' : '声音：关';
  soundButton.setAttribute('aria-pressed', String(soundOn));

  overlay.hidden = game.phase === 'playing';
  const labels = {
    ready: ['俄罗斯方块', '点击开始游戏'],
    paused: ['已暂停', '点击继续游戏'],
    over: ['游戏结束', '点击重新开始'],
  };
  if (labels[game.phase]) {
    [overlayTitle.textContent, overlayNote.textContent] = labels[game.phase];
  }
  statusElement.textContent = {
    ready: '准备开始', playing: '游戏中', paused: '已暂停', over: '游戏结束',
  }[game.phase];
  startButton.textContent = {
    ready: '开始游戏', playing: '暂停游戏', paused: '继续游戏', over: '重新开始',
  }[game.phase];
  save();
}

function ensureAudio() {
  if (!soundOn) return Promise.resolve(false);
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    soundButton.dataset.audioState = 'unsupported';
    return Promise.resolve(false);
  }
  try {
    if (!audioContext || audioContext.state === 'closed') audioContext = new AudioContext();
    if (audioContext.state === 'running') {
      soundButton.dataset.audioState = 'running';
      return Promise.resolve(true);
    }
    return audioContext.resume().then(() => {
      soundButton.dataset.audioState = audioContext.state;
      return audioContext.state === 'running';
    }).catch(() => {
      soundButton.dataset.audioState = 'blocked';
      return false;
    });
  } catch {
    soundButton.dataset.audioState = 'blocked';
    return Promise.resolve(false);
  }
}

function playSound(event) {
  if (!soundOn) return;
  const notes = {
    start: [440, 0.13], move: [230, 0.035], rotate: [390, 0.055],
    down: [190, 0.035], lock: [160, 0.075], clear: [660, 0.2],
    over: [110, 0.3],
  };
  const [frequency, duration] = notes[event] || notes.move;
  void ensureAudio().then(ready => {
    if (!ready || !soundOn) return;
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    volume.gain.setValueAtTime(0.035, now);
    volume.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  });
}

function scheduleTick() {
  clearTimeout(timer);
  timer = null;
  if (game.phase !== 'playing') return;
  timer = setTimeout(() => {
    perform('down', true);
  }, SPEEDS[game.level - 1]);
}

function startNew() {
  game = newGame();
  playSound('start');
  render();
  scheduleTick();
}

function perform(action, automatic = false) {
  const event = applyAction(game, action);
  if (!event) return;
  if (game.score > best) best = game.score;
  if (event !== 'pause' && (!automatic || event !== 'down')) playSound(event);
  render();
  if (action === 'drop' || action === 'down' || action === 'pause') scheduleTick();
}

startButton.addEventListener('click', () => {
  if (game.phase === 'ready' || game.phase === 'over') startNew();
  else perform('pause');
});
document.getElementById('reset').addEventListener('click', startNew);
soundButton.addEventListener('click', () => {
  soundOn = !soundOn;
  if (!soundOn) soundButton.dataset.audioState = 'off';
  render();
  if (soundOn) playSound('start');
});

const keys = {
  ArrowLeft: 'left', ArrowRight: 'right', ArrowDown: 'down', ArrowUp: 'rotate',
  ' ': 'drop', p: 'pause', r: 'reset', s: 'sound',
};
window.addEventListener('keydown', event => {
  const action = keys[event.key] || keys[event.key.toLowerCase()];
  if (!action || event.altKey || event.ctrlKey || event.metaKey) return;
  event.preventDefault();
  if (event.repeat && !['left', 'right', 'down'].includes(action)) return;
  if (action === 'reset') startNew();
  else if (action === 'sound') soundButton.click();
  else if (game.phase === 'ready' && action === 'drop') startNew();
  else perform(action);
});

document.querySelectorAll('[data-action]').forEach(button => {
  const action = button.dataset.action;
  if (['left', 'right', 'down'].includes(action)) {
    let delay = null;
    let repeat = null;
    const stop = () => {
      clearTimeout(delay);
      clearInterval(repeat);
      delay = null;
      repeat = null;
    };
    button.addEventListener('pointerdown', event => {
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      perform(action);
      delay = setTimeout(() => {
        repeat = setInterval(() => perform(action), action === 'down' ? 55 : 95);
      }, 190);
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type =>
      button.addEventListener(type, stop));
  } else {
    button.addEventListener('click', () => perform(action));
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.phase === 'playing') perform('pause');
});

render();
scheduleTick();
