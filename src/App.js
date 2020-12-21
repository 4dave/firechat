import React, { useRef, useState } from "react"
import "./App.css"

import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"
import "firebase/analytics"

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
// const analytics = firebase.analytics()

function App() {
  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header>
        <h1>🔥💬 COF firechat </h1>
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
  const dummy = useRef()
  const messagesRef = firestore.collection("messages")
  const query = messagesRef.orderBy("createdAt").limit(500)

  const [messages] = useCollectionData(query, { idField: "id" })

  const [formValue, setFormValue] = useState("")

  const sendMessage = async (e) => {
    e.preventDefault()

    const { uid, photoURL } = auth.currentUser

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      timestamp: Date.now(),
    })

    setFormValue("")
    dummy.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL, timestamp } = props.message

  const time = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp)

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received"

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={
            photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
        />
        <p>{text}</p>&nbsp;&nbsp;
        <span
          style={{
            backgroundColor: "black",
            color: "white",
            fontSize: ".7rem",
          }}
        >
          {time}
        </span>
      </div>
    </>
  )
}

export default App
