# Learning Guide: Alphamoji React Conversion

## 🎓 Welcome!

This project has been converted from vanilla JavaScript to React as a **learning project**. Every component, hook, and concept is thoroughly documented to help you understand modern React development.

## 📚 React Concepts Used in This Project

### 1. **Components** (Building Blocks of React)

Components are reusable pieces of UI. Think of them like LEGO blocks - you build complex UIs by combining simple components.

**Example in this project:**
- `GameContainer.jsx` - The main game area
- `LetterDisplay.jsx` - Shows the current letter
- `EmojiCard.jsx` - Displays the emoji

**Key Learning:**
- Components are functions that return JSX (HTML-like syntax)
- Components can accept `props` (properties) to customize their behavior
- Components can manage their own state using hooks

---

### 2. **JSX** (JavaScript + HTML)

JSX lets you write HTML-like code inside JavaScript. It makes UI code more readable.

```jsx
// Instead of: document.getElementById('letter').textContent = 'A'
// You write:
<div id="letter">A</div>
```

**Key Learning:**
- JSX looks like HTML but it's actually JavaScript
- Use `{}` to embed JavaScript expressions
- Use `className` instead of `class` (because `class` is a JavaScript keyword)

---

### 3. **Hooks** (React's Superpowers)

Hooks are special functions that let you use React features. They always start with `use`.

#### **useState** - Remember Values
```jsx
const [count, setCount] = useState(0);
// count: the current value
// setCount: function to update the value
// 0: initial value
```

#### **useEffect** - Run Code at Specific Times
```jsx
useEffect(() => {
  // This runs after the component renders
  console.log('Component mounted!');
}, []); // Empty array = run once when component appears
```

#### **useContext** - Share Data Across Components
```jsx
const gameState = useContext(GameContext);
// Access shared data without passing props through every component
```

#### **Custom Hooks** - Your Own Hooks
We created custom hooks like `useTimer`, `useKeyboard`, `useGameState`
- They're just regular functions that use other hooks
- They help organize and reuse logic

---

### 4. **Context API** (Global State Management)

Instead of passing props through many components, Context lets you share data globally.

**How it works:**
1. Create a Context: `const GameContext = createContext()`
2. Provide data: `<GameContext.Provider value={data}>`
3. Use data anywhere: `const data = useContext(GameContext)`

**In this project:**
- `GameContext.jsx` manages game state (letters, history, settings)
- Any component can access game state without prop drilling

---

### 5. **Props** (Component Properties)

Props are how you pass data from parent to child components.

```jsx
// Parent component
<LetterDisplay letter="A" emoji="🍎" />

// Child component receives props
function LetterDisplay({ letter, emoji }) {
  return <div>{letter} {emoji}</div>
}
```

---

### 6. **Event Handling**

React handles events similarly to HTML, but with camelCase names.

```jsx
// HTML: onclick="handleClick()"
// React: onClick={handleClick}

<button onClick={handleClick}>Click me</button>
```

---

### 7. **Conditional Rendering**

Show different UI based on conditions.

```jsx
// Option 1: Ternary operator
{isLoading ? <Spinner /> : <GameContent />}

// Option 2: Logical AND
{error && <ErrorMessage />}

// Option 3: If/else with early return
if (isLoading) return <Spinner />;
return <GameContent />;
```

---

## 🗂️ Project Structure Explained

```
react-app/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Game/            # Game-specific components
│   │   │   ├── GameContainer.jsx      # Main game wrapper
│   │   │   ├── LetterDisplay.jsx      # Shows current letter
│   │   │   ├── EmojiCard.jsx          # Shows emoji card
│   │   │   └── MobileKeyboard.jsx     # Mobile virtual keyboard
│   │   ├── Modals/          # Modal/popup components
│   │   │   ├── HistoryModal.jsx       # Shows game history
│   │   │   └── StatsModal.jsx         # Shows statistics
│   │   └── UI/              # General UI components
│   │       └── ControlButtons.jsx     # Game control buttons
│   ├── hooks/               # Custom React hooks (reusable logic)
│   │   ├── useGameState.js  # Manages game state and logic
│   │   ├── useTimer.js      # Tracks time for each letter
│   │   ├── useKeyboard.js   # Handles keyboard input
│   │   └── useAudio.js      # Manages sound effects and music
│   ├── context/             # Global state management
│   │   └── GameContext.jsx  # Provides game state to all components
│   ├── services/            # External API communication
│   │   └── api.js           # Functions to call Flask backend
│   ├── styles/              # CSS styling
│   │   └── *.module.css     # Component-specific styles
│   ├── utils/               # Helper functions
│   │   └── helpers.js       # Utility functions
│   ├── App.jsx              # Root component
│   └── main.jsx             # Entry point (renders App)
└── index.html               # HTML template
```

