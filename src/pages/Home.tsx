import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { FC, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Column } from "../components/Column";
import { Job, JobStatus } from "../models/Job";

import "./home.css";
import { JobDetail } from "../components/JobDetail";

const outerJobs: Job[] = [
  { id: 2, name: "Microsoft", status: "wishlist" },
  { id: 3, name: "Amazon", status: "wishlist" },
  { id: 4, name: "Meta", status: "wishlist" },
  { id: 5, name: "Google", status: "wishlist" },
  { id: 6, name: "Uber", status: "wishlist" },
  { id: 9, name: "Netflix", status: "wishlist" },
  { id: 11, name: "Apple", status: "wishlist" },
  { id: 12, name: "Facebook", status: "wishlist" },
];

export const Home: FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>(outerJobs);
  const [detail, setDetail] = useState<Job | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const updateJobStatus = (job: Job, status: JobStatus) => {
    setJobs((jobs) =>
      jobs.map((j) => {
        if (j.id == job.id) {
          return { ...j, status };
        } else {
          return j;
        }
      })
    );
  };

  const selectJob = (job: Job) => {
    setDetail(job);
    setShowDetail(true);
  };

  const upsertJob = (job: Job) => {
    if (job.id) {
      setJobs(jobs.map((j) => (j.id === job.id ? job : j)));
    } else {
      setJobs([...jobs, { ...job, id: jobs.length + 1, status: "wishlist" }]);
    }
    setShowDetail(false);
  };

  const showCreateJobModal = () => {
    setDetail(null);
    setShowDetail(true);
  };

  const closeModal = () => {
    setShowDetail(false);
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
      <hr />
      <JobDetail
        job={detail}
        show={showDetail}
        closeFn={closeModal}
        create={upsertJob}
      />
      <button onClick={showCreateJobModal}>Track new</button>
      <DndProvider backend={HTML5Backend}>
        <section className="columns">
          <Column
            type="wishlist"
            jobs={jobs.filter((j) => j.status === "wishlist")}
            update={updateJobStatus}
            select={selectJob}
          />
          <Column
            type="applied"
            jobs={jobs.filter((j) => j.status === "applied")}
            update={updateJobStatus}
            select={selectJob}
          />
          <Column
            type="interview"
            jobs={jobs.filter((j) => j.status === "interview")}
            update={updateJobStatus}
            select={selectJob}
          />
          <Column
            type="offer"
            jobs={jobs.filter((j) => j.status === "offer")}
            update={updateJobStatus}
            select={selectJob}
          />
          <Column
            type="rejected"
            jobs={jobs.filter((j) => j.status === "rejected")}
            update={updateJobStatus}
            select={selectJob}
          />
        </section>
      </DndProvider>
    </div>
  );
};
