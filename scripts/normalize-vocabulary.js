/**
 * VOCABULARY NORMALIZER SCRIPT
 * 
 * This script reads the vocabulary.json file and normalizes it:
 * 1. Converts declension numbers (1, 2, 3, 4, 5) to strings ('1st', '2nd', '3rd', '4th', '5th')
 * 2. Adds unique IDs to each word
 * 3. Creates a normalized version for use in our app
 * 
 * In JavaScript:
 * - 'const' means the variable can't be reassigned (like 'final' in Java)
 * - 'let' means the variable can be reassigned
 * - 'var' is old-style and should be avoided
 */

// Import the 'fs' module - this is Node.js's File System module
// It lets us read and write files on the computer
const fs = require('fs');

// Import the 'path' module - helps work with file paths
// Makes sure paths work on Windows, Mac, and Linux
const path = require('path');

/**
 * Map for converting declension numbers to strings
 * This is a JavaScript object (like a HashMap in Java)
 * 
 * In JavaScript, objects can be used as key-value maps:
 * - Keys are on the left (1, 2, 3...)
 * - Values are on the right ('1st', '2nd'...)
 */
const DECLENSION_MAP = {
  1: '1st',
  2: '2nd',
  3: '3rd',
  4: '4th',
  5: '5th'
};

/**
 * Function to capitalize the first letter of a string
 * Handles Spanish text properly, including accented characters
 * 
 * @param {string} str - The string to capitalize
 * @returns {string} - The string with first letter capitalized
 */
function capitalizeFirstLetter(str) {
  if (!str) return '';
  
  // Trim whitespace first
  str = str.trim();
  
  // Use charAt(0) and slice(1) to handle Unicode properly
  // This works correctly with Spanish accented characters like á, é, í, ó, ú, ñ
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Function to normalize gender values to standard forms
 * Converts various forms like "masculine/feminine", "común", etc. to standard values
 * 
 * @param {string} gender - The original gender value
 * @returns {string} - The normalized gender value
 */
function normalizeGender(gender) {
  // Convert to lowercase for easier matching
  const lowerGender = (gender || '').toLowerCase().trim();
  
  // Check for common gender variations
  if (lowerGender.includes('masculine') && lowerGender.includes('feminine')) {
    return 'common';
  }
  if (lowerGender === 'común' || lowerGender === 'common') {
    return 'common';
  }
  if (lowerGender.includes('masculine or feminine')) {
    return 'common';
  }
  if (lowerGender === 'feminine/masculine') {
    return 'common';
  }
  if (lowerGender === 'neuter and masculine') {
    // This is a special case - keep as neuter since it's primarily neuter
    return 'neuter';
  }
  if (lowerGender === 'adjective') {
    // Adjectives can be any gender, mark as common
    return 'common';
  }
  
  // Standard genders
  if (lowerGender === 'masculine') return 'masculine';
  if (lowerGender === 'feminine') return 'feminine';
  if (lowerGender === 'neuter') return 'neuter';
  
  // Default to common if unrecognized
  console.warn(`  ⚠️ Unknown gender value: "${gender}" - defaulting to common`);
  return 'common';
}

/**
 * Function to generate a unique ID for each word
 * 
 * In JavaScript, functions can be defined with:
 * - function keyword (traditional)
 * - arrow functions => (modern, shorter syntax)
 * 
 * @param {Object} word - The word object
 * @param {number} index - The position in the array
 * @returns {string} - A unique ID
 */
function generateWordId(word, index) {
  // Create ID from nominative (removing spaces and special chars) plus index
  // toLowerCase() converts to lowercase
  // replace() uses a regex to remove non-alphanumeric characters
  // padStart() adds zeros to the left (e.g., '1' becomes '0001')
  const cleanNominative = word.nominative
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ''); // Regex: ^ means "not", a-z0-9 are allowed chars
  
  const paddedIndex = String(index + 1).padStart(4, '0');
  
  // Template literals use backticks `` and ${} for variables
  // This is like String.format() in Java
  return `word_${cleanNominative}_${paddedIndex}`;
}

