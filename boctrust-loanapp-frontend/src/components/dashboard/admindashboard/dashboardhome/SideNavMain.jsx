import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import "../../Dashboard.css";
import handleAdminRoles from "../../../../../utilities/getAdminRoles";
import { Link } from "react-router-dom";

const SideNavMain = ({ onMenuItemClick }) => {
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoanOpen, setIsLoanOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isRemitaOpen, setIsRemitaOpen] = useState(false);
  const [isEmployerOpen, setIsEmployerOpen] = useState(false);
  const [isWebManagerOpen, setIsWebManagerOpen] = useState(false);
  const [isKycOpen, setIsKycOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isUserManagerOpen, setIsUserManagerOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const openSubCustomer = () => setIsCustomerOpen(true);
  const closeSubCustomer = () => setIsCustomerOpen(false);

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

  const openSubUserManager = () => setIsUserManagerOpen(true);
  const closeSubUserManager = () => setIsUserManagerOpen(false);

  const openSubReports = () => setIsReportsOpen(true);
  const closeSubReports = () => setIsReportsOpen(false);

  const openSubSetting = () => setIsSettingOpen(true);
  const closeSubSetting = () => setIsSettingOpen(false);

  // current login superAdmin user
  const currentUser = useSelector((state) => state.adminAuth.user);

  // role based menu
  const [superAdmin, setSuperAdmin] = useState("");
  const [adminRoles, setAdminRoles] = useState([]);
  const [shouldNotSee, setShouldNotSee] = useState([]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser?.userType === "super_admin") {
        setSuperAdmin("super_admin");
      }

      handleAdminRoles(currentUser, setAdminRoles);

      setShouldNotSee(currentUser?.userRole?.shouldNotSee);
    }
  }, [currentUser]);

  return (
    <div className="NavIcons SideMain FixSideNav">
      <div className="BrandCon">
        <div className=" LgLogo">
          <img src="/images/dlogo.png" alt="boctrust-logo" />
        </div>
        <p className="text-capitalize">{currentUser?.userRole?.label}</p>
      </div>

      <Link
        id="dashboard"
        to="/dashboard"
        onClick={onMenuItemClick}
        className="IconBox"
      >
        <img src="/images/ddashboard.png" alt="dashboard" />
        <p>Dashboard</p>
      </Link>

      <Link
        id="branches"
        to="/dashboard/branches"
        onClick={onMenuItemClick}
        className="IconBox"
      >
        <img src="/images/dmda.png" alt="branches" />
        <p>Branches</p>
      </Link>

      {/* Menu with sub item */}
      <div onMouseOver={openSubCustomer} onMouseLeave={closeSubCustomer}>
        <div className="IconBox">
          <img src="/images/dprofile.png" alt="customer" />
          <p>Customers</p>
        </div>
        {isCustomerOpen ? (
          <div className="SubItem">
            <ul>
              <li>
                <Link
                  id="customer"
                  onClick={onMenuItemClick}
                  to={"/dashboard/customers"}
                >
                  All Customers
                </Link>
              </li>
              {/* {superAdmin || adminRoles?.includes("customer_request") ? (
                <li id="customerrequest" onClick={onMenuItemClick}>
                  Customer Request
                </li>
              ) : null} */}
            </ul>
          </div>
        ) : null}
      </div>

      {/* loans menu */}

      <div onMouseOver={openSubLoan} onMouseLeave={closeSubLoan}>
        <div className="IconBox">
          <img src="/images/dmyloan.png" alt="loan" />
          <p>Loans</p>
        </div>
        {isLoanOpen ? (
          <div className="SubItem">
            <ul>
              <li>
                <Link
                  id="myloan"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans"
                >
                  All Loans
                </Link>
              </li>
              <li>
                <Link
                  id="pendingloans"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/pending"
                >
                  Pending Loan
                </Link>
              </li>
              <li>
                <Link
                  id="bookloans"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/book"
                >
                  Book Loans
                </Link>
              </li>

              {/* updated */}
              <li>
                <Link
                  id="loandisbursement"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/disburse"
                >
                  Disburse Loans
                </Link>
              </li>
              <li>
                <Link
                  id="completedloans"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/completed"
                >
                  Completed Loans
                </Link>
              </li>
              <li>
                <Link
                  id="overdueloans"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/overdue"
                >
                  Overdue Loans
                </Link>
              </li>
              <li>
                <Link
                  id="loanproducts"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/products"
                >
                  Loan Products
                </Link>
              </li>
              <li>
                <Link
                  id="loancalculator"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/calculator"
                >
                  Loan Calculator
                </Link>
              </li>
              <li>
                <Link
                  id="balanceenquiry"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/balanceenquiry"
                >
                  Balance Enquiry
                </Link>
              </li>

              <li>
                <Link
                  id="loanstatement"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/loanstatement"
                >
                  Loan A/C Statement
                </Link>
              </li>
            </ul>
          </div>
        ) : null}
      </div>

      {/* repayment menu */}
      <Link
        to="/dashboard/repayment"
        id="repayment"
        className="IconBox"
        onClick={onMenuItemClick}
      >
        <img
          id="repayment"
          onClick={onMenuItemClick}
          src="/images/dtransfer.png"
          alt="repayment"
        />
        <p>Repayments</p>
      </Link>

      {/* account menu */}
      <div onMouseOver={openSubAccount} onMouseLeave={closeSubAccount}>
        <div className="IconBox">
          <img src="/images/daccount.png" alt="accounts" />
          <p>Accounts</p>
        </div>
        {isAccountOpen ? (
          <div className="SubItem">
            <ul>
              <li>
                <Link
                  id="accounts"
                  onClick={onMenuItemClick}
                  to="/dashboard/accounts"
                >
                  All Accounts
                </Link>
              </li>
              <li>
                <Link
                  id="accounttypes"
                  onClick={onMenuItemClick}
                  to="/dashboard/accounts/types"
                >
                  Account Types
                </Link>
              </li>
            </ul>
          </div>
        ) : null}
      </div>

      {/* disbursement menu */}
      {/* <div id="withdraw" className="IconBox" onClick={onMenuItemClick}>
        <img
          id="withdraw"
          onClick={onMenuItemClick}
          src="/images/dwithdraw.png"
          alt="withdrawer"
        />
        <p id="withdraw" onClick={onMenuItemClick}>
          Disbursements
        </p>
      </div> */}

      <Link
        id="transaction"
        onClick={onMenuItemClick}
        to="/dashboard/transactions"
        className="IconBox"
      >
        <img id="transaction" src="/images/daccount.png" alt="transaction" />
        <p>Transactions</p>
      </Link>

      {/* NIBSS Menu with sub item */}
      <div onMouseOver={openSubItem} onMouseLeave={closeSubItem}>
        <div className="IconBox">
          <img src="/images/dwithdraw.png" alt="nibss" />
          <p>NIBSS Direct Debit</p>
        </div>
        {isOpen ? (
          <div className="SubItem">
            <ul>
              <li>
                <Link
                  id="debitTransactions"
                  onClick={onMenuItemClick}
                  to="/dashboard/nibbs"
                >
                  Debit Transactions
                </Link>
              </li>
              {superAdmin || adminRoles?.includes("manage_nibss") ? (
                <li>
                  <Link
                    id="collectionsSummary"
                    onClick={onMenuItemClick}
                    to="/dashboard/nibbs/collectionsSummary"
                  >
                    Collections Summary
                  </Link>
                </li>
              ) : null}
              <li>
                <Link
                  id="debitMandates"
                  onClick={onMenuItemClick}
                  to="/dashboard/nibbs/debitMandates"
                >
                  Debit Mandates
                </Link>
              </li>
              {superAdmin || adminRoles?.includes("manage_nibss") ? (
                <li>
                  <Link
                    id="stopRestartCollections"
                    onClick={onMenuItemClick}
                    to="/dashboard/nibbs/stopRestartCollections"
                  >
                    Stop/Restart Collections
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>

      <div onMouseOver={openSubRemita} onMouseLeave={closeSubRemita}>
        <div className="IconBox">
          <img src="/images/dremita.png" alt="remita" />
          <p>Remita Collections</p>
        </div>
        {isRemitaOpen ? (
          <div className="SubItem">
            <ul>
              {superAdmin || adminRoles?.includes("get_salary_history") ? (
                <li>
                  <Link
                    id="checksalaryhistory"
                    onClick={onMenuItemClick}
                    to="/dashboard/remita"
                  >
                    Check Salary History
                  </Link>
                </li>
              ) : null}

              <li>
                <Link
                  id="remita"
                  onClick={onMenuItemClick}
                  to="/dashboard/remita/disbursement"
                >
                  Loan Disbursements
                </Link>
              </li>

              <li>
                <Link
                  id="collectionnotifications"
                  onClick={onMenuItemClick}
                  to="/dashboard/remita/notification"
                >
                  Collection Notification
                </Link>
              </li>
              <li>
                <Link
                  id="mandatehistory"
                  onClick={onMenuItemClick}
                  to="/dashboard/remita/mandatehistory"
                >
                  Mandate History
                </Link>
              </li>
              {superAdmin || adminRoles?.includes("stop_remita_loan") ? (
                <li>
                  <Link
                    id="stopcollections"
                    onClick={onMenuItemClick}
                    to="/dashboard/remita/stopcollections"
                  >
                    Stop Collections
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>

      {(superAdmin || !shouldNotSee?.includes("creditAssessment")) && (
        <Link
          to="/dashboard/creditbureau"
          id="creditbureau"
          className="IconBox"
          onClick={onMenuItemClick}
        >
          <img id="creditbureau" src="/images/dreport.png" alt="creditbureau" />
          <p id="creditbureau">Credit Assessment</p>
        </Link>
      )}

      {superAdmin || !shouldNotSee?.includes("employerManager") ? (
        <div onMouseOver={openSubEmployer} onMouseLeave={closeSubEmployer}>
          <div className="IconBox">
            <img src="/images/dmda.png" alt="mdas" />
            <p>Employer Manager</p>
          </div>
          {isEmployerOpen ? (
            <div className="SubItem">
              <ul>
                <li>
                  <Link
                    id="mdas"
                    onClick={onMenuItemClick}
                    to="/dashboard/mdas"
                  >
                    All Employers
                  </Link>
                </li>
                <li>
                  <Link
                    id="addemployer"
                    onClick={onMenuItemClick}
                    to="/dashboard/mdas/addemployer"
                  >
                    Add Employer
                  </Link>
                </li>
                <li>
                  <Link
                    id="mandaterules"
                    onClick={onMenuItemClick}
                    to="/dashboard/mdas/mandaterules"
                  >
                    Mandate Rules
                  </Link>
                </li>
                <li>
                  <Link
                    id="statementrules"
                    onClick={onMenuItemClick}
                    to="/dashboard/mdas/statementrules"
                  >
                    Statement Rules
                  </Link>
                </li>
                <li>
                  <Link
                    id="employmentletter"
                    onClick={onMenuItemClick}
                    to="/dashboard/mdas/employmentletter"
                  >
                    Employment Letter
                  </Link>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {superAdmin || !shouldNotSee?.includes("kycReview") ? (
        <div onMouseOver={openSubKyc} onMouseLeave={closeSubKyc}>
          <div className="IconBox">
            <img src="/images/dkyc.png" alt="kyc" />
            <p>KYC Review</p>
          </div>

          {isKycOpen ? (
            <div className="SubItem">
              <ul>
                <li>
                  <Link id="kyc" onClick={onMenuItemClick} to="/dashboard/kyc">
                    Do KYC Review
                  </Link>
                </li>
                <li>
                  <Link
                    id="report"
                    onClick={onMenuItemClick}
                    to="/dashboard/kyc/report"
                  >
                    Review Report
                  </Link>
                </li>
                <li>
                  <Link
                    id="employmentLetters"
                    onClick={onMenuItemClick}
                    to="/dashboard/kyc/employmentLetters"
                  >
                    Employment Letters
                  </Link>
                </li>
                <li>
                  <Link
                    id="bankStatements"
                    onClick={onMenuItemClick}
                    to="/dashboard/kyc/bankStatements"
                  >
                    Bank Statement
                  </Link>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
      <div onMouseOver={openSubWebManager} onMouseLeave={closeSubWebManager}>
        <div className="IconBox">
          <img src="/images/dwebsite.png" alt="webmanager" />
          <p>Website Manager</p>
        </div>

        {isWebManagerOpen && (
          <div className="SubItem">
            <ul>
              {/* <li id="website" onClick={onMenuItemClick}>
                All Pages
              </li> */}
              <li>
                <Link
                  id="webmanager"
                  onClick={onMenuItemClick}
                  to="/dashboard/webmanager"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  id="contactForm"
                  onClick={onMenuItemClick}
                  to="/dashboard/webmanager/contactForm"
                >
                  Contact Form
                </Link>
              </li>
              <li>
                <Link
                  id="addwiki"
                  onClick={onMenuItemClick}
                  to="/dashboard/webmanager/addwiki"
                >
                  Wikis/FAQs
                </Link>
              </li>
              <li>
                <Link
                  id="customerAsk"
                  onClick={onMenuItemClick}
                  to="/dashboard/webmanager/customerAsk"
                >
                  Customer Enquiry
                </Link>
              </li>
              <li>
                <Link
                  id="career"
                  onClick={onMenuItemClick}
                  to="/dashboard/webmanager/career"
                >
                  Career
                </Link>
              </li>
              <li>
                <Link
                  id="job-applicants"
                  onClick={onMenuItemClick}
                  to="/dashboard/webmanager/job-applicants"
                >
                  Job Applications
                </Link>
              </li>
              <li>
                <Link
                  id="homeEditor"
                  onClick={onMenuItemClick}
                  to="/dashboard/webmanager/homeEditor"
                >
                  Home Page
                </Link>
              </li>
              <li>
                <Link
                  id="aboutEditor"
                  onClick={onMenuItemClick}
                  to="/dashboard/webmanager/aboutEditor"
                >
                  About Page
                </Link>
              </li>
              <li>
                <Link
                  id="boardEditor"
                  onClick={onMenuItemClick}
                  to="/dashboard/webmanager/boardEditor"
                >
                  Directors
                </Link>
              </li>
              <li>
                <Link
                  id="productEditor"
                  onClick={onMenuItemClick}
                  to="/dashboard/webmanager/productEditor"
                >
                  Products Page
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* <div id="withdrawmethod" className="IconBox" onClick={onMenuItemClick}>
        <img
          id="withdrawmethod"
          onClick={onMenuItemClick}
          src="/images/dwithdrawmethod.png"
          alt="withdrawmethod"
        />
        <p id="withdrawmethod" onClick={onMenuItemClick}>
          Disbursement Methods
        </p>
      </div> */}

      {(superAdmin || !shouldNotSee?.includes("userManager")) && (
        <div
          onMouseOver={openSubUserManager}
          onMouseLeave={closeSubUserManager}
        >
          <div className="IconBox">
            <img src="/images/dusermanage.png" alt="usermanager" />
            <p>User Manager</p>
          </div>
          {isUserManagerOpen ? (
            <div className="SubItem">
              <ul>
                <li>
                  <Link
                    id="allusers"
                    onClick={onMenuItemClick}
                    to="/dashboard/users"
                  >
                    All Users
                  </Link>
                </li>
                <li>
                  <Link
                    id="userrole"
                    onClick={onMenuItemClick}
                    to="/dashboard/roles"
                  >
                    User Roles
                  </Link>
                </li>
                <li>
                  <Link
                    id="accesscontrol"
                    onClick={onMenuItemClick}
                    to="/dashboard/accesscontrol"
                  >
                    Access Control
                  </Link>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      )}

      <div onMouseOver={openSubReports} onMouseLeave={closeSubReports}>
        <div className="IconBox">
          <img src="/images/dreport.png" alt="report" />
          <p>Reports</p>
        </div>

        {isReportsOpen ? (
          <div className="SubItem">
            <ul>
              <li>
                <Link
                  id="report"
                  onClick={onMenuItemClick}
                  to="/dashboard/report/account-statement"
                >
                  Account Statement
                </Link>
              </li>
              <li>
                <Link
                  id="accountbalance"
                  onClick={onMenuItemClick}
                  to="/dashboard/report/accountbalance"
                >
                  Account Balance
                </Link>
              </li>
              <li>
                <Link
                  id="loanreporting"
                  onClick={onMenuItemClick}
                  to="/dashboard/report/loan"
                >
                  Loan Report
                </Link>
              </li>
            </ul>
          </div>
        ) : null}
      </div>

      {(superAdmin || !shouldNotSee?.includes("userManager")) && (
        <div onMouseOver={openSubSetting} onMouseLeave={closeSubSetting}>
          <div className="IconBox">
            <img src="/images/dreport.png" alt="report" />
            <p>Settings</p>
          </div>

          {isSettingOpen ? (
            <div className="SubItem">
              <ul>
                <li>
                  <Link
                    id="general"
                    onClick={onMenuItemClick}
                    to="/dashboard/settings"
                  >
                    General
                  </Link>
                </li>
                <li>
                  <Link
                    id="email"
                    onClick={onMenuItemClick}
                    to="/dashboard/settings/email"
                  >
                    Email
                  </Link>
                </li>
                <li>
                  <Link
                    id="googleanalytics"
                    onClick={onMenuItemClick}
                    to="/dashboard/settings/googleanalytics"
                  >
                    Google Analytics
                  </Link>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

SideNavMain.propTypes = {
  onMenuItemClick: PropTypes.func,
};

export default SideNavMain;
