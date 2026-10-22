import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = (process.argv[2] || '').replace(/^v/, '');

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('Usage: node scripts/sync-version.mjs <version>');
  process.exit(1);
}

const now = new Date();
const today = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
].join('-');

for (const file of ['index.html', 'en/index.html']) {
  const full = path.join(root, file);
  const before = fs.readFileSync(full, 'utf8');
  if (!/"softwareVersion":\s*"\d+\.\d+\.\d+"/.test(before) || !/"dateModified":\s*"\d{4}-\d{2}-\d{2}"/.test(before)) {
    throw new Error(`Missing version fields in ${file}`);
  }
  const next = before
    .replace(/("softwareVersion":\s*")\d+\.\d+\.\d+(")/g, `$1${version}$2`)
    .replace(/("dateModified":\s*")\d{4}-\d{2}-\d{2}(")/g, `$1${today}$2`);
  fs.writeFileSync(full, next);
}

const sitemap = path.join(root, 'sitemap.xml');
const beforeSitemap = fs.readFileSync(sitemap, 'utf8');
if (!/<lastmod>[^<]+<\/lastmod>/.test(beforeSitemap)) {
  throw new Error('Missing <lastmod> in sitemap.xml');
}
fs.writeFileSync(sitemap, beforeSitemap.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`));

console.log(`Synced version ${version} and lastmod ${today}`);
