import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import { Table } from "react-bootstrap";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import ViewBySection from "../remita/ViewBySection.jsx";
import NoResult from "../../../shared/NoResult.jsx";

import useSearch from "../../../../../utilities/useSearchName.js";
import useSearchByDate from "../../../../../utilities/useSearchByDate.js";
import useSearchByDateRange from "../../../../../utilities/useSearchByDateRange.js";
import getNextMonthDate from "../../../../../utilities/getNextMonthDate";
import "./debit.css";

const DebitTransactions = () => {
  const styles = {
    btnBox: {
      display: "flex",
      justifyContent: "center",
    },
    table: {
      //   margin: "0 2rem 0 3rem",
      fontSize: "14px",
    },
    head: {
      color: "#fff",
      fontSize: "1rem",
    },
    approved: {
      backgroundColor: "#5cc51c",
    },
    approve: {
      backgroundColor: "#ecaa00",
    },
    pending: {
      backgroundColor: "red",
    },
    review: {
      backgroundColor: "#145098",
    },
    pendingTxt: {
      color: "red",
    },
    activeTxt: {
      color: "green",
    },
  };

  // fetch all customer
  const dispatch = useDispatch();
  const customers = useSelector(
    (state) => state.customerReducer.customers.customer
  );

  const status = useSelector((state) => state.customerReducer.status);

  useEffect(() => {
    dispatch(fetchAllCustomer());
  }, [dispatch]);

  // filter customer by remitaStatus
  const [remitaCustomers, setRemitaCustomers] = useState([]);
  // check if customer is not empty and filter by remitaStatus
  useEffect(() => {
    if (customers?.length > 0) {
      const result = customers.filter(
        (customer) => customer?.remita.loanStatus === "approved"
      );
      setRemitaCustomers(result);
    }
  }, [customers]);

  // handle search by
  const { searchTerm, setSearchTerm, filteredData } = useSearch(
    remitaCustomers,
    "firstname"
  );

  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    setRemitaCustomers(filteredData);
  }, [searchTerm, filteredData]);

  // handle search by date
  const { filteredDateData } = useSearchByDate(remitaCustomers, "createdAt");
  const searchByDate = () => {
    setRemitaCustomers(filteredDateData);
  };

  // handle list reload
  const handleReload = () => {
    setDateRange({
      fromDate: "",
      toDate: "",
    });
    dispatch(fetchAllCustomer());
    setRemitaCustomers(remitaCustomers);
  };

  // handle search by date range
  const { searchData } = useSearchByDateRange(
    remitaCustomers,
    dateRange,
    "createdAt"
  );

  useEffect(() => {
    setRemitaCustomers(searchData);
  }, [searchData]);

  return (
    <div>
      {/* view by section */}
      <ViewBySection
        firstBtn="Debits Today"
        setSearch={setSearchTerm}
        setDateRange={setDateRange}
        dateRange={dateRange}
        searchDateFunc={searchByDate}
        handleReload={handleReload}
      />

      {/* data loader */}
      {status === "loading" && <PageLoader />}

      {/* table section */}
      <div className="RBox">
        <DashboardHeadline
          height="52px"
          mspacer="2rem 0 -2.55rem -1rem"
          bgcolor="#145098"
        ></DashboardHeadline>
        <div style={styles.table}>
          <Table borderless hover responsive="sm">
            <thead style={styles.head}>
              <tr>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Account Number</th>
                <th>Loan Amount</th>
                <th>Debit Mandate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* <tr>
                <td colSpan="10">
                  {remitaCustomers?.length === 0 && (
                    <NoResult name="Customer" />
                  )}
                </td>
              </tr> */}
              <tr>
                <td>24-05-2-24</td>
                <td>Tunji Adams</td>
                <td>745787666</td>
                <td>N54,900</td>
                <td>Monthly</td>
                <td style={styles.pendingTxt}>Pending</td>
                <td>
                  <button className="actionBtn" style={styles.approve}>
                    Approve
                  </button>
                </td>
              </tr>
              <tr>
                <td>25-05-2-24</td>
                <td>Tinuke Banky</td>
                <td>745787777</td>
                <td>N44,700</td>
                <td>Weekly</td>
                <td style={styles.pendingTxt}>Pending</td>
                <td>
                  <button className="actionBtn" style={styles.review}>
                    Review
                  </button>
                </td>
              </tr>
              <tr>
                <td>25-05-2-24</td>
                <td>Jame Fred</td>
                <td>745787699</td>
                <td>N540,000</td>
                <td>Quarterly</td>
                <td style={styles.pendingTxt}>Pending</td>
                <td>
                  <button className="actionBtn" style={styles.pending}>
                    Reject
                  </button>
                </td>
              </tr>
              <tr>
                <td>26-05-2-24</td>
                <td>Glory Joel</td>
                <td>7457876456</td>
                <td>N34,900</td>
                <td>Annual</td>
                <td style={styles.activeTxt}>Active</td>
                <td>
                  <button className="actionBtn" style={styles.approved}>
                    Approved
                  </button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <NextPreBtn />
      </div>
    </div>
  );
};

export default DebitTransactions;
