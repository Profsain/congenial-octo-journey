import PropTypes from "prop-types";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserTransactions } from "../../../../redux/reducers/transactionReducer";
import PageLoader from "../../shared/PageLoader";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";

const RecentTransaction = ({ user }) => {
  const styles = {
    table: {
      marginLeft: "2rem",
    },
    th: {
      color: "#145098",
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
    completed: {
      color: "#5cc51c",
    },
  };

  const { userTransactions, status } = useSelector(
    (state) => state.transactionReducer
  );

  const dispatch = useDispatch(0);

  useEffect(() => {
    const getData = async () => {
      if (!user) return;

      try {
        await dispatch(
          fetchUserTransactions(user.banking?.accountDetails?.AccountNumber)
        );
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [user]);

  return (
    <div>
      <DashboardHeadline>Recent Transaction</DashboardHeadline>
      <Table
        borderless
        hover
        responsive="sm"
        style={styles.table}
        className="RBox"
      >
        <thead>
          <tr style={styles.th}>
            <th>Date</th>
            <th>AC Number</th>
            <th>Amount</th>
            <th>Dr/Cr</th>
            <th>Type</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>

        <tbody>
          {!userTransactions || status === "loading" ? (
            <tr>
              <td colSpan="5">
                <PageLoader width="70px" />
              </td>
            </tr>
          ) : userTransactions.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No recent transactions
              </td>
            </tr>
          ) : (
            userTransactions &&
            userTransactions.slice(0, 5).map((transaction, index) => {
              return (
                <tr key={index}>
                  <td>{transaction?.CurrentDate}</td>
                  <td>{transaction?.AccountNumber || "NIL"}</td>
                  <td>
                    {nigerianCurrencyFormat.format(transaction?.Amount / 100)}
                  </td>
                  <td>{transaction?.RecordType}</td>
                  <td> - </td>
                  <td style={styles.completed}>{transaction?.status}</td>
                  <td>
                    <BocButton
                      cursor="pointer"
                      bgcolor="#145098"
                      bradius="18px"
                    >
                      View
                    </BocButton>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
};

RecentTransaction.propTypes = {
  user: PropTypes.any,
};

export default RecentTransaction;
