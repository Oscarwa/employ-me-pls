import { signInWithEmailAndPassword } from "firebase/auth";
import { FC, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { Container } from "react-bootstrap";

export const Login: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const uuid = userCredential.user.uid;
        console.info("User log in", uuid);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <>
      <main>
        <Container>
          <div className="mt-5">
            <h1>Employ me pls</h1>
            <hr />
            <h3>Log in</h3>
            <form>
              <div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  className="field"
                  required
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="field"
                  required
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="button"
                  className="w-100"
                  onClick={() => onLogin()}
                >
                  Login
                </button>
              </div>
            </form>

            <p className="text-sm text-white">
              No account yet? <NavLink to="/signup">Sign up</NavLink>
            </p>
          </div>
        </Container>
      </main>
    </>
  );
};
