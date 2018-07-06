import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { addChannel, updateInputURL } from '../src/actions';

const readFile = promisify(fs.readFile);

beforeEach(async () => {
  const pathToHtml = path.resolve(__dirname, '__fixtures__/index.html');
  const html = await readFile(pathToHtml, 'utf8');
  document.body.innerHTML = html;
});

const initialState = {
  inputURL: '',
  isLoading: false,
  feed: [],
};

// test('App renders with initial state', () => {
//   expect(true).toBe(true);
// });

// test('App renders with pre-mutated state', () => {
//   expect(true).toBe(true);
// });

// test('App updates after state change', () => {
//   expect(true).toBe(true);
// });

test('Controller addChannel', () => {
  const feedItem = {
    title: 'Some feed',
    items: [
      {
        title: 'Title',
        link: 'link',
        pubDate: 'description',
      },
    ],
  };

  const expected = {
    inputURL: '',
    isLoading: false,
    feed: [
      { ...feedItem },
    ],
  };

  const actual = addChannel(initialState, feedItem);

  expect(actual).toEqual(expected);
});

test('Controller updateInputURL', () => {
  const str = '123test  hello';
  const expected = {
    inputURL: str,
    isLoading: false,
    feed: [],
  };

  const actual = updateInputURL(initialState, str);

  expect(actual).toEqual(expected);
});

// test('Parsing RSS/XML', () => {
//   expect(true).toBe(true);
// });
