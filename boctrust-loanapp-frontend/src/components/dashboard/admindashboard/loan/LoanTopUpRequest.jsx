// top up loan update here
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import getDateOnly from "../../../../../utilities/getDate";
import searchList from "../../../../../utilities/searchListFunc";
import NoResult from "../../../shared/NoResult";
import sortByCreatedAt from "../../shared/sortedByDate";
import DisplayLoanProductName from "../../shared/DisplayLoanProductName";
// custom hook
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";

import { toast, ToastContainer } from "react-toastify";
// toast styles
import "react-toastify/dist/ReactToastify.css";

const loansList = () => {
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


  const apiUrl = import.meta.env.VITE_BASE_URL;
  // handle search
  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");
  const [totalPage, setTotalPage] = useState(1);

  // search Loans list
  const [loansList, setLoansList] = useState(null);
  const [status, setStatus] = useState("loading");

  // fetch all top-up loan customer
  const fetchTopUpLoans = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/top-up/top-up-loans`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLoansList(data); // set loans list
       
        setStatus("success");
      } else {
        const error = await response.json();
        console.error("Error:", error.message);
        setStatus("success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTopUpLoans();
  }, []);

  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPage);
  const { paginatedData: paginatedLoansList, totalPages } = usePaginatedData(
    loansList,
    showCount,
    currentPage
  );

  // termination operation
  const [isTerminating, setIsTerminating] = useState(false);

  // handle start termination
  const handleStartTermination = async (id) => {
    setIsTerminating(true);
    try {
      const currentLoanTerminationStatus = "initiated";

      const response = await fetch(
        `${apiUrl}/api/top-up/start-termination/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentLoanTerminationStatus }),
        }
      );

      if (response.ok) {
        setIsTerminating(false);
        const data = await response.json();
        toast.success("Top-up loan termination initiated successful");
        fetchTopUpLoans();
      } else {
        setIsTerminating(false);
        const error = await response.json();
        toast.error("Network error, try again");
      }
    } catch (error) {
      setIsTerminating(false);
      console.log(error);
      toast.error("Error initiating termination");
    }
  };

  // handle approve termination
  const handleApproveTermination = async (id) => {
    console.log("approve termination", id);
    setIsTerminating(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/top-up/terminate-and-add-balance/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setIsTerminating(false);
        const data = await response.json();
        toast.success("Top-up loan termination approved successful");
        fetchTopUpLoans();
      } else {
        setIsTerminating(false);
        const error = await response.json();
        console.log(error);
        toast.error(error.error);
      }
    } catch (error) {
      setIsTerminating(false);
      toast.error("Error approving termination");
    }
  };

  // update loansList to show 10 pendingLoans on page load
  // or on count changes


  // update loansList on search
  // Filter loans dynamically
  const filteredLoans = searchTerms
    ? searchList(paginatedLoansList, searchTerms, "firstname")
    : paginatedLoansList;
  

  // top up loan functionality
  // handle update isTopUpLoanSent
  const [sendingRequest, setSendingRequest] = useState(false);
  const handleSentRequest = async (id) => {
    setSendingRequest(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/top-up/update-top-up-loan-status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setSendingRequest(false);
        const data = await response.json();
        toast.success("Top-up loan request sent successful");
        fetchTopUpLoans();
      } else {
        setSendingRequest(false);
        const error = await response.json();
        toast.error("Network error, try again");
      }
    } catch (error) {
      setSendingRequest(false);
      toast.error("Error sending top-up loan request");
    }
  };

  return (
    <div>
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
                <th>Product</th>
                <th>Borrower</th>
                <th>Amount Requested</th>
                <th>Tenure</th>
                <th>Date</th>
                <th>Credit Assessment</th>
                <th>Terminate</th>
              </tr>
            </thead>
            <tbody>
              {status === "loading" ? (
                <tr>
                  <td colSpan="9">
                    <PageLoader />
                  </td>
                </tr>
              ) : filteredLoans?.length === 0 ? (
                <NoResult name="Loan" />
              ) : (
                filteredLoans &&
                sortByCreatedAt(filteredLoans)?.map((loan) => {
                  return (
                    <tr key={loan._id}>
                      <td>
                        {loan?.customer?.banking?.accountDetails?.CustomerID}
                      </td>
                      <td>
                        <DisplayLoanProductName loan={loan} />
                      </td>
                      <td>
                        {loan?.customer?.banking?.accountDetails
                          ?.CustomerName ??
                          `${loan?.customer?.firstname} ${loan?.customer?.lastname}`}
                      </td>
                      <td>N{loan?.loanamount}</td>
                      <td>{loan?.numberofmonth} Months</td>
                      <td>{getDateOnly(loan?.createdAt)}</td>
                      <td>
                        <div>
                          {loan?.isTopUpLoanSent ? (
                            <button
                              className="btn btn-danger text-white"
                              disabled
                            >
                              Sent
                            </button>
                          ) : (
                            <div>
                              {sendingRequest ? (
                                <PageLoader width="12px" />
                              ) : (
                                <button
                                  className="btn btn-success text-white"
                                  onClick={() => handleSentRequest(loan?._id)}
                                >
                                  Send
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        {loan?.loanstatus === "with credit" ? (
                          <div>
                            {isTerminating && <PageLoader width="12px" />}
                            {loan?.currentLoanTerminationStatus ===
                            "pending" ? (
                              <button
                                className="btn btn-info text-white"
                                onClick={() =>
                                  handleStartTermination(loan?._id)
                                }
                              >
                                Start
                              </button>
                            ) : loan?.currentLoanTerminationStatus ===
                              "initiated" ? (
                              <button
                                className="btn btn-warning text-white"
                                onClick={() =>
                                  handleApproveTermination(loan?.customer._id)
                                }
                              >
                                Initiated
                              </button>
                            ) : (
                              <button
                                className="btn btn-danger text-white"
                                disabled
                              >
                                Terminated
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            className="btn btn-danger text-white"
                            disabled
                          >
                            Not Booked
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
        <ToastContainer />

        {/* next and previous button */}
        <NextPreBtn
          currentPage={currentPage}
          totalPages={totalPages}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
        />
      </div>
    </div>
  );
};

loansList.propTypes = {
  searchTerms: PropTypes.string,
  showCount: PropTypes.number,
};

export default loansList;
