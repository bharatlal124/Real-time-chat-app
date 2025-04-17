import React from 'react';
import { UserCircle } from "lucide-react"

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { text, user }, name }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if(user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
    {/*<p className="sentText pr-10">{trimmedName}</p> */}
          <div className="messageBox2 backgroundBlue">
            <p className="sentText">{trimmedName}</p>
            <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
          </div>
              <div className="avatarContainer">
                  <UserCircle className="userAvatar sentAvatar" size={32} />
              </div>
        </div>
        )
        : (
          <div className="messageContainer justifyStart">
                <div className="avatarContainer">
                    <UserCircle className="userAvatar receivedAvatar" size={32} />
                </div>
            <div className="messageBox backgroundLight">
              <p className="sentText ">{user}</p>
              <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
            </div>
{/* <p className="sentText pl-10 ">{user}</p> */}
          </div>
        )
  );
}

export default Message;
