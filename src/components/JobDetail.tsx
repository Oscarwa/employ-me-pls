import { FC, useEffect } from "react";

import "./jobdetail.css";
import { Job } from "../models/Job";
import { Field, Form, Formik } from "formik";

type JobDetailProps = {
  job: Job | null;
  show: boolean;
  closeFn: VoidFunction;
  create: (job: Job) => void;
};

export const JobDetail: FC<JobDetailProps> = ({
  job,
  show,
  closeFn,
  create,
}) => {
  useEffect(() => {
    const escClose = (code: string) => {
      if (code === "Escape") {
        closeFn();
      }
    };
    document.addEventListener("keyup", (e) => escClose(e.code));
    return document.removeEventListener("keyup", (e) => escClose(e.code));
  }, [closeFn]);

  return show ? (
    <>
      <div className="modal blur"></div>
      <div className="modal">
        <div className="content">
          <div>
            <span className="close" onClick={closeFn}>
              &times;
            </span>
          </div>
          <div className="header">
            <h3>{job ? `${job.name} Details` : "New job"}</h3>
          </div>
          <div className="body">
            <Formik
              initialValues={job || { name: "" }}
              onSubmit={(values) => create(values as Job)}
            >
              {({ values, isSubmitting }) => {
                return (
                  <Form>
                    <Field
                      className="field"
                      type="text"
                      name="name"
                      placeholder="Name"
                    />
                    <Field
                      className="field"
                      type="url"
                      name="url"
                      placeholder="URL"
                    />
                    <hr />
                    <Field
                      className="field"
                      type="text"
                      name="mainContact.name"
                      placeholder="Contact name"
                    />
                    <Field
                      className="field"
                      type="phone"
                      name="mainContact.phone"
                      placeholder="Contact phone"
                    />
                    <Field
                      className="field"
                      type="email"
                      name="mainContact.email"
                      placeholder="Contact email"
                    />
                    <Field
                      className="field"
                      type="url"
                      name="mainContact.website"
                      placeholder="Contact website (LinkedIn profile)"
                    />
                    <hr />
                    <Field
                      className="field"
                      type="text"
                      name="salary"
                      placeholder="Salary"
                    />
                    <Field
                      className="field"
                      type="text"
                      name="salaryRange"
                      placeholder="Salary range"
                    />
                    <Field
                      className="field"
                      as="textarea"
                      rows={5}
                      name="notes"
                      placeholder="Notes"
                    />

                    <button type="submit" disabled={false}>
                      {values.id ? "Update" : "Save"}
                    </button>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </>
  ) : null;
};
