import { formatBase, replaceHtml } from '.';

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
])('Formatted base', (base, expected) => {
  expect(formatBase(base)).toBe(expected);
});

const html = `<html>
      <link href="/_astro/style.css">
      <link href="/foo/_astro/style.css">
      <link href="https://example.com/style.css">
      <link href="//example.com/style.css">
      <script src="/_astro/script.js">
      <script src="/foo/_astro/script.js">
      <script src="https://example.com/script.js">
      <script src="//example.com/script.js">
      <a href="/">/</a>
      <a href="/foo/">/foo/</a>
      <a href="/foobar/">/foobar/</a>
      <a href="/foo/bar/">/foo/bar/</a>
      <a href="/foo/baz/">/foo/baz/</a>
      <a href='/foo/baz/'>/foo/baz/</a>
      <a href="https://example.com">example</a>
      <a href="//example.com">example</a>
      <a href="../">parent</a>
      <a href="foo">foo</a>
      <img src="/assets/images/foo.jpg" alt="" />
      <img src="/foo/assets/images/foo.jpg" alt="" />
      <img src="./assets/images/foo.jpg" alt="" />
      <img src="assets/images/foo.jpg" alt="" />
    </html>`;

test.each([
  {
    dirName: '/dist/',
    filePath: '/dist/index.html',
    base: '/',
    html,
    expected: `<html>
      <link href="./_astro/style.css">
      <link href="./foo/_astro/style.css">
      <link href="https://example.com/style.css">
      <link href="//example.com/style.css">
      <script src="./_astro/script.js">
      <script src="./foo/_astro/script.js">
      <script src="https://example.com/script.js">
      <script src="//example.com/script.js">
      <a href="./">/</a>
      <a href="./foo/">/foo/</a>
      <a href="./foobar/">/foobar/</a>
      <a href="./foo/bar/">/foo/bar/</a>
      <a href="./foo/baz/">/foo/baz/</a>
      <a href='./foo/baz/'>/foo/baz/</a>
      <a href="https://example.com">example</a>
      <a href="//example.com">example</a>
      <a href="../">parent</a>
      <a href="foo">foo</a>
      <img src="./assets/images/foo.jpg" alt="" />
      <img src="./foo/assets/images/foo.jpg" alt="" />
      <img src="./assets/images/foo.jpg" alt="" />
      <img src="assets/images/foo.jpg" alt="" />
    </html>`,
  },
  {
    dirName: '/dist/',
    filePath: '/dist/foo.html',
    base: '/',
    html,
    expected: `<html>
      <link href="./_astro/style.css">
      <link href="./foo/_astro/style.css">
      <link href="https://example.com/style.css">
      <link href="//example.com/style.css">
      <script src="./_astro/script.js">
      <script src="./foo/_astro/script.js">
      <script src="https://example.com/script.js">
      <script src="//example.com/script.js">
      <a href="./">/</a>
      <a href="./foo/">/foo/</a>
      <a href="./foobar/">/foobar/</a>
      <a href="./foo/bar/">/foo/bar/</a>
      <a href="./foo/baz/">/foo/baz/</a>
      <a href='./foo/baz/'>/foo/baz/</a>
      <a href="https://example.com">example</a>
      <a href="//example.com">example</a>
      <a href="../">parent</a>
      <a href="foo">foo</a>
      <img src="./assets/images/foo.jpg" alt="" />
      <img src="./foo/assets/images/foo.jpg" alt="" />
      <img src="./assets/images/foo.jpg" alt="" />
      <img src="assets/images/foo.jpg" alt="" />
    </html>`,
  },
  {
    dirName: '/dist/',
    filePath: '/dist/foo/index.html',
    base: '/',
    html,
    expected: `<html>
      <link href="../_astro/style.css">
      <link href="../foo/_astro/style.css">
      <link href="https://example.com/style.css">
      <link href="//example.com/style.css">
      <script src="../_astro/script.js">
      <script src="../foo/_astro/script.js">
      <script src="https://example.com/script.js">
      <script src="//example.com/script.js">
      <a href="../">/</a>
      <a href="../foo/">/foo/</a>
      <a href="../foobar/">/foobar/</a>
      <a href="../foo/bar/">/foo/bar/</a>
      <a href="../foo/baz/">/foo/baz/</a>
      <a href='../foo/baz/'>/foo/baz/</a>
      <a href="https://example.com">example</a>
      <a href="//example.com">example</a>
      <a href="../">parent</a>
      <a href="foo">foo</a>
      <img src="../assets/images/foo.jpg" alt="" />
      <img src="../foo/assets/images/foo.jpg" alt="" />
      <img src="./assets/images/foo.jpg" alt="" />
      <img src="assets/images/foo.jpg" alt="" />
    </html>`,
  },
  {
    dirName: '/dist/',
    filePath: '/dist/index.html',
    base: '/foo/',
    html,
    expected: `<html>
      <link href="/_astro/style.css">
      <link href="./_astro/style.css">
      <link href="https://example.com/style.css">
      <link href="//example.com/style.css">
      <script src="/_astro/script.js">
      <script src="./_astro/script.js">
      <script src="https://example.com/script.js">
      <script src="//example.com/script.js">
      <a href="/">/</a>
      <a href="./">/foo/</a>
      <a href="/foobar/">/foobar/</a>
      <a href="./bar/">/foo/bar/</a>
      <a href="./baz/">/foo/baz/</a>
      <a href='./baz/'>/foo/baz/</a>
      <a href="https://example.com">example</a>
      <a href="//example.com">example</a>
      <a href="../">parent</a>
      <a href="foo">foo</a>
      <img src="/assets/images/foo.jpg" alt="" />
      <img src="./assets/images/foo.jpg" alt="" />
      <img src="./assets/images/foo.jpg" alt="" />
      <img src="assets/images/foo.jpg" alt="" />
    </html>`,
  },
  {
    dirName: '/dist/',
    filePath: '/dist/foo.html',
    base: '/foo/',
    html,
    expected: `<html>
      <link href="/_astro/style.css">
      <link href="./_astro/style.css">
      <link href="https://example.com/style.css">
      <link href="//example.com/style.css">
      <script src="/_astro/script.js">
      <script src="./_astro/script.js">
      <script src="https://example.com/script.js">
      <script src="//example.com/script.js">
      <a href="/">/</a>
      <a href="./">/foo/</a>
      <a href="/foobar/">/foobar/</a>
      <a href="./bar/">/foo/bar/</a>
      <a href="./baz/">/foo/baz/</a>
      <a href='./baz/'>/foo/baz/</a>
      <a href="https://example.com">example</a>
      <a href="//example.com">example</a>
      <a href="../">parent</a>
      <a href="foo">foo</a>
      <img src="/assets/images/foo.jpg" alt="" />
      <img src="./assets/images/foo.jpg" alt="" />
      <img src="./assets/images/foo.jpg" alt="" />
      <img src="assets/images/foo.jpg" alt="" />
    </html>`,
  },
  {
    dirName: '/dist/',
    filePath: '/dist/foo/index.html',
    base: '/foo/',
    html,
    expected: `<html>
      <link href="/_astro/style.css">
      <link href="../_astro/style.css">
      <link href="https://example.com/style.css">
      <link href="//example.com/style.css">
      <script src="/_astro/script.js">
      <script src="../_astro/script.js">
      <script src="https://example.com/script.js">
      <script src="//example.com/script.js">
      <a href="/">/</a>
      <a href="../">/foo/</a>
      <a href="/foobar/">/foobar/</a>
      <a href="../bar/">/foo/bar/</a>
      <a href="../baz/">/foo/baz/</a>
      <a href='../baz/'>/foo/baz/</a>
      <a href="https://example.com">example</a>
      <a href="//example.com">example</a>
      <a href="../">parent</a>
      <a href="foo">foo</a>
      <img src="/assets/images/foo.jpg" alt="" />
      <img src="../assets/images/foo.jpg" alt="" />
      <img src="./assets/images/foo.jpg" alt="" />
      <img src="assets/images/foo.jpg" alt="" />
    </html>`,
  },
])('Replaced HTML', ({ expected, ...args }) => {
  expect(
    replaceHtml({
      ...args,
    })
  ).toBe(expected);
});
