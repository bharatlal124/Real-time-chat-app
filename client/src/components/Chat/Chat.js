import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import axios from "axios"; // ✅ Import axios

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

// 👇 Replace with your local or deployed backend URL
// const ENDPOINT = 'http://localhost:5000';
const ENDPOINT = 'https://real-time-chat-app-cisd.onrender.com/';

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // 🔁 On mount: get name & room from query params, connect to socket, fetch messages
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);
    setName(name);
    setRoom(room);

    // ✅ Emit join event
    socket.emit('join', { name, room }, (error) => {
      if (error) alert(error);
    });

    // ✅ Fetch previous messages from DB
    axios.get(`${ENDPOINT}/messages/${room}`)
      .then((res) => {
        const formattedMessages = res.data.map((msg) => ({
          user: msg.user,
          text: msg.text,
        }));
        setMessages(formattedMessages); // Set previous messages
      })
      .catch((err) => {
        console.error("Failed to load messages:", err);
      });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [location.search]);

  // 🔁 Real-time message receiving
  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });

    return () => {
      socket.off('message');
      socket.off('roomData');
    };
  }, []);

  // ✅ Send message to server
  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
