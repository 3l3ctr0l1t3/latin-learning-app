# Local Storage & Backend Implementation Plan

## Overview
This document outlines the implementation strategy for adding data persistence to the Latin Learning App, starting with local storage and eventually transitioning to a full backend solution.

## Timeline
- **Phase 1**: Local Storage (Week 1) - Immediate implementation
- **Phase 2**: Enhanced Local Features (Week 2)
- **Phase 3**: Backend Preparation (Weeks 3-4)
- **Phase 4**: Backend Implementation (Month 2)

---

## Phase 1: Local Storage Implementation (Immediate)

### 1.1 Create Storage Service Layer
**Location**: `/apps/web/src/services/storage/`

#### LocalStorageService.ts
Core service for handling all localStorage operations with type safety.

**Key Methods**:
```typescript
class LocalStorageService {
  // Session Management
  saveSession(session: StoredSession): void
  getSessions(): StoredSession[]
  getSession(id: string): StoredSession | null
  deleteSession(id: string): void
  
  // Progress Tracking
  saveProgress(wordId: string, result: PracticeResult): void
  getProgress(wordId: string): WordProgress | null
  getAllProgress(): Map<string, WordProgress>
  
  // User Preferences
  savePreferences(prefs: UserPreferences): void
  getPreferences(): UserPreferences | null
  
  // Statistics
  getStatistics(): Statistics
  updateStatistics(session: StoredSession): void
  
  // Data Management
  clearAllData(): void
  exportData(): string // JSON export
  importData(jsonData: string): boolean
  getStorageSize(): number // in bytes
}
```

### 1.2 Define Storage Data Models
**Location**: `/packages/types/src/storage.ts`

```typescript
// Session data stored locally
interface StoredSession {
  id: string
  startedAt: string // ISO date string
  completedAt: string
  duration: number // minutes
  wordsStudied: string[] // word IDs
  drillTypes: DrillType[]
  results: {
    correct: number
    incorrect: number
    byDrillType: Record<DrillType, { correct: number; incorrect: number }>
    byWord: Record<string, { attempts: number; correct: number }>
  }
}

// Individual word progress
interface WordProgress {
  wordId: string
  firstSeen: string // ISO date
  lastSeen: string
  timesSeen: number
  correctAttempts: number
  incorrectAttempts: number
  masteryLevel: 0 | 1 | 2 | 3 | 4 | 5 // 0=new, 5=mastered
  nextReviewDate?: string // For spaced repetition
}

// User preferences
interface UserPreferences {
  defaultDuration: 5 | 10 | 15
  defaultDrillTypes: DrillType[]
  theme?: 'dark' | 'light'
  soundEnabled?: boolean
  autoAdvance?: boolean
}

// Overall statistics
interface Statistics {
  totalSessions: number
  totalTimeMinutes: number
  totalWordsLearned: number
  wordsInProgress: number
  wordsMastered: number
  currentStreak: number
  longestStreak: number
  lastPracticeDate: string
  averageAccuracy: number
  strongestDeclension: string
  weakestDeclension: string
  favoriteWords: string[] // Most practiced
}

// Storage versioning for migrations
interface StorageVersion {
  version: number
  migrationDate: string
}
```

### 1.3 Implement Session Tracking

#### Update StudySession Component
**Location**: `/apps/web/src/features/study-session/components/StudySession.tsx`

**Track**:
- Session start time
- Each answer (correct/incorrect)
- Time per question
- Drill type performance
- Session completion

**Auto-save**:
- Save progress every 30 seconds
- Save on page unload (beforeunload event)
- Save on visibility change (page hidden)

### 1.4 Create Statistics Service
**Location**: `/apps/web/src/services/statistics/StatisticsService.ts`

**Calculate**:
- Words mastered (>80% correct over 5+ attempts)
- Current practice streak
- Time spent per declension
- Accuracy by drill type
- Progress trends (daily, weekly, monthly)
- Weakest areas needing review

### 1.5 Add User Progress Dashboard

#### Update Dashboard Component
**Location**: `/apps/web/src/features/dashboard/components/Dashboard.tsx`

**New Sections**:
1. **Recent Sessions**
   - Last 5 sessions with summary
   - Quick resume last session

2. **Statistics Overview**
   - Total words learned
   - Current streak
   - Time practiced this week
   - Overall accuracy

3. **Progress Charts**
   - Words learned over time
   - Accuracy trend
   - Time spent per day

4. **Achievements**
   - First session
   - 7-day streak
   - 100 words learned
   - All declensions practiced

---

## Phase 2: Enhanced Local Features (Week 2)

### 2.1 Implement Offline Queue
- Queue failed API calls when offline
- Retry when connection restored
- Handle conflict resolution
- Show sync status to user

### 2.2 Add Data Export/Import
**Features**:
- Export all data as JSON file
- Import from backup file
- Merge or replace options
- Validate imported data
- Share progress via file

### 2.3 Implement Spaced Repetition Algorithm
**Algorithm**: SM-2 or simplified version
- Calculate review intervals
- Track word difficulty
- Adjust intervals based on performance
- Priority queue for reviews

---

## Phase 3: Backend Preparation (Weeks 3-4)

### 3.1 Design API Schema

#### RESTful Endpoints
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/sessions
POST   /api/sessions
GET    /api/sessions/:id
PUT    /api/sessions/:id
DELETE /api/sessions/:id

GET    /api/progress
GET    /api/progress/:wordId
PUT    /api/progress/:wordId

GET    /api/statistics
GET    /api/statistics/leaderboard

