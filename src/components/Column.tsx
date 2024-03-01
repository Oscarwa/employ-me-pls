import { FC } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../utils/DragTypes";
import { JobCard } from "./JobCard";
import { Job, JobStatus } from "../models/Job";

type ColumnProps = {
  type: JobStatus;
  jobs: Job[];
  update: (job: Job, status: JobStatus) => void;
  select: (job: Job) => void;
};

export const Column: FC<ColumnProps> = ({ type, jobs, update, select }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.JOB,
    drop: (e: Job) => {
      update(e, type);
    },
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));
  return (
    <div
      className="col"
      ref={drop}
      style={{ backgroundColor: isOver ? "#2A2A2A" : "inherit" }}
    >
      <h3>{type}</h3>
      {jobs.map((j) => (
        <JobCard key={j.id} job={j} select={select} />
      ))}
    </div>
  );
};
