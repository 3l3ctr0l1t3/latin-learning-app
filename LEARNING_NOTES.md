# Learning Notes - Web Development Concepts 📖

This document explains web development concepts for developers coming from Java/backend backgrounds.

## 🎯 Core React Concepts

### Components
**What they are:** Reusable pieces of UI, like custom HTML elements.

**Java analogy:** Think of components as classes that render UI instead of processing data.

```javascript
// Component = Class that returns JSX (HTML-like syntax)
function Button() {
  return <button>Click me</button>;
}

// Use it like an HTML element
<Button />
```

### Props (Properties)
**What they are:** Data passed from parent to child components.

**Java analogy:** Like constructor parameters or method arguments.

```javascript
// Props are parameters
function Greeting({ name, age }) {  // Destructuring props
  return <h1>Hello {name}, you are {age}</h1>;
}

// Pass props like HTML attributes
<Greeting name="Juan" age={25} />
```

### State
**What it is:** Data that can change over time within a component.

**Java analogy:** Like instance variables that trigger UI updates when changed.

```javascript
const [count, setCount] = useState(0);  // State variable

// Reading state
console.log(count);  // 0

// Updating state (ALWAYS use the setter)
setCount(count + 1);  // Now count is 1
```

### Hooks
**What they are:** Functions that let you use React features (start with "use").

**Common hooks:**
- `useState`: Manage state
- `useEffect`: Side effects (API calls, timers)
- `useContext`: Share data across components
- `useMemo`: Cache expensive calculations
- `useCallback`: Cache functions

```javascript
// Hook usage MUST be at top level of component
function MyComponent() {
  const [data, setData] = useState();     // ✅ Correct
  
  if (condition) {
    const [bad, setBad] = useState();     // ❌ Wrong! Not top level
  }
}
```

## 📦 CSS Box Model

Every HTML element is a box with:

```
+---------------------------+
|         MARGIN           |  <- Space OUTSIDE (pushes others away)
| +---------------------+  |
| |      BORDER        |  |  <- The edge line
| | +---------------+  |  |
| | |   PADDING    |  |  |  <- Space INSIDE (between border & content)
| | | +---------+  |  |  |
| | | | CONTENT |  |  |  |  <- Your actual content
| | | +---------+  |  |  |
| | +---------------+  |  |
| +---------------------+  |
+---------------------------+
```

### MUI Spacing Shortcuts
```javascript
// These multiply by 8px (theme spacing)
p: 2    // padding: 16px (all sides)
px: 2   // padding-left: 16px, padding-right: 16px
py: 2   // padding-top: 16px, padding-bottom: 16px
pt: 2   // padding-top: 16px
pr: 2   // padding-right: 16px
pb: 2   // padding-bottom: 16px
pl: 2   // padding-left: 16px

// Same pattern for margin (m, mx, my, mt, mr, mb, ml)
```

## 🎨 Flexbox Layout

Flexbox arranges items in a row or column:

```javascript
// Container
display: 'flex'
flexDirection: 'row'    // Items side by side →
flexDirection: 'column' // Items stacked ↓

// Alignment
justifyContent: 'center'        // Main axis (horizontal if row)
alignItems: 'center'            // Cross axis (vertical if row)

// Common patterns
justifyContent: 'space-between' // Items at edges, space between
justifyContent: 'space-around'  // Equal space around items
alignItems: 'flex-start'        // Align to top/left
alignItems: 'flex-end'          // Align to bottom/right
```

Visual guide:
```
flexDirection: 'row'
+----------------------------------+
| [Item1] [Item2] [Item3]         |  <- justifyContent affects this →
+----------------------------------+
     ↑ alignItems affects this

flexDirection: 'column'  
+----------+
| [Item1]  | ← alignItems affects this
| [Item2]  |
| [Item3]  |
|          | ↑ justifyContent affects this
+----------+
```

## 🔄 Component Lifecycle

### Mounting (Component appears)
```javascript
useEffect(() => {
  // Runs AFTER component appears
  console.log('Component mounted!');
  
  return () => {
    // Cleanup when component disappears
    console.log('Component unmounting!');
  };
}, []);  // Empty array = run once
```

### Updating (State/props change)
```javascript
useEffect(() => {
  // Runs when 'count' changes
  console.log('Count changed to:', count);
}, [count]);  // Dependencies array
```

## 🎯 Event Handling

### Click Events
```javascript
const handleClick = (event) => {
  console.log('Clicked!', event);
};

<button onClick={handleClick}>Click me</button>

// Or inline
<button onClick={() => console.log('Clicked!')}>Click me</button>
```

### Form Events
```javascript
const handleChange = (event) => {
  const value = event.target.value;  // Get input value
  setState(value);
};

<input onChange={handleChange} value={state} />
```

## 🔀 Conditional Rendering

