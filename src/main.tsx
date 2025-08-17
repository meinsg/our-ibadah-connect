console.log('=== MAIN.TSX LOADED - CACHE BUST TEST ===');
console.log('Timestamp:', Date.now());

document.getElementById("root")!.innerHTML = `
  <div style="padding: 20px; font-family: Arial;">
    <h1 style="color: red;">CACHE BUST TEST - ${Date.now()}</h1>
    <p>If you see this, main.tsx is loading correctly.</p>
    <p>If you still see AuthProvider errors, there's a severe caching issue.</p>
  </div>
`;