---

## 🔄 Data Flow in This App

```
1. User presses a key
   ↓
2. useKeyboard hook captures the key
   ↓
3. GameContext checks if key is correct
   ↓
4. If correct:
   - useTimer calculates time taken
   - API service sends data to Flask backend
   - GameContext updates state
   ↓
5. Components re-render with new data
   ↓
6. User sees updated UI
```

---

## 🎯 Key Learning Files (Read in This Order)

### For Beginners:
1. **src/main.jsx** - See how React starts
2. **src/App.jsx** - Understand the root component
3. **src/components/Game/LetterDisplay.jsx** - Simple component with props
4. **src/hooks/useTimer.js** - Simple custom hook
5. **src/context/GameContext.jsx** - State management

### For Intermediate:
6. **src/hooks/useGameState.js** - Complex state logic
7. **src/hooks/useKeyboard.js** - Event handling
8. **src/services/api.js** - API communication
9. **src/components/Game/GameContainer.jsx** - Combining everything

---

## 💡 Common React Patterns in This Project

### 1. **Lifting State Up**
When multiple components need the same data, move the state to their common parent.

### 2. **Composition**
Building complex UIs by combining simple components.

### 3. **Custom Hooks**
Extracting component logic into reusable functions.

### 4. **Separation of Concerns**
- Components handle UI
- Hooks handle logic
- Services handle API calls
- Context handles global state

---

## 🚀 Try These Exercises

1. **Easy**: Add a new button that changes the emoji size
2. **Medium**: Create a dark mode toggle using Context
3. **Hard**: Add a difficulty selector that changes letter frequency

---

## 📖 Additional Resources

- [React Official Tutorial](https://react.dev/learn)
- [React Hooks Documentation](https://react.dev/reference/react)
- [Vite Documentation](https://vitejs.dev/guide/)
- [CSS Modules Guide](https://github.com/css-modules/css-modules)

---

## 🐛 Understanding Component Lifecycle

```
1. Component is created (Mounting)
   - Constructor/Initial state
   - First render
   - useEffect runs

2. Component updates (Updating)
   - State or props change
   - Re-render
   - useEffect runs (if dependencies changed)

3. Component is removed (Unmounting)
   - Cleanup functions in useEffect run
```

---

## 🔍 Debugging Tips

1. **Use React DevTools** - Browser extension to inspect React components
2. **console.log** - Add logs in components to see when they render
3. **useEffect dependencies** - Common source of bugs
4. **Props vs State** - Props come from parent, state is local

---

## ✨ Best Practices Used in This Project

1. **Component names start with capital letters** - `GameContainer` not `gameContainer`
2. **One component per file** - Easy to find and maintain
3. **Descriptive variable names** - `currentLetter` not `cl`
4. **Comments explain WHY, not WHAT** - Code shows what, comments explain why
5. **Consistent file structure** - Similar files in same folders
6. **Props destructuring** - `function Letter({ text })` instead of `function Letter(props)`

---

## 🎨 Styling Approach: CSS Modules

We use CSS Modules to scope styles to components:

```jsx
// LetterDisplay.module.css
.letter {
  font-size: 48px;
}

// LetterDisplay.jsx
import styles from './LetterDisplay.module.css';

function LetterDisplay() {
  return <div className={styles.letter}>A</div>;
}
```

**Benefits:**
- Styles are scoped to the component (no global conflicts)
- Still write regular CSS (easy to learn)
- Automatic unique class names

---

Happy Learning! 🚀
Remember: The best way to learn is by experimenting. Try breaking things and fixing them!
