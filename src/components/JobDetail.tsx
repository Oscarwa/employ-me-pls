import { FC, useEffect } from "react";

import "./jobdetail.css";
import { InterviewStep, Job } from "../models/Job";
import { Field, FieldArray, Form, Formik } from "formik";

type JobDetailProps = {
  job: Job | null;
  show: boolean;
  closeFn: VoidFunction;
  upsert: (job: Job) => void;
};

export const JobDetail: FC<JobDetailProps> = ({
  job,
  show,
  closeFn,
  upsert,
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
              initialValues={
                job ||
                ({
                  id: "",
                  name: "",
                  status: "wishlist",
                  interviewSteps: [],
                } as Job)
              }
              onSubmit={(values) => upsert(values as Job)}
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
                    <Field className="field" as="select" name="status">
                      <option value="wishlist">Wishlist</option>
                      <option value="applied">Applied</option>
                      <option value="interview">Interview</option>
                      <option value="offer">Offer</option>
                      <option value="rejected">Rejected</option>
                    </Field>
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

                    <h4>Job Interview Steps</h4>
                    <FieldArray name="interviewSteps">
                      {({ remove, push }) => {
                        return (
                          <div>
                            {values.interviewSteps?.map((_s, idx) => (
                              <div className="interview-steps" key={idx}>
                                <div className="interview-step-name">
                                  <Field
                                    className="field"
                                    name={`interviewSteps[${idx}].name`}
                                    placeholder="Process step name"
                                  />
                                </div>
                                <div className="interview-step-check">
                                  <Field
                                    type="checkbox"
                                    id={`interviewSteps[${idx}].completed`}
                                    name={`interviewSteps[${idx}].completed`}
                                  />
                                  <label
                                    htmlFor={`interviewSteps[${idx}].completed`}
                                  >
                                    Completed?
                                  </label>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => remove(idx)}
                                >
                                  Delete
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                if (!values.interviewSteps) {
                                  values.interviewSteps = [];
                                }
                                push({
                                  name: "",
                                  completed: false,
                                } as InterviewStep);
                              }}
                            >
                              Add step
                            </button>
                          </div>
                        );
                      }}
                    </FieldArray>
                    <hr />
                    <Field
                      className="field"
                      type="text"
                      name="salary"
                      placeholder="Salary (or range)"
                    />
                    <Field
                      className="field"
                      as="textarea"
                      rows={5}
                      name="notes"
                      placeholder="Notes"
                    />

                    <button type="submit" disabled={isSubmitting}>
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
