import { useEffect, useState } from 'react';
import './App.css';
import { FormControl, Input, IconButton } from '@material-ui/core';
import Message from './Message';
import db from './firebase';
import firebase from 'firebase';
import FlipMove from 'react-flip-move';
import SendIcon from '@material-ui/icons/Send';

function App() {

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState('')


  useEffect(() => {
    db.collection("messages")
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, message: doc.data() })))
      })
  }, [])


  useEffect(() => {
    setUsername(prompt('Please enter your name'));
  }, [])

  const sendMessage = (e) => {
    e.preventDefault()

    db.collection("messages").add({
      message: input,
      username: username,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })

    // setMessages([...messages, { username: username, text: input }])
    setInput("")

  }

  return (
    <div className="App">
      <h2>Welcome {username}</h2>
      <form className="app__form">
        <FormControl className="app__formControl">
          <Input className="app__input" placeholder='Enter your message...' value={input} onChange={e => setInput(e.target.value)} />
          <IconButton
            className='app__iconButton'
            varient="outlined" color="secondary" disabled={!input} type="submit" onClick={sendMessage}
          ><SendIcon />
          </IconButton>
        </FormControl>
      </form>

      <FlipMove>
        {messages.map(({ id, message }) => (
          <Message key={id} message={message} username={username} />
        ))}
      </FlipMove>
    </div>
  );
}

export default App;
