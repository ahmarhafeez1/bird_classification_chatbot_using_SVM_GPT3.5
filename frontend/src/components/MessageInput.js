import React, { useState } from 'react';

const styles = {
  form: {
    display: 'flex',
    marginBottom: '20px',
  },
  input: {
    flex: '1',
    padding: '8px',
    marginRight: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #4caf50',
    background: '#4caf50',
    color: '#fff',
    cursor: 'pointer',
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
