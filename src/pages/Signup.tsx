import { createUserWithEmailAndPassword } from "firebase/auth";
import { FC, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { Container } from "react-bootstrap";

export const Signup: FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        navigate("/login");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
  };

  return (
    <main>
      <Container>
        <div className="mt-5">
          <h1>Employ me pls</h1>
          <hr />
          <h3>Create your account</h3>
          <form>
            <div>
              <input
                type="email"
                value={email}
                className="field"
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                className="field"
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
            </div>

            <button
              type="button"
              style={{ width: "100%" }}
              onClick={() => onSubmit()}
            >
              Sign up
            </button>
          </form>

          <p>
            Already have an account? <NavLink to="/login">Sign in</NavLink>
          </p>
        </div>
      </Container>
    </main>
  );
};
