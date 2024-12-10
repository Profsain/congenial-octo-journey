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
import capitalizeEachWord from "../../../../../utilities/capitalizeFirstLetter";
import searchList from "../../../../../utilities/searchListFunc";
import LoanDetails from "./LoanDetails";
import NoResult from "../../../shared/NoResult";
import sortByCreatedAt from "../../shared/sortedByDate";
import { loanStatusEnum } from "../../../../lib/userRelated";
import { fetchLoans } from "../../../../redux/reducers/loanReducer";
import DisplayLoanProductName from "../../shared/DisplayLoanProductName";

import { toast, ToastContainer } from "react-toastify";
// toast styles
import "react-toastify/dist/ReactToastify.css";

const LoanTopUpRequest = () => {
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

  // current login user
  const { user: currentUser } = useSelector((state) => state.adminAuth);
  // console.log("currentUser", currentUser);
  const [canUserSendTopUp, setCanUserSendTopUp] = useState(false);
  const [canUserStartTerminate, setCanUserStartTerminate] = useState(false);
  const [canUserApproveTerminate, setCanUserApproveTerminate] = useState(false);

  // update user role
  useEffect(() => {
    setCanUserSendTopUp(currentUser?.userRole?.can.includes("sendTopUp"));
    setCanUserStartTerminate(
      currentUser?.userRole?.can.includes("initiateLoanTerminate")
    );
    setCanUserApproveTerminate(
      currentUser?.userRole?.can.includes("approveLoanTerminate")
    );
  }, [currentUser]);

  const apiUrl = import.meta.env.VITE_BASE_URL;
  // handle search
  const [showCount, setShowCount] = useState(10);
  const [searchTerms, setSearchTerms] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const [loanObj, setLoanObj] = useState({});
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
        console.log("Top-up loan request successful:", data);
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
    if (!LoanTopUpRequest) {
      return;
    }
    const currSearch = searchList(
      LoanTopUpRequest,
      searchTerms,
      "agreefullname"
    );
    setLoansList(currSearch);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerms]);

  const handleGoNext = () => {
    if (currentPage < Math.ceil((loansList?.length - 1) / showCount)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleGoPrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

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
                  ?.slice(
                    (currentPage - 1) * showCount,
                    currentPage * showCount
                  )
                  ?.map((loan) => {
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
            {/* <tbody>
            <tr>
              <td>12312</td>
              <td>Term Loan</td>
              <td>John Doe</td>
              <td>N100,000</td>
              <td>10 Months</td>
              <td>2024-08-12</td>
              <td>
                <div>
                  <button className="btn btn-success text-white">Send</button>
                </div>
              </td>
              <td>
                <div>
                  <button className="btn btn-info text-white">Start</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>12343</td>
              <td>Rosca Loan</td>
              <td>Jane Liba</td>
              <td>N300,000</td>
              <td>14 Months</td>
              <td>2024-12-02</td>
              <td>
                <div>
                  <button className="btn btn-warning text-white">Sent</button>
                </div>
              </td>
              <td>
                <div>
                  <button className="btn btn-danger text-white">
                    Terminated
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td>12356</td>
              <td>Term Loan</td>
              <td>Marry Good</td>
              <td>N90,000</td>
              <td>6 Months</td>
              <td>2024-12-04</td>
              <td>
                <div>
                  <button className="btn btn-warning text-white">Sent</button>
                </div>
              </td>
              <td>
                <div>
                  <button className="btn btn-warning text-white">
                    Initiated
                  </button>
                </div>
              </td>
            </tr>
          </tbody> */}
          </Table>
        </div>
        <ToastContainer />

        <NextPreBtn
          nextFunc={handleGoNext}
          numberOfPages={Math.ceil((loansList?.length - 1) / showCount)}
          count={currentPage}
          prevFunc={handleGoPrev}
        />
      </div>
    </div>
  );
};

LoanTopUpRequest.propTypes = {
  searchTerms: PropTypes.string,
  showCount: PropTypes.number,
};

export default LoanTopUpRequest;
