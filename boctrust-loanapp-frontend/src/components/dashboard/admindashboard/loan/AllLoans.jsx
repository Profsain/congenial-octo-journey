import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import getDateOnly from "../../../../../utilities/getDate";
import capitalizeEachWord from "../../../../../utilities/capitalizeFirstLetter";
import searchList from "../../../../../utilities/searchListFunc";
import LoanDetails from "./LoanDetails";
import NoResult from "../../../shared/NoResult";
import sortByCreatedAt from "../../shared/sortedByDate";
import { loanStatusEnum } from "../../../../lib/userRelated";
import { fetchLoans } from "../../../../redux/reducers/loanReducer";
import DisplayLoanProductName from "../../shared/DisplayLoanProductName";

const AllLoans = ({ showCount, currentPage, setCurrentPage, searchTerms }) => {
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

  const [show, setShow] = useState(false);
  const [loanObj, setLoanObj] = useState({});
  // search Loans list
  const [loansList, setLoansList] = useState(null);

  // fetch all customer
  const dispatch = useDispatch();
  const { allLoans, status } = useSelector((state) => state.loanReducer);

  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchLoans());
    };
    getData();
  }, [dispatch, show]);


  // handle close loan details
  const handleClose = () => {
    setLoanObj({});
    setShow(false);
  };

  // handle show loan details
  const handleShow = (id) => {
    const loan = loansList && loansList.find((loan) => loan._id === id);
    setLoanObj(loan);
    setShow(true);
  };

  // update loansList on search
  const handleSearch = () => {
    if (!allLoans) {
      return;
    }
    const currSearch = searchList(allLoans, searchTerms, "agreefullname");
    setLoansList(currSearch);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerms]);

  const handleGoNext = () => {
    if (currentPage < loansList?.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleGoPrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  console.log(allLoans)
  console.log(loansList)

  return (
    <div className="loans__tableContainer">
      <DashboardHeadline
        height="52px"
        mspacer="2rem 0 -3.2rem -1rem"
        bgcolor="#145098"
      ></DashboardHeadline>
      <div style={styles.table}>
        <Table borderless hover responsive="sm">
          <thead style={styles.head}>
            <tr>
              <th>Loan ID</th>
              <th>Type</th>
              <th>Loan Product</th>
              <th>Borrower</th>
              <th>A/C Number</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!loansList || status === "loading" ? (
              <tr>
                <td colSpan="9">
                  <PageLoader />
                </td>
              </tr>
            ) : loansList && loansList?.length === 0 ? (
              <NoResult name="Loan" />
            ) : (
              loansList &&
              sortByCreatedAt(loansList)
                ?.slice((currentPage - 1) * showCount, currentPage * showCount)
                ?.map((loan) => {
                  return (
                    <tr key={loan._id}>
                      <td>
                        {loan?.customer?.banking?.accountDetails?.CustomerID}
                      </td>
                      <td>
                        {loan.deductions === "remita" ? (
                          <p>Remita</p>
                        ) : (
                          <p>Nibss</p>
                        )}
                      </td>
                      <td>
                        <DisplayLoanProductName loan={loan} />
                      </td>
                      <td>
                        {loan?.customer?.banking?.accountDetails
                          ?.CustomerName ??
                          `${loan?.customer?.firstname} ${loan?.customer?.lastname}`}
                      </td>
                      <td>
                        {loan.customer?.banking?.accountDetails?.AccountNumber}
                      </td>
                      <td>{getDateOnly(loan.createdAt)}</td>
                      <td>N{loan.loanamount}</td>
                      <td
                        style={styles.padding}
                        className={
                          loan?.customer?.kyc?.loanstatus ===
                          loanStatusEnum.completed
                            ? "text-success"
                            : "text-warning"
                        }
                      >
                        {capitalizeEachWord(loan.loanstatus)}
                      </td>
                      <td>
                        <div>
                          <button
                            onClick={() => handleShow(loan._id)}
                            className="btn btn-info text-white"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </Table>
      </div>
      <NextPreBtn nextFunc={handleGoNext} count={currentPage} prevFunc={handleGoPrev} />

      {/* show loan details model */}
      {show && (
        <LoanDetails show={show} handleClose={handleClose} loanObj={loanObj} />
      )}
    </div>
  );
};

AllLoans.propTypes = {
  searchTerms: PropTypes.string,
  showCount: PropTypes.number,
};

export default AllLoans;
