import React, { useContext, useState } from 'react';
import { collection, query, where, getDocs, serverTimestamp, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import AuthContext from '../context/AuthContext';

const Search = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    try {
      const q = query(collection(db, 'users'), where('displayName', '==', username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setUser(null);
        setErr(true);
      } else {
        const userData = querySnapshot.docs[0].data();
        setUser(userData);
        setErr(false);
      }
    } catch (err) {
      console.error('Error searching for user:', err);
      setUser(null);
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === 'Enter') {
      handleSearch();
    }
  };

  const handleSelect = async () => {
    if (!user) return;

    // Combine user IDs to form a unique chat ID
    const combinedId = currentUser.uid > user.uid ? `${currentUser.uid}-${user.uid}` : `${user.uid}-${currentUser.uid}`;

    try {
      // Check if the chat document already exists
      const chatRef = doc(db, 'chats', combinedId);
      const chatDoc = await getDoc(chatRef);

      if (!chatDoc.exists()) {
        // If chat document doesn't exist, create it
        await setDoc(chatRef, { messages: [] });

        // Update userChats for current user
        const currentUserChatData = {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          date: serverTimestamp(),
        };
        const currentUserChatsRef = doc(db, 'userChats', currentUser.uid);
        await updateDoc(currentUserChatsRef, {
          [combinedId]: currentUserChatData,
        });

        // Update userChats for the other user
        const otherUserChatData = {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          date: serverTimestamp(),
        };
        const otherUserChatsRef = doc(db, 'userChats', user.uid);
        await updateDoc(otherUserChatsRef, {
          [combinedId]: otherUserChatData,
        });
      }
    } catch (err) {
      console.error('Error updating Firestore documents:', err);
    }
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="User Profile" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
