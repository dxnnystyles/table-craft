import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const game = 'examples/coin-flip-duel/game.js';
const cli = 'src/cli.js';
const run = (...args) => execFileSync(process.execPath, [cli, ...args], {
  cwd: root,
  encoding: 'utf8',
  timeout: 15000,
});

test('CLI --time accepts seconds for simulation, balance analysis, and sweeps', () => {
  const simulation = run('simulate', game, '--games', '100000', '--time', '0.01');
  assert.match(simulation, /\d+ games ·/);
  assert.doesNotMatch(simulation, /100000 games ·/);

  const balance = run('balance', game, '--games', '100000', '--time', '0.01');
  assert.match(balance, /stopped early at the time limit/);

  const sweep = run('balance', game, '--games', '100000', '--time', '0.01', '--sweep', 'options.target=1,2');
  assert.match(sweep, /Sweep options\.target/);
  assert.match(sweep, /1\s+2/);
});

test('CLI usage lists --time for simulate and balance', () => {
  const usage = run();
  assert.match(usage, /simulate <game\.js>[^\n]*\[--time <seconds>\]/);
  assert.match(usage, /balance <game\.js>[^\n]*\[--time <seconds>\]/);
});
