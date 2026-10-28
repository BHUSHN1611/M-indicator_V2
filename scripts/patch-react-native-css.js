const fs = require('fs');
const path = require('path');

const targets = [
  path.join(__dirname, '..', 'node_modules', 'react-native-css', 'dist', 'commonjs', 'components', 'index.cjs'),
  path.join(__dirname, '..', 'node_modules', 'react-native-css', 'dist', 'module', 'components', 'index.cjs'),
];

for (const target of targets) {
  if (!fs.existsSync(target)) continue;
  let content = fs.readFileSync(target, 'utf8');
  if (!content.includes('NativeComponentRegistry')) {
    content = content.replace(
      '  get VirtualViewMode() {\n    return require("react-native").VirtualViewMode;\n  }\n};',
      '  get VirtualViewMode() {\n    return require("react-native").VirtualViewMode;\n  },\n  get NativeComponentRegistry() {\n    return require("react-native").NativeComponentRegistry;\n  }\n};\n\nmodule.exports = new Proxy(module.exports, {\n  get(target, prop, receiver) {\n    if (prop in target) {\n      return Reflect.get(target, prop, receiver);\n    }\n    return require("react-native")[prop];\n  }\n});'
    );
    fs.writeFileSync(target, content, 'utf8');
    console.log(`[postinstall] Successfully patched ${target}`);
  }
}

