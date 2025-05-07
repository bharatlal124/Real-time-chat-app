import React from 'react';

import './Input.css';

const Input = ({ setMessage, sendMessage, message, handleImageChange, imageFile, handleTyping  }) => (
  
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
  <form className="form">
  <input
    className="input"
    type="text"
    placeholder="Type a message..."
    value={message}
    onChange={({ target: { value } }) => {setMessage(value); handleTyping();}}
    onKeyPress={(event) => event.key === 'Enter' ? sendMessage(event) : null}
  />

  {/* Show selected file name if exists */}
  {imageFile && (
    <span className="fileName">{imageFile.name}</span>
  )}

  {/* Hidden file input */}
  <input
    type="file"
    id="fileInput"
    accept="image/*"
    onChange={handleImageChange}
    style={{ display: 'none' }}
  />

  {/* Label acts as the upload button */}
  <label htmlFor="fileInput" className="uploadIcon">
    +
  </label>

  // <button className="sendButton" onClick={e => sendMessage(e)}>Send</button>
    <button
  className="sendButton"
  onClick={(e) => sendMessage(e)}
  disabled={sending}  // 🔒 Disable while sending
>
  {sending ? 'Sending...' : 'Send'}
</button>

</form>


)

export default Input;
