import React, { useRef, useState, useEffect } from "react"
import "./App.css"
import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollectionData } from "react-firebase-hooks/firestore"

firebase.initializeApp({
  apiKey: "AIzaSyAaNSGEGg_vF8wNr9SIRRnMhvQXBbRSClQ",
  authDomain: "firechat-969d9.firebaseapp.com",
  projectId: "firechat-969d9",
  storageBucket: "firechat-969d9.appspot.com",
  messagingSenderId: "669795137695",
  appId: "1:669795137695:web:ef912cb0884728e30c8aaa",
})

const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {
  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header>
        <h2>
          <span role="img" aria-label="fire">
            🔥
          </span>
          <span role="img" aria-label="chat">
            💬
          </span>
          Firechat
        </h2>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <p>&nbsp;</p>
    </>
  )
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  )
}

function ChatRoom() {
  const messagesRef = firestore.collection("tgtdemo")
  const query = messagesRef.orderBy("createdAt").limit(500)

  const [messages] = useCollectionData(query, { idField: "id" })

  const [formValue, setFormValue] = useState("")

  const deleteMessage = (uid) => {
    if (window.confirm("Are you sure to delete this record?")) {
      firebase.firestore().collection("messages").doc(uid).delete()
    }
  }

  // scroll to bottom when [messages] is updated
  const messagesEndRef = useRef()
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    const { uid, photoURL, displayName } = auth.currentUser
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      displayName,
      timestamp: Date.now(),
    })
    setFormValue("")
  }

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              deleteMessage={deleteMessage}
            />
          ))}
        <div ref={messagesEndRef} />
      </main>

      <form onSubmit={sendMessage}>
        <textarea
          type="text"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
          wrap="hard"
          cols="20"
        >
          {/* <input
            type="text"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="say something nice"
          /> */}
        </textarea>
        <button type="submit" disabled={!formValue}>
          <span role="img" aria-label="send">
            🕊️
          </span>
        </button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL, timestamp, displayName } = props.message

  const time = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    //second: "2-digit",
  }).format(timestamp)

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received"

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img src={photoURL || "/avatar-placeholder.png"} alt="" />
        <p>
          {text}&nbsp;&nbsp;
          {/* <button
            className="delete"
            onClick={() => props.deleteMessage(uid)}
          ></button> */}
        </p>
      </div>
      <div className={`whowhen message ${messageClass}`}>
        {displayName} {time}
      </div>
    </>
  )
}

export default App
