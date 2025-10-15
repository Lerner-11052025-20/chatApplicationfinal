import React, { useState } from "react";

const ChatWindow = ({ messages, onSend, currentUser }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div style={{ flex: 1 }}>
      <h3 style={{marginTop:0}}>Chat</h3>
      <div className="chat-log">
        {messages.map((msg, index) => {
          const isOwn = (msg.sender?._id || msg.sender) === currentUser._id;
          return (
            <div
              key={msg._id || `${index}-${msg.content}`}
              className={`msg-row ${isOwn ? 'right' : ''}`}
            >
              <div className={`bubble ${isOwn ? 'me' : ''}`}>
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat-input">
        <input
          type="text"
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
        />
        <button className="btn btn-success" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
