import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import "../../Dashboard.css";
import handleAdminRoles from "../../../../../utilities/getAdminRoles";

const SideNavMain = ({ onMenuItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoanOpen, setIsLoanOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isRemitaOpen, setIsRemitaOpen] = useState(false);
  const [isEmployerOpen, setIsEmployerOpen] = useState(false);
  const [isWebManagerOpen, setIsWebManagerOpen] = useState(false);
  const [isKycOpen, setIsKycOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const openSubItem = () => setIsOpen(true);
  const closeSubItem = () => setIsOpen(false);

  const openSubLoan = () => setIsLoanOpen(true);
  const closeSubLoan = () => setIsLoanOpen(false);

  const openSubAccount = () => setIsAccountOpen(true);
  const closeSubAccount = () => setIsAccountOpen(false);

  const openSubRemita = () => setIsRemitaOpen(true);
  const closeSubRemita = () => setIsRemitaOpen(false);

  const openSubEmployer = () => setIsEmployerOpen(true);
  const closeSubEmployer = () => setIsEmployerOpen(false);

  const openSubWebManager = () => setIsWebManagerOpen(true);
  const closeSubWebManager = () => setIsWebManagerOpen(false);

  const openSubKyc = () => setIsKycOpen(true);
  const closeSubKyc = () => setIsKycOpen(false);

  const openSubReports = () => setIsReportsOpen(true);
  const closeSubReports = () => setIsReportsOpen(false);

  const openSubSetting = () => setIsSettingOpen(true);
  const closeSubSetting = () => setIsSettingOpen(false);

  // current login admin user
  const currentUser = useSelector((state) => state.adminAuth.user);
  const userRole = currentUser.jobRole;

  // role based menu
  const [admin, setAdmin] = useState("");
  const [adminRoles, setAdminRoles] = useState([]);
  useEffect(() => {
    if (currentUser) {
      if (currentUser.userType === "admin" || currentUser.userType === "md") {
        setAdmin("admin");
      }

      handleAdminRoles(currentUser, setAdminRoles);
    }
  }, []);

  return (
    <div className="NavIcons SideMain FixSideNav">
      <div className="BrandCon">
        <div className=" LgLogo">
          <img src="images/dlogo.png" alt="boctrust-logo" />
        </div>
        <p>{userRole}</p>
      </div>

      <div id="dashboard" className="IconBox" onClick={onMenuItemClick}>
        <img
          id="dashboard"
          onClick={onMenuItemClick}
          src="images/ddashboard.png"
          alt="dashboard"
        />
        <p id="dashboard" onClick={onMenuItemClick}>
          Dashboard
        </p>
      </div>

      <div id="branches" className="IconBox" onClick={onMenuItemClick}>
        <img
          id="branches"
          onClick={onMenuItemClick}
          src="images/dmda.png"
          alt="branches"
        />
        <p id="branches" onClick={onMenuItemClick}>
          Branches
        </p>
      </div>

      {/* Menu with sub item */}
      <div onMouseOver={openSubItem} onMouseLeave={closeSubItem}>
        <div className="IconBox">
          <img src="images/dprofile.png" alt="customer" />
          <p>Customers</p>
        </div>
        {isOpen ? (
          <div className="SubItem">
            <ul>
              <li id="customer" onClick={onMenuItemClick}>
                All Customers
              </li>
              {admin || adminRoles.includes("customer_request") ? (
                <li id="customerrequest" onClick={onMenuItemClick}>
                  Customer Request
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>

      {/* loans menu */}
      {admin || adminRoles.includes("my_loan") ? (
        <div onMouseOver={openSubLoan} onMouseLeave={closeSubLoan}>
          <div className="IconBox">
            <img src="images/dmyloan.png" alt="loan" />
            <p>Loans</p>
          </div>
          {isLoanOpen ? (
            <div className="SubItem">
              <ul>
                <li id="myloan" onClick={onMenuItemClick}>
                  All Loans
                </li>
                <li id="pendingloans" onClick={onMenuItemClick}>
                  Pending Loan
                </li>
                <li id="activeloans" onClick={onMenuItemClick}>
                  Active Loan
                </li>
                <li id="loancalculator" onClick={onMenuItemClick}>
                  Loan Calculator
                </li>
                <li id="loanproducts" onClick={onMenuItemClick}>
                  Loan Products
                </li>
                {/* updated */}
                <li id="loandisbursement" onClick={onMenuItemClick}>
                  Loan Disbursement
                </li>
                <li id="balanceenquiry" onClick={onMenuItemClick}>
                  Balance Enquiry
                </li>
                <li id="checkcustomer" onClick={onMenuItemClick}>
                  Check Customer
                </li>
                <li id="getloan" onClick={onMenuItemClick}>
                  Get Loan
                </li>
                <li id="checkrepayment" onClick={onMenuItemClick}>
                  Check Repayment
                </li>
                <li id="loanstatement" onClick={onMenuItemClick}>
                  Statement
                </li>
                <li id="loanbalance" onClick={onMenuItemClick}>
                  Loan Balance
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

        {/* repayment menu */}
      <div id="repayment" className="IconBox" onClick={onMenuItemClick}>
        <img
          id="repayment"
          onClick={onMenuItemClick}
          src="images/dtransfer.png"
          alt="repayment"
        />
        <p id="repayment" onClick={onMenuItemClick}>
          Repayments
        </p>
      </div>

      {/* account menu */}
      <div onMouseOver={openSubAccount} onMouseLeave={closeSubAccount}>
        <div className="IconBox">
          <img src="images/daccount.png" alt="accounts" />
          <p>Accounts</p>
        </div>
        {isAccountOpen ? (
          <div className="SubItem">
            <ul>
              <li id="accounts" onClick={onMenuItemClick}>
                All Accounts
              </li>
              <li id="accounttypes" onClick={onMenuItemClick}>
                Account Types
              </li>
            </ul>
          </div>
        ) : null}
      </div>

        {/* disbursement menu */}
      <div id="withdraw" className="IconBox" onClick={onMenuItemClick}>
        <img
          id="withdraw"
          onClick={onMenuItemClick}
          src="images/dwithdraw.png"
          alt="withdrawer"
        />
        <p id="withdraw" onClick={onMenuItemClick}>
          Disbursements
        </p>
      </div>

      <div id="transaction" className="IconBox" onClick={onMenuItemClick}>
        <img
          id="transaction"
          onClick={onMenuItemClick}
          src="images/daccount.png"
          alt="transaction"
        />
        <p id="transaction" onClick={onMenuItemClick}>
          Transactions
        </p>
      </div>

      {/* NIBSS Menu with sub item */}
      <div onMouseOver={openSubItem} onMouseLeave={closeSubItem}>
        <div className="IconBox">
          <img src="images/dwithdraw.png" alt="nibss" />
          <p>NIBSS Direct</p>
        </div>
        {isOpen ? (
          <div className="SubItem">
            <ul>
              <li id="debitTransactions" onClick={onMenuItemClick}>
                Debit Transactions
              </li>
              {admin || adminRoles.includes("manage_nibss") ? (
                <li id="collectionsSummary" onClick={onMenuItemClick}>
                  Collections Summary
                </li>
              ) : null}
              <li id="debitMandates" onClick={onMenuItemClick}>
                Debit Mandates
              </li>
              {admin || adminRoles.includes("manage_nibss") ? (
                <li id="stopRestartCollections" onClick={onMenuItemClick}>
                  Stop/Restart Collections
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>

      <div onMouseOver={openSubRemita} onMouseLeave={closeSubRemita}>
        <div className="IconBox">
          <img src="images/dremita.png" alt="remita" />
          <p>Remita Collections</p>
        </div>
        {isRemitaOpen ? (
          <div className="SubItem">
            <ul>
              {admin || adminRoles.includes("get_salary_history") ? (
                <li id="checksalaryhistory" onClick={onMenuItemClick}>
                  Check Salary History
                </li>
              ) : null}

              <li id="remita" onClick={onMenuItemClick}>
                Loan Disbursements
              </li>

              <li id="collectionnotifications" onClick={onMenuItemClick}>
                Collection Notification
              </li>
              <li id="mandatehistory" onClick={onMenuItemClick}>
                Mandate History
              </li>
              {admin || adminRoles.includes("stop_remita_loan") ? (
                <li id="stopcollections" onClick={onMenuItemClick}>
                  Stop Collections
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>

      <div id="creditbureau" className="IconBox" onClick={onMenuItemClick}>
        <img
          id="creditbureau"
          onClick={onMenuItemClick}
          src="images/dreport.png"
          alt="creditbureau"
        />
        <p id="creditbureau" onClick={onMenuItemClick}>
          Credit Assessment
        </p>
      </div>

      {admin || adminRoles.includes("employer_manager") ? (
        <div onMouseOver={openSubEmployer} onMouseLeave={closeSubEmployer}>
          <div className="IconBox">
            <img src="images/dmda.png" alt="mdas" />
            <p>Employer Manager</p>
          </div>
          {isEmployerOpen ? (
            <div className="SubItem">
              <ul>
                <li id="addemployer" onClick={onMenuItemClick}>
                  Add Employer
                </li>
                <li id="mandaterules" onClick={onMenuItemClick}>
                  Mandate Rules
                </li>
                <li id="statementrules" onClick={onMenuItemClick}>
                  Statement Rules
                </li>
                <li id="mdas" onClick={onMenuItemClick}>
                  All Employers
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {admin || adminRoles.includes("kyc_review") ? (
        <div onMouseOver={openSubKyc} onMouseLeave={closeSubKyc}>
          <div className="IconBox">
            <img src="images/dkyc.png" alt="kyc" />
            <p>KYC Review</p>
          </div>

          {isKycOpen ? (
            <div className="SubItem">
              <ul>
                <li id="kyc" onClick={onMenuItemClick}>
                  Do KYC Review
                </li>
                <li id="signature" onClick={onMenuItemClick}>
                  Review Report
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      <div onMouseOver={openSubWebManager} onMouseLeave={closeSubWebManager}>
        <div className="IconBox">
          <img src="images/dwebsite.png" alt="webmanager" />
          <p>Website Manager</p>
        </div>

        {isWebManagerOpen ? (
          <div className="SubItem">
            <ul>
              {/* <li id="website" onClick={onMenuItemClick}>
                All Pages
              </li> */}
              <li id="webmanager" onClick={onMenuItemClick}>
                Blogs
              </li>
              <li id="contactForm" onClick={onMenuItemClick}>
                Contact Form
              </li>
              <li id="addwiki" onClick={onMenuItemClick}>
                Wikis/FAQs
              </li>
              <li id="customerAsk" onClick={onMenuItemClick}>
                Customer Enquiry
              </li>
              <li id="career" onClick={onMenuItemClick}>
                Career
              </li>
            </ul>
          </div>
        ) : null}
      </div>

      <div id="withdrawmethod" className="IconBox" onClick={onMenuItemClick}>
        <img
          id="withdrawmethod"
          onClick={onMenuItemClick}
          src="images/dwithdrawmethod.png"
          alt="withdrawmethod"
        />
        <p id="withdrawmethod" onClick={onMenuItemClick}>
          Disbursement Methods
        </p>
      </div>

      <div id="usermanager" className="IconBox" onClick={onMenuItemClick}>
        <img
          id="usermanager"
          onClick={onMenuItemClick}
          src="images/dusermanage.png"
          alt="usermanager"
        />
        <p id="usermanager" onClick={onMenuItemClick}>
          User Manager
        </p>
      </div>

      <div onMouseOver={openSubReports} onMouseLeave={closeSubReports}>
        <div className="IconBox">
          <img src="images/dreport.png" alt="report" />
          <p>Reports</p>
        </div>

        {isReportsOpen ? (
          <div className="SubItem">
            <ul>
              <li id="report" onClick={onMenuItemClick}>
                Account Statement
              </li>
              <li id="accountbalance" onClick={onMenuItemClick}>
                Account Balance
              </li>
              <li id="loanreporting" onClick={onMenuItemClick}>
                Loan Report
              </li>
            </ul>
          </div>
        ) : null}
      </div>

      <div onMouseOver={openSubSetting} onMouseLeave={closeSubSetting}>
        <div className="IconBox">
          <img src="images/dreport.png" alt="report" />
          <p>Settings</p>
        </div>

        {isSettingOpen ? (
          <div className="SubItem">
            <ul>
              <li id="general" onClick={onMenuItemClick}>
                General
              </li>
              <li id="email" onClick={onMenuItemClick}>
                Email
              </li>
              <li id="googleanalytics" onClick={onMenuItemClick}>
                Google Analytics
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};

SideNavMain.propTypes = {
  onMenuItemClick: PropTypes.func,
};

export default SideNavMain;
