import fs from 'node:fs';
import yaml from 'js-yaml';
import { fileURLToPath } from 'node:url';

const loadConfig = async (configPathOrData: string | object | URL) => {
  if (typeof configPathOrData === 'string') {
    const content = fs.readFileSync(fileURLToPath(configPathOrData), 'utf8');
    if (configPathOrData.endsWith('.yaml') || configPathOrData.endsWith('.yml')) {
      return yaml.load(content);
    }
    return content;
  }

  if (configPathOrData instanceof URL) {
    const content = fs.readFileSync(fileURLToPath(configPathOrData), 'utf8');
    if (
      configPathOrData.href.includes('_config') ||
      configPathOrData.href.endsWith('.yaml') ||
      configPathOrData.href.endsWith('.yml')
    ) {
      return yaml.load(content);
    }
    return content;
  }

  return configPathOrData;
};

export default loadConfig;
