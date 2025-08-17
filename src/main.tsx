import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Completely minimal test - no external dependencies
const MinimalApp = () => {
  console.log('MinimalApp rendering, React is:', React);
  console.log('useState available:', React.useState);
  
  const [count, setCount] = React.useState(0);
  
  React.useEffect(() => {
    console.log('useEffect working!');
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Minimal React Test</h1>
      <p>If you can see this, React is working!</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)} style={{ padding: '10px', marginRight: '10px' }}>
        Increment
      </button>
      <button onClick={() => setCount(0)} style={{ padding: '10px' }}>
        Reset
      </button>
    </div>
  );
};

console.log('About to render, React is:', React);
console.log('createRoot is:', createRoot);

const root = createRoot(document.getElementById("root")!);
root.render(<MinimalApp />);