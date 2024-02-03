import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { FC, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Column } from "../components/Column";
import { Job, JobStatus } from "../components/Job";

import "./home.css";

export const Home: FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([
    { id: 1, title: "EPAM Systems", status: "wishlist" },
  ]);

  const updateJob = (job: Job, status: JobStatus) => {
    // const match = jobs.find((j) => j.id === job.id);
    // if (match) {
    //   match.status = status;
    // }
    // setJobs(jobs);
    setJobs(
      jobs.map((j) => {
        if (j.id == job.id) {
          return { ...j, status };
        } else {
          return j;
        }
      })
    );
  };

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

      <DndProvider backend={HTML5Backend}>
        <section className="columns">
          <Column
            type="wishlist"
            jobs={jobs.filter((j) => j.status === "wishlist")}
            update={updateJob}
          />
          <Column
            type="applied"
            jobs={jobs.filter((j) => j.status === "applied")}
            update={updateJob}
          />
          <Column
            type="interview"
            jobs={jobs.filter((j) => j.status === "interview")}
            update={updateJob}
          />
          <Column
            type="offer"
            jobs={jobs.filter((j) => j.status === "offer")}
            update={updateJob}
          />
        </section>
      </DndProvider>
    </div>
  );
};
