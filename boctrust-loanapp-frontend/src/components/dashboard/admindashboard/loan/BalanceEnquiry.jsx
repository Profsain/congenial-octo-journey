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
import getDateOnly from "../../../../../utilities/getDate";
import searchList from "../../../../../utilities/searchListFunc";
import LoanDetails from "./LoanDetails";
import NoResult from "../../../shared/NoResult";
import sortByCreatedAt from "../../shared/sortedByDate";

const BalanceEnquiry = () => {
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
      customer.kyc.isKycApproved === true &&
      customer.deductions !== "remita" &&
      customer.disbursementstatus === "approved"
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

  const handleCheckBalance = async (id) => {
    // set is processing to true
    setIsProcessing(true);
    // get loan details
    const loan = filteredCustomers.find((customer) => customer._id === id);
    setLoanObj(loan);
    const loanAccountNumber = loan.banking.accountDetails.Message.AccountNumber;
    // call api to get balance details
    const loanBalance = await fetch(
      `${apiUrl}/api/bankone/balanceEnquiry/${loanAccountNumber}`
    );
    const loanBalanceData = await loanBalance.json();

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
              <th>Date</th>
              <th>Applied Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customerList?.length === 0 && <NoResult name="customer" />}
            {sortByCreatedAt(customerList)?.map((customer) => {
              return (
                <tr key={customer._id}>
                  <td>{customer.banking?.accountDetails?.Message.Id}</td>
                  <td>{customer.loanProduct || "General Loan"}</td>
                  <td>{customer.banking?.accountDetails?.Message.FullName}</td>
                  <td>
                    {customer?.banking?.accountDetails?.Message?.AccountNumber}
                  </td>
                  <td>{getDateOnly(customer.createdAt)}</td>
                  <td>N{customer.loanamount}</td>
                  <td>
                    {customer.disbursementstatus === "pending" ? (
                      <p style={styles.pending}>Pending</p>
                    ) : customer.disbursementstatus === "approved" ? (
                      <p style={styles.approved}>Disbursed</p>
                    ) : customer.disbursementstatus === "stopped" ? (
                      <p style={styles.pending}>Stopped</p>
                    ) : (
                      <p style={styles.completed}>Rejected</p>
                    )}
                  </td>
                  <td>
                    <div>
                      {isProcessing && (<PageLoader width="12px" />)}
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

BalanceEnquiry.propTypes = {
  searchTerms: PropTypes.string,
  showCount: PropTypes.number,
};

export default BalanceEnquiry;



// const BalanceEnquiry = () => {
//   return (
//     <div>BalanceEnquiry</div>
//   )
// }

// export default BalanceEnquiry