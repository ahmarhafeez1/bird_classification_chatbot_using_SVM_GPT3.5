import React from 'react';

const styles = {
  messageContainer: {
    maxHeight: '300px',
    overflowY: 'auto',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  message: {
    marginBottom: '10px',
    padding: '8px',
    borderRadius: '4px',
  },
  userMessage: {
    background: '#d3e0dc',
  },
  botMessage: {
    background: '#f0f0f0',
  },
};

const ChatWindow = ({ messages }) => {
  return (
    <div style={styles.messageContainer}>
      {messages.map((message, index) => (
        <div
          key={index}
          style={{
            ...styles.message,
            ...(message.role === "user" ? styles.userMessage : styles.botMessage),
          }}
        >
           { message &&  message.content}
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
