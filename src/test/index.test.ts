import { writeFileSync, readFileSync } from 'fs';
import path from 'path';
import {
  leadingTrailingSlash,
  relativeJsUrls,
  replaceCSS,
  replaceHTML,
} from '..';

test.each([
  [undefined, '/'],
  ['', '/'],
  ['/', '/'],
  ['foo', '/foo/'],
  ['/foo', '/foo/'],
  ['/foo/', '/foo/'],
  ['//foo//', '/foo/'],
  ['foo/bar', '/foo/bar/'],
  ['/foo/bar', '/foo/bar/'],
  ['foo/bar/', '/foo/bar/'],
  ['/foo/bar/', '/foo/bar/'],
  ['//foo/bar//', '/foo/bar/'],
])('Leading and trailing slashed base', (base, expected) => {
  expect(leadingTrailingSlash(base)).toBe(expected);
});

test.each([
  {
    base: '/',
    file: 'index.html',
  },
  {
    base: '/',
    file: 'foo.html',
  },
  {
    base: '/',
    file: 'foo/index.html',
  },
  {
    base: '/foo/',
    file: 'index.html',
  },
  {
    base: '/foo/',
    file: 'foo.html',
  },
  {
    base: '/foo/',
    file: 'foo/index.html',
  },
])('Replaced HTML', ({ file, base }) => {
  const outDirPath = '/dist/';
  const filePath = outDirPath + file;

  expect(
    replaceHTML({
      outDirPath,
      filePath,
      base,
      html: readFileSync(path.resolve(__dirname, 'src.html'), 'utf-8'),
    })
  ).toBe(
    readFileSync(path.resolve(__dirname, 'expected' + base + filePath), 'utf-8')
  );
});

test.each([
  {
    base: '/',
    file: '_astro/style.css',
  },
  {
    base: '/foo/',
    file: '_astro/style.css',
  },
])('Replaced CSS', ({ base, file }) => {
  const outDirPath = '/dist/';
  const filePath = outDirPath + file;

  expect(
    replaceCSS({
      outDirPath,
      filePath,
      base,
      css: readFileSync(path.resolve(__dirname, 'src.css'), 'utf-8'),
    })
  ).toBe(
    readFileSync(path.resolve(__dirname, 'expected' + base + filePath), 'utf-8')
  );
});

test.each([
  ['js', { relative: true }],
  ['html', undefined],
  ['css', undefined],
] as const)('Built URLs are relative for JavaScript only', (hostType, expected) => {
  expect(
    relativeJsUrls()('assets/foo.js', {
      type: 'asset',
      hostId: 'index.html',
      hostType,
      ssr: false,
    })
  ).toEqual(expected);
});

test('A renderBuiltUrl of the user takes precedence', () => {
  const userRenderBuiltUrl = () => 'https://cdn.example.com/foo.js';

  expect(
    relativeJsUrls(userRenderBuiltUrl)('assets/foo.js', {
      type: 'asset',
      hostId: 'index.html',
      hostType: 'js',
      ssr: false,
    })
  ).toBe('https://cdn.example.com/foo.js');
});

test('A renderBuiltUrl of the user that opts out is filled in for JavaScript', () => {
  const userRenderBuiltUrl = () => undefined;

  expect(
    relativeJsUrls(userRenderBuiltUrl)('assets/foo.js', {
      type: 'asset',
      hostId: 'index.html',
      hostType: 'js',
      ssr: false,
    })
  ).toEqual({ relative: true });
});
