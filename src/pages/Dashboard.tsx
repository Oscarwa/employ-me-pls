import { FC, useState } from "react";
import { JobDetail } from "../components/JobDetail";
import { DndProvider } from "react-dnd";
import { Column } from "../components/Column";
import { Job, JobStatus } from "../models/Job";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { addDoc, collection, doc, query, updateDoc } from "firebase/firestore";
import { User } from "firebase/auth";

type DashboardProps = {
  user: User;
};

export const Dashboard: FC<DashboardProps> = ({ user }) => {
  const firestore = useFirestore();
  const jobsCollection = collection(firestore, user.uid);
  const jobsQuery = query(jobsCollection);
  const { status, data } = useFirestoreCollectionData(jobsQuery, {
    idField: "id",
  });

  const jobs = data as Job[];

  const [detail, setDetail] = useState<Job | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const updateJobStatus = (job: Job, status: JobStatus) => {
    const jobRef = doc(firestore, user.uid, job.id);
    updateDoc(jobRef, { ...job, status });
  };

  const selectJob = (job: Job) => {
    setDetail(job);
    setShowDetail(true);
  };

  const upsertJob = (job: Job) => {
    if (job.id) {
      const jobRef = doc(firestore, user.uid, job.id);
      updateDoc(jobRef, job);
    } else {
      addDoc(jobsCollection, { ...job, status: "wishlist" });
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
  return (
    <>
      <JobDetail
        job={detail}
        show={showDetail}
        closeFn={closeModal}
        upsert={upsertJob}
      />
      <button onClick={showCreateJobModal}>Track new</button>
      <DndProvider backend={HTML5Backend}>
        {status === "success" ? (
          <section className="columns">
            <Column
              type="wishlist"
              jobs={jobs.filter((j) => j.status === "wishlist")}
              update={updateJobStatus}
              select={selectJob}
            />
            <Column
              type="applied"
              jobs={jobs?.filter((j) => j.status === "applied")}
              update={updateJobStatus}
              select={selectJob}
            />
            <Column
              type="interview"
              jobs={jobs?.filter((j) => j.status === "interview")}
              update={updateJobStatus}
              select={selectJob}
            />
            <Column
              type="offer"
              jobs={jobs?.filter((j) => j.status === "offer")}
              update={updateJobStatus}
              select={selectJob}
            />
            <Column
              type="rejected"
              jobs={jobs?.filter((j) => j.status === "rejected")}
              update={updateJobStatus}
              select={selectJob}
            />
          </section>
        ) : null}
      </DndProvider>
    </>
  );
};
