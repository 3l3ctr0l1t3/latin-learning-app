/**
 * DATA PACKAGE - VOCABULARY LOADER AND MANAGER
 * 
 * This package handles all data operations for our Latin vocabulary.
 * Since we're not using a backend, this package loads data from JSON files
 * and provides functions to filter, search, and retrieve words.
 * 
 * Think of this as your Data Access Layer (DAL) in a traditional architecture.
 */

// Import our type definitions from the types package
// The '@latin-app/types' is the package name we defined in package.json
import type { NormalizedLatinWord, VocabularyFilter } from '@latin-app/types';

// Import string normalization utilities for case/accent insensitive search
// CRITICAL: All searches must be case and accent insensitive
import { 
  // normalizeForSearch, // Removed - not being used
  stringIncludes, 
  stringStartsWith,
  compareStrings,
  // fuzzySearchScore // Removed - not being used
} from '@latin-app/shared';

// Import the normalized vocabulary JSON file
// In TypeScript/JavaScript, we can import JSON files directly
// The '../../../' goes up 3 directories to reach the root
import vocabularyData from '../../../vocabulary-normalized.json';

/**
 * CLASS: VocabularyService
 * 
 * This is a service class that manages vocabulary data.
 * In React, we often use classes or objects to organize related functions.
 * 
 * 'export class' makes this available to other files (like 'public class' in Java)
 */
export class VocabularyService {
  // Private property to store all words
  // 'private' means only this class can access it (like Java)
  // 'readonly' means it can't be reassigned after initialization
  private readonly words: NormalizedLatinWord[];
  
  /**
   * Constructor - runs when we create a new instance
   * 
   * In TypeScript/JavaScript:
   * - No need to declare parameter types if using TypeScript
   * - 'this' refers to the current instance (like Java)
   */
  constructor() {
    // Load and validate the vocabulary data
    // 'as' is a type assertion - tells TypeScript what type this is
    // Fix type issue: vocabularyData has null for exampleSentence, but our type expects string | undefined
    this.words = vocabularyData.map(word => ({
      ...word,
      exampleSentence: word.exampleSentence ?? undefined // Convert null to undefined
    })) as NormalizedLatinWord[];
    
    // Log how many words we loaded (useful for debugging)
    console.log(`VocabularyService: Loaded ${this.words.length} words`);
  }
  
  /**
   * Get all words in the vocabulary
   * 
   * Returns a copy of the array to prevent external modification
   * The spread operator [...] creates a shallow copy
   * 
   * @returns {NormalizedLatinWord[]} Array of all words
   */
  getAllWords(): NormalizedLatinWord[] {
    // [...this.words] creates a new array with the same elements
    // This prevents external code from modifying our internal data
    return [...this.words];
  }
  
  /**
   * Get a single word by ID
   * 
   * @param {string} id - The unique word ID
   * @returns {NormalizedLatinWord | undefined} The word or undefined if not found
   */
  getWordById(id: string): NormalizedLatinWord | undefined {
    // .find() searches the array and returns the first match
    // It returns undefined if no match is found
    // The arrow function (word => ...) is the search condition
    return this.words.find(word => word.id === id);
  }
  
  /**
   * Get multiple words by their IDs
   * 
   * @param {string[]} ids - Array of word IDs
   * @returns {NormalizedLatinWord[]} Array of matching words
   */
  getWordsByIds(ids: string[]): NormalizedLatinWord[] {
    // Create a Set for O(1) lookup time (faster than array.includes())
    // Set is like Java's HashSet
    const idSet = new Set(ids);
    
    // Filter words whose IDs are in the set
    return this.words.filter(word => idSet.has(word.id));
  }
  
