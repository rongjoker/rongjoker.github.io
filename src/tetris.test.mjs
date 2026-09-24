import assert from 'node:assert/strict';
import test from 'node:test';
import { applyAction, canPlace, newGame, randomType, validSavedGame } from '../tetris/engine.js';

const alwaysI = () => 0;

test('draws each piece from the original seven types without a bag', () => {
  assert.equal(randomType(() => 0), 'I');
  assert.equal(randomType(() => 0.999), 'T');
  assert.equal(randomType(alwaysI), randomType(alwaysI));
});

test('two simultaneous lines award 300 points and 20 lines advance the level', () => {
  const game = newGame(alwaysI);
  for (const y of [18, 19]) {
    for (let x = 0; x < 8; x += 1) game.board[y][x] = 1;
  }
  game.current = { type: 'O', rotation: 0, x: 8, y: 18 };
  assert.ok(canPlace(game.board, game.current));
  assert.equal(applyAction(game, 'drop', alwaysI), 'clear');
  assert.equal(game.lines, 2);
  assert.equal(game.score, 310); // 10 for placement, 300 for the two lines.

  game.lines = 19;
  for (let x = 0; x < 8; x += 1) game.board[19][x] = 1;
  game.current = { type: 'O', rotation: 0, x: 8, y: 18 };
  assert.equal(applyAction(game, 'drop', alwaysI), 'clear');
  assert.equal(game.level, 2);
});

test('Reset creates a clean game at Level 1 from any level', () => {
  const game = newGame(alwaysI);
  game.level = 6;
  game.lines = 100;
  game.score = 12345;
  game.board[19][0] = 1;
  const reset = newGame(alwaysI);
  assert.equal(reset.level, 1);
  assert.equal(reset.lines, 0);
  assert.equal(reset.score, 0);
  assert.ok(reset.board.every(row => row.every(cell => cell === 0)));
});

test('a saved game can resume from pause', () => {
  const game = newGame(alwaysI);
  assert.ok(validSavedGame(game));
  applyAction(game, 'pause');
  assert.equal(game.phase, 'paused');
  assert.equal(applyAction(game, 'left'), null);
  applyAction(game, 'pause');
  assert.equal(game.phase, 'playing');
});
