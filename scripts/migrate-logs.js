#!/usr/bin/env node

/**
 * Unified migration script:
 * - Replaces console.* with structured logger calls
 * - Ensures logger/error-handler imports exist
 * - Fixes logger signatures and replaces generic 'Component' with inferred name
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const getFiles = () => {
  try {
    const output = execSync('find src -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v ".d.ts"', { encoding: 'utf8' });
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.log('Error finding files:', error.message);
    return [];
  }
};

const consoleReplacements = [
  {
    pattern: /console\.log\(([^)]+)\);?/g,
    replacement: (match, args) => `logger.debug(${args}, undefined, 'Component');`
  },
  { pattern: /console\.error\(([^)]+)\);?/g, replacement: "logger.error($1, undefined, 'Component');" },
  { pattern: /console\.warn\(([^)]+)\);?/g, replacement: "logger.warn($1, undefined, 'Component');" },
  { pattern: /console\.info\(([^)]+)\);?/g, replacement: "logger.info($1, undefined, 'Component');" }
];

const fixSignaturePatterns = [
  {
    // Replace logger calls that mistakenly pass undefined placeholder in the 2nd arg for non-error
    pattern: /logger\.(warn|info|debug)\(([^,]+),\s*undefined,\s*'Component'\);/g,
    replacement: (m, level, message) => `logger.${level}(${message}, undefined, 'Component');`
  },
  {
    // Fix specific 4-parameter patterns introduced by prior migrations
    pattern: /logger\.(error|warn|info|debug)\('([^']+):',\s*([^,]+),\s*undefined,\s*'Component'\);/g,
    replacement: (match, level, msg, errVar) => {
      if (level === 'error') {
        return `const appError = handleApiError(${errVar}, 'Component');\nlogger.${level}('${msg}', appError, 'Component');`;
      }
      return `logger.${level}('${msg}', ${errVar}, 'Component');`;
    }
  },
  {
    // Replace generic 'Component' with inferred component/file name
    pattern: /logger\.(error|warn|info|debug)\(([^,]+),\s*([^,]+),\s*'Component'\);/g,
    replacement: (match, level, message, data, filePath) => {
      return match; // handled per-file with actual filePath below
    }
  }
];

function ensureImports(content) {
  let modified = false;
  const needsLogger = !content.includes("import { logger }");
  const needsHandler = !content.includes("import { handleApiError }");
  if (!needsLogger && !needsHandler) return { content, modified };

  const importRegex = /import[^;]+;/g;
  const imports = content.match(importRegex);
  const insertIndex = imports && imports.length > 0 ? content.lastIndexOf(imports[imports.length - 1]) + imports[imports.length - 1].length : 0;

  if (needsLogger) {
    content = content.slice(0, insertIndex) + "\nimport { logger } from '@/lib/logger';" + content.slice(insertIndex);
    modified = true;
  }
  if (needsHandler) {
    const afterLoggerIndex = insertIndex + (needsLogger ? "\nimport { logger } from '@/lib/logger';".length : 0);
    content = content.slice(0, afterLoggerIndex) + "\nimport { handleApiError } from '@/lib/error-handler';" + content.slice(afterLoggerIndex);
    modified = true;
  }
  return { content, modified };
}

function replaceConsole(content) {
  let modified = false;
  consoleReplacements.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });
  return { content, modified };
}

function fixLoggerSignatures(content) {
  let modified = false;
  fixSignaturePatterns.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });
  return { content, modified };
}

function replaceComponentName(content, filePath) {
  const componentName = path.basename(filePath).replace(/\.(ts|tsx)$/, '');
  const pascal = componentName.charAt(0).toUpperCase() + componentName.slice(1);
  const pattern = /logger\.(error|warn|info|debug)\(([^,]+),\s*([^,]+),\s*'Component'\);/g;
  if (!pattern.test(content)) return { content, modified: false };
  const replaced = content.replace(pattern, (m, level, msg, data) => `logger.${level}(${msg}, ${data}, '${pascal}');`);
  return { content: replaced, modified: true };
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let anyChange = false;

    const importsRes = ensureImports(content); content = importsRes.content; anyChange = anyChange || importsRes.modified;
    const consoleRes = replaceConsole(content); content = consoleRes.content; anyChange = anyChange || consoleRes.modified;
    const sigRes = fixLoggerSignatures(content); content = sigRes.content; anyChange = anyChange || sigRes.modified;
    const compRes = replaceComponentName(content, filePath); content = compRes.content; anyChange = anyChange || compRes.modified;

    if (anyChange) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    }
  } catch (err) {
    console.error(`❌ Error processing ${filePath}:`, err.message);
  }
}

function main() {
  console.log('🚀 Running unified log migration...');
  const files = getFiles();
  console.log(`Found ${files.length} files to process`);
  files.forEach(processFile);
  console.log('✅ Migration complete.');
}

if (require.main === module) {
  main();
}


