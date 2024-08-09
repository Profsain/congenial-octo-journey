import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import FigCard from "../shared/FigCard";
import "../Dashboard.css";

const TopCardSec = ({ user }) => {
  // console.log("TopCardSec", user);
  const balance = user?.balance || "0.00";
  const totalBalance = user?.totalBalance || "0.00";
  const upcomingPayments = user?.upcomingPayments || "0.00";

  const recentTransaction = user?.transactions || [];
  const recentTransactionData = recentTransaction[0] || {};
   const isEmpty = Object.keys(recentTransactionData).length === 0;

  console.log("Recent Transaction", isEmpty);

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
            <h5 className="FigNum">{balance}</h5>
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
            <h5 className="FigNum">{totalBalance}</h5>
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
            {isEmpty ? (
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