/**
 * Main function to normalize the vocabulary
 * 
 * 'async' means this function can use 'await' for asynchronous operations
 * Asynchronous = doesn't block the program while waiting (like Java's CompletableFuture)
 */
async function normalizeVocabulary() {
  try {
    // Step 1: Read the original vocabulary.json file
    console.log('📖 Reading vocabulary.json...');
    
    // __dirname is the directory of this script file
    // '..' means go up one directory
    // This creates the full path to vocabulary.json
    const vocabularyPath = path.join(__dirname, '..', 'vocabulary.json');
    
    // fs.readFileSync reads the file synchronously (blocks until done)
    // 'utf8' tells it to read as text (not binary)
    const rawData = fs.readFileSync(vocabularyPath, 'utf8');
    
    // JSON.parse converts JSON text into JavaScript objects
    // Like Jackson or Gson in Java
    const vocabulary = JSON.parse(rawData);
    
    console.log(`✅ Found ${vocabulary.length} words`);
    
    // Step 2: Normalize each word
    console.log('🔄 Normalizing data...');
    
    // .map() transforms each element in an array
    // It's like Java's Stream.map()
    const normalizedVocabulary = vocabulary.map((word, index) => {
      // Return a new object with normalized data
      // The spread operator (...) copies all properties from the original
      return {
        // Add a unique ID
        id: generateWordId(word, index),
        
        // Copy original fields
        nominative: word.nominative,
        genitive: word.genitive,
        
        // Convert declension number to string
        // If DECLENSION_MAP doesn't have the value, use the original
        declension: DECLENSION_MAP[word.declension] || word.declension,
        
        // Normalize gender - convert various forms to standard values
        // Handle all variations of common gender
        gender: normalizeGender(word.gender),
        
        // Rename spanishMeaning to spanishTranslation for consistency
        // Capitalize the first letter of the Spanish translation
        spanishTranslation: capitalizeFirstLetter(word.spanishMeaning),
        
        // Additional meanings (already an array)
        // Capitalize each additional meaning
        additionalMeanings: (word.additionalMeanings || []).map(meaning => 
          capitalizeFirstLetter(meaning)
        ),
        
        // Add placeholder for example sentence (will be filled by AI later)
        exampleSentence: null
      };
    });
    
    // Step 3: Save the normalized data
    console.log('💾 Saving normalized vocabulary...');
    
    const outputPath = path.join(__dirname, '..', 'vocabulary-normalized.json');
    
    // JSON.stringify converts JavaScript objects to JSON text
    // null, 2 means indent with 2 spaces for readability
    const jsonOutput = JSON.stringify(normalizedVocabulary, null, 2);
    
    // Write the file
    fs.writeFileSync(outputPath, jsonOutput, 'utf8');
    
    console.log(`✅ Normalized vocabulary saved to vocabulary-normalized.json`);
    
    // Step 4: Create a summary
    // Set is like Java's HashSet - stores unique values
    const declensions = new Set(normalizedVocabulary.map(w => w.declension));
    const genders = new Set(normalizedVocabulary.map(w => w.gender));
    
    console.log('\n📊 Summary:');
    console.log(`  Total words: ${normalizedVocabulary.length}`);
    console.log(`  Declensions: ${Array.from(declensions).join(', ')}`);
    console.log(`  Genders: ${Array.from(genders).join(', ')}`);
    
    // Step 5: Check for any issues
    const wordsWithNumericDeclension = normalizedVocabulary.filter(
      w => typeof w.declension === 'number'
    );
    
    if (wordsWithNumericDeclension.length > 0) {
      console.warn(`\n⚠️  Warning: ${wordsWithNumericDeclension.length} words still have numeric declension`);
    }
    
  } catch (error) {
    // Error handling - catch any problems
    console.error('❌ Error normalizing vocabulary:', error.message);
    
    // Exit with error code 1 (0 = success, non-zero = error)
    process.exit(1);
  }
}

// Run the script
// This is like Java's public static void main()
console.log('🚀 Starting vocabulary normalization...\n');
normalizeVocabulary();