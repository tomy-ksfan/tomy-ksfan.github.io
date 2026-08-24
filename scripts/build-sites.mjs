import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = join(root, 'dist', 'server');

const sources = [
  { route: '/', file: 'index.html', type: 'text/html; charset=utf-8', binary: false },
  { route: '/styles.css', file: 'styles.css', type: 'text/css; charset=utf-8', binary: false },
  { route: '/script.js', file: 'script.js', type: 'text/javascript; charset=utf-8', binary: false },
  { route: '/robots.txt', file: 'robots.txt', type: 'text/plain; charset=utf-8', binary: false },
  { route: '/sitemap.xml', file: 'sitemap.xml', type: 'application/xml; charset=utf-8', binary: false },
  { route: '/files/headshot.jpg', file: 'files/headshot.jpg', type: 'image/jpeg', binary: true },
  { route: '/files/headshot.webp', file: 'files/headshot.webp', type: 'image/webp', binary: true },
  { route: '/files/og-card.jpg', file: 'files/og-card.jpg', type: 'image/jpeg', binary: true },
];

const assets = await Promise.all(sources.map(async (source) => {
  const content = await readFile(join(root, source.file));
  return [
    source.route,
    {
      body: source.binary ? content.toString('base64') : content.toString('utf8'),
      type: source.type,
      binary: source.binary,
    },
  ];
}));

const worker = `const assets = new Map(${JSON.stringify(assets)});

const fromBase64 = (value) => {
  const decoded = atob(value);
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const route = url.pathname === '/index.html' ? '/' : url.pathname.replace(/\\/$/, '') || '/';
    const asset = assets.get(route);

    if (!asset) {
      return new Response('Not found', {
        status: 404,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });
    }

    const headers = new Headers({
      'content-type': asset.type,
      'cache-control': route === '/' ? 'public, max-age=300' : 'public, max-age=86400',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'strict-origin-when-cross-origin',
    });
    const body = request.method === 'HEAD' ? null : (asset.binary ? fromBase64(asset.body) : asset.body);

    return new Response(body, { status: 200, headers });
  },
};
`;

await rm(join(root, 'dist'), { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await writeFile(join(outputDirectory, 'index.js'), worker);

console.log(`Built ${assets.length} routes for Sites hosting.`);
