import React from 'react';

const styles = {
  messageContainer: {
    maxHeight: '300px',
    overflowY: 'auto',
    padding: '10px',
    border: '1px solid #444',
    borderRadius: '8px',
    backgroundColor: '#333',
  },
  message: {
    marginBottom: '10px',
    padding: '8px',
    borderRadius: '4px',
    color: '#fff',
    wordBreak: 'break-word',
  },
  userMessage: {
    background: '#2a3941',
  },
  botMessage: {
    background: '#39484f',
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
          {message && message.content}
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
