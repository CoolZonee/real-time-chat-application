import React, { useCallback, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { BACKEND_URL } from './config/env.config';

function App() {
  const [senderId, setSenderId] = React.useState<string>('');
  const [receiverId, setReceiverId] = React.useState<string>('');
  const [messages, setMessages] = React.useState<any[]>([]);
  const [newMessage, setNewMessage] = React.useState<string>('');
  const [ws, setWs] = React.useState<any>(null);
  const [form, setForm] = React.useState({
    email: '',
    password: '',
  });

  const [clientId, setClientId] = React.useState<number>();

  const signUp = async () => {
    await axios.post(`${BACKEND_URL}/sign-up`, {
      email: form.email,
      password: form.password,
    });
  }

  const getUser = useCallback(async () => {
    const res = await axios.get(`${BACKEND_URL}/user/${senderId}`);
    console.log(res.data);
  }, [senderId]);

  const getMessages = useCallback(async () => {
    const res = await axios.post(`${BACKEND_URL}/message`, {
      sender: senderId,
      receiver: receiverId,
    });
    console.log(res.data);
    setMessages(res.data.messages);
    openSocket();
  }, [senderId, receiverId]);

  const sendMessage = useCallback(async () => {
    const res = await axios.post(`${BACKEND_URL}/message/send`, {
      sender: senderId,
      receiver: receiverId,
      text: newMessage,
    });
    ws.send(JSON.stringify({
      sender: senderId,
      receiver: receiverId,
      text:
        newMessage,
    }));

    console.log(res.data);
  }, [senderId, receiverId, newMessage]);

  const openSocket = async () => {
    const socket = new WebSocket(`ws://localhost:8080?clientId=${senderId}`);
    console.log(senderId);
    socket.onopen = function () {
      console.log('Connected to WebSocket server');
    };

    socket.onmessage = async function (event) {

      console.log('Received message: ' + event.data);
      const data = await (event.data as Blob).text()
      console.log(data)

      // Add the new message to the list of messages
      setMessages(messages => [...messages, JSON.parse(data)]);
    };

    socket.onclose = function () {
      console.log('Disconnected from WebSocket server');
    };

    setWs(socket)
  };

  return (
    <div className="App">
      <form>
        <input name="email" type='email' onChange={(e) => setForm(
          {
            ...form,
            email: e.target.value
          }
        )} />
        <br />
        <input name="password" type='password' onChange={(e) => setForm(
          {
            ...form,
            password: e.target.value
          }
        )} />
        <br />
        <button type='button' onClick={() => { signUp() }}>Sign Up</button>
      </form>
      <form>
        <label>Sender ID:</label>
        <input type='text' name='senderId' placeholder='sender id' value={senderId} onChange={(e) => setSenderId(e.target.value)} />
        <br />
        <label>Receiver ID:</label>
        <input type='text' name='receiverId' placeholder='receiver id' value={receiverId} onChange={(e) => setReceiverId(e.target.value)} />
        <br />
        <button type='button' onClick={getMessages}>Get Messages</button>
      </form>
      <div>
        {
          messages && messages.length > 0 &&
          messages.map((message) => (
            <div key={message.id}>
              {
                message.sender === senderId ? (
                  <p style={{ color: "green" }}>{message.text}</p>
                ) : (
                  <p style={{ color: "red" }}>{message.text}</p>
                )
              }
            </div>
          ))
        }
      </div>
      <form>
        <label>Message:</label>
        <input type='text' name='message' placeholder='message' onChange={(e) => setNewMessage(e.target.value)} />
        <br />
        <button type='button' onClick={sendMessage}>Send Message</button>
      </form>

    </div>
  );
}

export default App;
