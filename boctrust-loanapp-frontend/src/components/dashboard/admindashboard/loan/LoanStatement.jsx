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
      margin: "0"
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

  // filtere customer by isKycApproved
  const filteredCustomers = customers?.filter(
    (customer) =>
      customer.kyc.isKycApproved === true && customer.deductions !== "remita"
  );

  const [showCount, setShowCount] = useState(10);
  const [searchTerms, setSearchTerms] = useState("");

  const [show, setShow] = useState(false);
  const [loanObj, setLoanObj] = useState({});
  // handle close loan details
  const handleClose = () => {
    setLoanObj({});
    setShow(false);
  };

  // handle show loan details
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const [isProcessing, setIsProcessing] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleCheckBalance = async (id) => {
    setIsProcessing(true);
    const loan = filteredCustomers.find((customer) => customer._id === id);
    setLoanObj(loan);
  
    const loanAccountNumber =
      loan.banking.accountDetails.Message.BankoneAccountNumber;
    const institutionCode = "100579";

    // call api to get balance details
    const loanStatement = await fetch(
      `${apiUrl}/api/bankone/loanAccountStatement/${loanAccountNumber}/${fromDate}/${toDate}/${institutionCode}`
    );
    const loanStatementData = await loanStatement.json();
    console.log("Loan Statement", loanStatementData);

    // set is processing to false
    setTimeout(() => {
      setIsProcessing(false);
      setShow(true);
    }, 5000);
  };

  // search customer list
  const [customerList, setCustomerList] = useState(filteredCustomers);

  // update customerList to show 10 customers on page load
  // or on count changes
  useEffect(() => {
    setCustomerList(filteredCustomers?.slice(0, showCount));
  }, [customers, showCount]);

  // update customerList on search
  const handleSearch = () => {
    // check filteredCustomers is not empty
    if (!filteredCustomers) return;
    const currSearch = searchList(
      filteredCustomers,
      searchTerms,
      "agreefullname"
    );
    setCustomerList(currSearch?.slice(0, showCount));
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
              <img src="images/search.png" alt="search-icon" />
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
            {customerList?.length === 0 && <NoResult name="customer" />}
            {sortByCreatedAt(customerList)?.map((customer) => {
              return (
                <tr key={customer._id}>
                  <td>{customer.banking.accountDetails.Message.Id}</td>
                  <td>{customer.loanProduct || "General Loan"}</td>
                  <td>{customer.banking.accountDetails.Message.FullName}</td>
                  <td>
                    {customer?.banking?.accountDetails?.Message?.AccountNumber}
                  </td>
                  <td>N{customer.loanamount}</td>
                  <td style={styles.dateT}>
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
                        func={() => handleCheckBalance(customer._id)}
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
      <NextPreBtn />

      {/* show loan details model */}
      {show && (
        <LoanDetails show={show} handleClose={handleClose} loanObj={loanObj} />
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
