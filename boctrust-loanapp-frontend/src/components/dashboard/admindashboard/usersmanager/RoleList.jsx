import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "../../../../redux/reducers/adminUserReducer";
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

const RoleList = ({ count, searchTerms }) => {
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
  };

  const { roles } = useSelector((state) => state.adminUserReducer);
  const status = useSelector((state) => state.adminUserReducer.status);

  // local state
  const [rolesList, setRoleList] = useState(roles);
  const [show, setShow] = useState(false);
  const [action, setAction] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [roleObj, setRoleObj] = useState({});
  const [adminRoles, setAdminRoles] = useState([]);
  const [viewEdit, setViewEdit] = useState("edit");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  // update rolesList to show 10 roles on page load
  useEffect(() => {
    setRoleList(roles?.slice(0, count));
  }, [roles, count]);

  // update rolesList on search
  const handleSearch = () => {
    const currSearch = searchList(roles, searchTerms, "label");
    setRoleList(currSearch);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerms]);

  // handle action select
  const handleAction = (e) => {
    const option = e.target.value;
    const id = e.target.id;

    // find selected role by id
    const role = roles.find((role) => role._id === id);
    setRoleObj(role);
    setRoleId(id);

    // check array of adminRoles
    handleAdminRoles(role, setAdminRoles);

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
    const apiUrl = import.meta.env.VITE_BASE_URL;
    await fetch(`${apiUrl}/api/admin/roles/${roleId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // remove role from rolesList
    dispatch(fetchRoles());
    setAction(false);
  };

  return (
    <>
      {status === "loading" && <PageLoader />}

      <div className="ListSec">
        <div style={styles.table}>
          <Table hover responsive="sm">
            <thead style={styles.head}>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rolesList?.length === 0 && <NoResult name="role" />}
              {rolesList?.map((role, index) => (
                <tr key={role._id} className="">
                  <td>{index + 1}</td>
                  <td>{role.label}</td>
                  <td>{role.description}</td>

                  <td>
                    <select
                      name="action"
                      className="action"
                      id={role._id}
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
          </Table>
        </div>
      </div>

      {/* edit role popup model */}
      {show && (
        <EditUser
          show={show}
          onHide={() => setShow(false)}
          roleobj={roleObj}
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

RoleList.propTypes = {
  count: PropTypes.number,
  searchTerms: PropTypes.string,
};

export default RoleList;
