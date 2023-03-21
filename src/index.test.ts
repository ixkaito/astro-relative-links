import { leadingTrailingSlash, replaceCSS, replaceHTML } from '.';

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
  expect(leadingTrailingSlash(base)).toBe(expected);
});

const html = `<html>
      <link href="/_astro/style.css">
      <link href="/foo/_astro/style.css">
      <link href="https://example.com/style.css">
      <link href="//example.com/style.css">
      <script src="/_astro/script.js"></script>
      <script src="/foo/_astro/script.js"></script>
      <script src="https://example.com/script.js"></script>
      <script src="//example.com/script.js"></script>
      <a href="/">/</a>
      <a href="/foo/">/foo/</a>
      <a href="/foobar/">/foobar/</a>
      <a href="/foo/bar/">/foo/bar/</a>
      <a href="/foo/baz/">/foo/baz/</a>
      <a href="
        /foo/baz/
      ">/foo/baz/</a>
      <a href='/foo/baz/'>/foo/baz/</a>
      <a foohref="/foo/baz/">/foo/baz/</a>
      <a href="https://example.com">example</a>
      <a href="//example.com">example</a>
      <a href="../">parent</a>
      <a href="foo">foo</a>
      <img
        src="/assets/images/foo.jpg"
        srcset="/assets/images/foo.jpg 1x,
                /assets/images/foo@2x.jpg 2x"
        alt=""
      />
      <img
        src="/foo/assets/images/foo.jpg"
        srcset="/foo/assets/images/foo.jpg 1x,
                /foo/assets/images/foo@2x.jpg 2x"
        alt=""
      />
      <img src="./assets/images/foo.jpg" alt="" />
      <img src="assets/images/foo.jpg" alt="" />
    </html>`;

