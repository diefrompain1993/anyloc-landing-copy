import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join, parse, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = join(root, 'dist');
const output = join(root, '_site');
if (relative(root, output) !== '_site') throw new Error('Build output must stay inside the repository');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
const moduleData = await readFile(join(source, 'product-ui.js'));
const moduleName = 'product-ui.' + createHash('sha256').update(moduleData).digest('hex').slice(0,12) + '.js';
await writeFile(join(output,moduleName),moduleData);
let html = await readFile(join(source, 'index.html'), 'utf8');

// New filenames prevent a fresh page from reusing an older cached script or stylesheet.
for (const [asset, attribute] of [['main.js', 'src'], ['finale-tag.js', 'src'], ['connected.css', 'href'], ['style.css', 'href'], ['lower.js', 'src'], ['lower.css', 'href'], ['refinements.css', 'href'], ['product-ui.css', 'href']]) {
  let data = await readFile(join(source, asset));
  if(asset==='lower.js')data=Buffer.from(data.toString().replace('./product-ui.js','./'+moduleName));
  const hash = createHash('sha256').update(data).digest('hex').slice(0, 12);
  const { name, ext } = parse(asset);
  const versioned = `${name}.${hash}${ext}`;
  const reference = `${attribute}="${asset}"`;
  if (!html.includes(reference)) throw new Error(`Missing asset reference: ${reference}`);
  html = html.replaceAll(reference, `${attribute}="${versioned}"`);
  await writeFile(join(output, versioned), data);
  console.log(`${asset} → ${versioned}`);
}

await writeFile(join(output, 'index.html'), html);