  /**
   * Filter words based on criteria
   * 
   * @param {VocabularyFilter} filter - Filter criteria
   * @returns {NormalizedLatinWord[]} Filtered words
   */
  filterWords(filter: VocabularyFilter): NormalizedLatinWord[] {
    // Start with all words
    let filtered = [...this.words];
    
    // Filter by declensions if specified
    if (filter.declensions && filter.declensions.length > 0) {
      // Create a Set for faster lookup
      const declensionSet = new Set(filter.declensions);
      
      // Keep only words with matching declension
      filtered = filtered.filter(word => declensionSet.has(word.declension));
    }
    
    // Filter by genders if specified
    if (filter.genders && filter.genders.length > 0) {
      const genderSet = new Set(filter.genders);
      
      // Handle special cases where gender might not be standard
      filtered = filtered.filter(word => {
        // Check if the word's gender is in our filter
        // We need to handle non-standard genders in the data
        const normalizedGender = this.normalizeGender(word.gender);
        return genderSet.has(normalizedGender);
      });
    }
    
    // Filter by search text if specified
    if (filter.searchText && filter.searchText.trim() !== '') {
      // IMPORTANT: Using normalized search for case and accent insensitive matching
      // This ensures "Maria" matches "María", "ROSA" matches "rosa", etc.
      const searchTerm = filter.searchText.trim();
      
      filtered = filtered.filter(word => {
        // Check if search text appears in nominative, genitive, or translation
        // Using stringIncludes for accent/case insensitive comparison
        return (
          stringIncludes(word.nominative, searchTerm) ||
          stringIncludes(word.genitive, searchTerm) ||
          stringIncludes(word.spanishTranslation, searchTerm) ||
          // Also check additional meanings
          word.additionalMeanings.some(meaning => 
            stringIncludes(meaning, searchTerm)
          )
        );
      });
    }
    
    return filtered;
  }
  
  /**
   * Search for words by text
   * 
   * More sophisticated than filter - ranks results by relevance
   * 
   * @param {string} searchText - Text to search for
   * @returns {NormalizedLatinWord[]} Search results ranked by relevance
   */
  searchWords(searchText: string): NormalizedLatinWord[] {
    if (!searchText || searchText.trim() === '') {
      return [];
    }
    
    const searchTerm = searchText.trim();
    
    // Create array of results with relevance scores
    // IMPORTANT: Using normalized comparison for case/accent insensitive search
    const results = this.words
      .map(word => {
        let score = 0;
        
        // Exact match in nominative (highest score)
        // compareStrings handles case and accent differences
        if (compareStrings(word.nominative, searchTerm)) {
          score += 100;
        }
        // Starts with search text in nominative
        else if (stringStartsWith(word.nominative, searchTerm)) {
          score += 50;
        }
        // Contains search text in nominative
        else if (stringIncludes(word.nominative, searchTerm)) {
          score += 25;
        }
        
        // Check Spanish translation
        if (compareStrings(word.spanishTranslation, searchTerm)) {
          score += 75;
        } else if (stringIncludes(word.spanishTranslation, searchTerm)) {
          score += 20;
        }
        
        // Check genitive
        if (stringIncludes(word.genitive, searchTerm)) {
          score += 15;
        }
        
        // Check additional meanings
        if (word.additionalMeanings.some(m => stringIncludes(m, searchTerm))) {
          score += 10;
        }
        
        return { word, score };
      })
      // Keep only words with a score > 0
      .filter(result => result.score > 0)
      // Sort by score (highest first)
      .sort((a, b) => b.score - a.score)
      // Extract just the words
      .map(result => result.word);
    
    return results;
  }
  
  /**
   * Get random words for practice
   * 
   * @param {number} count - Number of words to get
   * @param {VocabularyFilter} filter - Optional filter
   * @returns {NormalizedLatinWord[]} Random selection of words
   */
  getRandomWords(count: number, filter?: VocabularyFilter): NormalizedLatinWord[] {
    // Get filtered words or all words
    const pool = filter ? this.filterWords(filter) : [...this.words];
    
    // Can't get more words than we have
    const actualCount = Math.min(count, pool.length);
    
    // Fisher-Yates shuffle algorithm
    // This is an efficient way to get random elements
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      // Random index from 0 to i
      const j = Math.floor(Math.random() * (i + 1));
      
      // Swap elements at positions i and j
      // This is array destructuring - a modern way to swap
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Return the first 'count' elements
    return shuffled.slice(0, actualCount);
  }
  
