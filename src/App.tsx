import * as React from 'react';

console.log('App.tsx React object:', React);
console.log('App.tsx React.version:', React.version);
console.log('App.tsx React.useState:', React.useState);

function App() {
  console.log('Inside App component');
  
  // Test useState directly
  const [test, setTest] = React.useState('test');
  
  return (
    <div style={{ padding: '20px', fontSize: '18px' }}>
      <h1>React Debug Test</h1>
      <p>React Version: {React.version}</p>
      <p>Test State: {test}</p>
      <button onClick={() => setTest('clicked')}>
        Test useState
      </button>
    </div>
  );
}

export default App;