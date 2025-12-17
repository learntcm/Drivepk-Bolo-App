const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  entryPoints: ['src/app.ts'],
  bundle: true,
  outfile: 'dist/app.bundle.js',
  format: 'iife', // Use IIFE instead of ESM to avoid module resolution issues
  platform: 'browser',
  target: 'es2020',
  sourcemap: false, // Disable source maps to prevent browser from trying to load original files
  minify: false,
  external: [], // Bundle everything including node_modules
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  banner: {
    js: '/* AI Car Finder - Bundled Application */'
  }
}).then(() => {
  console.log('✓ Bundled successfully');
}).catch((error) => {
  console.error('✗ Bundle failed:', error);
  process.exit(1);
});

