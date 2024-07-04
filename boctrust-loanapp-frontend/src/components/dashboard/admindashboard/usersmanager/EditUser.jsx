/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdmins } from "../../../../redux/reducers/adminUserReducer";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./CreateNewAdmin.css";
import { userTypes } from "../../../../lib/userRelated";
import PageLoader from "../../shared/PageLoader";
import { toast } from "react-toastify";

const EditUser = (props) => {
  const dispatch = useDispatch();
  const user = props.userobj;

  const viewEdit = props.viewEdit;

  // form state
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editUserType, setEditUserType] = useState("");
  const [editAdminRoles, setEditAdminRoles] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const { rolesAndPermission } = useSelector((state) => state.adminUserReducer);

  // pass object data to form
  const updateFormObject = () => {
    setEditFullName(user.fullName);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditUsername(user.username);
    setEditUserType(user.userType);
    setEditAdminRoles(user?.userRole);
  };

  useEffect(() => {
    updateFormObject();
  }, [user]);

  // clear form fields
  const clearForm = () => {
    setEditFullName("");
    setEditEmail("");
    setEditPhone("");
    setEditUsername("");
    setEditPassword("");
    setEditUserType("");

    setEditAdminRoles("");
    dispatch(fetchAdmins());
  };

  // close model box
  const handleClose = () => {
    props.onHide();
    clearForm();
  };

  // submit update to api endpoint
  const handleSubmit = async (e) => {
    try {
      setIsLoading(true);

      e.preventDefault();

      const apiUrl = import.meta.env.VITE_BASE_URL;
      const updatedUser = {
        fullName: editFullName,
        email: editEmail,
        phone: editPhone,
        username: editUsername,
        password: editPassword,
        userType: editUserType,
        userRole: editAdminRoles,
      };

      const res = await fetch(`${apiUrl}/api/admin/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (res.ok) {
        clearForm();
        handleClose();
        toast.success("User has been updated");
      } else {
        const errorResponse = await res.json();
        toast.error(errorResponse?.error || "Something Went Wrong");
      }
    } catch (error) {
      toast.error(error?.reponse?.data?.error || "Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter "
      centered
      backdrop="static"
      className="modal__container"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit User Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* edit form */}
        <form onSubmit={handleSubmit}>
          <div className="FieldGroup">
            <label htmlFor="fullName" style={{ marginTop: "-1rem" }}>
              Full Name
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editFullName}
              onChange={(e) => setEditFullName(e.target.value)}
            />
          </div>

          <div className="FieldGroup">
            <label htmlFor="email" style={{ marginTop: "-1rem" }}>
              Email Address
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
          </div>

          <div className="FieldGroup">
            <label htmlFor="phone" style={{ marginTop: "-1rem" }}>
              Phone Number
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />
          </div>

          <div className="FieldGroup">
            <label htmlFor="username" style={{ marginTop: "-1rem" }}>
              Username
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
            />
          </div>

          <div className="FieldGroup">
            <label htmlFor="userType">User Type</label>
            <select
              name="userType"
              id="userType"
              className="Input w-100"
              disabled={viewEdit !== "edit"}
              value={editUserType}
              onChange={(e) => setEditUserType(e.target.value)}
            >
              {userTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {rolesAndPermission && (
            <div className="FieldGroup">
              <label htmlFor="userRole">User Roles</label>
              <select
                name="userRole"
                value={editAdminRoles?._id}
                disabled={viewEdit !== "edit" || !editUserType || editUserType === "super_admin"}  
                id="userRole"
                className="Input  w-100"
              >
                <option value="">Select Role</option>
                {rolesAndPermission.map((option) => (
                  <option
                    onClick={() => setEditAdminRoles(option._id)}
                    key={option._id}
                    value={option._id}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* adminRoles checkbox options section */}

          {/* <div className="AdminRoles">
            <label htmlFor="adminRoles">Admin Roles</label>

            <div className="CheckboxContainer">
              {adminRoles?.map((option) => (
                <div key={option.value} className="CheckboxGroup">
                  <input
                    type="checkbox"
                    name="adminRoles"
                    checked={editAdminRoles.includes(option.value)}
                    id={option.value}
                    value={option.value}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (checked) {
                        setEditAdminRoles([...editAdminRoles, e.target.value]);
                      } else {
                        setEditAdminRoles(
                          editAdminRoles.filter(
                            (item) => item !== e.target.value
                          )
                        );
                      }
                    }}
                  />
                  <label htmlFor={option.value}>{option.label}</label>
                </div>
              ))}
            </div>
          </div> */}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>

        {viewEdit === "edit" && (
          <Button variant="primary" type="button" onClick={handleSubmit}>
            {isLoading ? <PageLoader width="16px" /> : "Update"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EditUser;
