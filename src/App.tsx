import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { FirebaseAppProvider } from "reactfire";
import { app } from "./firebase";

import "./App.css";

function App() {
  return (
    <FirebaseAppProvider firebaseApp={app}>
      <Router>
        <section>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </section>
      </Router>
    </FirebaseAppProvider>
  );
}

export default App;
