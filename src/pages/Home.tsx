import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useFirebaseApp } from "reactfire";
import { FC, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { FirestoreProvider } from "reactfire";
import { Dashboard } from "./Dashboard";

import "./home.css";

export const Home: FC = () => {
  const firestoreInstance = getFirestore(useFirebaseApp());

  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (_user) => {
      if (_user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = _user.uid;
        setUser(_user);
        console.log("uid", uid);
      } else {
        // User is signed out
        setUser(null);
        console.log("user is logged out");
      }
    });
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
        console.error(error);
      });
  };

  return (
    <div>
      <div>
        <NavLink to="./">Home: {user?.email || null}</NavLink>
      </div>
      <div>
        <NavLink to="./login">Login</NavLink>
      </div>
      <div>
        <NavLink to="./signup">Signup</NavLink>
      </div>
      <hr />
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <hr />
      <FirestoreProvider sdk={firestoreInstance}>
        <Dashboard />
      </FirestoreProvider>
    </div>
  );
};
