import axios from "axios";

import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

// const ENDPOINT = 'https://project-chat-application.herokuapp.com/';
// const ENDPOINT = 'ws://localhost:5000/';
const ENDPOINT = 'https://real-time-chat-app-cisd.onrender.com/';

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    setRoom(room);
    setName(name);
  
    // Connect to socket
    socket = io(ENDPOINT);
  
    // Join room
    socket.emit("join", { name, room }, (error) => {
      if (error) alert(error);
    });
  
    // Fetch chat history
    axios.get(`http://localhost:5000/messages/${room}`)
      .then(res => {
        const historyMessages = res.data.map(msg => ({
          user: msg.user,
          text: msg.text
        }));
        setMessages(historyMessages);
      })
      .catch(err => console.error("Error loading history", err));
  }, [location.search]);
  
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

export default Chat;
