import React, { useState } from 'react';
import Add from '../img/addAvatar.jpg';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, storage, db } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [err, setErr] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { displayName, email, password, file } = e.target.elements;

    // Perform form validation
    if (!displayName.value || !email.value || !password.value || !file.files[0]) {
      setErrorMessage('Please fill in all fields and select an avatar.');
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email.value, password.value);
      const storageRef = ref(storage, displayName.value);
      const uploadTask = uploadBytesResumable(storageRef, file.files[0]);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Track upload progress if needed
        },
        (error) => {
          setErr(true);
          setErrorMessage('Something went wrong during file upload.');
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateProfile(user, {
              displayName: displayName.value,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, 'users', user.uid), {
              displayName: displayName.value,
              email: email.value,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, 'userChats', user.uid), {});

            navigate('/');
          } catch (error) {
            setErr(true);
            setErrorMessage('Error occurred while updating user profile.');
          }
        }
      );

    } catch (error) {
      setErr(true);
      setErrorMessage('An error occurred during registration.');
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chat Calm</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Anonymous Name" name="displayName" />
          <input type="email" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <input style={{ display: 'none' }} type="file" id="file" name="file" />
          <label htmlFor="file">
            <img src={Add} alt="Add Avatar" />
            <span>Add an avatar</span>
          </label>
          <button type="submit">Sign Up</button>
          {err && <span>{errorMessage}</span>}
        </form>
        <p>You already have an account? Login</p>
      </div>
    </div>
  );
};

export default Register;
