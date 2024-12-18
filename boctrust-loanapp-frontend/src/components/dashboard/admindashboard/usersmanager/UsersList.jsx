import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdmins } from "../../../../redux/reducers/adminUserReducer";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
// import DashboardHeadline from "../../shared/DashboardHeadline";
import PageLoader from "../../shared/PageLoader";
import NoResult from "../../../shared/NoResult";
import ActionNotification from "../../shared/ActionNotification";
import EditUser from "./EditUser";

// function
import searchList from "../../../../../utilities/searchListFunc";
import handleAdminRoles from "../../../../../utilities/getAdminRoles";
import apiClient from "../../../../lib/axios";

const UsersList = ({ count, searchTerms }) => {
  const styles = {
    head: {
      color: "#fff",
      fontSize: "1rem",
      backgroundColor: "#145098",
    },
    img: {
      width: "50px",
      height: "40px",
    },
    completed: {
      color: "#5cc51c",
    },
    table: {
      overflow: "auto",
    },
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  const users = useSelector((state) => state.adminUserReducer.admins.users);
  const status = useSelector((state) => state.adminUserReducer.status);

  // local state
  const [usersList, setUsersList] = useState(users);
  const [show, setShow] = useState(false);
  const [action, setAction] = useState(false);
  const [userId, setUserId] = useState("");
  const [userObj, setUserObj] = useState({});
  const [adminRoles, setAdminRoles] = useState([]);
  const [viewEdit, setViewEdit] = useState("edit");

  // update usersList to show 10 users on page load
  useEffect(() => {
    setUsersList(users?.slice(0, count));
  }, [users, count]);

  useEffect(() => {
    if (searchTerms.length >= 3 || searchTerms.length == 0) {
      dispatch(fetchAdmins(searchTerms));
    }
  }, [searchTerms]);

  // handle action select
  const handleAction = (e) => {
    const option = e.target.value;
    const id = e.target.id;

    // find selected user by id
    const user = users.find((user) => user._id === id);
    setUserObj(user);
    setUserId(id);

    // check array of adminRoles
    handleAdminRoles(user, setAdminRoles);

    if (option === "edit") {
      setShow(true);
      setViewEdit("edit");
    } else if (option === "view") {
      setShow(true);
      setViewEdit("view");
    } else if (option === "delete") {
      setAction(true);
    }
  };

  // handle delete
  const handleDelete = async () => {
    await apiClient.delete(`/admin/users/${userId}`);

    // remove user from usersList
    dispatch(fetchAdmins());
    setAction(false);
  };

  return (
    <>
      <div className="">
        <div style={styles.table}>
          <Table hover responsive="sm ">
            <thead style={styles.head}>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Username</th>

                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            {status === "loading" ? (
              <tr>
                <td colSpan="8">
                  <PageLoader />
                </td>
              </tr>
            ) : (
              <tbody>
                {usersList?.length === 0 && <NoResult name="user" />}
                {usersList?.map((user) => (
                  <tr key={user._id} className="">
                    <td>
                      <img
                        src={user.imageUrl}
                        alt="method-logo"
                        style={styles.img}
                      />
                    </td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.username}</td>

                    <td>{user?.userRole?.label || "All"}</td>
                    <td>
                      <span className="badge bg-success">
                        {user.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <select
                        name="action"
                        className="action"
                        id={user._id}
                        onChange={handleAction}
                      >
                        <option value="">Action</option>
                        <option value="edit">Edit</option>
                        <option value="view">View</option>
                        <option value="delete">Delete</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </Table>
        </div>
      </div>

      {/* edit user popup model */}
      {show && (
        <EditUser
          show={show}
          onHide={() => setShow(false)}
          userobj={userObj}
          adminRoles={adminRoles}
          viewEdit={viewEdit}
        />
      )}

      {/* acton popup model */}
      <ActionNotification
        show={action}
        handleClose={() => setAction(false)}
        handleProceed={handleDelete}
      />
    </>
  );
};

UsersList.propTypes = {
  count: PropTypes.number,
  searchTerms: PropTypes.string,
};

export default UsersList;
