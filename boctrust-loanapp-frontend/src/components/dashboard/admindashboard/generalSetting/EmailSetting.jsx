
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  mailType: Yup.string().required("Mail type is required"),
  fromEmail: Yup.string().required("From email is required"),
  fromName: Yup.string().required("From name is required"),
  smptName: Yup.string().required("SMPT name is required"),
  smptPort: Yup.string().required("SMPT port is required"),
  smptUsername: Yup.string().required("SMPT username is required"),
  smptPassword: Yup.string().required("SMPT password is required"),
  smptEncryption: Yup.string().required("SMPT encryption is required"),
});

const initialValues = {
  mailType: "",
  fromEmail: "",
  fromName: "",
  smptName: "",
  smptPort: "",
  smptPassword: "",
  smptEncryption: "",
};

const apiUrl = import.meta.env.VITE_BASE_URL;

const EmailSetting = () => {
  const handleSubmit = async (values, { resetForm }) => {
    // Handle form submission logic here
    await fetch(`${apiUrl}api/account/accounts`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(values),
    });
    resetForm();
  };

  return (
    <div className="TransContainer">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="mailType">Mail Type</label>
              <Field
                type="text"
                name="mailType"
                id="mailType"
                className="Input"
              />
              <ErrorMessage name="mailType" component="div" />
            </div>
            <div className="FieldGroup">
              <label htmlFor="fromEmail">From Email</label>
              <Field
                type="number"
                name="fromEmail"
                id="fromEmail"
                className="Input"
              />
              <ErrorMessage name="fromEmail" component="div" />
            </div>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="smptName">SMPT Name</label>
              <Field
                type="text"
                name="smptName"
                id="smptName"
                className="Input"
              />
              <ErrorMessage name="smptName" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="smptPort">SMPT Port</label>
              <Field
                type="text"
                name="smptPort"
                id="smptPort"
                className="Input"
              />
              <ErrorMessage name="smptPort" component="div" />
            </div>
          </div>
          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="smptUsername">SMPT Username</label>
              <Field type="text" name="smptUsername" id="smptUsername" className="Input" />
              <ErrorMessage name="smptUsername" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="smptPassword">SMPT Password</label>
              <Field
                type="text"
                name="smptPassword"
                id="smptPassword"
                className="Input"
              />
              <ErrorMessage name="smptPassword" component="div" />
            </div>
          </div>

          <div className="BtnContainer">
            <BocButton
              type="submit"
              width="220px"
              bgcolor="#ecaa00"
              bradius="18px"
            >
              Save Settings
            </BocButton>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default EmailSetting