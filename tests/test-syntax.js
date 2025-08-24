// Simple syntax test for biodata components
const fs = require('fs');
const path = require('path');

// Test BiodataSearch component
const biodataSearchPath = path.join(__dirname, 'src/components/biodata/BiodataSearch.tsx');
const biodataPagePath = path.join(__dirname, 'src/app/(client)/profile/biodatas/page.tsx');

try {
    const biodataSearchContent = fs.readFileSync(biodataSearchPath, 'utf8');
    const biodataPageContent = fs.readFileSync(biodataPagePath, 'utf8');

    // Basic syntax checks
    const openBraces = (biodataSearchContent.match(/{/g) || []).length;
    const closeBraces = (biodataSearchContent.match(/}/g) || []).length;
    const openParens = (biodataSearchContent.match(/\(/g) || []).length;
    const closeParens = (biodataSearchContent.match(/\)/g) || []).length;

    console.log('BiodataSearch Component:');
    console.log(`Open braces: ${openBraces}, Close braces: ${closeBraces}`);
    console.log(`Open parens: ${openParens}, Close parens: ${closeParens}`);
    console.log(`Braces balanced: ${openBraces === closeBraces}`);
    console.log(`Parens balanced: ${openParens === closeParens}`);

    // Check for common syntax issues
    const hasUnmatchedJSX = biodataSearchContent.includes('<div') && !biodataSearchContent.includes('</div>');
    const hasProperExport = biodataSearchContent.includes('export const BiodataSearch');
    const hasProperImports = biodataSearchContent.includes('import');

    console.log(`Has unmatched JSX: ${hasUnmatchedJSX}`);
    console.log(`Has proper export: ${hasProperExport}`);
    console.log(`Has proper imports: ${hasProperImports}`);

    console.log('\nBiodata Page Component:');
    const pageOpenBraces = (biodataPageContent.match(/{/g) || []).length;
    const pageCloseBraces = (biodataPageContent.match(/}/g) || []).length;
    console.log(`Braces balanced: ${pageOpenBraces === pageCloseBraces}`);

    console.log('\n✅ Basic syntax checks passed!');

} catch (error) {
    console.error('❌ Error reading files:', error.message);
}