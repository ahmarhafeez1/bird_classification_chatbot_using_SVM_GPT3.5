import React, { useEffect, useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import axios from 'axios'

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    backgroundColor: '#fff',
    
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

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [prediction,setPrediction] = useState()
  const [question,setQuestion] = useState()
  const [messageAdded,setMessageAdded] = useState(false)
  const [answer,setAnswer] = useState()
  const [bird,setBird] = useState()
  const[startChat,setStartChat] = useState(false)
  const [file, setFile] = useState(null);
  const addMessage = (content, role="user") => {
    const newMessage = {  role:"user" ,content};
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    console.log(messages)  
    setMessageAdded(true);
    // handleConvo()
  };
  const handleConvo = async() =>{
    // Step 2: Ask a question about the bird using the GPT endpoint
    const gptResponse = await fetch(`http://localhost:8000/query_gpt/?query=${question}&bird=${bird}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        messages
    ),
    });

    if (!gptResponse.ok) {
      console.error('Error:', gptResponse.status, gptResponse.statusText);
      return;
    }
    const gptResult = await gptResponse.json();
    console.log(gptResult['Query Response'])
    const newMessage = {  role:"system",content:gptResult['Query Response'] };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setAnswer(gptResult['Query Response'])
    console.log('Query Response:', gptResult['Query Response']);
  }

  
  const handleFileChange =async (event) => {
    setFile(event.target.files[0]);
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    try {
      const birdClassificationResponse = await fetch('http://localhost:8000/bird_classification/', {
        method: 'POST',
        body: formData,
      });

      if (!birdClassificationResponse.ok) {
        console.error('Error:', birdClassificationResponse.status, birdClassificationResponse.statusText);
        return;
      }

      const birdClassificationResult = await birdClassificationResponse.json();
      const birdName = birdClassificationResult.name;
      setBird(birdName)
    } catch (error) {
      console.error('Network error:', error);
    }
    }

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleAskQuestion = async () => {
    // Step 1: Upload bird image to get bird's name
    const newMessage = {  role:"user" ,content:question};
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const birdClassificationResponse = await fetch('http://localhost:8000/bird_classification/', {
        method: 'POST',
        body: formData,
      });

      if (!birdClassificationResponse.ok) {
        console.error('Error:', birdClassificationResponse.status, birdClassificationResponse.statusText);
        return;
      }

      const birdClassificationResult = await birdClassificationResponse.json();
      const birdName = birdClassificationResult.name;
      setBird(birdName)
      // Step 2: Ask a question about the bird using the GPT endpoint
      const gptResponse = await fetch(`http://localhost:8000/query_gpt/?query=${question}&bird=${birdName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: messages && JSON.stringify(
        //    messages 
      // ),
      });
      setStartChat(true)
console.log(messages)
      if (!gptResponse.ok) {
        console.error('Error:', gptResponse.status, gptResponse.statusText);
        return;
      }
      const gptResult = await gptResponse.json();
      const newMessage = {  role:"system",content:gptResult['Query Response'] };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      console.log(gptResult['Query Response'])
      setAnswer(gptResult['Query Response'])
      console.log('Query Response:', gptResult['Query Response']);
    } catch (error) {
      console.error('Network error:', error);
    }
  };
  useEffect(()=>{
    // console.log(messages)
    if(messageAdded)
    handleConvo()
  setMessageAdded(false)
    // const newMessage = { content:answer, role:"system" };
    // setMessages((prevMessages) => [...prevMessages, newMessage]);
  },[messageAdded])
  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Chatbot</h2>
      <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Ask a question to start a chat!</h4>
     {!startChat  && <> <input  style={styles.input} type="file" onChange={handleFileChange} />
     {bird && <h6>Bird Name : {bird}</h6>}
      <input style={styles.input} type="text" placeholder="Ask a question about the bird" value={question} onChange={handleQuestionChange} />
      
      <button style={styles.button} onClick={handleAskQuestion}>Ask Question</button></>
      }
    { startChat && <> <ChatWindow messages={messages} />
      <MessageInput addMessage={addMessage} /></>}
    </div>
  );
};

export default ChatApp;
