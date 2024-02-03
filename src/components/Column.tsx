import { FC } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../utils/DragTypes";
import { Job, JobStatus } from "./Job";

type ColumnProps = {
  type: JobStatus;
  jobs: Job[];
  update: (job: Job, status: JobStatus) => void;
};

export const Column: FC<ColumnProps> = ({ type, jobs, update }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.JOB,
    drop: (e: Job) => {
      console.log(e, `update to`, type);
      update?.(e, type);
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
      {jobs
        .filter((j) => j.status === type)
        .map((j) => (
          <Job key={j.id} job={j} />
        ))}
    </div>
  );
};
