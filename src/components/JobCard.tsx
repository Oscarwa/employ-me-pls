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
      <div>
        {job.name} {job.status === "offer" ? "🎉" : null}
      </div>
      {job.interviewSteps ? (
        <div className="job-track">
          {job.interviewSteps?.map((s, idx) => (
            <>
              <div key={idx} className={s.completed ? "full" : ""}></div>
              {idx < job.interviewSteps.length - 1 ? <span></span> : null}
            </>
          ))}
        </div>
      ) : null}
      <div className="job-info">
        {job.salary ? <div className="salary">{job.salary}</div> : null}
      </div>
    </section>
  );
};
