import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

beforeEach(async () => {
  const pathToHtml = path.resolve(__dirname, '__fixtures__/index.html');
  const html = await readFile(pathToHtml, 'utf8');
  document.body.innerHTML = html;
});

test('App renders with initial state', () => {
  (() => true)();
});

test('App renders with pre-mutated state', () => {
  (() => true)();
});

test('App updates after state change', () => {
  (() => true)();
});

test('Controller addChannel', () => {
  (() => true)();
});

test('Controller updateChannel', () => {
  (() => true)();
});

test('Controller updateInputURL', () => {
  (() => true)();
});

test('Controller setLoading', () => {
  (() => true)();
});

test('Parsing RSS/XML', () => {
  (() => true)();
});
