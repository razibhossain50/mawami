#!/usr/bin/env node

/**
 * Migration script to replace console.log statements with proper logging
 * Run with: node scripts/migrate-console-logs.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files to process - using find command instead of glob
const getFiles = () => {
  try {
    const output = execSync('find src -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v ".d.ts"', { encoding: 'utf8' });
    return output.trim().split('\n').filter(file => file.length > 0);
  } catch (error) {
    console.log('Using fallback file discovery...');
    return [
      'src/components/profile/marriage/contact-info-step.tsx',
      'src/components/profile/marriage/basic-info-step.tsx',
      'src/components/profile/marriage/location-info-step.tsx',
      'src/components/profile/marriage/education-info-step.tsx',
      'src/components/profile/marriage/family-info-step.tsx',
      'src/components/profile/marriage/partner-preferences-step.tsx',
      'src/hooks/useBiodataStatus.ts',
      'src/hooks/useProfileView.ts'
    ].filter(file => fs.existsSync(file));
  }
};

// Replacement patterns
const replacements = [
  {
    pattern: /console\.log\(([^)]+)\);?/g,
    replacement: (match, args) => {
      // Try to extract meaningful context from the arguments
      const cleanArgs = args.replace(/[\"'`]/g, '').trim();
      if (cleanArgs.includes('🔍') || cleanArgs.includes('DEBUG')) {
        return `logger.debug(${args}, undefined, 'Component');`;
      } else if (cleanArgs.includes('✅') || cleanArgs.includes('SUCCESS')) {
        return `logger.info(${args}, undefined, 'Component');`;
      } else {
        return `logger.debug(${args}, undefined, 'Component');`;
      }
    }
  },
  {
    pattern: /console\.error\(([^)]+)\);?/g,
    replacement: 'logger.error($1, undefined, \'Component\');'
  },
  {
    pattern: /console\.warn\(([^)]+)\);?/g,
    replacement: 'logger.warn($1, undefined, \'Component\');'
  },
  {
    pattern: /console\.info\(([^)]+)\);?/g,
    replacement: 'logger.info($1, undefined, \'Component\');'
  }
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if file has console statements
    const hasConsoleStatements = /console\.(log|error|warn|info)/.test(content);
    
    if (!hasConsoleStatements) {
      return;
    }
    
    console.log(`Processing: ${filePath}`);
    
    // Add imports if not present
    if (!content.includes("import { logger }")) {
      // Find the last import statement
      const importRegex = /import[^;]+;/g;
      const imports = content.match(importRegex);
      
      if (imports && imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport);
        const insertIndex = lastImportIndex + lastImport.length;
        
        content = content.slice(0, insertIndex) + 
                 "\nimport { logger } from '@/lib/logger';" +
                 "\nimport { handleApiError } from '@/lib/error-handler';" +
                 content.slice(insertIndex);
        modified = true;
      }
    }
    
    // Apply replacements
    replacements.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function main() {
  console.log('🚀 Starting console.log migration...');
  
  const files = getFiles();
  console.log(`Found ${files.length} files to process`);
  
  files.forEach(processFile);
  
  console.log('✅ Migration complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Review the changes and test your application');
  console.log('2. Update component names in logger calls from \'Component\' to actual component names');
  console.log('3. Replace remaining manual fetch calls with API client methods');
  console.log('4. Add proper error handling with handleApiError utility');
}

if (require.main === module) {
  main();
}

module.exports = { processFile, replacements };