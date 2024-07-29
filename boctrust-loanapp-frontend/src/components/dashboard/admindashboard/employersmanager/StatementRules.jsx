import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployers } from "../../../../redux/reducers/employersManagerReducer";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import { IoMdCloseCircle } from "react-icons/io";
import { toast } from "react-toastify";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  ruleTitle: Yup.string().required("Rule title is required"),
  maximumTenure: Yup.string().required("Maximum tenure is required"),
  maximumAmount: Yup.string().required("Maximum amount is required"),
  rule: Yup.string().required("Statement rule is required"),
  addEmployer: Yup.string().required("Employer is required"),
});

const initialValues = {
  ruleTitle: "",
  maximumTenure: "",
  maximumAmount: "",
  rule: "",
  addEmployer: "",
};

// Define options for select inputs
const tenures = [
  { value: "3 months", label: "3 Months" },
  { value: "6 months", label: "6 Months" },
  { value: "12 months", label: "12 Months" },
  { value: "24 months", label: "24 Months" },
  { value: "36 months", label: "36 Months" },
  { value: "48 months", label: "48 Months" },
  { value: "Unlimited", label: "No Maximum Tenure" },
  // Add more options as needed
];

const StatementRules = () => {
  const [message, setMessage] = useState(null);
  const [selectedEmployers, setSelectedEmployers] = useState(null);
  const [employerOptions, setEmployerOptions] = useState([]);

  // Get employers from redux store
  const employers = useSelector(
    (state) => state.employersManagerReducer.employers.employers
  );

  // Fetch employers from redux store
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchEmployers());
  }, [dispatch]);

  useEffect(() => {
    if (!employers) return;
    setEmployerOptions(
      employers?.map((employer) => ({
        value: employer._id,
        label: employer.employersName,
      }))
    );
  }, [employers]);

  const hanleSelectEmployer = (employerOptn) => {
    let tempEmployerOptions = [...employerOptions];
    tempEmployerOptions = tempEmployerOptions.filter(
      (employer) => employer?.value != employerOptn?.value
    );
    setEmployerOptions(tempEmployerOptions);
    if (selectedEmployers && selectedEmployers.includes(employerOptn)) return;
    else if (selectedEmployers && selectedEmployers.length > 0) {
      setSelectedEmployers([...selectedEmployers, employerOptn]);
    } else {
      setSelectedEmployers([employerOptn]);
    }
  };

  const handleRemoveEmployer = (employerOptn) => {
    setEmployerOptions([...employerOptions, employerOptn]);
    let tempSelectedEmployers = [...selectedEmployers];
    tempSelectedEmployers = tempSelectedEmployers.filter(
      (employer) => employer?.value != employerOptn?.value
    );
    setSelectedEmployers(tempSelectedEmployers);
  };

  const addStatementRule = async ({ id, values }) => {
    try {
      const apiUrl = import.meta.env.VITE_BASE_URL;
      // Handle form submission logic here
      await fetch(`${apiUrl}/api/agency/employers/${id}/statementRule`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (selectedEmployers && selectedEmployers.length > 0) {
      selectedEmployers.forEach(async (employer) => {
        await addStatementRule({ id: employer.value, values });
      });
    }

    // Reset form after submission
    resetForm();

    // Display success message
    setMessage("Statement rule created successfully");
    toast.success("Mandate rule added successfully");
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  return (
    <div>
      <div className="TransContainer">
        <DashboardHeadline>Create New Statement Rule</DashboardHeadline>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange }) => (
            <Form>
              <div className="FieldRow rule__title">
                <div className="FieldGroup ">
                  <label htmlFor="ruleTitle">Rule Title</label>
                  <Field
                    type="text"
                    name="ruleTitle"
                    id="ruleTitle"
                    className="Input"
                  ></Field>
                  <ErrorMessage name="ruleTitle" component="div" />
                </div>
              </div>

              <div className="FieldRow">
                <div className="FieldGroup">
                  <label htmlFor="maximumTenure">Maximum Tenure</label>
                  <Field
                    as="select"
                    name="maximumTenure"
                    id="maximumTenure"
                    className="Select"
                  >
                    <option value="" label="Select tenure" />
                    {tenures.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </Field>
                  <ErrorMessage name="maximumTenure" component="div" />
                </div>
                <div className="FieldGroup no__maxTenure ">
                  <div className="Input ">
                    <label>
                      <Field type="checkbox" name="nomaxtenure" />
                    </label>
                    No Maximum Tenure
                  </div>
                </div>
              </div>

              <div className="FieldRow">
                <div className="FieldGroup">
                  <label htmlFor="maximumAmount">Maximum Amount</label>
                  <Field
                    type="text"
                    name="maximumAmount"
                    id="maximumAmount"
                    className="Input"
                  ></Field>
                  <ErrorMessage name="maximumAmount" component="div" />
                </div>
                <div className="RadioCon">
                  <label htmlFor="rule">Rule</label>
                  <div className="Input">
                    <label className="MandateLabel">
                      <Field
                        type="radio"
                        name="rule"
                        value="tenure"
                        className="Gap"
                      />
                      Tenure
                    </label>
                    <label className="MandateLabel">
                      <Field
                        type="radio"
                        name="rule"
                        value="amount"
                        className="Gap"
                      />
                      Amount
                    </label>
                  </div>

                  <ErrorMessage name="rule" component="div" />
                </div>
              </div>

              {/* <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="addEmployers">Add Employers</label>
                <Field
                  type="text"
                  name="addEmployers"
                  id="addEmployers"
                  className="Input"
                ></Field>
                <ErrorMessage name="addEmployers" component="div" />
              </div>
            </div> */}
              {/* <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="addEmployer">Add Employer</label>
                <Field
                  as="select"
                  name="addEmployer"
                  id="addEmployer"
                  className="Select"
                >
                  <option value="" label="Select employers" />
                  {employerOptions?.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </Field>
                <ErrorMessage name="addEmployer" component="div" />
              </div>
            </div> */}

              <div>
                <div className="FieldRow ">
                  <div className="FieldGroup">
                    <label htmlFor="addEmployerStack">
                      Add Employer for Rule Stacking
                    </label>
                    <select
                      name="addEmployer"
                      id="addEmployer"
                      className="Select"
                      onChange={(event) => {
                        handleChange(event);
                        hanleSelectEmployer(
                          employerOptions.find(
                            (option) => option.value === event.target.value
                          )
                        );
                      }}
                    >
                      <option value="" label="Select employers" />
                      {employerOptions?.map((option) => (
                        <option
                          onClick={() => hanleSelectEmployer(option)}
                          key={option.value}
                          value={option.value}
                          label={option.label}
                        />
                      ))}
                      \
                    </select>
                    <ErrorMessage name="addEmployer" component="div" />
                  </div>
                </div>
                {selectedEmployers && (
                  <div className="selected__employer">
                    {selectedEmployers.map((employer) => (
                      <div key={employer.value} className="d-flex gap-2">
                        {employer.label}
                        <button
                          type="button"
                          onClick={() => handleRemoveEmployer(employer)}
                          className="btn btn-danger remove__employer"
                        >
                          <IoMdCloseCircle />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {message && (
                <div style={{ textAlign: "center", color: "#145098" }}>
                  {message}
                </div>
              )}

              <div className="BtnContainer">
                <BocButton
                  fontSize="1.6rem"
                  type="submit"
                  bgcolor="#ecaa00"
                  bradius="18px"
                >
                  Create Rule
                </BocButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default StatementRules;
