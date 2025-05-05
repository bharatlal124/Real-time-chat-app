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
const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
// const ENDPOINT = 'https://real-time-chat-app-cisd.onrender.com';

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [imageFile, setImageFile] = useState(null);


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
          image: msg.image,
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

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // ✅ Send message to server
  // const sendMessage = (event) => {
  //   event.preventDefault();
  //   if (message) {
  //     socket.emit('sendMessage', message, () => setMessage(''));
  //   }
  // };
// Send MESSAGE 
  // const sendMessage = (event) => {
  //   event.preventDefault();
  
  //   if (message || imageFile) {
  //     const reader = new FileReader();
  
  //     if (imageFile) {
  //       reader.onloadend = () => {
  //         // send message with image as base64
  //         socket.emit('sendMessage', {
  //           text: message,
  //           image: reader.result, // base64 encoded string
  //         }, () => {
  //           setMessage('');
  //           setImageFile(null); // reset image
  //         });
  //       };
  //       reader.readAsDataURL(imageFile); // convert image to base64
  //       console.log("image",imageFile);
  //     } else {
  //       socket.emit('sendMessage', {
  //         text: message,
  //         image: null,
  //       }, () => setMessage(''));
  //     }
  //   }
  // };


  const sendMessage = async (e) => {
  e.preventDefault();

  let imageUrl = null;

  if (imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post('https://real-time-chat-app-cisd.onrender.com/upload', formData);
      imageUrl = response.data.imageUrl;
    } catch (err) {
      console.error("Image upload failed:", err);
      return;
    }
  }

  if (message || imageUrl) {
    socket.emit('sendMessage', {
      text: message,
      image: imageUrl,
    }, () => {
      setMessage('');
      setImageFile(null);
    });
  }
};

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
  message={message}
  setMessage={setMessage}
  sendMessage={sendMessage}
  handleImageChange={handleImageChange}
  imageFile={imageFile}
/>
        </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
