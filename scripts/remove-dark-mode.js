#!/usr/bin/env node

/**
 * Remove Dark Mode Classes Script
 * 
 * This script removes all dark mode classes (dark:) from React components
 * to ensure the application only uses light mode.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const COMPONENTS_DIR = 'resources/js/components';
const PAGES_DIR = 'resources/js/pages';

/**
 * Remove dark mode classes from a string
 */
function removeDarkModeClasses(content) {
    // Remove dark: prefixed classes
    let updatedContent = content.replace(/dark:[^\s]+/g, '');
    
    // Remove empty class attributes
    updatedContent = updatedContent.replace(/className="\s*"/g, '');
    updatedContent = updatedContent.replace(/className='\s*'/g, '');
    
    // Clean up multiple spaces
    updatedContent = updatedContent.replace(/\s+/g, ' ');
    
    return updatedContent;
}

/**
 * Process a single file
 */
function processFile(filePath) {
    console.log(`Processing: ${filePath}`);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        content = removeDarkModeClasses(content);
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Updated: ${filePath}`);
        } else {
            console.log(`- No changes needed: ${filePath}`);
        }
        
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
    }
}

/**
 * Find all React files
 */
function findReactFiles() {
    const patterns = [
        `${COMPONENTS_DIR}/**/*.tsx`,
        `${COMPONENTS_DIR}/**/*.jsx`,
        `${PAGES_DIR}/**/*.tsx`,
        `${PAGES_DIR}/**/*.jsx`
    ];
    
    const files = [];
    patterns.forEach(pattern => {
        const matches = glob.sync(pattern);
        files.push(...matches);
    });
    
    return files;
}

/**
 * Main function
 */
function main() {
    console.log('🌞 Remove Dark Mode Classes Script');
    console.log('===================================\n');
    
    const files = findReactFiles();
    console.log(`Found ${files.length} React files to process\n`);
    
    files.forEach(processFile);
    
    console.log('\n✅ Dark mode classes removal complete!');
    console.log('\nNote: This script removes dark: prefixed classes.');
    console.log('You may need to manually review some components for proper styling.');
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    removeDarkModeClasses,
    processFile
};
