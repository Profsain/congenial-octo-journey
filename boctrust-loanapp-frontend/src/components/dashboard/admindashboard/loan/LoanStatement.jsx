import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import searchList from "../../../../../utilities/searchListFunc";
import NoResult from "../../../shared/NoResult";

import LoanStatementModal from "./loanStatementModal/LoanStatementModal";
import LoanStatementRecord from "./loanStatementRecord/LoanStatementRecord";
import { fetchCompletedLoan } from "../../../../redux/reducers/loanReducer";

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
  };

  // fetch all loan
  const dispatch = useDispatch();
  const { completedLoans } = useSelector((state) => state.loanReducer);

  const status = useSelector((state) => state.customerReducer.status);

  useEffect(() => {
    dispatch(fetchCompletedLoan());
  }, [dispatch]);

  const [showCount, setShowCount] = useState(10);
  const [searchTerms, setSearchTerms] = useState("");

  // handle show loan details
  // const apiUrl = import.meta.env.VITE_BASE_URL;
  const [isProcessing, setIsProcessing] = useState(false);

  const [accountStatement, setAccountStatement] = useState(null);

  // search loan list
  const [loanList, setLoanList] = useState(completedLoans);

  // update loanList to show 10 customers on page load
  // or on count changes
  useEffect(() => {
    setLoanList(completedLoans?.slice(0, showCount));
  }, [completedLoans, showCount]);

  // update loanList on search
  const handleSearch = () => {
    // check filteredCustomers is not empty
    if (!completedLoans) return;
    const currSearch = searchList(completedLoans, searchTerms, "agreefullname");
    setLoanList(currSearch?.slice(0, showCount));
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerms]);

  return (
    <div className="loan__statement">
      {/* top search bar */}
      <div className="Search">
        <DashboardHeadline padding="0" height="70px" bgcolor="#d9d9d9">
          <div className="SearchBar">
            <div className="FormGroup">
              <label htmlFor="show">Show</label>
              <input
                name="showCount"
                type="number"
                step={10}
                min={10}
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
          mspacer="2rem 0 -3.3rem -1rem"
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
              {!loanList || status === "loading" ? (
                <td colSpan="8">
                  <PageLoader />
                </td>
              ) : loanList && loanList?.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <NoResult name="loan" />
                  </td>
                </tr>
              ) : (
                loanList &&
                loanList?.map((loan) => {
                  return (
                    <React.Fragment key={loan._id}>
                      <LoanStatementRecord
                        setAccountStatement={setAccountStatement}
                        setIsProcessing={setIsProcessing}
                        loan={loan}
                      />
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
        <NextPreBtn />

        {/* show loan details model */}
        {accountStatement && (
          <LoanStatementModal
            show={!!accountStatement}
            accountStatement={accountStatement}
            handleClose={() => setAccountStatement(null)}
            isLoading={isProcessing}
          />
        )}
      </div>
    </div>
  );
};

LoanStatement.propTypes = {
  searchTerms: PropTypes.string,
  showCount: PropTypes.number,
};

export default LoanStatement;
