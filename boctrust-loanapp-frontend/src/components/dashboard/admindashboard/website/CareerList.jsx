import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCareer } from "../../../../redux/reducers/careerReducer";
import Table from "react-bootstrap/Table";
import PageLoader from "../../shared/PageLoader";
import ActionNotification from "../../shared/ActionNotification";
import "../../Dashboard.css";
import EditCareer from "./EditCareer";
import NoResult from "../../../shared/NoResult";
// functions
import getDateOnly from "../../../../../utilities/getDate";
import apiClient from "../../../../lib/axios";
// import searchList from "../../../../../utilities/searchListFunc";

const CareerList = ({ count, searchTerms }) => {
  const [openModel, setOpenModel] = useState(false);
  const [action, setAction] = useState(false);
  const [actionOption, setActionOption] = useState("");
  const [careerId, setCareerId] = useState("");
  const [careerObj, setCareerObj] = useState({});

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCareer());
  }, [dispatch]);

  const careers = useSelector((state) => state.careerReducer.careers.careers);
  const status = useSelector((state) => state.careerReducer.status);
  const [careerList, setCareerList] = useState(careers);

  // update careerList to show 10 jobss on page load
  // or when count changes
  useEffect(() => {
    setCareerList(careers?.slice(0, count));
  }, [careers, count]);

  // update careerList on search
  const handleSearch = () => {
    // const currSearch = searchList(careers, searchTerms, "title");
    // setCareerList(currSearch?.slice(0, count));
  };
  useEffect(() => {
    handleSearch();
  }, [searchTerms]);

  // handle edit action
  const handleEdit = () => {
    setOpenModel(true);
  };

  // handle select action
  const handleSelect = (e) => {
    const option = e.target.value;
    const id = e.target.id;
    setCareerId(id);

    // filter jobs object by id
    const career = careers.find((jobs) => jobs._id === id);
    setCareerObj(career);

    if (option === "edit") {
      setActionOption("edit");
      handleEdit();
    } else if (option === "delete") {
      setAction(true);
    } else if (option === "view") {
      setActionOption("view");
      handleEdit();
    }
  };

  // handle delete action
  const handleDelete = async () => {
    await apiClient.delete(`/career/careers/${careerId}`);

    dispatch(fetchCareer());
    setAction(false);
  };

  const styles = {
    head: {
      color: "#145098",
      fontSize: "1.2rem",
      backgroudColor: "#f9f9f9",
    },
    select: {
      backgroundColor: "#ecaa00",
      color: "#fff",
      border: "none",
      fontSize: "1rem",
      marginTop: "0.1rem",
      padding: "0.2rem 0.5rem",
    },
  };

  return (
    <>
      {status === "loading" ? (
        <PageLoader />
      ) : (
        <div className="ListSec">
          <div style={styles.table}>
            <Table hover responsive="sm">
              <thead style={styles.head}>
                <tr>
                  <th>Jobs</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {careerList?.length === 0 && <NoResult name="jobs" />}
                {careerList?.map((jobs) => (
                  <tr key={jobs._id}>
                    <td>{jobs.jobtitle}</td>
                    <td>{jobs.description.slice(0, 60)}....</td>
                    <td>{getDateOnly(jobs.dateposted)}</td>
                    <td>
                      <div>
                        <select
                          name="action"
                          id={jobs._id}
                          onChange={(e) => handleSelect(e)}
                          style={styles.select}
                        >
                          <option value="">Action</option>
                          <option value="view">View</option>
                          <option value="edit">Edit</option>
                          <option value="delete">Delete</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}

      <EditCareer
        onHide={() => setOpenModel(false)}
        show={openModel}
        career={careerObj}
        option={actionOption}
      />
      <ActionNotification
        show={action}
        handleClose={() => setAction(false)}
        handleProceed={handleDelete}
      />
    </>
  );
};

CareerList.propTypes = {
  count: PropTypes.number,
  searchTerms: PropTypes.string,
};

export default CareerList;
