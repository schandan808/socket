import React, { useEffect, useState } from 'react';
import { socket } from '../socket';

export default function ChatPage() {
  const [formData, setFormData] = useState({ room: '', message: '' });
  const [messages, setMessages] = useState([]);
  const [roomJoined, setRoomJoined] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    socket.emit('joinRoom', { room: formData.room });

  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (roomJoined) {
      socket.emit('sendMessage', { room: formData.room, message: formData.message });
      setFormData({ ...formData, message: '' }); // Clear message input
    }
  };

  useEffect(() => {
    socket.on('joinRoom', (res) => {
      setRoomJoined(true);
      setMessages((prevMessages) => [...prevMessages, `Joined room: ${res.room}`]);
    });

    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    socket.on('error', (error) => {
      setMessages((prevMessages) => [...prevMessages, `Error: ${error.message}`]);
    });

    return () => {
      socket.off('joinRoom');
      socket.off('message');
      socket.off('error');
    };
  }, []);

  return (
    <>
      {!roomJoined ? (
        <form onSubmit={handleJoinRoom}>
          <label>Room</label>
          <input type='text' name='room' value={formData.room} onChange={handleChange} />
          <button type='submit'>Join Room</button>
        </form>
      ) : (
        <>
          <div>
            <h2>Room: {formData.room}</h2>
            <form onSubmit={handleSendMessage}>
              <label>Message</label>
              <input type='text' name='message' required value={formData.message} onChange={handleChange} />
              <button type='submit'>Send</button>
            </form>
          </div>
          <div>
            <h3>Messages</h3>
            <ul>
              {messages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}

