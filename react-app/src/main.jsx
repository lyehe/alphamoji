/**
 * main.jsx - Application Entry Point
 *
 * WHAT: This is where React connects to the HTML and starts rendering
 *
 * WHY: Every React app needs an entry point that:
 * - Finds the root HTML element
 * - Creates a React root
 * - Renders the App component
 *
 * LEARNING NOTES:
 * - This file is loaded first (configured in index.html)
 * - It "mounts" React into the DOM
 * - Usually you don't need to modify this file much
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/**
 * LEARNING: How React Apps Start
 *
 * Step 1: Get the root element from HTML
 * - In index.html, there's a <div id="root"></div>
 * - This is where React will render everything
 * - document.getElementById('root') finds that div
 *
 * Step 2: Create a React root
 * - createRoot() creates a React 18 root
 * - This is the new way (React 18+)
 * - Old way (React 17): ReactDOM.render()
 *
 * Step 3: Render the app
 * - .render() tells React what to display
 * - We render <App /> which is our root component
 * - Everything inside App will appear in the page
 */

createRoot(document.getElementById('root')).render(
  /**
   * LEARNING: StrictMode
   *
   * What is StrictMode?
   * - A development tool that checks for problems
   * - Doesn't render any visible UI
   * - Only runs in development (removed in production build)
   *
   * What does it do?
   * - Identifies components with unsafe lifecycles
   * - Warns about legacy APIs
   * - Detects unexpected side effects
   * - Double-invokes some functions (to find bugs)
   *
   * Why use it?
   * - Helps you write better React code
   * - Catches bugs early
   * - Prepares you for future React versions
   * - Free bug detection!
   *
   * Should I remove it?
   * - No! Keep it for development
   * - It automatically disappears in production
   * - The warnings help you write better code
   */
  <StrictMode>
    <App />
  </StrictMode>
);

/**
 * LEARNING SUMMARY:
 *
 * Key Concepts:
 *
 * 1. **Entry Point**
 *    - Every app needs a starting point
 *    - main.jsx (or index.js) is that point
 *    - Connects React to HTML
 *
 * 2. **ReactDOM**
 *    - Bridge between React and the browser DOM
 *    - createRoot: New React 18+ API
 *    - render: Displays components on page
 *
 * 3. **Root Element**
 *    - HTML has <div id="root"></div>
 *    - React renders everything inside this div
 *    - You can change "root" to any id
 *
 * 4. **StrictMode**
 *    - Development helper
 *    - Finds common mistakes
 *    - Only in development
 *
 * The Flow:
 * 1. Browser loads index.html
 * 2. index.html loads main.jsx
 * 3. main.jsx finds <div id="root">
 * 4. main.jsx renders <App /> into that div
 * 5. App renders all other components
 * 6. User sees the app!
 *
 * React 18 vs React 17:
 *
 * React 18 (current, what we use):
 * ```js
 * import { createRoot } from 'react-dom/client';
 * createRoot(element).render(<App />);
 * ```
 *
 * React 17 (old way):
 * ```js
 * import ReactDOM from 'react-dom';
 * ReactDOM.render(<App />, element);
 * ```
 *
 * Why did it change?
 * - React 18 added concurrent features
 * - New API supports these features
 * - Old API still works but is deprecated
 *
 * Common Questions:
 *
 * Q: Can I have multiple roots?
 * A: Yes! You can create multiple React apps on one page
 *
 * Q: What if root element doesn't exist?
 * A: You'll get an error. Make sure index.html has <div id="root">
 *
 * Q: Do I need to modify this file?
 * A: Rarely. Maybe to add global providers or dev tools
 *
 * Q: What's the difference between main.jsx and App.jsx?
 * A: main.jsx mounts React into DOM
 *    App.jsx is your root React component
 *
 * Try This:
 * - Change id="root" to id="app" (update both HTML and here)
 * - Temporarily remove StrictMode to see the difference
 * - Add console.log to see when this file runs
 * - Add React DevTools to see component tree
 *
 * File Naming:
 * - main.jsx or index.jsx (entry point)
 * - .jsx extension for files with JSX
 * - .js extension works too (but .jsx is clearer)
 *
 * Debugging Tips:
 * - Blank screen? Check browser console for errors
 * - Error about 'root'? Check index.html has <div id="root">
 * - StrictMode warnings? Read them carefully, they help!
 * - Use React DevTools browser extension
 */
