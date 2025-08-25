#!/usr/bin/env node

/**
 * Script to fix incorrect logger signatures from migration
 */

const fs = require('fs');
const { execSync } = require('child_process');

// Get all TypeScript files
const getFiles = () => {
  try {
    const output = execSync('find src -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v ".d.ts"', { encoding: 'utf8' });
    return output.trim().split('\n').filter(file => file.length > 0);
  } catch (error) {
    console.log('Error finding files:', error.message);
    return [];
  }
};

function fixLoggerSignatures(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix logger calls with incorrect signatures
    const patterns = [
      {
        // Fix logger.error with 4 parameters
        pattern: /logger\.(error|warn|info|debug)\('([^']+):', ([^,]+), undefined, 'Component'\);/g,
        replacement: (match, level, message, errorVar) => {
          if (level === 'error') {
            return `const appError = handleApiError(${errorVar}, 'Component');\n            logger.${level}('${message}', appError, 'Component');`;
          } else {
            return `logger.${level}('${message}', ${errorVar}, 'Component');`;
          }
        }
      },
      {
        // Fix logger calls with 'Component' as component name
        pattern: /logger\.(error|warn|info|debug)\(([^,]+), ([^,]+), 'Component'\);/g,
        replacement: (match, level, message, data) => {
          // Extract component name from file path
          const componentName = filePath.split('/').pop()?.replace(/\.(ts|tsx)$/, '') || 'Component';
          const pascalCaseName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
          return `logger.${level}(${message}, ${data}, '${pascalCaseName}');`;
        }
      }
    ];
    
    patterns.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed logger signatures in: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function main() {
  console.log('🔧 Fixing logger signatures...');
  
  const files = getFiles();
  console.log(`Found ${files.length} files to check`);
  
  files.forEach(fixLoggerSignatures);
  
  console.log('✅ Logger signature fixes complete!');
}

if (require.main === module) {
  main();
}