import React from 'react';

function App() {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      background: '#0f172a', 
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', margin: '0' }}>NexCert Live</h1>
      <p style={{ color: '#94a3b8' }}>If you see this, the connection is working!</p>
    </div>
  );
}

export default App;