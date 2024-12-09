import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import FigCard from "../shared/FigCard";
import "../Dashboard.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTransactions } from "../../../redux/reducers/transactionReducer";
import {
  fetchLoanAccountBal,
  fetchLoanRepaymentSchedule,
} from "../../../redux/reducers/loanReducer";
import { calcDaysDiffFromNow } from "../../../../utilities/calcDaysDiff";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import {
  currencyFormat,
  nigerianCurrencyFormat,
} from "../../../../utilities/formatToNiaraCurrency";
import { format } from "date-fns";

import Spinner from "react-bootstrap/Spinner";
import LoanTopUpModal from "./LoanTopUpModal";

const BaseURL = import.meta.env.VITE_BASE_URL;

const TopCardSec = ({ user }) => {
  const [useBalance, setUserBalance] = useState({
    balance: "0.00",
    totalPaid: "0.00",
  });
  const [upcomingPayments, setUpcomingPayments] = useState("0.00");
  const [recentTransaction, setRecentTransaction] = useState(null);

  const { userTransactions } = useSelector((state) => state.transactionReducer);
  const { activeLoanRepaymentSchedule, loansAccountBalance } = useSelector(
    (state) => state.loanReducer
  );

  const dispatch = useDispatch(0);

  useEffect(() => {
    const getData = async () => {
      if (!user) return;
      // `${BaseURL}/api/bankone/balanceEnquiry/${user?.banking?.accountDetails?.AccountNumber}`
      try {
        await dispatch(
          fetchLoanAccountBal(user?.banking?.accountDetails?.CustomerID)
        );

        await dispatch(fetchLoanRepaymentSchedule(user?.activeLoan?.Number));

        await dispatch(
          fetchUserTransactions(user.banking?.accountDetails?.AccountNumber)
        );
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [user]);

  useEffect(() => {
    if (activeLoanRepaymentSchedule) {
      const payment = activeLoanRepaymentSchedule?.find(
        (item) => calcDaysDiffFromNow(item.PaymentDueDate) <= 0
      );
      setUpcomingPayments(payment?.Total);
    }

    if (loansAccountBalance && typeof loansAccountBalance != "string") {
      const currLoan = loansAccountBalance?.find(
        (loan) => loan.LoanAccountNo == user?.activeLoan?.Number
      );
      setUserBalance({
        totalPaid: currLoan?.TotalAmountPaidTillDate || "0.00",
        balance: currLoan?.TotalOutstandingAmount || 0,
      });
    }
  }, [activeLoanRepaymentSchedule, loansAccountBalance]);

  useEffect(() => {
    if (userTransactions && userTransactions.length > 0) {
      setRecentTransaction(userTransactions[0]);
    }
  }, [userTransactions]);

  // check topup qualification and show topup card
  const [isTopupQaulify, setIsTopUpQaulify] = useState(
    !user.topUpLoanEligibility.isEligible
  );
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  // handle open top up
  const handleOpenTopUp = () => {
    setShowTopUpModal(true);
  };

  const handleCloseTopUpModal = () => {
    setShowTopUpModal(false);
  };

  console.log("user", user);
  return (
    <>
      <div className="TopCard">
        <Row>
          <Col xs={6} md={3}>
            <FigCard classname="MobCard">
              <img
                width="28px"
                height="28px"
                src="/images/whitenaira.png"
                alt="naira"
              />
              <h5 className="FigNum">
                {currencyFormat.format(useBalance.balance)}
              </h5>
              <p>Balance</p>
            </FigCard>
          </Col>

          <Col xs={6} md={3}>
            <FigCard classname="MobCard">
              <img
                width="28px"
                height="28px"
                src="/images/whitenaira.png"
                alt="naira"
              />
              <h5 className="FigNum">{useBalance.totalPaid}</h5>
              <p>Total Paid</p>
            </FigCard>
          </Col>

          <Col xs={6} md={3}>
            <FigCard classname="MobCard">
              <img
                width="28px"
                height="28px"
                src="/images/whitenaira.png"
                alt="naira"
              />
              <h5 className="FigNum">{upcomingPayments}</h5>
              <p>Upcoming Payments</p>
            </FigCard>
          </Col>

          <Col xs={6} md={3}>
            {isTopupQaulify ? (
              <FigCard classname="YellowCard MobCard" func={handleOpenTopUp}>
                <Spinner animation="grow" variant="light" size="lg" />

                <p id="topUpCta">
                  Increase Your Loan, <br /> Reduce Your Stress – Top Up Today
                </p>
              </FigCard>
            ) : (
              <FigCard classname="YellowCard MobCard">
                {!recentTransaction ? (
                  <div id="CardText">
                    <p>No recent transaction data available.</p>
                  </div>
                ) : (
                  <div id="CardText">
                    <b>{recentTransaction.RecordType}</b>
                    <div>
                      <h5
                        className={`recentTrscAmt ${
                          recentTransaction.RecordType === "Credit"
                            ? "credit"
                            : "debit"
                        }`}
                      >
                        <span>
                          {recentTransaction.RecordType === "Credit" ? (
                            <IoMdAdd />
                          ) : (
                            <IoMdRemove color="#dc2626" />
                          )}
                        </span>

                        {nigerianCurrencyFormat.format(
                          recentTransaction.Amount / 100
                        )}
                      </h5>
                      <p>
                        {format(
                          recentTransaction.CurrentDate,
                          "dd/LL/yyyy, hh:mm aaa"
                        )}
                      </p>
                    </div>
                    <p>Recent Transaction</p>
                  </div>
                )}
              </FigCard>
            )}
          </Col>
        </Row>
      </div>

      {/* loan top up modal */}
      <LoanTopUpModal
        showModal={showTopUpModal}
        handleCloseModal={handleCloseTopUpModal}
        customerID={user?._id}
      />
    </>
  );
};

TopCardSec.propTypes = {
  user: PropTypes.any,
};

export default TopCardSec;
