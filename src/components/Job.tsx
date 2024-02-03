import { FC } from "react";

import { useDrag } from "react-dnd";
import { ItemTypes } from "../utils/DragTypes";

import "./job.css";

export type JobStatus =
  | "wishlist"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

export type Job = {
  id: number;
  title: string;
  status?: JobStatus;
};

type JobProps = {
  job: Job;
};

export const Job: FC<JobProps> = ({ job }) => {
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
    >
      {job.title} {job.status}
    </section>
  );
};
