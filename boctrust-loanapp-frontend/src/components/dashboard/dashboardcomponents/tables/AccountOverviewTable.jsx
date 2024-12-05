import PropTypes from "prop-types";
import DashboardHeadline from "../../shared/DashboardHeadline";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import PageLoader from "../../shared/PageLoader";
import { fetchLoanAccountBal } from "../../../../redux/reducers/loanReducer";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";

const AccountOverviewTable = ({ user }) => {
  const styles = {
    table: {
      marginLeft: "2rem",
    },
    head: { color: "#145098", fontWeight: "bold", fontSize: "1.2rem" },
  };

  const { loansAccountBalance, status } = useSelector(
    (state) => state.loanReducer
  );

  const dispatch = useDispatch();
  useEffect(() => {
    const getData = async () => {
      if (!user?.banking?.accountDetails?.CustomerID) return;
      try {
        await dispatch(
          fetchLoanAccountBal(user?.banking?.accountDetails?.CustomerID)
        );
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [user]);

  return (
    <div>
      <DashboardHeadline>Account Overview</DashboardHeadline>
      <Table
        borderless
        hover
        responsive="sm"
        style={styles.table}
        className="RBox"
      >
        <thead>
          <tr style={styles.head}>
            <th>Account Number</th>

            <th>Balance</th>
            <th>Outstanding Amount</th>
            <th>Total Paid</th>
          </tr>
        </thead>
        <tbody>
          {!Array.isArray(loansAccountBalance) || status === "loading" ? (
            <tr>
              <td colSpan="5">
                <PageLoader width="70px" />
              </td>
            </tr>
          ) : loansAccountBalance.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No account overview
              </td>
            </tr>
          ) : (
            loansAccountBalance.map((loan) => (
              <tr key={loan.LoanAccountNo}>
                <td>{loan.LoanAccountNo}</td>
                <td>{nigerianCurrencyFormat.format(loan.AccountBalance)}</td>
                <td>{nigerianCurrencyFormat.format(loan.TotalOutstandingAmount)}</td>
                <td>{nigerianCurrencyFormat.format(loan?.TotalAmountPaidTillDate)}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

AccountOverviewTable.propTypes = {
  user: PropTypes.any,
};

export default AccountOverviewTable;
