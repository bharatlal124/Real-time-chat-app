import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';

import './InfoBar.css';

const InfoBar = ({ room }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" src={onlineIcon} alt="online icon" />
      <h3>{room}</h3>
    </div>
    <div className="rightInnerContainer">
      <a href="/"><img src={closeIcon} alt="close icon" /></a>
    </div>
  </div>
);
// const InfoBar = ({ room, typingUser }) => (
//   <div className="infoBar">
//     <div className="leftInnerContainer">
//     <img className="onlineIcon" src={onlineIcon} alt="online icon" />
//       <h3>{room}</h3>
//     </div>
//     <div className="rightInnerContainer">
//     <a href="/"><img src={closeIcon} alt="close icon" /></a>
//       {typingUser && <p className="typing-indicator">{typingUser} is typing...</p>}
//     </div>
//   </div>
// );

export default InfoBar;
