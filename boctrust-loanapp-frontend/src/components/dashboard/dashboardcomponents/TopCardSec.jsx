import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import FigCard from "../shared/FigCard";
import "../Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTransactions } from "../../../redux/reducers/transactionReducer";

const BaseURL = import.meta.env.VITE_BASE_URL;

const TopCardSec = ({ user }) => {
  // console.log("TopCardSec", user);

  const [useBalance, setUserBalance] = useState({
    balance: "0.00",
    totalBalance: "0.00",
  });
  const [upcomingPayments, setUpcomingPayments] = useState("0.00");
  const [recentTransaction, setRecentTransaction] = useState(null);

  const { userTransactions } = useSelector((state) => state.transactionReducer);

  const dispatch = useDispatch(0);

  useEffect(() => {
    const getData = async () => {
      if (!user) return;
      try {
        const response = axios.get(
          `${BaseURL}/api/bankone/balanceEnquiry/${user?.banking?.accountDetails?.AccountNumber}`
        );

        setUserBalance({
          totalBalance: response.data.AvailableBalance,
          balance: response.data.WithdrawableBalance,
        });
        setUpcomingPayments("0.00");

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
    if (userTransactions && userTransactions.length > 0) {
      setRecentTransaction(userTransactions[0]);
    }
  }, [userTransactions]);

  return (
    <div className="TopCard">
      <Row>
        <Col xs={6} md={3}>
          <FigCard classname="MobCard">
            <img
              width="28px"
              height="28px"
              src="images/whitenaira.png"
              alt="naira"
            />
            <h5 className="FigNum">{useBalance.balance}</h5>
            <p>Balance</p>
          </FigCard>
        </Col>

        <Col xs={6} md={3}>
          <FigCard classname="MobCard">
            <img
              width="28px"
              height="28px"
              src="images/whitenaira.png"
              alt="naira"
            />
            <h5 className="FigNum">{useBalance.totalBalance}</h5>
            <p>Total Balance</p>
          </FigCard>
        </Col>

        <Col xs={6} md={3}>
          <FigCard classname="MobCard">
            <img
              width="28px"
              height="28px"
              src="images/whitenaira.png"
              alt="naira"
            />
            <h5 className="FigNum">{upcomingPayments}</h5>
            <p>Upcoming Payments</p>
          </FigCard>
        </Col>

        <Col xs={6} md={3}>
          <FigCard classname="YellowCard MobCard">
            {!recentTransaction || recentTransaction.length === 0 ? (
              <div id="CardText">
                <p>No recent transaction data available.</p>
              </div>
            ) : (
              <div id="CardText">
                <h5>
                  <span>
                    <img
                      width="18px"
                      height="18px"
                      src="images/whitenaira.png"
                      alt="naira"
                    />
                  </span>
                  20,312
                </h5>
                <p>00 - 00 - 0000</p>
                <p>From</p>
                <p>1234567890123</p>
                <p>To</p>
                <p>1234567890123</p>
                <p>Recent Transaction</p>
              </div>
            )}
          </FigCard>
        </Col>
      </Row>
    </div>
  );
};

TopCardSec.propTypes = {
  user: PropTypes.any,
};

export default TopCardSec;
