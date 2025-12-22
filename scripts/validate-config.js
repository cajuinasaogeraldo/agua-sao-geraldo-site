// eslint-disable no-console
import fs from 'fs';
import yaml from 'js-yaml';

const files = ['public/_config', 'public/_htaccess'];

let hasError = false;

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    yaml.load(content);
    console.log(`✅ YAML válido: ${file}`);
  } catch (err) {
    hasError = true;
    console.error(`❌ YAML inválido: ${file}`);
    console.error(err.message);
  }
}

if (hasError) {
  process.exit(1);
}

process.exit(0);
