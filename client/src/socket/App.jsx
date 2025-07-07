import React, { useState } from 'react';
import ChatRoom from './components/ChatRoom';

function App() {
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);

  return (
    <div style={{ padding: 20 }}>
      {!joined ? (
        <>
          <h2>Enter your name to join chat:</h2>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
          />
          <button onClick={() => username && setJoined(true)}>Join</button>
        </>
      ) : (
        <ChatRoom username={username} />
      )}
    </div>
  );
}

export default App;
