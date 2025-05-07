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
  const [sending, setSending] = useState(false);
   const [typingUsers, setTypingUsers] = useState([]);

let typingTimeout;

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


  useEffect(() => {
    if (message) {
      socket.emit('typing', { user: name, room });
    } else {
      socket.emit('stopTyping', { room });
    }
  }, [message, name, room]);

  useEffect(() => {
    socket.on('userTyping', (userName) => {
      setTypingUsers(prev => {
        if (!prev.includes(userName)) {
          return [...prev, userName];
        }
        return prev;
      });
    });
  
    socket.on('userStopTyping', (userName) => {
      setTypingUsers(prev => prev.filter(u => u !== userName));
    });
  
    return () => {
      socket.off('userTyping');
      socket.off('userStopTyping');
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
const handleTyping = () => {
    socket.emit('typing', { name, room });
  
    if (typingTimeout) clearTimeout(typingTimeout);
  
    typingTimeout = setTimeout(() => {
      socket.emit('stopTyping', { room });
    }, 1000); // stop typing after 1s of inactivity
  };


  const sendMessage = async (e) => {
  e.preventDefault();

  if (sending) return; // ⛔ Prevent multiple sends
  setSending(true);     // 🚫 Lock sending

  let imageUrl = null;

  if (imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post(
        'https://real-time-chat-app-cisd.onrender.com/upload',
        formData
      );
      imageUrl = response.data.imageUrl;
    } catch (err) {
      console.error("Image upload failed:", err);
      setSending(false); // 🔓 Unlock if error
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
      setSending(false); // ✅ Unlock after send
    });
  } else {
    setSending(false); // ✅ Unlock if nothing to send
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
    handleTyping={handleTyping}
/>
        </div>
      <TextContainer users={users} typingUsers={typingUsers} />
    </div>
  );
};

export default Chat;
