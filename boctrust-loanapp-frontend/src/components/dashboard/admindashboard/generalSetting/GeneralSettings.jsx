import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState} from "react";
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
  copyrightText: Yup.string().required("copyright is required"),
});


const GeneralSettings = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state?.settingReducer?.settings?.settings);
  const status = useSelector((state) => state.settingReducer.status);
  const [settingData, setSettingData] = useState({});

    useEffect(() => {
      dispatch(fetchSetting());
    }, [dispatch]);

    useEffect(() => {
      // check settings and update the state
      if (settings && settings.length > 0) {
        setSettingData(settings[0]);
      } else {
        setSettingData({});
      }
    }, [settings]);

  const { siteTitle, address, phoneNumber1, phoneNumber2, email, copyrightText } = settingData;

  const initialValues = {
    siteTitle: siteTitle || "",
    address: address || "",
    phoneNumber1: phoneNumber1 || "",
    phoneNumber2: phoneNumber2 || "",
    email: email || "",
    copyrightText: copyrightText || "",
  };

 const handleSubmit = async (values) => {
   try {
     // Handle form submission logic here
     const data = {
       siteTitle: values.siteTitle,
       address: values.address,
       phoneNumber1: values.phoneNumber1,
       phoneNumber2: values.phoneNumber2,
       email: values.email,
       copyrightText: values.copyrightText,
     };

     await updateSettings(data);
   

    //  resetForm();
   } catch (error) {
     console.error("Error updating settings:", error);
   }
 };



  return (
    <div className="TransContainer">
      {/* show loading */}
      {status === "loading" ? (<PageLoader />) : ( <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="siteTitle">SiteTitle</label>
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
              <label htmlFor="email">Email Address</label>
              <Field
                type="text"
                name="email"
                id="email"
                className="Input"
              />
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
      </Formik>)}
     
    </div>
  );
};

export default GeneralSettings;
