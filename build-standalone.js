// Script to bundle index.html, css/style.css, and all js files into standalone.html
const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
let html = fs.readFileSync(path.join(baseDir, 'index.html'), 'utf8');

// Replace CSS link with inline style
const cssPath = path.join(baseDir, 'css', 'style.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');
html = html.replace(/<link\s+rel=["']stylesheet["']\s+href=["']css\/style\.css["']\s*\/?>/i, `<style>\n${cssContent}\n</style>`);

// Replace each script tag with inline script
html = html.replace(/<script\s+src=["']([^"']+)["']\s*><\/script>/gi, (match, src) => {
  const scriptPath = path.join(baseDir, src.replace(/\//g, path.sep));
  if (fs.existsSync(scriptPath)) {
    const jsContent = fs.readFileSync(scriptPath, 'utf8');
    return `<script>\n${jsContent}\n</script>`;
  }
  return match;
});

const outPath = path.join(baseDir, 'standalone.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log(`Successfully generated standalone.html (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
