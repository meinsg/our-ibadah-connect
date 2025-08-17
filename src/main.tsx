import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Minimal test app to check if React works
const TestApp = () => {
  const [count, setCount] = React.useState(0);
  
  React.useEffect(() => {
    console.log('React is working!');
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>React Test</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
);