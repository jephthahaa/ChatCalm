import React, { useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import AuthContext from '../context/AuthContext';
import { getFirestore } from 'firebase/firestore';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [isSubscribed, setIsSubscribed] = useState(true);

  useEffect(() => {
    console.log('useEffect running'); // Add logging to check if useEffect is running
    // Initialize the Firestore database
    const db = getFirestore();

    // Subscribe to Firestore data using onSnapshot
    const unsubscribe = onSnapshot(doc(db, 'userChats', currentUser.uid), (snapshot) => {
      // Check if the component is still mounted before updating state
      if (isSubscribed) {
        // Check if the document exists before accessing its data
        if (snapshot.exists()) {
          setChats(snapshot.data());
        } else {
          // Handle the case when the document doesn't exist
          setChats([]);
        }
      }
    });

    // Unsubscribe from the snapshot listener when the component unmounts
    return () => {
      console.log('unsubscribing'); // Add logging to check if the cleanup function is called
      unsubscribe();
      setIsSubscribed(false);
    };
  }, [currentUser.uid, isSubscribed]);

  console.log('rendering', chats); // Add logging to track renders and state changes

  return (
    <div className="chats">
      <div className="userChat">
        <img src="" alt="" />
        <div className="userChatInfo">
          <span>Jane</span>
          <p>Hello</p>
        </div>
      </div>
    </div>
  );
};

export default Chats;
