import React, { useState, useEffect } from 'react';
import SocketComponent from './socket/SocketComponent';
import Header from './themes/Header';
import { Routes, Route } from 'react-router-dom'
import AddUser from './chat/AddUser';
import ChatPage from './chat/ChatPage';

function App() {

  return (
    <>
      {/* < Header /> */}
      {/* <SocketComponent/> */}
      <Routes >
        <Route path='/' element={<AddUser />} />
        <Route path='/chat' element={<ChatPage />} />
      </Routes>
    </>
  );
}

export default App;
