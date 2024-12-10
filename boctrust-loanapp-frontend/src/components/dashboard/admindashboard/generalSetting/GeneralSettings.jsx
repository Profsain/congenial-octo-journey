import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSetting } from "../../../../redux/reducers/settingReducer";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import PageLoader from "../../shared/PageLoader";
import updateSettings from "./updateSetting";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  siteTitle: Yup.string().required("Site title is required"),
  address: Yup.string().required("Address is required"),
  phoneNumber1: Yup.string().required("Phone number is required"),
  phoneNumber2: Yup.string().required("Phone number is required"),
  email: Yup.string().required("Email is required"),
  copyrightText: Yup.string().required("Copyright is required"),
  // top up update
  topUpEligibilityMonths: Yup.number()
    .min(1, "Must be at least 1 month")
    .required("Top-Up Eligibility Months is required"),
});

const GeneralSettings = () => {
  const dispatch = useDispatch();
  const settings = useSelector(
    (state) => state?.settingReducer?.settings?.settings
  );
  const status = useSelector((state) => state.settingReducer.status);
  const [settingData, setSettingData] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    dispatch(fetchSetting());
  }, [dispatch]);

  useEffect(() => {
    if (settings && settings.length > 0) {
      setSettingData(settings[0]);
    } else {
      setSettingData({});
    }
  }, [settings]);

  const initialValues = {
    siteTitle: settingData.siteTitle || "",
    address: settingData.address || "",
    phoneNumber1: settingData.phoneNumber1 || "",
    phoneNumber2: settingData.phoneNumber2 || "",
    email: settingData.email || "",
    copyrightText: settingData.copyrightText || "",
    topUpEligibilityMonths: settingData.topUpEligibilityMonths || 6, // Default value
  };

  const handleSubmit = async (values) => {
    setProcessing(true);
    try {
      const response = await updateSettings(values);
      if (response) {
        setSuccessMsg("Settings updated successfully");
      } else {
        setSuccessMsg("Error updating settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    }
    setProcessing(false);
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
                <label htmlFor="siteTitle">Site Title</label>
                <Field
                  type="text"
                  name="siteTitle"
                  id="siteTitle"
                  className="Input"
                />
                <ErrorMessage name="siteTitle" component="div" />
              </div>
              <div className="FieldGroup">
                <label htmlFor="address">Address</label>
                <Field
                  type="text"
                  name="address"
                  id="address"
                  className="Input"
                />
                <ErrorMessage name="address" component="div" />
              </div>
            </div>

            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="phoneNumber1">Phone Number 1</label>
                <Field
                  type="text"
                  name="phoneNumber1"
                  id="phoneNumber1"
                  className="Input"
                />
                <ErrorMessage name="phoneNumber1" component="div" />
              </div>
              <div className="FieldGroup">
                <label htmlFor="phoneNumber2">Phone Number 2</label>
                <Field
                  type="text"
                  name="phoneNumber2"
                  id="phoneNumber2"
                  className="Input"
                />
                <ErrorMessage name="phoneNumber2" component="div" />
              </div>
            </div>

            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="email">Email</label>
                <Field type="text" name="email" id="email" className="Input" />
                <ErrorMessage name="email" component="div" />
              </div>
              <div className="FieldGroup">
                <label htmlFor="copyrightText">Copyright Text</label>
                <Field
                  type="text"
                  name="copyrightText"
                  id="copyrightText"
                  className="Input"
                />
                <ErrorMessage name="copyrightText" component="div" />
              </div>
            </div>

              {/* top up loan update */}
            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="topUpEligibilityMonths">
                  Top-Up Eligibility (Months)
                </label>
                <Field
                  type="number"
                  name="topUpEligibilityMonths"
                  id="topUpEligibilityMonths"
                  className="Input"
                />
                <ErrorMessage name="topUpEligibilityMonths" component="div" />
              </div>
            </div>

            <div className="BtnContainer">
              <p>{successMsg}</p>
              {processing && <PageLoader />}
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

export default GeneralSettings;
