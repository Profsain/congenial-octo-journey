import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import SelectField from "../../../loanapplication/loanform/formcomponents/SelectField";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployerLetterRules } from "../../../../redux/reducers/employerLetterRuleReducer";
import { fetchStatementRules } from "../../../../redux/reducers/statementRuleReducer";
import { fetchMandateRules } from "../../../../redux/reducers/mandateRuleReducer";
import PageLoader from "../../shared/PageLoader";
import apiClient from "../../../../lib/axios";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  employersId: Yup.string().required("Employers ID is required"),
  employersName: Yup.string().required("Employers name is required"),
  employersAddress: Yup.string().required("Employer address is required"),
});

const initialValues = {
  employersId: "",
  employersName: "",
  employersAddress: "",
  mandateRule: "",
  statementRule: "",
  employerLetterRule: "",
};

const AddEmployer = () => {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const { employerLetterRules } = useSelector(
    (state) => state.employerLetterRuleReducer
  );
  const { statementRules } = useSelector((state) => state.statementRuleReducer);
  const { mandateRules } = useSelector((state) => state.mandateRuleReducer);

  useEffect(() => {
    const getData = async () => {
      try {
        await dispatch(fetchEmployerLetterRules());
        await dispatch(fetchStatementRules());
        await dispatch(fetchMandateRules());
      } catch (error) {
        toast.error(error.message);
      }
    };

    getData();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsLoading(true);
      
      // Handle form submission logic here
      await apiClient.post(`/agency/employers`, values);

      // Reset form after submission
      resetForm();
      // Set message after successful submission
      setMessage("Employer added successfully");
      toast.success("Employer added successfully");
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add__employerContainer">
      <div className="TransContainer">
        <DashboardHeadline>Add New Employer</DashboardHeadline>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="appForm">
            <div className="FieldRow">
              <div className="FieldGroup mGroup">
                <label htmlFor="employersId">Employers ID</label>
                <Field
                  type="text"
                  name="employersId"
                  id="employersId"
                  className="Input"
                />
                <ErrorMessage
                  name="employersId"
                  component="div"
                  className="error__msg"
                />
              </div>

              <div className="FieldGroup">
                <label htmlFor="employersName">Employers Name</label>
                <Field
                  type="text"
                  name="employersName"
                  id="employersName"
                  className="Input"
                />
                <ErrorMessage
                  name="employersName"
                  component="div"
                  className="error__msg"
                />
              </div>
            </div>

            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="employersAddress">Employers Address</label>
                <Field
                  type="text"
                  name="employersAddress"
                  id="employersAddress"
                  className="Input"
                />
                <ErrorMessage
                  name="employersAddress"
                  component="div"
                  className="error__msg"
                />
              </div>

              <div className="FieldGroup">
                <SelectField label="Mandate Rule" name="mandateRule">
                  <option value="">Select</option>
                  {/* <option value="000">No Bank</option> */}
                  {mandateRules ? (
                    mandateRules?.map((mandateRule) => {
                      return (
                        <option key={mandateRule._id} value={mandateRule._id}>
                          {mandateRule.mandateTitle}
                        </option>
                      );
                    })
                  ) : (
                    <div>
                      <PageLoader width="28px" />
                    </div>
                  )}
                </SelectField>
                <div className="error__msg" />
              </div>
            </div>

            <div className="FieldRow">
              <div className="FieldGroup">
                <SelectField label="Statement Rule" name="statementRule">
                  <option value="">Select</option>
                  {/* <option value="000">No Bank</option> */}
                  {statementRules ? (
                    statementRules?.map((statementRule) => {
                      return (
                        <option
                          key={statementRule._id}
                          value={statementRule._id}
                        >
                          {statementRule.ruleTitle}
                        </option>
                      );
                    })
                  ) : (
                    <div>
                      <PageLoader width="28px" />
                    </div>
                  )}
                </SelectField>
                <div className="error__msg" />
              </div>

              <div className="FieldGroup">
                <SelectField
                  label="Employment Letter Rule"
                  name="employerLetterRule"
                >
                  <option value="">Select</option>
                  {/* <option value="000">No Bank</option> */}
                  {employerLetterRules ? (
                    employerLetterRules?.map((employerRule) => {
                      return (
                        <option key={employerRule._id} value={employerRule._id}>
                          {employerRule.ruleTitle}
                        </option>
                      );
                    })
                  ) : (
                    <div>
                      <PageLoader width="28px" />
                    </div>
                  )}
                </SelectField>
                <div className="error__msg" />
              </div>
            </div>

            {message && (
              <div style={{ textAlign: "center", color: "#145098" }}>
                {message}
              </div>
            )}
            <div className="BtnContainer">
              <BocButton
                fontSize="1.2rem"
                type="submit"
                bgcolor="#ecaa00"
                bradius="16px"
                width={"200px"}
              >
                Add Employer
                {isLoading && <PageLoader strokeColor="#fff" width="20px" />}
              </BocButton>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default AddEmployer;
