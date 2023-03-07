# astro-relative-links 🔗

This Astro integration builds Astro with relative links.

## Installation

### Quick Install

The `astro add` command-line tool automates the installation for you. Run one of the following commands in a new terminal window. (If you aren't sure which package manager you're using, run the first command.) Then, follow the prompts, and type "y" in the terminal (meaning "yes") for each one.

```sh
# Using NPM
npx astro add astro-relative-links
# Using Yarn
yarn astro add astro-relative-links
# Using PNPM
pnpm astro add astro-relative-links
```

If you run into any issues, [feel free to report them to me on GitHub](https://github.com/ixkaito/astro-relative-links/issues) and try the manual installation steps below.

### Manual Install

First, install the `astro-relative-links` packages using your package manager. If you're using npm or aren't sure, run this in the terminal:

```sh
npm install astro-relative-links
```

Then, apply this integration to your `astro.config.*` file using the `integrations` property:

**`astro.config.mjs`**

```js ins={2} "relativeLinks()"
import { defineConfig } from 'astro/config';
import relativeLinks from 'astro-relative-links';

export default defineConfig({
  // ...
  integrations: [relativeLinks()],
});
```

## Usage

Build as usual with `npm run build` etc. All links in the project will be generated as relative paths.

## Examples

### Assets

- `dist/index.html`
  ```html
  <link rel="stylesheet" href="./_astro/index.*.css" />
  <script type="module" src="./_astro/hoisted.*.js"></script>
  ```
- `dist/sub/index.html`
  ```html
  <link rel="stylesheet" href="../_astro/index.*.css" />
  <script type="module" src="../_astro/hoisted.*.js"></script>
  ```

### Links and images

- `src/components/Header.astro`
  ```html
  <a href="/">Home</a>
  <a href="/apple/">
    <img src="/images/apple.png" alt="" />
    Apple
  </a>
  <a href="/banana/">
    <img src="/images/banana.png" alt="" />
    Banana
  </a>
  ```

The above components will be generated as follows.

- `dist/index.html`
  ```html
  <a href="./">Home</a>
  <a href="./apple/">
    <img src="./images/apple.png" alt="" />
    Apple
  </a>
  <a href="./banana/">
    <img src="./images/banana.png" alt="" />
    Banana
  </a>
  ```
- `dist/apple/index.html`
  ```html
  <a href="../">Home</a>
  <a href="../apple/">
    <img src="../images/apple.png" alt="" />
    Apple
  </a>
  <a href="../banana/">
    <img src="../images/banana.png" alt="" />
    Banana
  </a>
  ```
- `dist/banana/index.html`
  ```html
  <a href="../">Home</a>
  <a href="../apple/">
    <img src="../images/apple.png" alt="" />
    Apple
  </a>
  <a href="../banana/">
    <img src="../images/banana.png" alt="" />
    Banana
  </a>
  ```

### With `base` config

- `astro.config.mjs`
  ```js
  import { defineConfig } from 'astro/config';
  import relativeLinks from 'astro-relative-links';

  export default defineConfig({
    base: 'fruits',
    integrations: [relativeLinks()],
  });
  ```
- `src/components/Header.astro`
  ```html
  <a href="/">Home</a>
  <a href="/fruits/">Fruits</a>
  <a href="/fruits/apple/">
    <img src="/fruits/images/apple.png" alt="" />
    Apple
  </a>
  <a href="/fruits/banana/">
    <img src="/fruits/images/banana.png" alt="" />
    Banana
  </a>
  ```

The above components will be generated as follows.

- `dist/index.html`
  ```html
  <a href="/">Home</a>
  <a href="./">Fruits</a>
  <a href="./apple/">
    <img src="./images/apple.png" alt="" />
    Apple
  </a>
  <a href="./banana/">
    <img src="./images/banana.png" alt="" />
    Banana
  </a>
  ```
- `dist/apple/index.html`
  ```html
  <a href="/">Home</a>
  <a href="../">Fruits</a>
  <a href="../apple/">
    <img src="../images/apple.png" alt="" />
    Apple
  </a>
  <a href="../banana/">
    <img src="../images/banana.png" alt="" />
    Banana
  </a>
  ```
- `dist/banana/index.html`
  ```html
  <a href="/">Home</a>
  <a href="../">Fruits</a>
  <a href="../apple/">
    <img src="../images/apple.png" alt="" />
    Apple
  </a>
  <a href="../banana/">
    <img src="../images/banana.png" alt="" />
    Banana
  </a>
  ```

# License

[MIT](https://github.com/ixkaito/astro-relative-links/blob/main/LICENSE)
