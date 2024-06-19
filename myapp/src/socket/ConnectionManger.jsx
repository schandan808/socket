import React from 'react'
import {socket} from '../socket'

function ConnectionManger() {
    function connect() {
        socket.connect();
      }
    
      function disconnect() {
        socket.disconnect();
      }
  return (
   <>
   <button onClick={ connect }>Connect</button>
   <button onClick={ disconnect }>Disconnect</button>
   </>
  )
}

export default ConnectionManger