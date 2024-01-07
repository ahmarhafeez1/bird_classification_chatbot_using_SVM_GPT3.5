import React, { useEffect, useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';


import axios from 'axios'

const styles = {
  body: {
    backgroundColor: '#111', // Dark background color
    minHeight: '100vh', // Ensure the body covers the whole viewport height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    backgroundColor: '#222',
    color: '#fff',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  subTitle: {
    fontSize: '18px',
    marginBottom: '20px',
  },
  input: {
    flex: '1',
    padding: '8px',
    margin: '0 8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: '#333',
    color: '#fff',
  },
  button: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #4caf50',
    background: '#4caf50',
    color: '#fff',
    cursor: 'pointer',
  },
  birdInfo: {
    margin: '20px 0',
  },
  birdImage: {
    borderRadius: '50%',
    width: '200px',
    height: '200px',
    objectFit: 'cover',
  },
};

const ChatApp = () => {
  const [birdImageUrl, setBirdImageUrl] = useState("");
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
      const searchTerm = birdName;
      try {
        const birdImageResponse = await fetch(`http://localhost:8000/get_bird_image/?search_term=${searchTerm}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            search_term: searchTerm,
          }),
        });
        const birdImageResult = await birdImageResponse.json();
        
        console.log('birdImageResponse.bo')
        console.log(birdImageResult.image_link) 

        
        if (birdImageResponse.status === 200) {
          setBirdImageUrl(birdImageResult.image_link);
        }
      } catch (error) {
        console.error('Error fetching bird image:', error);
      }
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
    <div style={styles.body}>
    <div style={styles.container}>
      <h2 style={styles.title}>ChirpChat</h2>
      <h4 style={styles.subTitle}>Ask a question to start a chat!</h4>

      {!startChat && (
        <>
          <input style={styles.input} type="file" onChange={handleFileChange} />
          <input style={styles.input} type="text" placeholder="Ask a question about the bird" value={question} onChange={handleQuestionChange} />
          <button style={styles.button} onClick={handleAskQuestion}>Ask Question</button>
        </>
      )}

      {bird && (
        <div style={styles.birdInfo}>
          <h6>Bird Name: {bird}</h6>
          {birdImageUrl && (
            <img
              src={birdImageUrl}
              alt="Bird"
              style={styles.birdImage}
            />
          )}
        </div>
      )}

      {startChat && (
        <>
          <ChatWindow messages={messages} />
          <MessageInput addMessage={addMessage} />
        </>
      )}
    </div>
    </div>
  );
};

export default ChatApp;
