import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import { fetchLoans } from "../../../../redux/reducers/loanReducer.js";
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
import ReviewDirectDebit from "./ReviewDirectDebit";
import "./debit.css";

// custom hook
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";


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

  const apiUrl = import.meta.env.VITE_BASE_URL;

  const [allLoansCustomers, setAllLoansCustomer] = useState([]);
  const [directDebitCustomers, setDirectDebitCustomers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });

  // Fetch all loans
  const fetchAllLoans = async () => {
    try {
      setStatus("loading");
      const response = await fetch(`${apiUrl}/api/loans/all`);
      if (!response.ok) {
        throw new Error(`Failed to fetch loans: ${response.statusText}`);
      }

      const data = await response.json();
      setAllLoansCustomer(data);
      setStatus("success");
    } catch (error) {
      console.error("Error fetching loans:", error.message);
      setStatus("error");
    }
  };

  // handle search
  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPages);
  const { paginatedData: paginatedDirectDebitCustomer } = usePaginatedData(
    allLoansCustomers,
    showCount,
    currentPage
  );

  // update loansList to show 5 pendingLoans on page load
  // or on count changes
  useEffect(() => {
    setDirectDebitCustomers(paginatedDirectDebitCustomer); // Update local state with paginated data
  }, [paginatedDirectDebitCustomer]);

  useEffect(() => {
    setTotalPages(totalPages); // Update total pages when it changes
  }, [totalPages, setTotalPages]);

  // Filter customers for direct debit
  useEffect(() => {
    const filtered = allLoansCustomers.filter(
      (customer) =>
        customer?.deductions === "ippis" &&
        customer?.customer?.directDebit?.isDebitProcessed === false
    );
    setDirectDebitCustomers(filtered);
  }, [allLoansCustomers]);

  // Fetch loans on component mount and modal close
  useEffect(() => {
    fetchAllLoans();
  }, [showReviewModal]);

  // Search by name
  const { searchTerm, setSearchTerm, filteredData } = useSearch(
    directDebitCustomers,
    "firstname"
  );

  // Search by date
  const { filteredDateData } = useSearchByDate(
    directDebitCustomers,
    "createdAt"
  );
  const searchByDate = () => {
    setDirectDebitCustomers(filteredDateData);
  };

  // Search by date range
  const { searchData } = useSearchByDateRange(
    directDebitCustomers,
    dateRange,
    "createdAt"
  );

  // Handle list reload
  const handleReload = () => {
    setDateRange({ fromDate: "", toDate: "" });
    setSearchTerm("");
    fetchAllLoans();
  };

  // Open review modal
  const handleReviewClick = (customer) => {
    setSelectedCustomer(customer);
    setShowReviewModal(true);
  };
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
              <tr>
                <td colSpan="10">
                  {directDebitCustomers?.length === 0 && (
                    <NoResult name="Customer" />
                  )}
                </td>
              </tr>

              {directDebitCustomers?.map((customer) => (
                <tr key={customer?._id}>
                  <td>{customer?.createdAt.slice(0, 10)}</td>
                  <td>
                    {customer?.customer.firstname} {customer?.customer.lastname}
                  </td>
                  <td>{customer?.customer.salaryaccountnumber}</td>
                  <td>N{customer?.loantotalrepayment}</td>
                  <td>Monthly</td>
                  <td style={styles.pendingTxt}>
                    {customer?.customer.directDebit.debitStatus}
                  </td>
                  <td>
                    {customer?.customer.directDebit.debitStatus ===
                    "approved" ? (
                      <button className="actionBtn" style={styles.approve}>
                        Approved
                      </button>
                    ) : customer?.customer.directDebit.debitStatus ===
                      "declined" ? (
                      <button className="actionBtn" style={styles.pending}>
                        Rejected
                      </button>
                    ) : (
                      <button
                        className="actionBtn"
                        style={styles.review}
                        onClick={() => handleReviewClick(customer)}
                      >
                        Review
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <NextPreBtn
          currentPage={currentPage}
          totalPages={totalPages}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
        />
      </div>

      {/* Review Direct Debit Modal */}
      {selectedCustomer && (
        <ReviewDirectDebit
          show={showReviewModal}
          handleClose={() => setShowReviewModal(false)}
          customer={selectedCustomer}
        />
      )}
    </div>
  );
};

export default DebitTransactions;
