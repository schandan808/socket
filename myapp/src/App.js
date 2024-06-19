import React, { useState, useEffect } from 'react';
import { socket ,emitFunction} from './socket';
import ConnectionManger from './socket/ConnectionManger';
function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [formData, setFormData] = useState()
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect)
    };
  }, []);


  useEffect(() => {
    emmitData()
  }, [socket]);

  const emmitData = ()=>{
    if (socket) {
      socket.emit('getList');
      socket.on('getList', (response) => {
        setFooEvents(response)
      });
    }
  }

  const handelChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    socket.emit('add',formData);
    emmitData()
    setFormData({
      title: '',
      description: '',
      file_name: ''
    });
  }

  return (
    <>
      <p>State: {'' + isConnected}</p>
      <ConnectionManger />
      <form onSubmit={handleSubmit}>
        <label>
          title
          <input type="text" name="title" required value={formData?.title} onChange={handelChange} />
        </label>
        <label>
          description
          <input type="text" name="description" required value={formData?.description} onChange={handelChange} />
        </label>
        <label>
          file
          <input type="text" value={formData?.file_name} required name="file_name" onChange={handelChange} />
        </label>
        <button type='submit'>submit</button>
      </form>
      <ul>
        <table>
          <thead>
            <tr>
              <th>title</th>
              <th>description</th>
              <th>file name</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {
              fooEvents && fooEvents.map((event, index) =>
                <tr key={index}>
                  <td>{event?.title} </td>
                  <td>{event?.description} </td>
                  <td>{event?.file_name} </td>
                  <td>{event?.completed.toString()} </td>
                </tr>
              )
            }
          </tbody>

        </table>

      </ul>
    </>
  );
}

export default App;