test.each([
  {
    outDirPath: '/dist/',
    filePath: '/dist/index.html',
    base: '/',
    html,
    expected: `<html>
      <link href="./_astro/style.css">
      <link href="./foo/_astro/style.css">
      <link href="https://example.com/style.css">
      <link href="//example.com/style.css">
      <script src="./_astro/script.js"></script>
      <script src="./foo/_astro/script.js"></script>
      <script src="https://example.com/script.js"></script>
      <script src="//example.com/script.js"></script>
      <a href="./">/</a>
      <a href="./foo/">/foo/</a>
      <a href="./foobar/">/foobar/</a>
      <a href="./foo/bar/">/foo/bar/</a>
      <a href="./foo/baz/">/foo/baz/</a>
      <a href="
        ./foo/baz/
      ">/foo/baz/</a>
      <a href='./foo/baz/'>/foo/baz/</a>
      <a foohref="/foo/baz/">/foo/baz/</a>
      <a href="https://example.com">example</a>
      <a href="//example.com">example</a>
      <a href="../">parent</a>
      <a href="foo">foo</a>
      <img
        src="./assets/images/foo.jpg"
        srcset="./assets/images/foo.jpg 1x,
                ./assets/images/foo@2x.jpg 2x"
        alt=""
      />
      <img
        src="./foo/assets/images/foo.jpg"
        srcset="./foo/assets/images/foo.jpg 1x,
                ./foo/assets/images/foo@2x.jpg 2x"
        alt=""
      />
      <img src="./assets/images/foo.jpg" alt="" />
      <img src="assets/images/foo.jpg" alt="" />
    </html>`,
  },
  {
    outDirPath: '/dist/',
    filePath: '/dist/foo.html',
    base: '/',
    html,
    expected: `<html>
      <link href="./_astro/style.css">
      <link href="./foo/_astro/style.css">
      <link href="https://example.com/style.css">
      <link href="//example.com/style.css">
      <script src="./_astro/script.js"></script>
      <script src="./foo/_astro/script.js"></script>
      <script src="https://example.com/script.js"></script>
      <script src="//example.com/script.js"></script>
      <a href="./">/</a>
      <a href="./foo/">/foo/</a>
      <a href="./foobar/">/foobar/</a>
      <a href="./foo/bar/">/foo/bar/</a>
      <a href="./foo/baz/">/foo/baz/</a>
      <a href="
        ./foo/baz/
      ">/foo/baz/</a>
      <a href='./foo/baz/'>/foo/baz/</a>
      <a foohref="/foo/baz/">/foo/baz/</a>
      <a href="https://example.com">example</a>
      <a href="//example.com">example</a>
      <a href="../">parent</a>
      <a href="foo">foo</a>
      <img
        src="./assets/images/foo.jpg"
        srcset="./assets/images/foo.jpg 1x,
                ./assets/images/foo@2x.jpg 2x"
        alt=""
      />
      <img
        src="./foo/assets/images/foo.jpg"
        srcset="./foo/assets/images/foo.jpg 1x,
                ./foo/assets/images/foo@2x.jpg 2x"
        alt=""
      />
      <img src="./assets/images/foo.jpg" alt="" />
      <img src="assets/images/foo.jpg" alt="" />
    </html>`,
  },
  {
    outDirPath: '/dist/',
    filePath: '/dist/foo/index.html',
    base: '/',
    html,
    expected: `<html>
      <link href="../_astro/style.css">
      <link href="../foo/_astro/style.css">
      <link href="https://example.com/style.css">
      <link href="//example.com/style.css">
      <script src="../_astro/script.js"></script>
      <script src="../foo/_astro/script.js"></script>
      <script src="https://example.com/script.js"></script>
      <script src="//example.com/script.js"></script>
      <a href="../">/</a>
      <a href="../foo/">/foo/</a>
      <a href="../foobar/">/foobar/</a>
      <a href="../foo/bar/">/foo/bar/</a>
      <a href="../foo/baz/">/foo/baz/</a>
      <a href="
        ../foo/baz/
      ">/foo/baz/</a>
      <a href='../foo/baz/'>/foo/baz/</a>
      <a foohref="/foo/baz/">/foo/baz/</a>
      <a href="https://example.com">example</a>
      <a href="//example.com">example</a>
      <a href="../">parent</a>
      <a href="foo">foo</a>
      <img
        src="../assets/images/foo.jpg"
        srcset="../assets/images/foo.jpg 1x,
                ../assets/images/foo@2x.jpg 2x"
        alt=""
      />
      <img
        src="../foo/assets/images/foo.jpg"
        srcset="../foo/assets/images/foo.jpg 1x,
                ../foo/assets/images/foo@2x.jpg 2x"
        alt=""
      />
      <img src="./assets/images/foo.jpg" alt="" />
      <img src="assets/images/foo.jpg" alt="" />
    </html>`,
  },
  {
    outDirPath: '/dist/',
    filePath: '/dist/index.html',
    base: '/foo/',
    html,
    expected: `<html>
      <link href="/_astro/style.css">
      <link href="./_astro/style.css">
      <link href="https://example.com/style.css">
      <link href="//example.com/style.css">
      <script src="/_astro/script.js"></script>
      <script src="./_astro/script.js"></script>
      <script src="https://example.com/script.js"></script>
      <script src="//example.com/script.js"></script>
      <a href="/">/</a>
      <a href="./">/foo/</a>
      <a href="/foobar/">/foobar/</a>
      <a href="./bar/">/foo/bar/</a>
      <a href="./baz/">/foo/baz/</a>
      <a href="
        ./baz/
      ">/foo/baz/</a>
      <a href='./baz/'>/foo/baz/</a>
      <a foohref="/foo/baz/">/foo/baz/</a>
      <a href="https://example.com">example</a>
      <a href="//example.com">example</a>
      <a href="../">parent</a>
      <a href="foo">foo</a>
      <img
        src="/assets/images/foo.jpg"
        srcset="/assets/images/foo.jpg 1x,
                /assets/images/foo@2x.jpg 2x"
        alt=""
      />
      <img
        src="./assets/images/foo.jpg"
        srcset="./assets/images/foo.jpg 1x,
                ./assets/images/foo@2x.jpg 2x"
        alt=""
      />
      <img src="./assets/images/foo.jpg" alt="" />
      <img src="assets/images/foo.jpg" alt="" />
    </html>`,
  },
  {
    outDirPath: '/dist/',
    filePath: '/dist/foo.html',
    base: '/foo/',
    html,
    expected: `<html>
      <link href="/_astro/style.css">
      <link href="./_astro/style.css">
      <link href="https://example.com/style.css">
      <link href="//example.com/style.css">
      <script src="/_astro/script.js"></script>
      <script src="./_astro/script.js"></script>
      <script src="https://example.com/script.js"></script>
      <script src="//example.com/script.js"></script>
      <a href="/">/</a>
      <a href="./">/foo/</a>
      <a href="/foobar/">/foobar/</a>
      <a href="./bar/">/foo/bar/</a>
      <a href="./baz/">/foo/baz/</a>
      <a href="
        ./baz/
      ">/foo/baz/</a>
      <a href='./baz/'>/foo/baz/</a>
      <a foohref="/foo/baz/">/foo/baz/</a>
      <a href="https://example.com">example</a>
      <a href="//example.com">example</a>
      <a href="../">parent</a>
      <a href="foo">foo</a>
      <img
        src="/assets/images/foo.jpg"
        srcset="/assets/images/foo.jpg 1x,
                /assets/images/foo@2x.jpg 2x"
        alt=""
      />
      <img
        src="./assets/images/foo.jpg"
        srcset="./assets/images/foo.jpg 1x,
                ./assets/images/foo@2x.jpg 2x"
        alt=""
      />
      <img src="./assets/images/foo.jpg" alt="" />
      <img src="assets/images/foo.jpg" alt="" />
    </html>`,
  },
  {
    outDirPath: '/dist/',
    filePath: '/dist/foo/index.html',
    base: '/foo/',
    html,
    expected: `<html>
      <link href="/_astro/style.css">
      <link href="../_astro/style.css">
      <link href="https://example.com/style.css">
      <link href="//example.com/style.css">
      <script src="/_astro/script.js"></script>
      <script src="../_astro/script.js"></script>
      <script src="https://example.com/script.js"></script>
      <script src="//example.com/script.js"></script>
      <a href="/">/</a>
      <a href="../">/foo/</a>
      <a href="/foobar/">/foobar/</a>
      <a href="../bar/">/foo/bar/</a>
      <a href="../baz/">/foo/baz/</a>
      <a href="
        ../baz/
      ">/foo/baz/</a>
      <a href='../baz/'>/foo/baz/</a>
      <a foohref="/foo/baz/">/foo/baz/</a>
      <a href="https://example.com">example</a>
      <a href="//example.com">example</a>
      <a href="../">parent</a>
      <a href="foo">foo</a>
      <img
        src="/assets/images/foo.jpg"
        srcset="/assets/images/foo.jpg 1x,
                /assets/images/foo@2x.jpg 2x"
        alt=""
      />
      <img
        src="../assets/images/foo.jpg"
        srcset="../assets/images/foo.jpg 1x,
                ../assets/images/foo@2x.jpg 2x"
        alt=""
      />
      <img src="./assets/images/foo.jpg" alt="" />
      <img src="assets/images/foo.jpg" alt="" />
    </html>`,
  },
])('Replaced HTML', ({ expected, ...args }) => {
  expect(
    replaceHTML({
      ...args,
    })
  ).toBe(expected);
});