GET    /api/vocabulary
GET    /api/vocabulary/:id
POST   /api/vocabulary/bulk-update
```

### 3.2 Create API Service Layer
**Location**: `/apps/web/src/services/api/`

- **ApiService.ts**: HTTP client with interceptors
- **AuthService.ts**: Token management, login/logout
- **SyncService.ts**: Local-remote synchronization

### 3.3 Implement Dual Storage Strategy
```typescript
class DualStorageService {
  async saveSession(session: StoredSession) {
    // Save locally first
    localStorage.saveSession(session)
    
    // Try to sync with backend
    try {
      await api.saveSession(session)
    } catch (error) {
      // Queue for later sync
      offlineQueue.add('saveSession', session)
    }
  }
}
```

---

## Phase 4: Backend Implementation (Month 2)

### 4.1 Backend Technology Options

#### Option 1: Supabase (Recommended)
**Pros**:
- PostgreSQL database
- Built-in authentication
- Real-time subscriptions
- Generous free tier
- TypeScript SDK

**Cons**:
- Vendor lock-in
- Limited customization

#### Option 2: Firebase
**Pros**:
- Easy setup
- Good offline support
- Real-time database
- Google authentication

**Cons**:
- NoSQL (different paradigm)
- Can get expensive

#### Option 3: Custom Node.js + PostgreSQL
**Pros**:
- Full control
- Any hosting provider
- Custom business logic

**Cons**:
- More development time
- Need to handle auth, security

### 4.2 Database Schema (PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  preferences JSONB
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  duration_minutes INTEGER,
  words_studied TEXT[],
  drill_types TEXT[],
  results JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Word progress table
CREATE TABLE word_progress (
  user_id UUID REFERENCES users(id),
  word_id VARCHAR(255),
  first_seen TIMESTAMP,
  last_seen TIMESTAMP,
  times_seen INTEGER DEFAULT 0,
  correct_attempts INTEGER DEFAULT 0,
  incorrect_attempts INTEGER DEFAULT 0,
  mastery_level INTEGER DEFAULT 0,
  next_review_date TIMESTAMP,
  PRIMARY KEY (user_id, word_id)
);

-- Achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  achievement_type VARCHAR(100),
  earned_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

-- Indexes for performance
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_completed_at ON sessions(completed_at);
CREATE INDEX idx_word_progress_next_review ON word_progress(next_review_date);
```

### 4.3 Authentication Implementation
- Email/password with bcrypt
- JWT tokens for sessions
- Refresh token rotation
- OAuth providers (Google, GitHub)
- Password reset flow
- Email verification

---

## Implementation Checklist

### Phase 1 Tasks
- [ ] Create storage service directory structure
- [ ] Implement LocalStorageService class
- [ ] Add storage types to packages/types
- [ ] Update StudySession to track progress
- [ ] Implement auto-save functionality
- [ ] Create StatisticsService
- [ ] Update Dashboard with progress display
- [ ] Add data management settings page
- [ ] Test localStorage limits and performance
- [ ] Add data migration system

### Phase 2 Tasks
- [ ] Implement offline queue
- [ ] Add export functionality
- [ ] Add import functionality
- [ ] Implement spaced repetition
- [ ] Add review scheduling
- [ ] Create review reminder system

### Phase 3 Tasks
- [ ] Design API endpoints
- [ ] Create OpenAPI specification
- [ ] Implement ApiService
- [ ] Add authentication service
- [ ] Create sync service
- [ ] Implement conflict resolution
- [ ] Add loading states
- [ ] Error handling strategy

### Phase 4 Tasks
- [ ] Choose backend technology
- [ ] Set up database
- [ ] Implement API endpoints
- [ ] Add authentication
- [ ] Deploy backend
- [ ] Migrate existing users
- [ ] Add monitoring
- [ ] Documentation

---

## Technical Considerations

### Storage Limits
- **localStorage**: ~5-10MB limit per origin
- **IndexedDB**: Much larger (50MB+), but more complex
- **Compression**: Consider LZ-string for text compression

### Data Structure Best Practices
- Keep data flat (avoid deep nesting)
- Use IDs as keys for O(1) lookups
- Separate frequently vs rarely accessed data
- Consider data normalization

### Performance Optimizations
- Batch localStorage writes
- Debounce auto-save
- Use Web Workers for heavy calculations
- Lazy load historical data

### Security Considerations
- Never store passwords in localStorage
- Sanitize imported data
- Use HTTPS for API calls
- Implement rate limiting
- Add CORS properly

### Privacy
- Allow data deletion
- Export user data (GDPR)
- Clear explanation of data usage
- Optional analytics

---

## Benefits of This Approach

1. **Immediate Value**: Users get persistence without waiting for backend
2. **Progressive Enhancement**: Backend adds sync, not required for basic functionality
3. **Offline First**: App works without internet connection
4. **Gradual Migration**: Can move to backend without breaking changes
5. **Learning Opportunity**: Understand data flow before adding complexity
6. **Reduced Costs**: No backend costs initially
7. **Faster Development**: Ship features quickly, add backend later

---

## Success Metrics

### Phase 1
- Users can see their progress across sessions
- Data persists after closing browser
- Statistics accurately reflect practice

### Phase 2
- Users can backup their progress
- Spaced repetition improves retention
- Offline functionality works smoothly

### Phase 3
- API design supports all features
- Sync works without data loss
- Good error handling

### Phase 4
- Multi-device sync works
- Authentication is secure
- Performance at scale

---

## Next Steps

1. Start with LocalStorageService implementation
2. Add basic session tracking
3. Update Dashboard with saved data
4. Gather user feedback
5. Iterate based on usage patterns

---

*Document created: 2025-08-18*
*Last updated: 2025-08-18*
*Status: Planning Phase*