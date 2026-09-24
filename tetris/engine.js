export const WIDTH = 10;
export const HEIGHT = 20;
export const SPEEDS = [800, 650, 500, 370, 250, 160];
export const TYPES = ['I', 'L', 'J', 'Z', 'S', 'O', 'T'];

const SHAPES = {
  I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
  J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
  Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
  S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
};

export function randomType(random = Math.random) {
  return TYPES[Math.floor(random() * TYPES.length)];
}

export function shapeFor(type, rotation = 0) {
  let shape = SHAPES[type];
  for (let i = 0; i < rotation; i += 1) {
    shape = shape[0].map((_, x) => shape.map(row => row[x]).reverse());
  }
  return shape;
}

export function cellsFor(piece) {
  const shape = shapeFor(piece.type, piece.rotation);
  const cells = [];
  shape.forEach((row, y) => row.forEach((value, x) => {
    if (value) cells.push([piece.x + x, piece.y + y]);
  }));
  return cells;
}

export function canPlace(board, piece) {
  return cellsFor(piece).every(([x, y]) =>
    x >= 0 && x < WIDTH && y < HEIGHT && (y < 0 || board[y][x] === 0));
}

function newPiece(type) {
  return { type, rotation: 0, x: type === 'O' ? 4 : 3, y: -1 };
}

export function newGame(random = Math.random) {
  return {
    board: Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0)),
    current: newPiece(randomType(random)),
    next: randomType(random),
    score: 0,
    lines: 0,
    level: 1,
    phase: 'playing',
  };
}

function lock(game, random) {
  let aboveTop = false;
  cellsFor(game.current).forEach(([x, y]) => {
    if (y < 0) aboveTop = true;
    else game.board[y][x] = 1;
  });
  game.score += 10 + (game.level - 1) * 2;
  if (aboveTop) {
    game.phase = 'over';
    return 'over';
  }

  const remaining = game.board.filter(row => row.some(cell => cell === 0));
  const cleared = HEIGHT - remaining.length;
  while (remaining.length < HEIGHT) remaining.unshift(Array(WIDTH).fill(0));
  game.board = remaining;
  if (cleared) {
    game.score += [0, 100, 300, 700, 1500][cleared];
    game.lines += cleared;
    game.level = Math.min(6, 1 + Math.floor(game.lines / 20));
  }

  game.current = newPiece(game.next);
  game.next = randomType(random);
  if (!canPlace(game.board, game.current)) game.phase = 'over';
  return game.phase === 'over' ? 'over' : cleared ? 'clear' : 'lock';
}

export function applyAction(game, action, random = Math.random) {
  if (action === 'pause') {
    if (game.phase === 'playing') game.phase = 'paused';
    else if (game.phase === 'paused') game.phase = 'playing';
    return 'pause';
  }
  if (game.phase !== 'playing') return null;

  if (action === 'left' || action === 'right' || action === 'down') {
    const dx = action === 'left' ? -1 : action === 'right' ? 1 : 0;
    const dy = action === 'down' ? 1 : 0;
    const candidate = { ...game.current, x: game.current.x + dx, y: game.current.y + dy };
    if (canPlace(game.board, candidate)) {
      game.current = candidate;
      return action === 'down' ? 'down' : 'move';
    }
    return action === 'down' ? lock(game, random) : null;
  }
  if (action === 'rotate') {
    const rotation = (game.current.rotation + 1) % 4;
    for (const [dx, dy] of [[0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0], [0, -1]]) {
      const candidate = { ...game.current, rotation, x: game.current.x + dx, y: game.current.y + dy };
      if (canPlace(game.board, candidate)) {
        game.current = candidate;
        return 'rotate';
      }
    }
    return null;
  }
  if (action === 'drop') {
    while (canPlace(game.board, { ...game.current, y: game.current.y + 1 })) game.current.y += 1;
    return lock(game, random);
  }
  return null;
}

export function validSavedGame(game) {
  return game && Array.isArray(game.board) && game.board.length === HEIGHT &&
    game.board.every(row => Array.isArray(row) && row.length === WIDTH &&
      row.every(cell => cell === 0 || cell === 1)) &&
    game.current && TYPES.includes(game.current.type) &&
    Number.isInteger(game.current.rotation) && game.current.rotation >= 0 && game.current.rotation < 4 &&
    Number.isInteger(game.current.x) && Number.isInteger(game.current.y) &&
    TYPES.includes(game.next) && Number.isInteger(game.score) && game.score >= 0 &&
    Number.isInteger(game.lines) && game.lines >= 0 &&
    Number.isInteger(game.level) && game.level >= 1 && game.level <= 6 &&
    ['playing', 'paused', 'over'].includes(game.phase);
}
