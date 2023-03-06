import type { AstroIntegration } from 'astro';
import { writeFileSync, readFileSync } from 'fs';
import { globSync } from 'glob';
import path from 'path';

export default (): AstroIntegration => {
  return {
    name: 'relative-links',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        try {
          const filePaths = globSync(`${dir.pathname}**/*.html`);

          filePaths.forEach((filePath) => {
            const html = readFileSync(filePath, 'utf8');

            const relativePath =
              path.relative(path.dirname(filePath), dir.pathname) || '.';

            const result = html.replace(
              /(\s(href|src))="\//g,
              `$1="${relativePath}/`
            );

            writeFileSync(filePath, result, 'utf8');
          });
        } catch (error) {
          console.log(error);
        }
      },
    },
  };
};
