import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSetting } from "../../../../redux/reducers/settingReducer";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import PageLoader from "../../shared/PageLoader";
import updateSettings from "./updateSetting";

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


const EmailSetting = () => {
  const dispatch = useDispatch();
  const settings = useSelector(
    (state) => state.settingReducer?.settings?.settings[0]
  );
  const status = useSelector((state) => state.settingReducer.status);

  useEffect(() => {
    dispatch(fetchSetting());
  }, [dispatch]);

  const {
    mailType,
    fromEmail,
    fromName,
    smtpName,
    smtpPort,
    smtpUsername,
    smtpPassword,
    smtpEncryption,
  } = settings;

  const initialValues = {
    mailType: mailType || "",
    fromEmail: fromEmail || "",
    fromName: fromName || "",
    smptName: smtpName || "",
    smptPort: smtpPort || "",
    smptUsername: smtpUsername || "",
    smptPassword: smtpPassword || "",
    smptEncryption: smtpEncryption || "",
  };

   const handleSubmit = async (values) => {
     try {
       // Handle form submission logic here
       const data = {
          mailType: values.mailType,
          fromEmail: values.fromEmail,
          fromName: values.fromName,
          smtpName: values.smptName,
          smtpPort: values.smptPort,
          smtpUsername: values.smptUsername,
          smtpPassword: values.smptPassword,
          smtpEncryption: values.smptEncryption,
       };

       console.log(data);

       const response = await updateSettings(data);
       console.log("Settings updated:", response);

       //  resetForm();
     } catch (error) {
       console.error("Error updating settings:", error);
     }
   };

  return (
    <div className="TransContainer">
      {status === "loading" ? (
        <PageLoader />
      ) : (
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
                  type="text"
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
                <Field
                  type="text"
                  name="smptUsername"
                  id="smptUsername"
                  className="Input"
                />
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
      )}
    </div>
  );
};

export default EmailSetting;
