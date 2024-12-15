import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import BocButton from "../../shared/BocButton";
import NextPreBtn from "../../shared/NextPreBtn";
import handleAdminRoles from "../../../../../utilities/getAdminRoles";
import sortByCreatedAt from "../../shared/sortedByDate";

// custom hook
import usePaginatedData from "../../../../customHooks/usePaginationData";

const RepaymentList = ({ count, searchTerms, setTotalPages, currentPage }) => {
  const styles = {
    table: {
      //   margin: "0 2rem 0 3rem",
      fontSize: "14px",
    },
    head: {
      color: "#fff",
      fontSize: "1rem",
    },
    approved: {
      color: "#5cc51c",
    },
    completed: {
      color: "#f64f4f",
    },
    padding: {
      color: "#ecaa00",
    },
  };

  // role based access
  const currentUser = useSelector((state) => state.adminAuth.user);
  const [admin, setAdmin] = useState("");
  const [adminRoles, setAdminRoles] = useState([]);
  useEffect(() => {
    if (currentUser) {
      if (currentUser.userType === "admin" || currentUser.userType === "md") {
        setAdmin("admin");
      }

      handleAdminRoles(currentUser, setAdminRoles);
    }
  }, []);

  const [ repaymentList, setRepaymentList] = useState([])

  // custom pagination update
  // const { paginatedData: paginatedList, totalPages } = usePaginatedData(
  //   [],
  //   count,
  //   currentPage
  // );

  // useEffect(() => {
  //   setRepaymentList(paginatedList); // Update local state with paginated data
  // }, [paginatedList]);

  // useEffect(() => {
  //   setTotalPages(totalPages); // Update total pages when it changes
  // }, [totalPages, setTotalPages]);

  return (
    <div>
      <DashboardHeadline
        height="52px"
        mspacer="2rem 0 -2.55rem -1rem"
        bgcolor="#145098"
      ></DashboardHeadline>
      <div style={styles.table}>
        <Table borderless hover responsive="sm">
          <thead style={styles.head}>
            <tr>
              <th>Loan ID</th>
              <th>Payment Date</th>
              <th>Principle Amount</th>
              <th>Interest</th>
              <th>Late Penalties</th>
              <th>Total Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>No Record </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default RepaymentList;
