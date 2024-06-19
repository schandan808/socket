import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketComponent = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = io('http://192.168.92.1:8080'); // Replace with your server URL
    setSocket(socket);
    console.log(('===========hereeeeee',socket))

    socket.on('getList', (data) => {
        console.log("hereeeeeeee0",data)
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = (message) => {
    if (socket) {
      socket.emit('chat-message', message);
    }
  };

  return (
    <div>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
      <input type="text" onKeyPress={(event) => {
        if (event.key === 'Enter') {
          sendMessage(event.target.value);
          event.target.value = '';
        }
      }} />
    </div>
  );
};

export default SocketComponent;
