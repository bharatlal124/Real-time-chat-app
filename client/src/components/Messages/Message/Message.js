import React from 'react';
import { UserCircle } from "lucide-react"
import './Message.css';
import ReactEmoji from 'react-emoji';

const Message = ({ message, name }) => {
  const trimmedName = name.trim().toLowerCase();
  const isSentByCurrentUser = message.user === trimmedName;

  return (
    isSentByCurrentUser ? (
      <div className="messageContainer justifyEnd">
        <div className="messageBox2 backgroundBlue  ">
          <p className="sentText">{trimmedName}</p>
          {message.text && typeof message.text === 'string' && (
  <p className="messageText colorWhite">
    {ReactEmoji.emojify(message.text)}
  </p>
)}
{message.image && (
  <img
    src={message.image.startsWith('data:image') ? message.image : `https://real-time-chat-app-cisd.onrender.com${message.image}`}
    alt="chat"
    style={{ maxWidth: "200px", borderRadius: "8px", marginTop: "5px" }}
  />
)}


          {/* {message.text && (
            <p className="messageText colorWhite">{ReactEmoji.emojify(String(message.text || ''))}</p>
          )}
          {message.image && (
            <img
              src={`http://localhost:5000${message.image}`}
              alt="chat"
              style={{ maxWidth: "200px", borderRadius: "8px", marginTop: "5px" }}
            />
          )} */}
        </div>
          <div className="avatarContainer">
                  <UserCircle className="userAvatar sentAvatar" size={28} />
              </div>
      </div>
    ) : (
      <div className="messageContainer justifyStart">
      <div className="avatarContainer">
                    <UserCircle className="userAvatar receivedAvatar" size={28} />
                </div>
        <div className="messageBox backgroundLight  ">
          <p className="sentText">{message.user}</p>
          {message.text && typeof message.text === 'string' && (
  <p className="messageText colorDark">
    {ReactEmoji.emojify(message.text)}
  </p>
)}
{message.image && (
  <img
    src={message.image.startsWith('data:image') ? message.image : `https://real-time-chat-app-cisd.onrender.com${message.image}`}
    alt="chat"
    style={{ maxWidth: "200px", borderRadius: "8px", marginTop: "5px" }}
  />
)}


          {/* {message.text && (
            <p className="messageText colorWhite">{ReactEmoji.emojify(String(message.text || ''))}</p>
          )}
          {message.image && (
            <img
              src={`http://localhost:5000${message.image}`}
              alt="chat"
              style={{ maxWidth: "200px", borderRadius: "8px", marginTop: "5px" }}
            />
          )} */}
        </div>
      </div>
    )
  );
}

export default Message;
