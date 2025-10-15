import React from "react";

const ChatList = ({ chats, onSelect, currentUser }) => {
  if (!chats || !currentUser) return <p>Loading chats...</p>;

  const seenPartners = new Set(); // To track displayed partners

  return (
    <div className="sidebar">
      <h3 style={{marginTop:0}}>Your chats</h3>
      <ul className="list">
        {chats.map((chat) => {
          if (!chat.users || !Array.isArray(chat.users)) return null;

          // Find the other user in the chat (excluding self)
          const partner = chat.users.find((u) => u?._id !== currentUser?._id);
          if (!partner || seenPartners.has(partner._id)) return null;

          seenPartners.add(partner._id); // Mark as seen

          return (
            <li
              key={chat._id}
              onClick={() => onSelect(chat)}
              className="list-item"
            >
              {partner.username || "Unknown User"}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatList;
