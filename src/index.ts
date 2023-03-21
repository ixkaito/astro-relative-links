import type { AstroIntegration, AstroConfig } from 'astro';
import { writeFileSync, readFileSync } from 'fs';
import { globSync } from 'glob';
import path from 'path';

/**
 * Add leading and trailing slashes to the `base`.
 *
 * @param {string} base
 * @returns {string} - Formatted base.
 */
export function leadingTrailingSlash(base?: string) {
  return base?.replace(/^\/*([^\/]+)(.*)([^\/]+)\/*$/, '/$1$2$3/') || '/';
}

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
  const pattern = new RegExp(
    `(?<=\\s(href|src(set)?)=["']([^"']*,)?\\s*?)${base}(?!\/)`,
    'gm'
  );

  const relativePath = path.relative(path.dirname(filePath), outDirPath) || '.';

  return html.replace(pattern, `${relativePath}/`);
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
  const pattern = new RegExp(`(?<=url\\(\\s*?["']?\\s*?)${base}(?!\/)`, 'gm');

  const relativePath = path.relative(path.dirname(filePath), outDirPath) || '.';

  return css.replace(pattern, `${relativePath}/`);
}

function relativeLinks({ config }: { config?: AstroConfig }): AstroIntegration {
  const base = leadingTrailingSlash(config?.base);

  return {
    name: 'relative-links',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const outDirPath = dir.pathname;

        try {
          // HTML
          globSync(`${outDirPath}**/*.html`).forEach((filePath) => {
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
          });

          // CSS
          globSync(`${outDirPath}**/*.css`).forEach((filePath) => {
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
          // Pass the Astro config to the `astro:build:done` hook
          integrations: [relativeLinks({ config })],
        });
      },
    },
  };
}
