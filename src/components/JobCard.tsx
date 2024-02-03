import { FC } from "react";

import { useDrag } from "react-dnd";
import { ItemTypes } from "../utils/DragTypes";

import "./jobcard.css";
import { Job } from "../models/Job";

type JobProps = {
  job: Job;
  select: (job: Job) => void;
};

export const JobCard: FC<JobProps> = ({ job, select }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.JOB,
    item: job,
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));
  return (
    <section
      className="job"
      ref={dragRef}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => select(job)}
    >
      {job.name} {job.status === "offer" ? "🎉" : null}
    </section>
  );
};
