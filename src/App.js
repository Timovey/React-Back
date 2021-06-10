import React, { useReducer } from 'react';
import JoinBlock from './components/joinBlock';
import Chat from './components/Chat';
import socket from './socket';
import reducer from './reducer';

function App() {
  const [state, dispatch] = useReducer(reducer, {
    isAuth: false,
    roomId: null,
    userName: null
  });  

  const onLogin = (obj) => {
    dispatch({
        type: 'IS_AUTH',
        payload: obj
      });
      socket.emit('ROOM:JOIN', obj);
  }
  React.useEffect(() => {
    socket.on('ROOM:JOINED', users => {
      console.log('Новый пользователь', users);
    });
    
  }, []);
  
  window.socket = socket;
  //console.log(state);
  return (
    <div>
      {!state.isAuth ? <JoinBlock onLogin={onLogin}></JoinBlock> : <Chat></Chat>}
    </div>
    
  );
}

export default App;
