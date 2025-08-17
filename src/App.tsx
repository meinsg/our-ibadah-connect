import React from 'react';

// Test React availability step by step
console.log('=== REACT DEBUG INFO ===');
console.log('React object:', React);
console.log('React.useState:', React?.useState);
console.log('React.useEffect:', React?.useEffect);
console.log('========================');

// Minimal test component
const TestComponent = () => {
  console.log('TestComponent rendering...');
  
  try {
    const [count, setCount] = React.useState(0);
    console.log('useState worked, count:', count);
    
    React.useEffect(() => {
      console.log('useEffect worked!');
    }, []);
    
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
        <h1>React Test</h1>
        <p>Count: {count}</p>
        <button 
          onClick={() => setCount(c => c + 1)}
          style={{ padding: '10px 20px', margin: '10px', fontSize: '16px' }}
        >
          Increment ({count})
        </button>
        <p style={{ color: 'green', marginTop: '20px' }}>
          ✅ React hooks are working!
        </p>
      </div>
    );
  } catch (error) {
    console.error('Error in TestComponent:', error);
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        <h1>React Error</h1>
        <p>Error: {error?.message}</p>
        <pre style={{ background: '#f5f5f5', padding: '10px', textAlign: 'left' }}>
          {error?.stack}
        </pre>
      </div>
    );
  }
};

const App = () => {
  console.log('App component rendering...');
  return <TestComponent />;
};

export default App;
