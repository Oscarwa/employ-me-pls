import { FC, useEffect, useState } from "react";

import "./jobdetail.css";
import { InterviewStep, Job } from "../models/Job";
import { Field, FieldArray, Form, Formik } from "formik";
import { Collapse } from "react-bootstrap";

type JobDetailProps = {
  job: Job | null;
  show: boolean;
  closeFn: VoidFunction;
  upsert: (job: Job) => void;
};

const perkList = [
  {
    key: "healthInsurance",
    icon: <i className="fa-solid fs-5 fa-stethoscope"></i>,
  },
  { key: "lifeInsurance", icon: <i className="fa-solid fs-5 fa-heart"></i> },
  { key: "savingsFund", icon: <i className="fa-solid fs-5 fa-piggy-bank"></i> },
  {
    key: "vacations",
    icon: <i className="fa-solid fs-5 fa-umbrella-beach"></i>,
  },
  {
    key: "equity",
    icon: <i className="fa-solid fs-5 fa-money-bill-trend-up"></i>,
  },
  {
    key: "vacationPrime",
    icon: <i className="fa-solid fs-5 fa-hand-holding-dollar"></i>,
  },
  { key: "dentalPlan", icon: <i className="fa-solid fs-5 fa-tooth"></i> },
  { key: "visionPlan", icon: <i className="fa-solid fs-5 fa-glasses"></i> },
  {
    key: "homeOfficeSupport",
    icon: <i className="fa-solid fs-5 fa-house-laptop"></i>,
  },
  { key: "bonuses", icon: <i className="fa-solid fs-5 fa-star"></i> },
];

const emptyPerks = {
  healthInsurance: false,
  lifeInsurance: false,
  savingsFund: false,
  vacations: false,
  equity: false,
  vacationPrime: false,
  dentalPlan: false,
  visionPlan: false,
  homeOfficeSupport: false,
  bonuses: false,
};

const perkDisplay = (perk: string) =>
  perk
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (str: string) => str.toUpperCase());

export const JobDetail: FC<JobDetailProps> = ({
  job,
  show,
  closeFn,
  upsert,
}) => {
  const [showContact, setShowContact] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
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
      <div className="e-modal blur"></div>
      <div className="e-modal">
        <div className="content">
          <div>
            <span className="close" onClick={closeFn}>
              &times;
            </span>
          </div>
          <div className="header">
            <h2>
              {job ? (
                <>
                  {job.name}
                  {job.url ? (
                    <a href={`${job.url}`} target="_blank">
                      <i className="fa-solid fa-arrow-up-right-from-square fs-4 ms-3"></i>
                    </a>
                  ) : null}
                </>
              ) : (
                "New job application"
              )}
            </h2>
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
                  perks: emptyPerks,
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
                    <Field
                      className="field"
                      type="text"
                      name="salary"
                      placeholder="Salary (or range)"
                    />
                    <Field className="field" as="select" name="status">
                      <option value="wishlist">Wishlist</option>
                      <option value="applied">Applied</option>
                      <option value="interview">Interview</option>
                      <option value="offer">Offer</option>
                      <option value="rejected">Rejected</option>
                    </Field>
                    <hr />
                    <div className="d-flex justify-content-between pb-2">
                      <h4>
                        Contact
                        {values.mainContact?.name
                          ? `: ${values.mainContact?.name}`
                          : null}
                        {values.mainContact?.email ? (
                          <a
                            href={`mailto:${values.mainContact.email}`}
                            target="_blank"
                          >
                            <i className="fa-solid fa-envelope fs-5 ms-3"></i>
                          </a>
                        ) : null}
                        {values.mainContact?.phone ? (
                          <a
                            href={`phone:${values.mainContact.phone}`}
                            target="_blank"
                          >
                            <i className="fa-solid fa-phone fs-5 ms-3"></i>
                          </a>
                        ) : null}
                        {values.mainContact?.website ? (
                          <a
                            href={`${values.mainContact.website}`}
                            target="_blank"
                          >
                            <i className="fa-solid fa-arrow-up-right-from-square fs-5 ms-3"></i>
                          </a>
                        ) : null}
                      </h4>
                      <button
                        type="button"
                        className="small"
                        onClick={() => setShowContact(!showContact)}
                      >
                        {showContact ? (
                          <i className="fa-solid fa-chevron-up"></i>
                        ) : (
                          <i className="fa-solid fa-chevron-down"></i>
                        )}
                      </button>
                    </div>
                    <Collapse in={showContact}>
                      <div>
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
                      </div>
                    </Collapse>
                    <hr />

                    <FieldArray name="interviewSteps">
                      {({ remove, push }) => {
                        return (
                          <div>
                            <div className="d-flex justify-content-between align-items-center">
                              <h4>Interview Steps</h4>
                              <div>
                                {showSteps ? (
                                  <button
                                    type="button"
                                    className="small me-2"
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
                                    <i className="fa-solid fa-plus me-2"></i>
                                    Step
                                  </button>
                                ) : null}
                                <button
                                  type="button"
                                  className="small"
                                  onClick={() => setShowSteps(!showSteps)}
                                >
                                  {showSteps ? (
                                    <i className="fa-solid fa-chevron-up"></i>
                                  ) : (
                                    <i className="fa-solid fa-chevron-down"></i>
                                  )}
                                </button>
                              </div>
                            </div>
                            <Collapse in={showSteps}>
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
                                        className="ms-1"
                                      >
                                        Completed?
                                      </label>
                                    </div>
                                    <div>
                                      <button
                                        type="button"
                                        className="small"
                                        onClick={() => remove(idx)}
                                      >
                                        <i className="fa-solid fa-trash"></i>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Collapse>
                          </div>
                        );
                      }}
                    </FieldArray>
                    <hr />
                    <div>
                      <div className="d-flex justify-content-between align-items-center">
                        <h4>Benefits and perks</h4>
                        <div>
                          <button
                            type="button"
                            className="small"
                            onClick={() => setShowBenefits(!showBenefits)}
                          >
                            {showBenefits ? (
                              <i className="fa-solid fa-chevron-up"></i>
                            ) : (
                              <i className="fa-solid fa-chevron-down"></i>
                            )}
                          </button>
                        </div>
                      </div>
                      <Collapse in={showBenefits}>
                        <div>
                          {perkList.map(({ key: p, icon }) => (
                            <div key={p}>
                              <Field
                                type="checkbox"
                                id={`perks.${p}`}
                                name={`perks.${p}`}
                                // type="switch"
                              />
                              <label htmlFor={`perks.${p}`} className="ms-2">
                                {icon}
                                <span className="ps-2">{perkDisplay(p)}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </Collapse>
                    </div>
                    <hr />
                    <Field
                      className="field"
                      as="textarea"
                      rows={3}
                      name="notes"
                      placeholder="Notes"
                    />

                    <button
                      className="w-100"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <>
                        <i className="fa-solid fa-floppy-disk me-3"></i>
                        {values.id ? "Update" : "Save"}
                      </>
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
