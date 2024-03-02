import { FC, useEffect, useState } from "react";

import "./jobdetail.css";
import { InterviewStep, Job } from "../models/Job";
import { Field, FieldArray, Form, Formik } from "formik";
import { Collapse, Modal } from "react-bootstrap";

type JobDetailProps = {
  job: Job | null;
  show: boolean;
  closeFn: VoidFunction;
  upsert: (job: Job) => void;
};

const perkList = [
  {
    key: "healthInsurance",
    icon: <i className="fa-solid fs-4 fa-stethoscope"></i>,
  },
  { key: "lifeInsurance", icon: <i className="fa-solid fs-4 fa-heart"></i> },
  { key: "savingsFund", icon: <i className="fa-solid fs-4 fa-piggy-bank"></i> },
  {
    key: "vacations",
    icon: <i className="fa-solid fs-4 fa-umbrella-beach"></i>,
  },
  {
    key: "equity",
    icon: <i className="fa-solid fs-4 fa-money-bill-trend-up"></i>,
  },
  {
    key: "vacationPrime",
    icon: <i className="fa-solid fs-4 fa-hand-holding-dollar"></i>,
  },
  { key: "dentalPlan", icon: <i className="fa-solid fs-4 fa-tooth"></i> },
  { key: "visionPlan", icon: <i className="fa-solid fs-4 fa-glasses"></i> },
  {
    key: "homeOfficeSupport",
    icon: <i className="fa-solid fs-4 fa-house-laptop"></i>,
  },
  { key: "bonuses", icon: <i className="fa-solid fs-4 fa-star"></i> },
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
    <Modal show={true} size="lg" style={{ maxWidth: "100vw" }} onHide={closeFn}>
      <Modal.Header closeButton>
        <Modal.Title>
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
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
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
                <div
                  className="d-flex justify-content-between pb-2"
                  onClick={() => setShowContact(!showContact)}
                >
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
                      <a href={`${values.mainContact.website}`} target="_blank">
                        <i className="fa-solid fa-arrow-up-right-from-square fs-5 ms-3"></i>
                      </a>
                    ) : null}
                  </h4>
                  <button type="button" className="small">
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
                        <div
                          className="d-flex justify-content-between align-items-center mb-2"
                          onClick={() => setShowSteps(!showSteps)}
                        >
                          <h4>Interview Steps</h4>
                          <div>
                            <button type="button" className="small">
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
                              <div className="interview-steps my-2" key={idx}>
                                <div className="interview-step-name">
                                  <Field
                                    className="field mb-0"
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
                            <button
                              type="button"
                              className="small w-100"
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
                          </div>
                        </Collapse>
                      </div>
                    );
                  }}
                </FieldArray>
                <hr />
                <div>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    onClick={() => setShowBenefits(!showBenefits)}
                  >
                    <h4>Benefits and perks</h4>
                    <div>
                      <button type="button" className="small">
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
                        <div key={p} className="pb-2">
                          <Field
                            type="checkbox"
                            id={`perks.${p}`}
                            name={`perks.${p}`}
                          />
                          <label htmlFor={`perks.${p}`} className="ms-2">
                            {icon}
                            <span className="ps-2 fs-5">{perkDisplay(p)}</span>
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

                <button className="w-100" type="submit" disabled={isSubmitting}>
                  <>
                    <i className="fa-solid fa-floppy-disk me-3"></i>
                    {values.id ? "Update" : "Save"}
                  </>
                </button>
              </Form>
            );
          }}
        </Formik>
      </Modal.Body>

      {/* <Modal.Footer>
        </Modal.Footer> */}
    </Modal>
  ) : null;
};
