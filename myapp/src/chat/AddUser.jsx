import React, { useEffect, useState } from 'react'
import { socket } from '../socket';
import { Link } from 'react-router-dom';

export default function AddUser() {
    const [formData , setFormData] = useState()
    const [nameList, setNameList] = useState()
    const handleChange = (e)=>{

        const {name , value}= e.target;
        console.log(name, value)
        setFormData({...formData ,[name]:value})
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
     
    }

    useEffect(() => {
       
    
        socket.on('connect');
        socket.on('disconnect');
        socket.on('error');
    
        return () => {
          socket.off('connect');
          socket.off('disconnect');
          socket.off('error');
        };
      }, [socket]);

      useEffect(() => {
        const handleGetList = (response) => {
          console.log("response", response);
          setNameList(response);
        };
    
        socket.on('list', handleGetList);
    
        // Emit the getList event initially to load the list
        socket.emit('list',handleGetList);
    
        return () => {
          socket.off('list', handleGetList);
        };
      }, [socket]);

  return (
    <>
    <form  onSubmit={handleSubmit}>
    <label>Name</label> 
    <input type='text' name="name" onChange={handleChange} />
    <button type='submit'>Sumbit</button>
    </form>

    <ul>
        {nameList && nameList?.map((e,i)=>
        <li key={i} >{e?.name}</li>
        )}
    </ul>
        <Link to={'/chat'}>chat</Link>
    </>
  )
}
