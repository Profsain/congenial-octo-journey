import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSetting } from "../../../../redux/reducers/settingReducer";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import PageLoader from "../../shared/PageLoader";
import updateSettings from "./updateSetting";
import { fetchAllLoanOfficers } from "../../../../redux/reducers/loanOfficerReducer";

const apiUrl = import.meta.env.VITE_BASE_URL;

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
  const settings = useSelector(
    (state) => state?.settingReducer?.settings?.settings
  );
  const { allLoanOfficers } = useSelector((state) => state.loanOfficerReducer);
  const status = useSelector((state) => state.settingReducer.status);
  const [settingData, setSettingData] = useState({});

  useEffect(() => {
    dispatch(fetchSetting());
    dispatch(fetchAllLoanOfficers());
  }, [dispatch]);

  useEffect(() => {
    // check settings and update the state
    if (settings && settings.length > 0) {
      setSettingData(settings[0]);
    } else {
      setSettingData({});
    }
  }, [settings]);

  const {
    siteTitle,
    address,
    phoneNumber1,
    phoneNumber2,
    email,
    copyrightText,
  } = settingData;
  const [successMsg, setSuccessMsg] = useState("");
  const [processing, setProcessing] = useState(false);

  const initialValues = {
    siteTitle: siteTitle || "",
    address: address || "",
    phoneNumber1: phoneNumber1 || "",
    phoneNumber2: phoneNumber2 || "",
    email: email || "",
    copyrightText: copyrightText || "",
  };

  const handleSubmit = async (values) => {
    setProcessing(true);

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

      const response = await updateSettings(data);

      if (response) {
        setSuccessMsg("Settings updated successfully");
        setProcessing(false);
      } else {
        setSuccessMsg("Error updating settings");
        setProcessing(false);
      }

      //  resetForm();
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };


  const [selectedLoanOfficer,setSelectedLoanOfficer] = useState([]);

  const fetchSelectedLoanOfficers=async()=>{
    const res = await fetch(`${apiUrl}/api/admin/getSelectedLoanOfficers`);
    const result = await res.json();

    setSelectedLoanOfficer(result.SelectedLoanOfficers);
  }




  useEffect(() => {
    if (allLoanOfficers) {
      setRows(allLoanOfficers)
      fetchSelectedLoanOfficers();
    }
  }, [allLoanOfficers])

  // Sample data for the table
  const [rows, setRows] = useState(allLoanOfficers);

  // Handle checkbox change for a specific row
  const handleCheckboxChange = (Id) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.Id === Id ? { ...row, selected: !row.selected } : row
      )
    );
  };


  

  // Select or deselect all rows
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setRows((prevRows) =>
      prevRows.map((row) => ({ ...row, selected: isChecked }))
    );
  };

  const handleLoanOfficers = async () => {
    const data = [];
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].selected) {
        data.push(rows[i].Name);
      }
    }
  
    console.log("APAPAP", data[0]);
  
    const res = await fetch(`${apiUrl}/api/admin/updateSelectedLoanOfficers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Inform the server that JSON data is being sent
      },
      body: JSON.stringify({ loanOfficers: data }), // Convert to JSON string
    });
  
    const result = await res.json();
    console.log(result);
  };

  return (
    <div className="TransContainer">
      {/* show loading */}
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

      <div>
        <h2 style={{ textAlign: "center", paddingTop: "50px", paddingBottom: "50px" }}>Loan Officers</h2>
        <table border="1" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={rows?.every((row) => row.selected)}
                />
              </th>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>Branch</th>
              <th>Email</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {rows?.map((row) => (
              <tr key={row.Id}>
                <td>
                  <input
                    type="checkbox"
                    checked={row.selected}
                    onChange={() => handleCheckboxChange(row.Id)}
                  />
                </td>
                <td>{row.Id || ""}</td>
                <td>{row.Code || ""}</td>
                <td>{row.Name || ""}</td>
                <td>{row.Branch || ""}</td>
                <td>{row.Email || ""}</td>
                <td>{row.PhoneNumber || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '10px' }}>
          <strong>Selected Loan Officers:</strong>{' '}
          {rows?.filter((row) => row.selected).map((row) => row.Name).join(', ') || 'None'}
        </div>
      </div>
      <div className="BtnContainer">
        <p>{successMsg}</p>
        {processing && <PageLoader />}
        <button
          type="submit"
          width="220px"
          bgcolor="#ecaa00"
          bradius="18px"
          onClick={handleLoanOfficers}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default GeneralSettings;
