import React, { useEffect, useState } from 'react';
import socket from '../socket/socket';

export default function ChatRoom({ username }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    socket.emit('user_join', username);

    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('typing_users', (typingList) => {
      setTypingUsers(typingList.filter(name => name !== username));
    });

    socket.on('user_list', (users) => {
      setUserList(users);
    });

    return () => {
      socket.off('receive_message');
      socket.off('typing_users');
      socket.off('user_list');
    };
  }, [username]);

  const handleSend = () => {
    if (message.trim()) {
      socket.emit('send_message', { message });
      setMessage('');
    }
  };

  const handleTyping = () => {
    socket.emit('typing', message.length > 0);
  };

  return (
    <div>
      <h2>Welcome, {username} 👋</h2>
      <h4>Online Users:</h4>
      <ul>
        {userList.map((u) => (
          <li key={u.id}>{u.username}</li>
        ))}
      </ul>

      <div style={{ border: '1px solid gray', padding: 10, height: 200, overflowY: 'scroll' }}>
        {messages.map((msg, idx) => (
          <p key={idx}><strong>{msg.sender}:</strong> {msg.message}</p>
        ))}
      </div>

      {typingUsers.length > 0 && <em>{typingUsers.join(', ')} typing...</em>}

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleTyping}
        placeholder="Type a message"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