  /**
   * Get words grouped by declension
   * 
   * @returns {Map<string, NormalizedLatinWord[]>} Words grouped by declension
   */
  getWordsByDeclension(): Map<string, NormalizedLatinWord[]> {
    // Map is like Java's HashMap
    const grouped = new Map<string, NormalizedLatinWord[]>();
    
    // Initialize map with empty arrays for each declension
    ['1st', '2nd', '3rd', '4th', '5th'].forEach(declension => {
      grouped.set(declension, []);
    });
    
    // Group words
    this.words.forEach(word => {
      const group = grouped.get(word.declension);
      if (group) {
        group.push(word);
      }
    });
    
    return grouped;
  }
  
  /**
   * Get statistics about the vocabulary
   * 
   * @returns {Object} Statistics object
   */
  getStatistics() {
    const stats = {
      totalWords: this.words.length,
      byDeclension: {} as Record<string, number>,
      byGender: {} as Record<string, number>,
      withAdditionalMeanings: 0,
    };
    
    // Count words by declension and gender
    this.words.forEach(word => {
      // Count by declension
      stats.byDeclension[word.declension] = 
        (stats.byDeclension[word.declension] || 0) + 1;
      
      // Count by gender (normalized)
      const gender = this.normalizeGender(word.gender);
      stats.byGender[gender] = (stats.byGender[gender] || 0) + 1;
      
      // Count words with additional meanings
      if (word.additionalMeanings.length > 0) {
        stats.withAdditionalMeanings++;
      }
    });
    
    return stats;
  }
  
  /**
   * Helper: Normalize gender values
   * 
   * Some words in the data have non-standard gender values
   * This function maps them to standard values
   * 
   * @private
   * @param {string} gender - Raw gender value
   * @returns {string} Normalized gender
   */
  private normalizeGender(gender: string): 'masculine' | 'feminine' | 'neuter' | 'common' {
    const genderLower = gender.toLowerCase();
    
    // Handle various cases
    if (genderLower.includes('masculine') || genderLower === 'masculino') {
      return 'masculine';
    }
    if (genderLower.includes('feminine') || genderLower === 'femenino') {
      return 'feminine';
    }
    if (genderLower.includes('neuter') || genderLower === 'neutro') {
      return 'neuter';
    }
    if (genderLower.includes('common') || genderLower === 'común') {
      return 'common';
    }

    // Default for ambiguous cases (like "common", "adjective")
    // You might want to handle these differently
    return 'masculine';
  }
}

/**
 * Create a singleton instance
 * 
 * A singleton ensures we only have one instance of the service.
 * This saves memory and ensures all parts of the app use the same data.
 * 
 * In JavaScript, module exports are cached, so this acts like a singleton.
 */
export const vocabularyService = new VocabularyService();

/**
 * Export convenience functions
 * 
 * These are shortcuts that call methods on the singleton.
 * This makes the API easier to use:
 * import { getAllWords } from '@latin-app/data'
 * instead of:
 * import { vocabularyService } from '@latin-app/data'
 * vocabularyService.getAllWords()
 */
export const getAllWords = () => vocabularyService.getAllWords();
export const getWordById = (id: string) => vocabularyService.getWordById(id);
export const getWordsByIds = (ids: string[]) => vocabularyService.getWordsByIds(ids);
export const filterWords = (filter: VocabularyFilter) => vocabularyService.filterWords(filter);
export const searchWords = (searchText: string) => vocabularyService.searchWords(searchText);
export const getRandomWords = (count: number, filter?: VocabularyFilter) => 
  vocabularyService.getRandomWords(count, filter);
export const getWordsByDeclension = () => vocabularyService.getWordsByDeclension();
export const getVocabularyStatistics = () => vocabularyService.getStatistics();