const css = `
      url(/assets/images/foo.jpg);
      url("/assets/images/foo.jpg");
      url('/assets/images/foo.jpg');
      url(/foo/assets/images/foo.jpg);
      url("/foo/assets/images/foo.jpg");
      url('/foo/assets/images/foo.jpg');
      url(
        /assets/images/foo.jpg
      );
      url(
        "/assets/images/foo.jpg"
      );
      url("
        /assets/images/foo.jpg
      ");
      url(
        '/assets/images/foo.jpg'
      );
      url('
        /assets/images/foo.jpg
      ');
      url(
        /foo/assets/images/foo.jpg
      );
      url(
        "/foo/assets/images/foo.jpg"
      );
      url("
        /foo/assets/images/foo.jpg
      ");
      url(
        '/foo/assets/images/foo.jpg'
      );
      url('
        /foo/assets/images/foo.jpg
      ');
      url(./assets/images/foo.jpg);
      url(https://example.com/foo.jpg);
      url(//example.com/foo.jpg);
      /assets/images/foo.jpg;
      /foo/assets/images/foo.jpg;
    `;

test.each([
  {
    outDirPath: '/dist/',
    filePath: '/dist/_astro/style.css',
    base: '/',
    css,
    expected: `
      url(../assets/images/foo.jpg);
      url("../assets/images/foo.jpg");
      url('../assets/images/foo.jpg');
      url(../foo/assets/images/foo.jpg);
      url("../foo/assets/images/foo.jpg");
      url('../foo/assets/images/foo.jpg');
      url(
        ../assets/images/foo.jpg
      );
      url(
        "../assets/images/foo.jpg"
      );
      url("
        ../assets/images/foo.jpg
      ");
      url(
        '../assets/images/foo.jpg'
      );
      url('
        ../assets/images/foo.jpg
      ');
      url(
        ../foo/assets/images/foo.jpg
      );
      url(
        "../foo/assets/images/foo.jpg"
      );
      url("
        ../foo/assets/images/foo.jpg
      ");
      url(
        '../foo/assets/images/foo.jpg'
      );
      url('
        ../foo/assets/images/foo.jpg
      ');
      url(./assets/images/foo.jpg);
      url(https://example.com/foo.jpg);
      url(//example.com/foo.jpg);
      /assets/images/foo.jpg;
      /foo/assets/images/foo.jpg;
    `,
  },
  {
    outDirPath: '/dist/',
    filePath: '/dist/_astro/style.css',
    base: '/foo/',
    css,
    expected: `
      url(/assets/images/foo.jpg);
      url("/assets/images/foo.jpg");
      url('/assets/images/foo.jpg');
      url(../assets/images/foo.jpg);
      url("../assets/images/foo.jpg");
      url('../assets/images/foo.jpg');
      url(
        /assets/images/foo.jpg
      );
      url(
        "/assets/images/foo.jpg"
      );
      url("
        /assets/images/foo.jpg
      ");
      url(
        '/assets/images/foo.jpg'
      );
      url('
        /assets/images/foo.jpg
      ');
      url(
        ../assets/images/foo.jpg
      );
      url(
        "../assets/images/foo.jpg"
      );
      url("
        ../assets/images/foo.jpg
      ");
      url(
        '../assets/images/foo.jpg'
      );
      url('
        ../assets/images/foo.jpg
      ');
      url(./assets/images/foo.jpg);
      url(https://example.com/foo.jpg);
      url(//example.com/foo.jpg);
      /assets/images/foo.jpg;
      /foo/assets/images/foo.jpg;
    `,
  },
])('Replaced CSS', ({ expected, ...args }) => {
  expect(
    replaceCSS({
      ...args,
    })
  ).toBe(expected);
});