### Pattern 1: && (Show if true)
```javascript
{isLoggedIn && <WelcomeMessage />}
// Shows WelcomeMessage only if isLoggedIn is true
```

### Pattern 2: Ternary (If-else)
```javascript
{isLoggedIn ? <WelcomeMessage /> : <LoginForm />}
// Shows one or the other
```

### Pattern 3: Early return
```javascript
if (loading) return <Spinner />;
if (error) return <ErrorMessage />;
return <Content />;
```

## 📝 Array Operations

### Mapping (Transform each item)
```javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);  // [2, 4, 6]

// In JSX
{words.map(word => (
  <WordCard key={word.id} word={word} />
))}
```

### Filtering (Keep some items)
```javascript
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(n => n % 2 === 0);  // [2, 4]
```

### Finding (Get one item)
```javascript
const users = [{id: 1, name: 'Ana'}, {id: 2, name: 'Juan'}];
const juan = users.find(u => u.name === 'Juan');
```

## 🏗️ Component Patterns

### Controlled Components
Parent controls the state:
```javascript
// Parent
const [value, setValue] = useState('');
<ChildInput value={value} onChange={setValue} />

// Child (controlled)
function ChildInput({ value, onChange }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}
```

### Uncontrolled Components
Component manages its own state:
```javascript
function UncontrolledInput() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}
```

## 🎨 TypeScript Basics

### Interfaces (Object shapes)
```typescript
interface User {
  id: number;
  name: string;
  email?: string;  // Optional with ?
}
```

### Type Aliases
```typescript
type Status = 'pending' | 'active' | 'complete';  // Union type
type ID = string | number;  // Can be either
```

### Generics (Like Java generics)
```typescript
function identity<T>(value: T): T {
  return value;
}

interface Box<T> {
  content: T;
}
```

## 📦 Import/Export

### Named Exports
```javascript
// Export
export const PI = 3.14;
export function calculate() {}

// Import
import { PI, calculate } from './math';
```

### Default Export
```javascript
// Export (one per file)
export default function Component() {}

// Import (can rename)
import MyComponent from './Component';
```

## 🔧 Common Patterns

### Spread Operator (...)
```javascript
// Copy array
const copy = [...originalArray];

// Copy object
const copy = {...originalObject};

// Merge
const merged = {...obj1, ...obj2};

// Pass all props
<Component {...props} />
```

### Destructuring
```javascript
// Object destructuring
const {name, age} = person;

// Array destructuring  
const [first, second] = array;

// In function parameters
function greet({name, age}) {
  console.log(`${name} is ${age}`);
}
```

### Template Literals
```javascript
const name = 'Juan';
const greeting = `Hello, ${name}!`;  // "Hello, Juan!"
```

## 🎯 MUI Component Props

### Common Props
```javascript
// Sizing
fullWidth        // Take full width of container
size="small"     // Size variants: small, medium, large

// State
disabled         // Disable interaction
loading          // Show loading state

// Appearance
variant="contained"  // Button styles: contained, outlined, text
color="primary"      // Theme colors: primary, secondary, error, etc.

// Layout
sx={{}}          // Custom styles
component="div"  // Change underlying HTML element
```

## 🚨 Common Mistakes to Avoid

### ❌ Mutating State Directly
```javascript
// Wrong
state.push(newItem);
setState(state);

// Correct
setState([...state, newItem]);
```

### ❌ Missing Keys in Lists
```javascript
// Wrong
{items.map(item => <Item />)}

// Correct
{items.map(item => <Item key={item.id} />)}
```

### ❌ Using Index as Key (with reorderable lists)
```javascript
// Avoid if list can be reordered
{items.map((item, index) => <Item key={index} />)}

// Better
{items.map(item => <Item key={item.id} />)}
```

### ❌ Forgetting Dependencies
```javascript
// Wrong - missing dependency
useEffect(() => {
  console.log(count);
}, []);  // Should include count

// Correct
useEffect(() => {
  console.log(count);
}, [count]);
```

## 📚 Glossary

- **SPA**: Single Page Application - One HTML page, JavaScript changes content
- **JSX**: JavaScript XML - HTML-like syntax in JavaScript
- **Props**: Properties passed to components
- **State**: Data that changes over time
- **Hook**: Function that uses React features
- **Component**: Reusable piece of UI
- **Render**: Process of creating UI from components
- **Mount**: When component appears on page
- **Unmount**: When component is removed
- **Side Effect**: Operations like API calls, timers
- **Callback**: Function passed to be called later
- **Event Handler**: Function that responds to user actions
- **Controlled Component**: Parent controls the state
- **Lifting State Up**: Moving state to parent component
- **Props Drilling**: Passing props through many levels
- **Context**: Way to share data without passing props

---

Remember: The best way to learn is by building! Start small, experiment, and gradually increase complexity. 🚀