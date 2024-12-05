import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import BocButton from "../../shared/BocButton";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import searchList from "../../../../../utilities/searchListFunc";
import LoanDetails from "./LoanDetails";
import NoResult from "../../../shared/NoResult";
import sortByCreatedAt from "../../shared/sortedByDate";
import DisplayLoanProductName from "../../shared/DisplayLoanProductName";

// custom hook
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";

const LoanStatement = () => {
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
      color: "#ecaa00 ",
    },
    pending: {
      color: "#f64f4f",
    },
    date: {
      width: "120px",
      fontSize: "12px",
      border: "1px solid #d9d9d9",
      padding: "0.3rem",
      margin: "0",
    },
  };

  // fetch all loan
  const dispatch = useDispatch();
  const { completedLoans } = useSelector((state) => state.loanReducer);

  const status = useSelector((state) => state.customerReducer.status);

  useEffect(() => {
    dispatch(fetchAllCustomer());
  }, [dispatch]);

  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPages);
  const { paginatedData: paginatedLoansList } = usePaginatedData(
    completedLoans,
    showCount,
    currentPage
  );

  const [show, setShow] = useState(false);
  const [loanObj, setLoanObj] = useState({});
  // handle close loan details
  const handleClose = () => {
    setLoanObj({});
    setShow(false);
  };

  // handle show loan details
  // const apiUrl = import.meta.env.VITE_BASE_URL;
  const [isProcessing, setIsProcessing] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleCheckBalance = async () => {
    setIsProcessing(true);
  };

  // search loan list
  const [loanList, setLoanList] = useState(completedLoans);


  // update loansList to show 5 pendingLoans on page load
  // or on count changes
   useEffect(() => {
     setLoanList(paginatedLoansList); // Update local state with paginated data
   }, [paginatedLoansList]);

   useEffect(() => {
     setTotalPages(totalPages); // Update total pages when it changes
   }, [totalPages, setTotalPages]);
  
  
  // update loanList to show 10 customers on page load
  // or on count changes
  // useEffect(() => {
  //   setLoanList(completedLoans?.slice(0, showCount));
  // }, [completedLoans, showCount]);

  // update loanList on search
  const handleSearch = () => {
    // check filteredCustomers is not empty
    if (!completedLoans) return;
    const currSearch = searchList(completedLoans, searchTerms, "firstname");
    setLoanList(currSearch?.slice(0, showCount));
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerms]);

  return (
    <>
      {/* top search bar */}
      <div className="Search">
        <DashboardHeadline padding="0" height="70px" bgcolor="#d9d9d9">
          <div className="SearchBar">
            <div className="FormGroup">
              <label htmlFor="show">Show</label>
              <input
                name="showCount"
                type="number"
                step={5}
                min={5}
                value={showCount}
                onChange={(e) => setShowCount(e.target.value)}
              />
            </div>
            <div className="FormGroup SBox">
              <input
                name="search"
                placeholder="Search by name"
                onChange={(e) => setSearchTerms(e.target.value)}
              />
              <img src="/images/search.png" alt="search-icon" />
            </div>
          </div>
        </DashboardHeadline>
      </div>

      <div className="bSection">
        {/* data loader */}
        {status === "loading" && <PageLoader />}
        <DashboardHeadline
          height="52px"
          mspacer="2rem 0 -2.5rem -1rem"
          bgcolor="#145098"
        ></DashboardHeadline>
        <div style={styles.table}>
          <Table borderless hover responsive="sm">
            <thead style={styles.head}>
              <tr>
                <th>Loan ID</th>
                <th>Loan Product</th>
                <th>Borrower</th>
                <th>A/C Number</th>
                <th>Applied Amount</th>
                <th>FromDate</th>
                <th>ToDate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loanList && loanList?.length === 0 && <NoResult name="loan" />}
              {loanList &&
                sortByCreatedAt(loanList)?.map((loan) => {
                  return (
                    <tr key={loan._id}>
                      <td>
                        {loan?.customer?.banking?.accountDetails?.Message?.Id ??
                          "N/A"}
                      </td>
                      <td>
                        <DisplayLoanProductName loan={loan} />
                      </td>
                      <td>
                        {loan?.customer?.banking?.accountDetails?.Message
                          .FullName ?? "N/A"}
                      </td>
                      <td>
                        {loan?.customer?.banking?.accountDetails?.Message
                          ?.AccountNumber ?? "N/A"}
                      </td>
                      <td>N{loan.loanamount}</td>
                      <td style={styles.date}>
                        <input
                          style={styles.date}
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          style={styles.date}
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </td>
                      <td>
                        <div>
                          {isProcessing && <PageLoader width="12px" />}
                          <BocButton
                            func={() => handleCheckBalance(loan._id)}
                            bradius="12px"
                            fontSize="12px"
                            width="80px"
                            margin="4px"
                            bgcolor="#ecaa00"
                          >
                            Check
                          </BocButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
        <NextPreBtn
          currentPage={currentPage}
          totalPages={totalPages}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
        />

        {/* show loan details model */}
        {show && (
          <LoanDetails
            show={show}
            handleClose={handleClose}
            loanObj={loanObj}
          />
        )}
      </div>
    </>
  );
};

LoanStatement.propTypes = {
  searchTerms: PropTypes.string,
  showCount: PropTypes.number,
};

export default LoanStatement;
