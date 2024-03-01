import { FC, useMemo, useState } from "react";
import { JobDetail } from "../components/JobDetail";
import { DndProvider } from "react-dnd";
import { Column } from "../components/Column";
import { Job, JobStatus } from "../models/Job";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { addDoc, collection, doc, query, updateDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { Container } from "react-bootstrap";

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
  const jobs = useMemo(
    () => ({
      wishlist: data?.filter((j) => j.status === "wishlist") as Job[],
      applied: data?.filter((j) => j.status === "applied") as Job[],
      interview: data?.filter((j) => j.status === "interview") as Job[],
      offer: data?.filter((j) => j.status === "offer") as Job[],
      rejected: data?.filter((j) => j.status === "rejected") as Job[],
    }),
    [data]
  );

  const [detail, setDetail] = useState<Job | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const updateJobStatus = (job: Job, status: JobStatus) => {
    const jobRef = doc(firestore, user.uid, job.id);
    updateDoc(jobRef, { status });
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
    <Container>
      <JobDetail
        job={detail}
        show={showDetail}
        closeFn={closeModal}
        upsert={upsertJob}
      />
      <button onClick={showCreateJobModal}>
        <i className="fa-solid fa-plus me-3"></i>Track new
      </button>
      <DndProvider backend={HTML5Backend}>
        {status === "success" ? (
          <section className="overflow-auto">
            <div className="columns">
              <Column
                type="wishlist"
                jobs={jobs.wishlist}
                update={updateJobStatus}
                select={selectJob}
              />
              <Column
                type="applied"
                jobs={jobs.applied}
                update={updateJobStatus}
                select={selectJob}
              />
              <Column
                type="interview"
                jobs={jobs.interview}
                update={updateJobStatus}
                select={selectJob}
              />
              <Column
                type="offer"
                jobs={jobs.offer}
                update={updateJobStatus}
                select={selectJob}
              />
              <Column
                type="rejected"
                jobs={jobs.rejected}
                update={updateJobStatus}
                select={selectJob}
              />
            </div>
          </section>
        ) : null}
      </DndProvider>
    </Container>
  );
};
