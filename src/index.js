import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from "firebase";
import 'firebase/firestore'
import 'firebase/auth'


export const app = firebase.initializeApp({
  apiKey: "AIzaSyCskLHsuHy6UIhpT3tp3be9ktYvRuqwHFE",
  authDomain: "fire-chat-4eb9b.firebaseapp.com",
  projectId: "fire-chat-4eb9b",
  storageBucket: "fire-chat-4eb9b.appspot.com",
  messagingSenderId: "557296480263",
  appId: "1:557296480263:web:e332e12d422f8bef9ebaa2",
  measurementId: "G-VQ08SFFMVG",
  databaseURL: "https://fire-chat-4eb9b-default-rtdb.europe-west1.firebasedatabase.app",
}
);

export const Context = createContext(null)


const auth = firebase.auth()
const firestore = firebase.firestore()


ReactDOM.render(
  <Context.Provider value={{   
    firebase,
    auth,
    firestore
  }}>
    <App />
  </Context.Provider>,
  document.getElementById('root')
);