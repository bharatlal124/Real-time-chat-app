import React from 'react';

import './Input.css';

const Input = ({ setMessage, sendMessage, message, handleImageChange, imageFile, socket   }) => {
  
  // <form className="form">
  //   <input
  //     className="input"
  //     type="text"

  //     placeholder="Type a message..."
  //     value={message}
  //     onChange={({ target: { value } }) => setMessage(value)}
  //     onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
  //   />
  //     <input type="file" accept="image/*" onChange={handleImageChange} />

  //   <button className="sendButton" onClick={e => sendMessage(e)}>Send</button>
  // </form>
//   <form className="form">
//   <input
//     className="input"
//     type="text"
//     placeholder="Type a message..."
//     value={message}
//     onChange={({ target: { value } }) => {setMessage(value); handleTyping();}}
//     onKeyPress={(event) => event.key === 'Enter' ? sendMessage(event) : null}
//   />

//   {/* Show selected file name if exists */}
//   {imageFile && (
//     <span className="fileName">{imageFile.name}</span>
//   )}

//   {/* Hidden file input */}
//   <input
//     type="file"
//     id="fileInput"
//     accept="image/*"
//     onChange={handleImageChange}
//     style={{ display: 'none' }}
//   />

//   {/* Label acts as the upload button */}
//   <label htmlFor="fileInput" className="uploadIcon">
//     +
//   </label>

//  <button className="sendButton" onClick={e => sendMessage(e)}>Send</button>
 

// </form>

const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    socket.emit('typing'); // Emit typing event on every keystroke

    // Reset previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Set new timeout to emit stopTyping
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping');
    }, 2000); // 2 seconds of inactivity
  };

  return (
    <form className="form">
      <input
        className="input"
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={handleChange}
        onKeyPress={(e) => e.key === 'Enter' ? sendMessage(e) : null}
      />
      {imageFile && <span className="fileName">{imageFile.name}</span>}
      <input type="file" id="fileInput" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
      <label htmlFor="fileInput" className="uploadIcon">+</label>
      <button className="sendButton" onClick={sendMessage}>Send</button>
    </form>
  );
};

export default Input;
