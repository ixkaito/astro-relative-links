import type { AstroIntegration, AstroConfig } from 'astro';
import { writeFileSync, readFileSync } from 'fs';
import { globSync } from 'glob';
import path from 'path';

function relativeLinks({ config }: { config?: AstroConfig }): AstroIntegration {
  const base = config?.base
    ? config.base.replace(/^\/*([^\/]+)(.*)([^\/]+)\/*$/, '/$1$2$3')
    : '/';

  return {
    name: 'relative-links',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        try {
          const filePaths = globSync(`${dir.pathname}**/*.html`);

          filePaths.forEach((filePath) => {
            const html = readFileSync(filePath, 'utf8');

            const pattern = new RegExp(`(\\s(href|src))="${base}/*`, 'g');

            const relativePath =
              path.relative(path.dirname(filePath), dir.pathname) || '.';

            const result = html.replace(pattern, `$1="${relativePath}/`);
            
            const pattern2 = new RegExp(`(,\\s)${base}/`, 'g');
            
            const result2 = result.replace(pattern2, `$1${relativePath}/`);

            writeFileSync(filePath, result2, 'utf8');
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
