import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import ConnectionManger from './ConnectionManger';

const SocketComponent = () => {
  
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file_name: ''
  });
  const [fooEvents, setFooEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const handleError = (error) => {
      console.error("Error received from server:", error.message);
      setError(error.message);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('error', handleError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('error', handleError);
    };
  }, [socket]);

  useEffect(() => {
    const handleGetList = (response) => {
      console.log("response", response);
      setFooEvents(response);
    };

    socket.on('getList', handleGetList);

    // Emit the getList event initially to load the list
    socket.emit('getList');

    return () => {
      socket.off('getList', handleGetList);
    };
  }, [socket]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    socket.emit('add', formData);
    // Emit getList to update the list after adding new data
    socket.emit('getList');
    setFormData({
      title: '',
      description: '',
      file_name: ''
    });
  };

  return (
    <>
      <p>State: {'' + isConnected}</p>
      <ConnectionManger />
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="horizontal-form">
  <div className="form-group">
    <label htmlFor="title">Title</label>
    <input
      type="text"
      id="title"
      name="title"
      required
      value={formData?.title}
      onChange={handleChange}
    />
  </div>
  <div className="form-group">
    <label htmlFor="description">Description</label>
    <input
      type="text"
      id="description"
      name="description"
      required
      value={formData?.description}
      onChange={handleChange}
    />
  </div>
  <div className="form-group">
    <label htmlFor="file_name">File</label>
    <input
      type="text"
      id="file_name"
      name="file_name"
      required
      value={formData?.file_name}
      onChange={handleChange}
    />
  </div>
  <button type="submit">Submit</button>
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
};

export default SocketComponent;
