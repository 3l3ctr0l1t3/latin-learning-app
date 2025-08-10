# Color Guide - Latin Learning App

## Theme Colors & Usage Guidelines

### Primary Palette
- **Purple (#BB86FC)** - Primary brand color
  - Use for: Primary buttons, important actions, active states, links
  - Examples: "Start Session" button, selected tabs, progress indicators

- **Light Purple (#E7B9FF)** - Primary light variant
  - Use for: Hover states on purple elements, highlights

- **Dark Purple (#9965D4)** - Primary dark variant  
  - Use for: Pressed states, shadows on purple elements

### Secondary Palette
- **Cyan (#03DAC6)** - Secondary accent color
  - Use for: Secondary actions, success indicators, chips (sparingly)
  - Examples: Drill type chips, secondary buttons
  - ⚠️ **Avoid using for headers or main text**

### Text Colors
- **Primary Text (rgba(255,255,255,0.87))** - Main text
  - Use for: Headers, body text, important labels
  - This is the default for all text

- **Secondary Text (rgba(255,255,255,0.60))** - Muted text
  - Use for: Descriptions, helper text, less important information
  - Examples: Card descriptions, hints

- **Disabled Text (rgba(255,255,255,0.38))** - Disabled states
  - Use for: Disabled buttons, unavailable options

### Semantic Colors
- **Error (#CF6679)** - Soft red for errors
  - Use for: Error messages, delete actions, warnings

- **Warning (#FF9800)** - Orange for warnings
  - Use for: Warning messages, caution states

- **Success (#4CAF50)** - Green for success
  - Use for: Success messages, completed states
  - ⚠️ **Not for headers - too similar to standard green**

- **Info (#2196F3)** - Blue for information
  - Use for: Info messages, tips

### Background Colors
- **Default (#121212)** - Main background
  - Use for: Page background, app background

- **Paper (#1E1E1E)** - Elevated surfaces
  - Use for: Cards, dialogs, dropdowns

### Component-Specific Guidelines

#### Headers & Titles
✅ **DO:**
- Use `text.primary` (white) for most headers
- Use `primary.main` (purple) for emphasis or branding
- Add `fontWeight: 'medium'` or `'bold'` for hierarchy

❌ **DON'T:**
- Use `secondary.main` (cyan) for headers - too bright
- Use `success.main` (green) for headers - off-brand

#### Buttons
✅ **DO:**
- Primary actions: `variant="contained" color="primary"`
- Secondary actions: `variant="outlined" color="primary"`
- Dangerous actions: `variant="contained" color="error"`

❌ **DON'T:**
- Use cyan for primary buttons
- Mix too many colors on one screen

#### Chips & Tags
✅ **DO:**
- Declension colors (as defined in components)
- Status indicators can use semantic colors
- Selected states use primary purple

❌ **DON'T:**
- Use random colors
- Make everything colorful - maintain hierarchy

### Declension Colors (Special Case)
These are specifically for Latin word categorization:
- **1st Declension** - Purple variants
- **2nd Declension** - Blue variants  
- **3rd Declension** - Green variants
- **4th Declension** - Orange variants
- **5th Declension** - Red variants

### Examples of Good Color Usage

```tsx
// Good header
<Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'medium' }}>
  Section Title
</Typography>

// Good emphasis header
<Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
  Welcome!
</Typography>

// Good description
<Typography variant="body2" sx={{ color: 'text.secondary' }}>
  This is helper text with less emphasis
</Typography>

// Good button
<Button variant="contained" color="primary">
  Primary Action
</Button>
```

### Examples to Avoid

```tsx
// Bad - cyan header (too bright, not hierarchical)
<Typography variant="h6" sx={{ color: 'secondary.main' }}>
  Section Title
</Typography>

// Bad - green header (off-brand)
<Typography variant="h6" sx={{ color: 'success.main' }}>
  Section Title  
</Typography>

// Bad - too many colors
<Box>
  <Typography color="primary">Title</Typography>
  <Typography color="secondary">Subtitle</Typography>
  <Typography color="success">Description</Typography>
  <Typography color="error">More text</Typography>
</Box>
```

## Summary

1. **White is your friend** - Use `text.primary` for most text
2. **Purple for branding** - Use `primary.main` for key brand moments
3. **Cyan sparingly** - Use `secondary.main` only for small accents
4. **Maintain hierarchy** - Don't make everything colorful
5. **Consistency matters** - Similar elements should use similar colors