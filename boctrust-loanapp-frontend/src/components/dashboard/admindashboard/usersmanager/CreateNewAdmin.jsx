/* eslint-disable no-undef */
import { useState } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import "./CreateNewAdmin.css";
import validationSchema from "./validationSchema";
import adminRoles from "./adminRoles";

const initialValues = {
  fullName: "",
  photo: "",
  email: "",
  phone: "",
  username: "",
  password: "",
  userType: "",
  jobRole: "",
  adminRoles: [],
};

const userTypes = [
  { value: "admin", label: "Admin" },
  { value: "md", label: "MD" },
  { value: "coo", label: "COO" },
  { value: "credit_head", label: "Credit Head" },
  { value: "credit_analyst", label: "Credit Analyst" },
  { value: "operation_staff", label: "Operation Staff" },
  { value: "loan_officer", label: "Loan Officer" },
];

const CreateNewAdmin = ({ func }) => {
  const [notification, setNotification] = useState("");

  const handleSubmit = async (values, { resetForm }) => {
    const apiUrl = import.meta.env.VITE_BASE_URL;

    // Handle form submission logic here
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("photo", values.photo);
    formData.append("email", values.email.toLowerCase());
    formData.append("phone", values.phone);
    formData.append("username", values.username.toLowerCase());
    formData.append("password", values.password);
    formData.append("userType", values.userType);
    formData.append("jobRole", values.jobRole);
    formData.append("adminRoles", values.adminRoles);

    await fetch(`${apiUrl}/api/admin/register`, {
      method: "POST",
      enctype: "multipart/form-data",
      body: formData,
    });

    // clear fields
    resetForm();

    // clear checkbox
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    setNotification("New admin user added successfully");

    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const handleClose = () => {
    func(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="TransContainer">
      <DashboardHeadline>Add New Method</DashboardHeadline>
      <div className="FormCon">
        <form onSubmit={formik.handleSubmit}>
          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter full name"
                id="fullName"
                className="Input"
                onChange={formik.handleChange}
                value={formik.values.fullName}
              />
              {formik.errors.fullName && formik.touched.fullName ? (
                <div className="Error">{formik.errors.fullName}</div>
              ) : null}
            </div>
            <div className="FieldGroup IUpload">
              <label htmlFor="photo">Profile Photo</label>
              <input
                type="file"
                name="photo"
                accept=".jpg, .jpeg, .png"
                id="photo"
                className="Input"
                onChange={(event) => {
                  formik.setFieldValue("photo", event.currentTarget.files[0]);
                }}
                style={{ paddingBottom: "38px", fontSize: "12px" }}
              />
              {formik.errors.photo && formik.touched.photo ? (
                <div className="Error">{formik.errors.photo}</div>
              ) : null}
            </div>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="email">Office Email</label>
              <input
                type="text"
                name="email"
                placeholder="Enter office email"
                id="email"
                className="Input"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.errors.email && formik.touched.email ? (
                <div className="Error">{formik.errors.email}</div>
              ) : null}
            </div>
            <div className="FieldGroup IUpload">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="e.g. 09082312333"
                id="phone"
                className="Input"
                onChange={formik.handleChange}
              />
              {formik.errors.phone && formik.touched.phone ? (
                <div className="Error">{formik.errors.phone}</div>
              ) : null}
            </div>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                id="username"
                className="Input"
                onChange={formik.handleChange}
                value={formik.values.username}
              />
              {formik.errors.username && formik.touched.username ? (
                <div className="Error">{formik.errors.username}</div>
              ) : null}
            </div>
            <div className="FieldGroup IUpload">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                id="password"
                className="Input"
                onChange={formik.handleChange}
              />
              {formik.errors.password && formik.touched.password ? (
                <div className="Error">{formik.errors.password}</div>
              ) : null}
            </div>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="jobRole">Job Role</label>
              <input
                type="text"
                name="jobRole"
                placeholder="Enter job role"
                id="jobRole"
                className="Input"
                onChange={formik.handleChange}
                value={formik.values.jobRole}
              />
              {formik.errors.jobRole && formik.touched.jobRole ? (
                <div className="Error">{formik.errors.jobRole}</div>
              ) : null}
            </div>

            <div className="FieldGroup">
              <label htmlFor="userType">Admin Type</label>
              <select
                name="userType"
                id="userType"
                className="Input"
                onChange={formik.handleChange}
              >
                <option value="">Select Role</option>
                {userTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {formik.errors.userType && formik.touched.userType ? (
                <div className="Error">{formik.errors.userType}</div>
              ) : null}
            </div>
          </div>

          {/* adminRoles checkbox options section */}
          <div className="AdminRoles">
            <label htmlFor="adminRoles">Admin Roles</label>

            <div className="CheckboxContainer">
              {adminRoles.map((option) => (
                <div key={option.value} className="CheckboxGroup">
                  <input
                    type="checkbox"
                    name="adminRoles"
                    id={option.value}
                    value={option.value}
                    onChange={formik.handleChange}
                  />
                  <label htmlFor={option.value}>{option.label}</label>
                </div>
              ))}
            </div>
            {formik.errors.adminRoles && formik.touched.adminRoles ? (
              <div className="Error">{formik.errors.adminRoles}</div>
            ) : null}
          </div>

          {/* notification message */}
          <div className="Notification">
            <p>{notification}</p>
          </div>

          <div className="BtnRow">
            <div className="BtnContainer">
              <BocButton
                fontSize="1.6rem"
                type="button"
                bgcolor="gray"
                bradius="18px"
                func={handleClose}
              >
                Cancel
              </BocButton>
            </div>
            <div className="BtnContainer">
              <BocButton
                fontSize="1.6rem"
                type="submit"
                bgcolor="#ecaa00"
                bradius="18px"
              >
                Submit
              </BocButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

CreateNewAdmin.propTypes = {
  func: PropTypes.func,
};

export default CreateNewAdmin;
