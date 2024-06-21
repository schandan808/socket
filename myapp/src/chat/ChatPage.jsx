import React, { useEffect, useState } from 'react';
import { socket } from '../socket';
// import './ChatPage.css'; // Assuming you have a CSS file for styling

export default function ChatPage() {
  const [formData, setFormData] = useState({ name: '', room: '', message: '' });
  const [messages, setMessages] = useState([]);
  const [roomJoined, setRoomJoined] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    socket.emit('joinRoom', { room: formData.room, name: formData.name });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (roomJoined) {
      socket.emit('sendMessage', { room: formData.room, message: formData.message, name: formData.name });
      setFormData({ ...formData, message: '' }); // Clear message input
    }
  };

  useEffect(() => {
    socket.on('joinRoom', (res) => {
      setRoomJoined(true);
      console.log(res,'===============')
      setMessages((prevMessages) => [...prevMessages, `${res.name} joined room: ${res.room}`]);
    });

    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, { name: data.name, message: data.message }]);
    });

    socket.on('error', (error) => {
      setMessages((prevMessages) => [...prevMessages, { name: 'System', message: `Error: ${error.message}` }]);
    });

    return () => {
      socket.off('joinRoom');
      socket.off('message');
      socket.off('error');
    };
  }, []);

  return (
    <div className="chat-container dark-mode">
      {!roomJoined ? (
        <form onSubmit={handleJoinRoom} className="join-room-form">
          <label>Name</label>
          <input type='text' name='name' value={formData.name} onChange={handleChange} required />
          <label>Room</label>
          <input type='text' name='room' value={formData.room} onChange={handleChange} required />
          <button type='submit'>Join Room</button>
        </form>
      ) : (
        <div className="chat-room">
          <h2>Room: {formData.room}</h2>
          <div className="chat-messages">
            <ul>
              {messages.map((msg, index) => (
                <li key={index} className={msg.name === formData.name ? 'message-sent' : 'message-received'}>
                  <strong>{msg.name}</strong>: {msg.message}
                </li>
              ))}
            </ul>
          </div>
          <form onSubmit={handleSendMessage} className="send-message-form">
            <input type='text' name='message' required value={formData.message} onChange={handleChange} />
            <button type='submit'>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}
