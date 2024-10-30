import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import Table from "react-bootstrap/Table";
import { fetchLoanRepaymentSchedule } from "../../../../redux/reducers/loanReducer";
import { useDispatch, useSelector } from "react-redux";
import PageLoader from "../../shared/PageLoader";
import { format } from "date-fns";

const UpcomingLoanPayment = ({ user }) => {
  const styles = {
    table: {
      marginLeft: "2rem",
    },
    head: { color: "#145098", fontWeight: "bold", fontSize: "1.2rem" },
  };

  const { activeLoanRepaymentSchedule, status } = useSelector(
    (state) => state.loanReducer
  );

  const dispatch = useDispatch(0);

  // fetch upcoming loan payment
  useEffect(() => {
    const getData = async () => {
      try {
        await dispatch(fetchLoanRepaymentSchedule(user?.activeLoan?.Number));
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <div>
      <DashboardHeadline>Upcoming Loan Payment</DashboardHeadline>
      <Table
        borderless
        hover
        responsive="sm"
        style={styles.table}
        className="RBox"
      >
        <thead>
          <tr style={styles.head}>
            <th>Loan ID</th>
            <th>Payement Due Date</th>
            <th>Status</th>
            <th>Amount to Pay</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {!activeLoanRepaymentSchedule || status === "loading" ? (
            <tr>
              <td colSpan="5">
                <PageLoader width="70px" />
              </td>
            </tr>
          ) : activeLoanRepaymentSchedule &&
            activeLoanRepaymentSchedule.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No upcoming loan payment
              </td>
            </tr>
          ) : (
            activeLoanRepaymentSchedule &&
            activeLoanRepaymentSchedule.map((loan) => (
              <tr key={loan.Id}>
                <td>{loan.Id}</td>
                <td>{  loan.PaymentDueDate && format(loan.PaymentDueDate, "dd/LL/yyyy, hh:mm aaa")} </td>
                <td></td>
                <td>
                  <div className="d-flex">
                    <img src="/images/naira.png" alt="" width={15} />
                    {loan.Total}
                  </div>
                </td>
                <td>
                  <button className="btn btn-primary">Pay</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

UpcomingLoanPayment.propTypes = {
  user: PropTypes.shape({
    banking: PropTypes.shape({
      accountDetails: PropTypes.shape({
        Message: PropTypes.shape({
          AccountNumber: PropTypes.any,
        }),
      }),
    }),
  }),
};

export default UpcomingLoanPayment;
