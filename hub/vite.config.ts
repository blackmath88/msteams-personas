import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const ENGINE = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', 'src') + sep;

/*
 * The renderers in ../src are browser scripts: each one attaches its API to `window`, and
 * some also support Node through `module.exports`. A bundler would treat those as CommonJS
 * and never set the globals the other scripts rely on. Wrapping each file with `module`
 * undefined makes it behave exactly as it does behind a <script> tag, in dev and in the build.
 */
function engineScripts(): Plugin {
  return {
    name: 'engine-scripts',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0];
      if (!file.startsWith(ENGINE) || !file.endsWith('.js')) return null;
      return { code: `(function (module, exports, require) {\n${code}\n}).call(window);\n`, map: null };
    }
  };
}

// Static build with relative paths and hash routing: it can be served from any folder
// (GitHub Pages included) without server configuration.
export default defineConfig({
  base: './',
  plugins: [engineScripts(), react()],
  // The renderers, their styles and the bundled font live in the repository root.
  server: { fs: { allow: ['..'] } },
  build: { outDir: 'dist', chunkSizeWarningLimit: 900 }
});
