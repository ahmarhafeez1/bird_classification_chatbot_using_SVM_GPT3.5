import React, { useState } from 'react';

const styles = {
  form: {
    display: 'flex',
    marginBottom: '20px',
  },
  input: {
    flex: '1',
    padding: '10px',
    marginRight: '10px',
    borderRadius: '8px',
    border: 'none',
    borderBottom: '2px solid #4caf50',
    fontSize: '16px',
    outline: 'none',
    color: '#333',
  },
  button: {
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    background: '#4caf50',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

const MessageInput = ({ addMessage }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() !== '') {
      addMessage(text, true); // Add user message to the state
      setText(''); // Clear input field
    }
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        Send
      </button>
    </form>
  );
};

export default MessageInput;
