import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useFirebaseApp } from "reactfire";
import { FC, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { FirestoreProvider } from "reactfire";
import { Dashboard } from "./Dashboard";

import "./home.css";
import { Container, Navbar } from "react-bootstrap";

export const Home: FC = () => {
  const firestoreInstance = getFirestore(useFirebaseApp());

  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (_user) => {
      if (_user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(_user);
      } else {
        // User is signed out
        setUser(null);
        navigate("login");
      }
    });
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("login");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
        console.error(error);
      });
  };

  return (
    <div>
      <Navbar className="bg-body-tertiary px-3">
        <Container className="d-flex justify-content-between">
          <h2>
            <NavLink to="./">Employ me pls</NavLink>
          </h2>
          <div>
            <span className="d-none d-sm-inline-block">
              Hola, {user?.email || null}!
            </span>
            <button className="ms-4 small" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket me-3"></i>
              Logout
            </button>
          </div>
        </Container>
      </Navbar>
      <FirestoreProvider sdk={firestoreInstance}>
        {user ? <Dashboard user={user} /> : null}
      </FirestoreProvider>
    </div>
  );
};
