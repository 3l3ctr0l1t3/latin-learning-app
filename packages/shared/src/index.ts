/**
 * SHARED UTILITIES AND CONSTANTS
 * 
 * This package contains code that both web and mobile apps can use.
 * By sharing code, we avoid duplication and ensure consistency.
 * 
 * Think of this as a shared library in Java that multiple projects depend on.
 */

/**
 * Re-export everything from individual modules
 * 
 * The "export * from" syntax takes all exports from another file
 * and re-exports them from this file. This creates a single entry point.
 * 
 * Users can then import like: import { normalizeForSearch } from '@latin-app/shared'
 * instead of: import { normalizeForSearch } from '@latin-app/shared/utils/stringUtils'
 */
export * from './utils';