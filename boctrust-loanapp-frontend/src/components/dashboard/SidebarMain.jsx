import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Dashboard.css";

const SidebarMain = ({ onMenuItemClick }) => {
  const [isLoanOpen, setIsLoanOpen] = useState(false);
  const openSubLoan = () => setIsLoanOpen(true);
  const closeSubLoan = () => setIsLoanOpen(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const openSubReport = () => setIsReportOpen(true);
  const closeSubReport = () => setIsReportOpen(false);
  const currentUser = useSelector((state) => state.adminAuth.user);

  // check if user is empty and redirect to login page
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser || !currentUser.careertype) {
      // Add a specific property check or adjust as per your user object structure
      navigate("/login");
    }
  }, [currentUser, navigate]);
  const customerCareer = currentUser?.careertype;

  return (
    <div className="NavIcons SideMain FixSideNav">
      <div className="BrandCon">
        <div className=" LgLogo">
          <img src="/images/dlogo.png" alt="boctrust-logo" />
        </div>
        <p>Customer</p>
      </div>
      <Link
        id="dashboard"
        to="/dashboard"
        className="IconBox"
        onClick={onMenuItemClick}
      >
        <img id="dashboard" src="/images/ddashboard.png" alt="dashboard" />
        <p id="dashboard">Dashboard</p>
      </Link>

      <div onMouseOver={openSubLoan} onMouseLeave={closeSubLoan}>
        <div id="myloan" className="IconBox" onClick={onMenuItemClick}>
          <img
            id="myloan"
            onClick={onMenuItemClick}
            src="/images/dmyloan.png"
            alt="loan"
          />
          <p id="myloan" onClick={onMenuItemClick}>
            Loans
          </p>
        </div>
        {isLoanOpen ? (
          <div className="SubItem">
            <ul>
              <li>
                <Link
                  id="myloan"
                  onClick={onMenuItemClick}
                  to={"/dashboard/loans"}
                >
                  All Loans
                </Link>
              </li>
              <li>
                <Link
                  id="applyloan"
                  onClick={onMenuItemClick}
                  to={"/dashboard/loans/apply"}
                >
                  Apply for Loan
                </Link>
              </li>
              <li>
                <Link
                  id="loancalculator"
                  onClick={onMenuItemClick}
                  to={"/dashboard/loans/calculator"}
                >
                  Loan Calculator
                </Link>
              </li>
            </ul>
          </div>
        ) : null}
      </div>

      <Link
        to={"/dashboard/repayment"}
        id="loanrepayment"
        className="IconBox"
        onClick={onMenuItemClick}
      >
        <img id="loanrepayment" src="/images/dtransfer.png" alt="repayment" />
        <p id="loanrepayment">Repayments</p>
      </Link>

      {customerCareer !== "government employee" ? (
        <Link
          to={"/dashboard/transfer"}
          id="transfer"
          className="IconBox"
          onClick={onMenuItemClick}
        >
          <img id="transfer" src="/images/dtransfer.png" alt="transfer" />
          <p id="transfer">Transfer Money</p>
        </Link>
      ) : null}

      {customerCareer !== "government employee" &&
      customerCareer !== "private employee" ? (
        <Link
          to={"/dashboard/withdraw"}
          id="withdraw"
          className="IconBox"
          onClick={onMenuItemClick}
        >
          <img id="withdraw" src="/images/dtransfer.png" alt="withdraw" />
          <p id="withdraw">Withdrawal</p>
        </Link>
      ) : null}

      <Link
        to={"/dashboard/transactions"}
        id="transaction"
        className="IconBox"
        onClick={onMenuItemClick}
      >
        <img
          id="transaction"
          onClick={onMenuItemClick}
          src="/images/daccount.png"
          alt="account"
        />
        <p id="transaction" onClick={onMenuItemClick}>
          Account Transactions
        </p>
      </Link>

      {currentUser?.deductions === "remita" ? (
        <Link
          to={"/dashboard/remita"}
          id="remita"
          className="IconBox"
          onClick={onMenuItemClick}
        >
          <img
            id="remita"
            onClick={onMenuItemClick}
            src="/images/dreport.png"
            alt="profile"
          />
          <p id="remita" onClick={onMenuItemClick}>
            Remita History
          </p>
        </Link>
      ) : null}

      <Link
        to={"/dashboard/profile"}
        id="profile"
        className="IconBox"
        onClick={onMenuItemClick}
      >
        <img id="profile" src="/images/dprofile.png" alt="profile" />
        <p id="profile">Profile</p>
      </Link>

      <div onMouseOver={openSubReport} onMouseLeave={closeSubReport}>
        <div id="report" className="IconBox" onClick={onMenuItemClick}>
          <img
            id="report"
            onClick={onMenuItemClick}
            src="/images/dreport.png"
            alt="report"
          />
          <p id="report" onClick={onMenuItemClick}>
            Report
          </p>
        </div>
        {isReportOpen ? (
          <div className="SubItem">
            <ul>
              <li>
                <Link
                  id="report"
                  onClick={onMenuItemClick}
                  to={"/dashboard/report"}
                >
                  Account Statement
                </Link>
              </li>
              <li onClick={onMenuItemClick}>
                <Link
                  id="transactionreport"
                  onClick={onMenuItemClick}
                  to={"/dashboard/report/transaction"}
                >
                  Transaction Report
                </Link>
              </li>
              <li>
                <Link
                  id="accountbalance"
                  onClick={onMenuItemClick}
                  to={"/dashboard/report/accountbalance"}
                >
                  Account Balance
                </Link>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};

SidebarMain.propTypes = {
  onMenuItemClick: PropTypes.func,
};

export default SidebarMain;
