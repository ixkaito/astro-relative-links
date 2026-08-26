import type { AstroIntegration, AstroConfig } from 'astro';
import { writeFileSync, readFileSync } from 'fs';
import { globSync } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Add leading and trailing slashes to the `base`.
 *
 * @param {string} base
 * @returns {string} - Formatted base.
 */
export function leadingTrailingSlash(base?: string) {
  return base?.replace(/^\/*([^\/]+)(.*)([^\/]+)\/*$/, '/$1$2$3/') || '/';
}

const pattern = {
  htmlAttr: `(href|src(set)?|poster|component-url|renderer-url)=["']?([^"']*,)?`,
  styleAttr: `style=("[^"]*|'[^']*|[^\\s]*)`,
  styleUrl: `url\\(\\s*?["']?`,
};

/**
 * Replace absolute paths in HTML files with relative paths.
 *
 * @param {object} options
 * @param {string} options.outDirPath - The path of the directory that `astro build` writes final build to.
 * @param {string} options.filePath - The path of the target file.
 * @param {string} options.base - The base path to deploy to.
 * @param {string} options.html - The content of the HTML file.
 * @returns {string} - Replaced HTML
 */
export function replaceHTML({
  outDirPath,
  filePath,
  base,
  html,
}: {
  outDirPath: string;
  filePath: string;
  base: string;
  html: string;
}) {
  const { htmlAttr, styleAttr, styleUrl } = pattern;
  const htmlPattern =
    `<[^>]+\\s(` + htmlAttr + `|` + styleAttr + styleUrl + `)`;
  const cssPattern = `<style>[^<]*` + styleUrl;
  const regex = new RegExp(
    `(?<=(` + htmlPattern + `|` + cssPattern + `)\\s*?)${base}(?!\/)`,
    'gm'
  );

  const relativePath =
    path
      .relative(path.dirname(filePath), outDirPath)
      .split(path.sep)
      .join(path.posix.sep) || '.';

  return html.replace(regex, `${relativePath}/`);
}

/**
 * Replace absolute paths in CSS files with relative paths.
 *
 * @param {object} options
 * @param {string} options.outDirPath - The path of the directory that `astro build` writes final build to.
 * @param {string} options.filePath - The path of the target file.
 * @param {string} options.base - The base path to deploy to.
 * @param {string} options.css - The content of the CSS file.
 * @returns {string} - Replaced CSS
 */
export function replaceCSS({
  outDirPath,
  filePath,
  base,
  css,
}: {
  outDirPath: string;
  filePath: string;
  base: string;
  css: string;
}) {
  const { styleUrl } = pattern;
  const regex = new RegExp(`(?<=` + styleUrl + `\\s*?)${base}(?!\/)`, 'gm');

  const relativePath =
    path
      .relative(path.dirname(filePath), outDirPath)
      .split(path.sep)
      .join(path.posix.sep) || '.';

  return css.replace(regex, `${relativePath}/`);
}

type RenderBuiltUrl = NonNullable<
  NonNullable<NonNullable<AstroConfig['vite']>['experimental']>['renderBuiltUrl']
>;

/**
 * Make Vite emit the URLs it builds for JavaScript relative to the importing
 * chunk instead of `base + path`.
 *
 * HTML and CSS are made relative after the build (`replaceHTML`/`replaceCSS`),
 * but paths used from JavaScript cannot be replaced that way: Vite bakes the
 * base into a runtime helper (`assetsURL = dep => base + dep`) and keeps the
 * paths themselves in a separate array, so there is no absolute path in the
 * output to match. Those paths are therefore left pointing at the server root —
 * `modulepreload` links of dynamically imported chunks and asset URLs built with
 * `new URL(..., import.meta.url)`. A build deployed under a sub-path requests
 * them from the wrong place, and where the server answers a miss with an HTML
 * error page the browser reports `Failed to load module script: Expected a
 * JavaScript-or-Wasm module script but the server responded with a MIME type of
 * "text/html"`.
 *
 * `{ relative: true }` switches Vite to `new URL(dep, importerUrl)` and makes it
 * emit chunk-relative dependency paths. `html` and `css` are left to Vite's
 * default so the post-build replacement keeps working, and a `renderBuiltUrl` of
 * the user's own always wins — this only fills in the case it leaves open.
 *
 * @param {RenderBuiltUrl} [userRenderBuiltUrl] - `renderBuiltUrl` already set in the Astro config.
 * @returns {RenderBuiltUrl} - `renderBuiltUrl` to pass to Vite.
 */
export function relativeJsUrls(
  userRenderBuiltUrl?: RenderBuiltUrl
): RenderBuiltUrl {
  return (filename, context) => {
    const userResult = userRenderBuiltUrl?.(filename, context);

    if (userResult !== undefined) {
      return userResult;
    }

    return context.hostType === 'js' ? { relative: true } : undefined;
  };
}

function relativeLinks({ config }: { config?: AstroConfig }): AstroIntegration {
  const base = leadingTrailingSlash(config?.base);

  return {
    name: 'relative-links',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        // Use fileURLToPath to get a valid, cross-platform absolute path string
        const outDirPath = fileURLToPath(dir);

        try {
          // HTML
          globSync(`${decodeURI(dir.pathname)}**/*.html`).forEach(
            (filePath) => {
              writeFileSync(
                filePath,
                replaceHTML({
                  outDirPath,
                  filePath,
                  base,
                  html: readFileSync(filePath, 'utf8'),
                }),
                'utf8'
              );
            }
          );

          // CSS
          globSync(`${decodeURI(dir.pathname)}**/*.css`).forEach((filePath) => {
            writeFileSync(
              filePath,
              replaceCSS({
                outDirPath,
                filePath,
                base,
                css: readFileSync(filePath, 'utf8'),
              }),
              'utf8'
            );
          });
        } catch (error) {
          console.log(error);
        }
      },
    },
  };
}

export default function (): AstroIntegration {
  return {
    name: 'relative-links',
    hooks: {
      'astro:config:setup': ({ config, updateConfig }) => {
        updateConfig({
          vite: {
            experimental: {
              // Paths used from JavaScript are not covered by the post-build
              // replacement — see `relativeJsUrls`.
              renderBuiltUrl: relativeJsUrls(
                config?.vite?.experimental?.renderBuiltUrl
              ),
            },
          },
          // Pass the Astro config to the `astro:build:done` hook
          integrations: [relativeLinks({ config })],
        });
      },
    },
  };
}
