import React from 'react';
import './Message.css';
import ReactEmoji from 'react-emoji';

const Message = ({ message, name }) => {
  const trimmedName = name.trim().toLowerCase();
  const isSentByCurrentUser = message.user === trimmedName;

  return (
    isSentByCurrentUser ? (
      <div className="messageContainer justifyEnd">
        <div className="messageBox2 backgroundBlue glassMessageBox sentGlass">
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
      </div>
    ) : (
      <div className="messageContainer justifyStart">
        <div className="messageBox backgroundLight glassMessageBox receivedGlass">
          <p className="sentText">{message.user}</p>
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
      </div>
    )
  );
}

export default Message;
